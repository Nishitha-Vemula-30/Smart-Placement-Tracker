import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const StudentDashboard = ({ authUser }) => {
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [appsRes, notificationsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/application/my-applications`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/notifications`, { withCredentials: true })
      ]);

      setApplications(Array.isArray(appsRes.data) ? appsRes.data : []);
      setNotifications(Array.isArray(notificationsRes.data) ? notificationsRes.data : []);
    } catch (error) {
      console.error("Student dashboard loading failed:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusStep = (status) => {
    const steps = ["Applied", "Round1", "Round2", "HR", "Selected"];
    const index = steps.indexOf(status);
    if (status === "Rejected") return -1;
    return index >= 0 ? index : 0;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
      case "Round1":
      case "Round2":
        return "bg-amber-500/20 text-amber-300 border border-amber-500/30";
      case "HR":
        return "bg-purple-500/20 text-purple-300 border border-purple-500/30";
      case "Selected":
        return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse";
      case "Rejected":
        return "bg-rose-500/20 text-rose-300 border border-rose-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border border-slate-500/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
        <span className="ml-4 text-cyan-400 font-medium text-lg">Loading Student Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 lg:p-10 font-sans">
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-10 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-xl">
        <div>
          <span className="text-cyan-400 font-bold tracking-widest text-xs uppercase block mb-1">Student Portal</span>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white">
            Welcome back, {authUser?.name || "Student"}! 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">Here is a quick overview of your placement journey.</p>
        </div>

        {/* Academic Stats */}
        <div className="flex gap-4 lg:gap-6 bg-slate-900/60 p-4 rounded-2xl border border-white/5">
          <div className="text-center px-2">
            <span className="text-xs text-slate-400 font-semibold block uppercase">Branch</span>
            <span className="text-lg font-bold text-cyan-300 mt-1 block">{authUser?.branch || "N/A"}</span>
          </div>
          <div className="h-10 w-[1px] bg-white/10 self-center"></div>
          <div className="text-center px-2">
            <span className="text-xs text-slate-400 font-semibold block uppercase">CGPA</span>
            <span className="text-lg font-bold text-amber-300 mt-1 block">{authUser?.cgpa || "N/A"}</span>
          </div>
          <div className="h-10 w-[1px] bg-white/10 self-center"></div>
          <div className="text-center px-2">
            <span className="text-xs text-slate-400 font-semibold block uppercase">Applications</span>
            <span className="text-lg font-bold text-indigo-300 mt-1 block">{applications.length}</span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Application Status Trackers */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400"></span> Active Applications Tracker
              </h2>
              <Link to="/companies" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-sm px-4 py-2 rounded-xl font-bold transition-all duration-200">
                Browse Companies
              </Link>
            </div>

            {applications.length > 0 ? (
              <div className="space-y-6">
                {applications.map((app) => {
                  const stepIndex = getStatusStep(app.status);
                  const isRejected = app.status === "Rejected";

                  return (
                    <div key={app._id} className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 space-y-4">
                      {/* Top Row info */}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div>
                          <h3 className="text-xl font-bold text-white">{app.company?.companyName || "N/A"}</h3>
                          <span className="text-xs text-slate-400 font-medium">Role: {app.company?.role || "N/A"} &bull; Package: {app.company?.packageValue || "N/A"} LPA</span>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold self-start sm:self-center ${getStatusBadgeClass(app.status)}`}>
                          {app.status}
                        </span>
                      </div>

                      {/* Stepper for visual status tracking */}
                      {!isRejected ? (
                        <div className="pt-2">
                          <div className="relative flex justify-between items-center w-full">
                            {/* Connector line */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 z-0"></div>
                            <div 
                              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 -translate-y-1/2 z-0 transition-all duration-500"
                              style={{ width: `${(stepIndex / 4) * 100}%` }}
                            ></div>

                            {/* Steps */}
                            {["Applied", "Round 1", "Round 2", "HR", "Selected"].map((step, idx) => {
                              const isCompleted = idx <= stepIndex;
                              const isActive = idx === stepIndex;
                              return (
                                <div key={step} className="relative z-10 flex flex-col items-center">
                                  <div className={`h-6 w-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-[10px] font-bold ${
                                    isCompleted 
                                      ? "bg-cyan-500 border-cyan-400 text-slate-950" 
                                      : "bg-slate-900 border-white/20 text-slate-400"
                                  } ${isActive ? "ring-4 ring-cyan-500/30 scale-110" : ""}`}>
                                    {isCompleted ? "✓" : idx + 1}
                                  </div>
                                  <span className={`text-[10px] mt-1.5 font-bold tracking-tight hidden sm:block ${isCompleted ? "text-cyan-400" : "text-slate-400"}`}>
                                    {step}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl">
                          <p className="text-xs text-rose-300 font-semibold leading-relaxed">
                            We regret to inform you that your application was not selected. TPO encourages you to apply for other drives.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500">
                <p className="mb-4">You have not applied for any placement drives yet.</p>
                <Link to="/companies" className="text-sm font-bold text-cyan-400 hover:text-cyan-300 underline">
                  Check Eligible Companies Now
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Notifications Feed */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-pink-400"></span> Placement Notifications
            </h2>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {notifications.length > 0 ? (
                notifications.map((noti) => {
                  const isGlobal = !noti.studentId;
                  return (
                    <div key={noti._id} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${isGlobal ? "bg-purple-500/20 text-purple-300" : "bg-cyan-500/20 text-cyan-300"}`}>
                          {isGlobal ? "Announcement" : "Personal Alert"}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(noti.createdAt).toLocaleDateString()} at {new Date(noti.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed">{noti.message}</p>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-500 text-center py-10 text-sm">No notifications yet</p>
              )}
            </div>
          </div>

          <div className="text-center mt-6 pt-4 border-t border-white/5">
            <Link to="/notifications" className="text-sm text-pink-400 hover:text-pink-300 font-bold transition-all duration-200">
              View All Alerts &rarr;
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;