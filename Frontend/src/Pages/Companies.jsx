import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Companies = ({ authUser }) => {
  const userRole = authUser?.role;
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [appliedCompanies, setAppliedCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEligibleOnly, setShowEligibleOnly] = useState(false);

  // Search & Filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [minPackage, setMinPackage] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Edit Modal States
  const [editingCompany, setEditingCompany] = useState(null);
  const [editFormData, setEditFormData] = useState({
    companyName: "",
    role: "",
    packageValue: "",
    minimumCGPA: "",
    eligibleBranches: "",
  });

  const getCompanies = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/company/all`,
        { withCredentials: true }
      );

      if (Array.isArray(res.data)) {
        setCompanies(res.data);
      } else {
        setCompanies([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load companies list");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const getMyApplications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/application/my-applications`,
        { withCredentials: true }
      );

      if (Array.isArray(res.data)) {
        const companyIds = res.data.map((app) => app.company?._id || app.company);
        setAppliedCompanies(companyIds);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCompanies();
    if (userRole === "student") {
      getMyApplications();
    }
  }, [userRole]);

  const applyCompany = async (companyId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/application/apply`,
        { companyId },
        { withCredentials: true }
      );

      setAppliedCompanies([...appliedCompanies, companyId]);
      toast.success("Applied Successfully 🎉");
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Failed to apply";
      toast.error(errorMsg);
    }
  };

  // Delete Company
  const handleDeleteCompany = async (companyId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this company drive? All associated applications will also be permanently deleted from the tracker."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/company/${companyId}`,
        { withCredentials: true }
      );
      toast.success("Company Drive Deleted Successfully");
      setCompanies(companies.filter((c) => c._id !== companyId));
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete company");
    }
  };

  // Open Edit Modal
  const openEditModal = (company) => {
    setEditingCompany(company);
    setEditFormData({
      companyName: company.companyName,
      role: company.role,
      packageValue: company.packageValue,
      minimumCGPA: company.minimumCGPA,
      eligibleBranches: company.eligibleBranches ? company.eligibleBranches.join(", ") : "",
    });
  };

  // Handle Edit Input Change
  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit Edit Form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const branchesArray = editFormData.eligibleBranches
        .split(",")
        .map((br) => br.trim())
        .filter((br) => br !== "");

      const updatedData = {
        ...editFormData,
        minimumCGPA: Number(editFormData.minimumCGPA),
        eligibleBranches: branchesArray,
      };

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/company/${editingCompany._id}`,
        updatedData,
        { withCredentials: true }
      );

      toast.success("Company drive details updated successfully!");
      setCompanies(companies.map((c) => (c._id === editingCompany._id ? res.data : c)));
      setEditingCompany(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update company drive");
    }
  };

  // Check student eligibility for a specific company
  const checkEligibility = (company) => {
    if (userRole === "admin") return { eligible: true };

    const userCgpa = authUser?.cgpa !== undefined && authUser?.cgpa !== "" ? Number(authUser.cgpa) : null;
    const userBranch = authUser?.branch || null;

    const meetsCgpa = userCgpa !== null ? userCgpa >= company.minimumCGPA : false;
    const meetsBranch =
      !company.eligibleBranches ||
      company.eligibleBranches.length === 0 ||
      (userBranch && company.eligibleBranches.includes(userBranch));

    const reasons = [];
    if (!meetsCgpa) reasons.push(`CGPA is ${userCgpa ?? "not provided"} (requires >= ${company.minimumCGPA})`);
    if (!meetsBranch) reasons.push(`Branch is ${userBranch ?? "not provided"} (requires ${company.eligibleBranches.join(", ")})`);

    return {
      eligible: meetsCgpa && meetsBranch,
      reasons,
    };
  };

  // Filter companies based on user input
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPackage =
      !minPackage || Number(company.packageValue) >= Number(minPackage);

    const matchesEligibility = !showEligibleOnly || checkEligibility(company).eligible;

    return matchesSearch && matchesPackage && matchesEligibility;
  });

  // Sort companies
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (sortBy === "packageDesc") {
      return Number(b.packageValue) - Number(a.packageValue);
    }
    if (sortBy === "packageAsc") {
      return Number(a.packageValue) - Number(b.packageValue);
    }
    if (sortBy === "cgpaAsc") {
      return Number(a.minimumCGPA) - Number(b.minimumCGPA);
    }
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
        <span className="ml-4 text-cyan-400 font-medium text-lg">Loading Recruitment Drives...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 lg:p-10 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8 bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Recruitment & Placement Drives
          </h1>
          <p className="text-slate-400 text-sm mt-1">Explore job openings, check eligibility, and apply.</p>
        </div>

        {/* Filter Toggle for Students */}
        {userRole === "student" && (
          <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-2xl border border-white/5">
            <label className="text-sm font-semibold text-slate-300 select-none cursor-pointer" htmlFor="eligibleToggle">
              Show Eligible Only
            </label>
            <input
              type="checkbox"
              id="eligibleToggle"
              checked={showEligibleOnly}
              onChange={(e) => setShowEligibleOnly(e.target.checked)}
              className="w-5 h-5 accent-cyan-400 cursor-pointer rounded border-white/10"
            />
          </div>
        )}
      </div>

      {/* Advanced Intermediate Filters */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Query */}
        <div className="w-full md:w-1/3 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Search Drive</label>
          <input
            type="text"
            placeholder="Search Company name or Role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm placeholder-slate-500 transition-colors"
          />
        </div>

        {/* Minimum CTC Package */}
        <div className="w-full md:w-1/4 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Min Package (LPA)</label>
          <input
            type="number"
            placeholder="E.g. 6 (filters >= 6 LPA)"
            value={minPackage}
            onChange={(e) => setMinPackage(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm placeholder-slate-500 transition-colors"
          />
        </div>

        {/* Sorting Dropdown */}
        <div className="w-full md:w-1/4 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sort Listings By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-slate-300 focus:outline-none focus:border-cyan-400 text-sm cursor-pointer transition-colors"
          >
            <option value="newest" className="bg-slate-900 text-white">Date Posted: Newest</option>
            <option value="packageDesc" className="bg-slate-900 text-white">Package: High to Low</option>
            <option value="packageAsc" className="bg-slate-900 text-white">Package: Low to High</option>
            <option value="cgpaAsc" className="bg-slate-900 text-white">Minimum CGPA: Low to High</option>
          </select>
        </div>
      </div>

      {/* Companies Grid */}
      {sortedCompanies.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl shadow-xl">
          <p className="text-xl text-rose-400 font-semibold mb-2">No Drives Found</p>
          <p className="text-slate-500 text-sm">
            {showEligibleOnly 
              ? "You do not meet the eligibility requirements for any matching active drives currently." 
              : "Try refining your search or package range filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {sortedCompanies.map((company) => {
            const { eligible, reasons } = checkEligibility(company);
            const isApplied = appliedCompanies.includes(company._id);

            return (
              <div
                key={company._id}
                className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-xl hover:scale-[1.02] hover:shadow-cyan-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Cmp Name & Badges */}
                  <div className="flex justify-between items-start gap-2 mb-4">
                    <h2 className="text-2xl font-bold text-white tracking-tight">{company.companyName}</h2>
                    
                    {/* Eligibility Badge */}
                    {userRole === "student" && (
                      <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                        eligible 
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}>
                        {eligible ? "Eligible" : "Ineligible"}
                      </span>
                    )}
                  </div>

                  {/* Company Info */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Position Role</span>
                      <span className="font-semibold text-slate-100">{company.role}</span>
                    </div>
                    <div className="h-[1px] bg-white/5"></div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Salary Package</span>
                      <span className="font-semibold text-cyan-300">{company.packageValue} LPA</span>
                    </div>
                    <div className="h-[1px] bg-white/5"></div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Min Required CGPA</span>
                      <span className="font-semibold text-amber-300">{company.minimumCGPA}</span>
                    </div>
                    <div className="h-[1px] bg-white/5"></div>

                    <div className="flex flex-col text-sm pt-1">
                      <span className="text-slate-400 mb-1">Eligible Branches</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {company.eligibleBranches && company.eligibleBranches.length > 0 ? (
                          company.eligibleBranches.map((br) => (
                            <span key={br} className="bg-slate-900 text-slate-300 px-2 py-0.5 rounded text-xs border border-white/5">
                              {br}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-xs italic">All Branches</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Eligibility warnings & Actions */}
                <div>
                  {userRole === "student" && !eligible && (
                    <div className="mb-4 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                      <div className="text-[11px] text-rose-300 font-semibold leading-relaxed">
                        Ineligible reasons:
                        <ul className="list-disc list-inside mt-1 font-normal">
                          {reasons.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}

                  {userRole === "student" && (
                    <button
                      onClick={() => applyCompany(company._id)}
                      disabled={isApplied || !eligible}
                      className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-all duration-300 ${
                        isApplied
                          ? "bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed"
                          : !eligible
                          ? "bg-rose-500/10 text-rose-400/40 border border-rose-500/15 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white hover:scale-[1.02] shadow-cyan-500/10 active:scale-[0.98]"
                      }`}
                    >
                      {isApplied ? "Applied ✓" : eligible ? "Apply to Drive" : "Ineligible"}
                    </button>
                  )}
                  
                  {userRole === "admin" && (
                    <div className="flex flex-col gap-2.5">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(company)}
                          className="flex-1 py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                          ✏️ Edit details
                        </button>
                        <button
                          onClick={() => handleDeleteCompany(company._id)}
                          className="flex-1 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                      <button
                        onClick={() => navigate(`/admin-applications?company=${encodeURIComponent(company.companyName)}`)}
                        className="w-full py-2.5 rounded-xl bg-cyan-600/10 hover:bg-cyan-600/25 border border-cyan-500/30 text-cyan-300 text-xs font-black transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        👥 View Applicants & Track Rounds
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Overlay Modal */}
      {editingCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 w-full max-w-[500px] border border-white/10 p-8 rounded-3xl shadow-2xl relative">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6 text-center">
              Edit Drive: {editingCompany.companyName}
            </h2>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={editFormData.companyName}
                  onChange={handleEditChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Position Role</label>
                <input
                  type="text"
                  name="role"
                  value={editFormData.role}
                  onChange={handleEditChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Salary Package (LPA)</label>
                  <input
                    type="text"
                    name="packageValue"
                    value={editFormData.packageValue}
                    onChange={handleEditChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Min CGPA Required</label>
                  <input
                    type="number"
                    step="0.01"
                    name="minimumCGPA"
                    value={editFormData.minimumCGPA}
                    onChange={handleEditChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                  Eligible Branches (comma-separated)
                </label>
                <input
                  type="text"
                  name="eligibleBranches"
                  placeholder="IT, CSE, ECE"
                  value={editFormData.eligibleBranches}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
                <span className="text-[10px] text-slate-500 italic mt-1 block">Leave blank to make open to all branches.</span>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingCompany(null)}
                  className="flex-1 py-3 bg-slate-800 border border-white/5 text-slate-400 rounded-xl font-bold text-sm hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold text-sm hover:scale-[1.02] shadow-lg shadow-cyan-500/10 active:scale-[0.98] transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Companies;