import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddCompany = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    packageValue: "",
    minimumCGPA: "",
    eligibleBranches: ""
  });

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // HANDLE FORM SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // CREATE COMPANY DATA
      const companyData = {
        companyName: formData.companyName,
        role: formData.role,
        packageValue: formData.packageValue,
        minimumCGPA: Number(formData.minimumCGPA),
        eligibleBranches: formData.eligibleBranches
          ? formData.eligibleBranches
              .split(",")
              .map((branch) => branch.trim().toUpperCase())
              .filter(Boolean)
          : []
      };

      // ADD COMPANY
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/company/add`,
        companyData,
        {
          withCredentials: true
        }
      );

      toast.success("Company Added & Notifications Sent");

      // RESET FORM
      setFormData({
        companyName: "",
        role: "",
        packageValue: "",
        minimumCGPA: "",
        eligibleBranches: ""
      });

    } catch (error) {
      console.log(error);
      toast.error("Failed To Add Company");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 lg:p-10 font-sans relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/5 border border-white/10 backdrop-blur-xl w-full max-w-[500px] p-8 md:p-10 rounded-3xl shadow-2xl space-y-6"
      >
        <div className="text-center">
          <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent mb-2">
            Add Placement Drive
          </h1>
          <p className="text-slate-400 text-xs mt-1">Register a new company and notify eligible students.</p>
        </div>

        <div className="space-y-4">
          {/* COMPANY NAME */}
          <div>
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Company Name</label>
            <input
              type="text"
              name="companyName"
              placeholder="e.g. Google LLC"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-cyan-400 text-sm transition-colors"
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Position Role</label>
            <input
              type="text"
              name="role"
              placeholder="e.g. Software Engineer"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-cyan-400 text-sm transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* PACKAGE */}
            <div>
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Package (LPA)</label>
              <input
                type="text"
                name="packageValue"
                placeholder="e.g. 12"
                value={formData.packageValue}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-cyan-400 text-sm transition-colors"
              />
            </div>

            {/* MINIMUM CGPA */}
            <div>
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Min CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                name="minimumCGPA"
                placeholder="e.g. 7.5"
                value={formData.minimumCGPA}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-cyan-400 text-sm transition-colors"
              />
            </div>
          </div>

          {/* ELIGIBLE BRANCHES */}
          <div>
            <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Eligible Branches</label>
            <input
              type="text"
              name="eligibleBranches"
              placeholder="e.g. CSE, IT, ECE (comma-separated)"
              value={formData.eligibleBranches}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-cyan-400 text-sm transition-colors"
            />
            <span className="text-[10px] text-slate-500 italic mt-1 block">Leave blank for all branch departments.</span>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-3.5 rounded-xl text-base font-bold shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] duration-300"
        >
          Add Drive & Broadcast Alerts 📢
        </button>
      </form>
    </div>
  );
};

export default AddCompany;