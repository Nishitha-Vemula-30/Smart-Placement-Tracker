import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useNavigate, Link } from "react-router-dom"

const Register = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    cgpa: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: "student",
      branch: formData.branch ? formData.branch.trim().toUpperCase() : "",
      cgpa: formData.cgpa,
    }

    try {

      await axios.post(

        `${import.meta.env.VITE_API_URL}/api/students/register`,

        payload,

        {
          withCredentials: true
        }

      )

      toast.success("Registration Successful 🎉")

      navigate("/login")

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Registration Failed"
      )

    }

  }

  return (

    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-5 overflow-hidden">

      {/* Background Blur Effects */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8">

        {/* Heading */}
        <div className="text-center mb-6">

          <h1 className="text-4xl font-extrabold text-white mb-3">
            Student Registration 🚀
          </h1>

          <p className="text-gray-300">
            Register to access Smart Placement Tracker
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>

            <label className="block text-gray-300 text-sm mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-blue-400 transition-all duration-300"
              onChange={handleChange}
              value={formData.name}
              required
            />

          </div>

          {/* Email */}
          <div>

            <label className="block text-gray-300 text-sm mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-blue-400 transition-all duration-300"
              onChange={handleChange}
              value={formData.email}
              required
            />

          </div>

          {/* Password */}
          <div className="relative">

            <label className="block text-gray-300 text-sm mb-2">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              className="w-full mt-2 pr-12 p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-blue-400 transition-all duration-300"
              onChange={handleChange}
              value={formData.password}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "�"}
            </button>

          </div>

          {/* Student-only fields: Branch and CGPA */}
            <>
              {/* Branch */}
              <div>

                <label className="block text-gray-300 text-sm mb-2">
                  Branch
                </label>

                <input
                  type="text"
                  name="branch"
                  placeholder="Enter your branch (e.g. CSE, ECE)"
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-blue-400 transition-all duration-300"
                  onChange={handleChange}
                  value={formData.branch}
                  required
                />

              </div>

              {/* CGPA */}
              <div>

                <label className="block text-gray-300 text-sm mb-2">
                  CGPA
                </label>

                <input
                  type="number"
                  name="cgpa"
                  step="0.01"
                  min="0"
                  max="10"
                  placeholder="Enter your CGPA"
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-blue-400 transition-all duration-300"
                  onChange={handleChange}
                  value={formData.cgpa}
                  required
                />

              </div>
            </>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:scale-[1.02] bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
          >
            Register as Student
          </button>

        </form>

        {/* Login Link */}
        <div className="text-center mt-6">

          <p className="text-gray-300">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-blue-400 hover:text-cyan-300 font-semibold transition-all duration-300"
            >
              Login!!
            </Link>

          </p>

        </div>

      </div>

    </div>

  )
}

export default Register
