import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AdminApplications = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const companyUrlParam = queryParams.get("company") || "";

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState(companyUrlParam);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/application/all`,
        { withCredentials: true }
      );

      console.log("All Applications:", res.data);
      if (Array.isArray(res.data)) {
        setApplications(res.data);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Update application status
  const updateStatus = async (applicationId, newStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/application/status/${applicationId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      setApplications(
        applications.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      toast.success(`Application updated to ${newStatus} Successfully!`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update application status");
    }
  };

  // Compile list of unique companies from applications dynamically
  const uniqueCompanies = Array.from(
    new Set(applications.map((app) => app.company?.companyName).filter(Boolean))
  ).sort();

  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
      case "Round1":
        return "bg-amber-500/20 text-amber-300 border border-amber-500/30";
      case "Round2":
        return "bg-purple-500/20 text-purple-300 border border-purple-500/30";
      case "HR":
        return "bg-pink-500/20 text-pink-300 border border-pink-500/30";
      case "Selected":
        return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
      case "Rejected":
        return "bg-rose-500/20 text-rose-300 border border-rose-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border border-slate-500/30";
    }
  };

  // Filter applications array inline
  const filteredApplications = applications.filter((app) => {
    const studentName = app.student?.name || "";
    const studentEmail = app.student?.email || "";
    const matchesSearch =
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studentEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const companyName = app.company?.companyName || "";
    const matchesCompany = !companyFilter || companyName === companyFilter;

    const matchesStatus = !statusFilter || app.status === statusFilter;

    return matchesSearch && matchesCompany && matchesStatus;
  });

  const statuses = ["Applied", "Round1", "Round2", "HR", "Selected", "Rejected"];

  // Quick Action rendering for Tracking Rounds
  const renderQuickRoundControls = (app) => {
    const current = app.status;

    if (current === "Selected") {
      return (
        <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
          🎉 Placed! (Selected)
        </span>
      );
    }
    if (current === "Rejected") {
      return (
        <div className="flex items-center gap-2">
          <span className="text-rose-400 font-bold text-xs">❌ Rejected</span>
          <button
            onClick={() => updateStatus(app._id, "Applied")}
            className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
          >
            Re-evaluate
          </button>
        </div>
      );
    }

    let nextRound = "";
    let btnLabel = "";

    if (current === "Applied") {
      nextRound = "Round1";
      btnLabel = "Advance to Round 1 ➔";
    } else if (current === "Round1") {
      nextRound = "Round2";
      btnLabel = "Advance to Round 2 ➔";
    } else if (current === "Round2") {
      nextRound = "HR";
      btnLabel = "Shortlist for HR ➔";
    } else if (current === "HR") {
      nextRound = "Selected";
      btnLabel = "Offer Selection 🎉";
    }

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateStatus(app._id, nextRound)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg border border-indigo-400/20 shadow-md shadow-indigo-500/10 active:scale-95 transition"
        >
          {btnLabel}
        </button>
        <button
          onClick={() => updateStatus(app._id, "Rejected")}
          className="bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-[11px] px-2 py-1.5 rounded-lg active:scale-95 transition"
        >
          Reject ❌
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
        <span className="ml-4 text-cyan-400 font-medium text-lg">Loading Applications...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Applications & Recruitment Pipeline
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Track student application rounds, shortlist, and place candidates.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-xl mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="w-full lg:w-2/5 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Candidate Search</label>
            <input
              type="text"
              placeholder="Search by student name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm placeholder-slate-500 transition-colors"
            />
          </div>

          {/* Company filter */}
          <div className="w-full lg:w-1/4 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Placement Drive</label>
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-slate-300 focus:outline-none focus:border-cyan-400 text-sm cursor-pointer transition-colors"
            >
              <option value="" className="bg-slate-900 text-white">All Companies</option>
              {uniqueCompanies.map((name) => (
                <option key={name} value={name} className="bg-slate-900 text-white">
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="w-full lg:w-1/4 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Pipeline Stage</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-slate-300 focus:outline-none focus:border-cyan-400 text-sm cursor-pointer transition-colors"
            >
              <option value="" className="bg-slate-900 text-white">All Stages</option>
              {statuses.map((status) => (
                <option key={status} value={status} className="bg-slate-900 text-white">
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table representation */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-slate-400 text-sm font-semibold">
                <th className="p-4 rounded-tl-2xl">Student Details</th>
                <th className="p-4">Placement Drive</th>
                <th className="p-4">Date Applied</th>
                <th className="p-4">Status Stage</th>
                <th className="p-4 text-center rounded-tr-2xl">Pipeline Action Controls</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <tr
                    key={app._id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                  >
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{app.student?.name || "N/A"}</span>
                        <span className="text-slate-400 text-xs font-mono">{app.student?.email || "N/A"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-200">{app.company?.companyName || "N/A"}</span>
                        <span className="text-cyan-400 text-xs">{app.company?.role || "N/A"}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300 text-sm">
                      {new Date(app.appliedDate).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-center min-w-[280px]">
                      {renderQuickRoundControls(app)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-12 text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-3xl">📂</span>
                      <p className="font-semibold text-slate-400">No Applications Found</p>
                      <p className="text-xs text-slate-500">Try adjusting your filters or candidate search queries.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AdminApplications;
