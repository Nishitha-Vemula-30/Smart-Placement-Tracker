import { Link } from "react-router-dom"

const Profile = ({ authUser }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 lg:p-10 font-sans relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* Profile Card Header */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
            <div>
              <p className="text-xs text-cyan-400 uppercase font-bold tracking-widest mb-1.5">User Profile Overview</p>
              <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                {authUser?.name || "Student Portal User"}
              </h1>
              <p className="text-slate-400 mt-2 text-sm">
                Review academic specifications below. Keep CGPA and department branch details accurate to satisfy company drive eligibility criteria.
              </p>
            </div>
            
            <Link
              to={authUser?.role === "admin" ? "/dashboard" : "/student-dashboard"}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-xs px-4 py-2.5 rounded-xl font-bold hover:scale-[1.02] shadow-lg shadow-cyan-500/10 active:scale-[0.98] transition-all"
            >
              Go to {authUser?.role === "admin" ? "Dashboard Dashboard" : "Student Dashboard"}
            </Link>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          {/* Card 1: Basic details */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
              Account Details
            </h2>
            
            <div className="space-y-4 text-slate-300">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">User Name</p>
                <p className="mt-1 text-base font-semibold text-white">{authUser?.name || "Not provided"}</p>
              </div>
              <div className="h-[1px] bg-white/5"></div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Email Address</p>
                <p className="mt-1 text-base font-mono text-slate-200">{authUser?.email || "Not provided"}</p>
              </div>
              <div className="h-[1px] bg-white/5"></div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Security Role</p>
                <p className="mt-1">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                    authUser?.role === "admin" 
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" 
                      : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  }`}>
                    {authUser?.role || "student"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Academics */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400"></span>
              Academic Details
            </h2>
            
            <div className="space-y-4 text-slate-300">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Academic Branch</p>
                <p className="mt-1 text-base font-semibold text-white">{authUser?.branch || "Not applicable (Admin Account)"}</p>
              </div>
              <div className="h-[1px] bg-white/5"></div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Cumulative CGPA</p>
                <p className="mt-1">
                  {authUser?.role === "admin" ? (
                    <span className="text-slate-400 text-sm italic">Not applicable</span>
                  ) : authUser?.cgpa !== undefined && authUser?.cgpa !== null && authUser?.cgpa !== "" ? (
                    <span className="text-amber-400 font-bold bg-amber-400/10 px-3 py-1 rounded-lg border border-amber-400/20 font-mono">
                      {Number(authUser.cgpa).toFixed(2)} / 10.00
                    </span>
                  ) : (
                    <span className="text-slate-500 italic text-sm">Not provided</span>
                  )}
                </p>
              </div>
              <div className="h-[1px] bg-white/5"></div>
              <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
                <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-1">Drive Eligibility Note</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Active recruitment criteria filter candidates based on CGPA and Branch specs. Keeping roster profiles updated guarantees smooth drive applications.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Instructions */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-pink-400"></span>
            Recommended Actions Pipeline
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300">
            <li>Verify your academic branch and cumulative CGPA details in this portal view.</li>
            <li>Explore active and upcoming job hiring cycles on the <Link to="/companies" className="text-cyan-400 hover:text-cyan-300 font-semibold underline">Companies</Link> page.</li>
            <li>Track interview rounds and real-time status transitions under <Link to="/applications" className="text-cyan-400 hover:text-cyan-300 font-semibold underline">My Applications</Link>.</li>
          </ol>
        </div>

      </div>
    </div>
  )
}

export default Profile
