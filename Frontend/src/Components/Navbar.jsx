import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = ({ authUser, setAuthUser }) => {
  const isAdmin = authUser?.role === "admin";
  const isLoggedIn = Boolean(authUser);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/students/logout`,
        {},
        { withCredentials: true }
      );
      setAuthUser(null);
      toast.success("Logout Successful");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Logout Failed");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 text-white px-6 lg:px-10 py-4 flex justify-between items-center shadow-2xl">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent tracking-tight hover:scale-[1.01] transition-transform duration-200">
          Smart Placement Tracker
        </Link>
      </div>

      <div className="flex gap-4 lg:gap-6 text-sm lg:text-base items-center">
        {/* BEFORE LOGIN */}
        {!isLoggedIn && (
          <>
            <Link
              to="/"
              className="text-slate-300 hover:text-white font-semibold transition-colors duration-200"
            >
              Home
            </Link>

            <Link
              to="/register"
              className="text-slate-300 hover:text-white font-semibold transition-colors duration-200"
            >
              Register
            </Link>

            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 px-4 py-2 rounded-xl font-bold shadow-lg shadow-cyan-500/10 transition-all duration-300 hover:scale-[1.03]"
            >
              Login
            </Link>
          </>
        )}

        {/* AFTER LOGIN */}
        {isLoggedIn && (
          <>
            <Link
              to={isAdmin ? "/dashboard" : "/student-dashboard"}
              className="text-slate-300 hover:text-white font-semibold transition-colors duration-200"
            >
              {isAdmin ? "Dashboard" : "Student Portal"}
            </Link>

            <Link
              to="/profile"
              className="text-slate-300 hover:text-white font-semibold transition-colors duration-200"
            >
              Profile
            </Link>

            <Link
              to="/companies"
              className="text-slate-300 hover:text-white font-semibold transition-colors duration-200"
            >
              Companies
            </Link>

            {isAdmin ? (
              <>
                <Link
                  to="/add-company"
                  className="text-slate-300 hover:text-white font-semibold transition-colors duration-200"
                >
                  Add Company
                </Link>

                <Link
                  to="/students"
                  className="text-slate-300 hover:text-white font-semibold transition-colors duration-200"
                >
                  Students List
                </Link>

                <Link
                  to="/admin-applications"
                  className="text-slate-300 hover:text-white font-semibold transition-colors duration-200"
                >
                  Applications
                </Link>

                <Link
                  to="/statistics"
                  className="text-slate-300 hover:text-white font-semibold transition-colors duration-200"
                >
                  Stats
                </Link>
              </>
            ) : (
              <Link
                to="/applications"
                className="text-slate-300 hover:text-white font-semibold transition-colors duration-200"
              >
                My Applications
              </Link>
            )}

            <Link
              to="/notifications"
              className="text-slate-300 hover:text-white font-semibold transition-colors duration-200 flex items-center gap-1.5"
            >
              🔔 Notifications
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 hover:border-red-500/40 text-red-400 px-4 py-2 rounded-xl font-bold text-xs lg:text-sm hover:scale-[1.03] transition-all duration-300"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;