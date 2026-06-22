import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for sending notification
  const [notificationMsg, setNotificationMsg] = useState("");
  const [targetStudentId, setTargetStudentId] = useState("all");
  const [sendingNotification, setSendingNotification] = useState(false);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");

  const fetchData = async () => {
    try {
      const [studentsRes, companiesRes, appsRes, notificationsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/students/all`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/company/all`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/application/all`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/notifications`, { withCredentials: true })
      ]);

      setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);
      setCompanies(Array.isArray(companiesRes.data) ? companiesRes.data : []);
      setApplications(Array.isArray(appsRes.data) ? appsRes.data : []);
      setNotifications(Array.isArray(notificationsRes.data) ? notificationsRes.data : []);
    } catch (error) {
      console.error("Dashboard data fetching failed:", error);
      toast.error("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notificationMsg.trim()) {
      toast.error("Notification message cannot be empty");
      return;
    }

    setSendingNotification(true);
    try {
      const payload = {
        studentId: targetStudentId === "all" ? null : targetStudentId,
        message: notificationMsg.trim(),
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notifications`,
        payload,
        { withCredentials: true }
      );

      toast.success(targetStudentId === "all" ? "Broadcast message sent!" : "Notification sent to student!");
      setNotificationMsg("");
      // Refresh notifications list
      setNotifications([res.data, ...notifications]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send notification");
    } finally {
      setSendingNotification(false);
    }
  };

  // Calculations for Stats
  const totalStudents = students.filter(s => s.role !== "admin").length;
  const totalCompanies = companies.length;
  const totalApps = applications.length;

  const placedStudentsSet = new Set(
    applications
      .filter((app) => app.status === "Selected" && app.student)
      .map((app) => app.student._id || app.student)
  );
  const placedCount = placedStudentsSet.size;
  const placementRate = totalStudents > 0 ? ((placedCount / totalStudents) * 100).toFixed(1) : "0.0";

  const packages = companies
    .map((c) => parseFloat(c.packageValue) || 0)
    .filter((p) => p > 0);
  const highestPackage = packages.length > 0 ? Math.max(...packages).toFixed(1) : "0.0";
  const avgPackage = packages.length > 0 ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1) : "0.0";

  // Filter students (exclude admins)
  const filteredStudents = students
    .filter((s) => s.role !== "admin")
    .filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBranch =
        branchFilter === "all" ||
        (s.branch && s.branch.trim().toUpperCase() === branchFilter);
      return matchesSearch && matchesBranch;
    });

  // Extract unique uppercase branches for filter dropdown
  const uniqueBranches = [...new Set(
    students
      .filter((s) => s.role !== "admin" && s.branch)
      .map((s) => s.branch.trim().toUpperCase())
  )].sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
        <span className="ml-4 text-cyan-400 font-medium text-lg">Loading Admin Suite...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 lg:p-10 font-sans">
      
      {/* Upper header with navigation shortcuts */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5 mb-10">
        <div>
          <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Admin Operations Panel
          </h1>
          <p className="text-slate-400 mt-2">Manage college recruitment drives, tracking, and analytics.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/add-company" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all duration-300">
            + Add Company
          </Link>
          <Link to="/admin-applications" className="bg-white/10 hover:bg-white/15 border border-white/10 text-white px-5 py-3 rounded-xl font-bold hover:scale-[1.02] transition-all duration-300">
            View Applications
          </Link>
          <Link to="/companies" className="bg-white/10 hover:bg-white/15 border border-white/10 text-white px-5 py-3 rounded-xl font-bold hover:scale-[1.02] transition-all duration-300">
            Companies List
          </Link>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-5 mb-10">
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Students</span>
          <span className="text-3xl font-extrabold text-blue-400 mt-3">{totalStudents}</span>
        </div>
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Placed Students</span>
          <span className="text-3xl font-extrabold text-emerald-400 mt-3">{placedCount}</span>
        </div>
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Placement Rate</span>
          <span className="text-3xl font-extrabold text-cyan-400 mt-3">{placementRate}%</span>
        </div>
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Companies Added</span>
          <span className="text-3xl font-extrabold text-indigo-400 mt-3">{totalCompanies}</span>
        </div>
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Average Package</span>
          <span className="text-3xl font-extrabold text-purple-400 mt-3">{avgPackage} LPA</span>
        </div>
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Highest Package</span>
          <span className="text-3xl font-extrabold text-pink-400 mt-3">{highestPackage} LPA</span>
        </div>
      </div>

      {/* Main Grid: Left column students, right column notification compose & logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Student Management */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-400"></span> Registered Students
            </h2>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search name/email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/10 border border-white/15 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-400 outline-none focus:border-cyan-400 transition-all duration-300"
              />

              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="bg-white/10 border border-white/15 text-white text-sm rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-cyan-400 transition-all duration-300"
              >
                <option value="all" className="bg-slate-900 text-white">All Branches</option>
                {uniqueBranches.map((branch) => (
                  <option key={branch} value={branch} className="bg-slate-900 text-white">{branch}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-slate-400 text-sm font-semibold">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Branch</th>
                  <th className="p-4 text-center">CGPA</th>
                  <th className="p-4 text-center">Placement Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const isPlaced = applications.some(
                      (app) => app.student?._id === student._id && app.status === "Selected"
                    );
                    return (
                      <tr key={student._id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                        <td className="p-4 font-medium text-white">{student.name}</td>
                        <td className="p-4 text-slate-300 text-sm">{student.email}</td>
                        <td className="p-4 text-slate-300 text-sm">{student.branch}</td>
                        <td className="p-4 text-center text-slate-100 font-semibold">{student.cgpa || "N/A"}</td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${isPlaced ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20"}`}>
                            {isPlaced ? "Placed 🎉" : "Seeking"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-slate-500">
                      No Students Registered Yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Notifications composer & logs */}
        <div className="space-y-8">
          
          {/* Notification Compose Form */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-pink-400"></span> Send Student Alert
            </h2>

            <form onSubmit={handleSendNotification} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-2">Recipient</label>
                <select
                  value={targetStudentId}
                  onChange={(e) => setTargetStudentId(e.target.value)}
                  className="w-full bg-white/10 border border-white/15 text-white rounded-xl p-3 outline-none cursor-pointer focus:border-pink-500 transition-all duration-300"
                >
                  <option value="all" className="bg-slate-900 text-white">All Students (Global Broadcast)</option>
                  {students
                    .filter((s) => s.role !== "admin")
                    .map((s) => (
                      <option key={s._id} value={s._id} className="bg-slate-900 text-white">
                        {s.name} ({s.branch} - CGPA: {s.cgpa})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-2">Message</label>
                <textarea
                  placeholder="Enter message (e.g. TCS recruitment drive starts tomorrow. Apply fast!)"
                  value={notificationMsg}
                  onChange={(e) => setNotificationMsg(e.target.value)}
                  rows="4"
                  className="w-full bg-white/10 border border-white/15 text-white rounded-xl p-4 outline-none placeholder-slate-400 focus:border-pink-500 transition-all duration-300 resize-none text-sm"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={sendingNotification}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex justify-center items-center"
              >
                {sendingNotification ? "Sending Alert..." : "Send Alert"}
              </button>
            </form>
          </div>

          {/* Recent Alerts Feed */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-400"></span> Recent Alerts Logs
            </h2>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((noti) => (
                  <div key={noti._id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${noti.studentId ? "bg-cyan-500/20 text-cyan-300" : "bg-purple-500/20 text-purple-300"}`}>
                        {noti.studentId ? `To: ${noti.studentId.name || "Student"}` : "Global Broadcast"}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(noti.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{noti.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-5 text-sm">No recent alerts sent</p>
              )}
            </div>
            
            <div className="text-center mt-4">
              <Link to="/notifications" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-all duration-200">
                View All Alerts &rarr;
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;