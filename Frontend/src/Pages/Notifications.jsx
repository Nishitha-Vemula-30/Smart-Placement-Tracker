import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Notifications = ({ authUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin send notification states
  const [students, setStudents] = useState([]);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [targetStudentId, setTargetStudentId] = useState("all");
  const [sending, setSending] = useState(false);

  const isAdmin = authUser?.role === "admin";

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/notifications`,
        { withCredentials: true }
      );

      if (Array.isArray(res.data)) {
        setNotifications(res.data);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/students/all`,
        { withCredentials: true }
      );
      if (Array.isArray(res.data)) {
        setStudents(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    if (isAdmin) {
      fetchStudents();
    }
  }, []);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notificationMsg.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    setSending(true);
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

      toast.success(
        targetStudentId === "all"
          ? "Notification sent to all students!"
          : "Notification sent to student!"
      );
      setNotificationMsg("");
      setTargetStudentId("all");
      // Add new notification to the top of the list
      setNotifications([res.data, ...notifications]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
        <span className="ml-4 text-cyan-400 font-medium text-lg">Loading Notifications...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 lg:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              🔔 Notifications
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {isAdmin
                ? "Send and manage notifications for students."
                : "Stay updated with placement alerts and announcements."
              }
            </p>
          </div>
          
          <button 
            onClick={fetchNotifications}
            className="bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs px-4 py-2 rounded-xl font-bold hover:scale-[1.02] transition-all duration-300"
          >
            Refresh
          </button>
        </div>

        {/* Admin: Send Notification Form */}
        {isAdmin && (
          <div className="mb-8 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-pink-400"></span>
              Send Notification
            </h2>

            <form onSubmit={handleSendNotification} className="space-y-4">
              {/* Recipient */}
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-2">
                  Send To
                </label>
                <select
                  value={targetStudentId}
                  onChange={(e) => setTargetStudentId(e.target.value)}
                  className="w-full bg-white/10 border border-white/15 text-white rounded-xl p-3 outline-none cursor-pointer focus:border-pink-500 transition-all duration-300"
                >
                  <option value="all" className="bg-slate-900 text-white">All Students (Global)</option>
                  {students.map((s) => (
                    <option key={s._id} value={s._id} className="bg-slate-900 text-white">
                      {s.name} ({s.branch || "No Branch"} - CGPA: {s.cgpa || "N/A"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-2">
                  Message
                </label>
                <textarea
                  placeholder="Type your notification message here..."
                  value={notificationMsg}
                  onChange={(e) => setNotificationMsg(e.target.value)}
                  rows="3"
                  className="w-full bg-white/10 border border-white/15 text-white rounded-xl p-4 outline-none placeholder-slate-400 focus:border-pink-500 transition-all duration-300 resize-none text-sm"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white py-3 rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                {sending ? "Sending..." : "Send Notification"}
              </button>
            </form>
          </div>
        )}

        {/* Notifications Feed */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
            {isAdmin ? "Sent Notifications" : "Your Notifications"}
            <span className="ml-2 text-xs bg-white/10 px-2 py-1 rounded-lg text-slate-400 font-medium">
              {notifications.length}
            </span>
          </h2>

          {notifications.length === 0 ? (
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-10 shadow-xl text-center">
              <p className="text-slate-400 font-semibold text-lg">No Notifications Yet</p>
              <p className="text-slate-500 text-sm mt-1">
                {isAdmin
                  ? "Use the form above to send notifications to students."
                  : "You're all caught up! Check back later for updates."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => {
                const isGlobal = !notification.studentId;
                
                return (
                  <div
                    key={notification._id}
                    className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-xl hover:bg-white/8 transition-colors duration-200"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider self-start ${
                        isGlobal
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      }`}>
                        {isGlobal ? "📢 Global Announcement" : "👤 Personal Alert"}
                      </span>
                      
                      <span className="text-xs text-slate-500 font-medium">
                        {new Date(notification.createdAt).toLocaleDateString()} at{" "}
                        {new Date(notification.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <p className="text-slate-200 text-base leading-relaxed">
                      {notification.message}
                    </p>

                    {/* Show recipient info for admin */}
                    {isAdmin && !isGlobal && notification.studentId && (
                      <p className="text-xs text-slate-500 mt-2">
                        Sent to: {notification.studentId.name || "Student"} ({notification.studentId.email || ""})
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Notifications;