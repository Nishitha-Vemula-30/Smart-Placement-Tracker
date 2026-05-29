import { useEffect, useState } from "react"
import axios from "axios"

const Statistics = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalApplications: 0,
    selectedStudents: 0,
    averagePackage: 0,
    highestPackage: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, companies, apps] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/students/all`, {
            withCredentials: true
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/company/all`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/application/all`, {
            withCredentials: true
          })
        ]);

        const studentList = Array.isArray(students.data) ? students.data : [];
        const companyList = Array.isArray(companies.data) ? companies.data : [];
        const appList = Array.isArray(apps.data) ? apps.data : [];

        const selectedCount = appList.filter(
          (app) => app.status === "Selected"
        ).length;

        const packages = companyList
          .map((c) => parseFloat(c.packageValue) || 0)
          .filter((p) => p > 0);

        const avgPackage = packages.length > 0
          ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(2)
          : 0;

        const highestPackage = packages.length > 0
          ? Math.max(...packages)
          : 0;

        setStats({
          totalStudents: studentList.length,
          totalCompanies: companyList.length,
          totalApplications: appList.length,
          selectedStudents: selectedCount,
          averagePackage: avgPackage,
          highestPackage: highestPackage
        });

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
        <span className="ml-4 text-cyan-400 font-medium text-lg">Loading Placement Statistics...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 lg:p-10 font-sans relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Header */}
        <div className="text-center md:text-left mb-10">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Placement Metrics & Analytics
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Overview of total package value spreads, applicant selections, and enrollment tracking.
          </p>
        </div>

        {/* Core metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-xl text-center hover:scale-[1.02] transition-transform duration-300">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Highest CTC Package</h2>
            <p className="text-5xl font-extrabold text-emerald-400 font-mono tracking-tight">
              {stats.highestPackage} <span className="text-2xl font-bold text-slate-300">LPA</span>
            </p>
            <span className="text-[10px] text-slate-500 italic block mt-2">Peak placement package offered.</span>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-xl text-center hover:scale-[1.02] transition-transform duration-300">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Average Package Range</h2>
            <p className="text-5xl font-extrabold text-cyan-400 font-mono tracking-tight">
              {stats.averagePackage} <span className="text-2xl font-bold text-slate-300">LPA</span>
            </p>
            <span className="text-[10px] text-slate-500 italic block mt-2">Mean package value overall.</span>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-xl text-center hover:scale-[1.02] transition-transform duration-300">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Placed Students</h2>
            <p className="text-5xl font-extrabold text-purple-400 font-mono tracking-tight">
              {stats.selectedStudents} <span className="text-xl font-bold text-slate-300">Offers</span>
            </p>
            <span className="text-[10px] text-slate-500 italic block mt-2">Candidates selected by companies.</span>
          </div>

        </div>

        {/* Count statistics grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-xl text-center hover:scale-[1.02] transition-transform duration-300">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Enrolled Roster</h2>
            <p className="text-5xl font-extrabold text-indigo-400 font-mono tracking-tight">
              {stats.totalStudents} <span className="text-lg font-bold text-slate-300">Students</span>
            </p>
            <span className="text-[10px] text-slate-500 italic block mt-2">Excludes admin placement profiles.</span>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-xl text-center hover:scale-[1.02] transition-transform duration-300">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Hiring Partners</h2>
            <p className="text-5xl font-extrabold text-pink-400 font-mono tracking-tight">
              {stats.totalCompanies} <span className="text-lg font-bold text-slate-300">Drives</span>
            </p>
            <span className="text-[10px] text-slate-500 italic block mt-2">Active college partner profiles.</span>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-xl text-center hover:scale-[1.02] transition-transform duration-300">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Submitted Job Leads</h2>
            <p className="text-5xl font-extrabold text-amber-400 font-mono tracking-tight">
              {stats.totalApplications} <span className="text-lg font-bold text-slate-300">Leads</span>
            </p>
            <span className="text-[10px] text-slate-500 italic block mt-2">Student job applications filed.</span>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Statistics