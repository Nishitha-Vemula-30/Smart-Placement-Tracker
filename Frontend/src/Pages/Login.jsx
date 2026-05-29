import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

const Login = ({ setAuthUser }) => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({

    email: "",
    password: ""

  })

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    })

  }

  const submitHandler = async (e) => {

    e.preventDefault()

    try {

      const response = await axios.post(

        `${import.meta.env.VITE_API_URL}/api/students/login`,

        formData,

        {
          withCredentials: true
        }

      )

      console.log(response.data)

      const student = response.data.student

      setAuthUser(student)

      if (student?.role === "admin") {

        navigate("/dashboard")

      } else {

        navigate("/student-dashboard")

      }

    } catch (error) {

      console.log(error)

      alert(

        error.response?.data?.message ||

        "Login Failed"

      )

    }

  }

  return (

    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-5">

      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>

      <form
        onSubmit={submitHandler}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8"
      >

        <div className="text-center mb-8">

          <h1 className="text-4xl font-extrabold text-white mb-3">
            Welcome Back 👋
          </h1>

          <p className="text-gray-300">
            Login to continue your placement journey
          </p>

        </div>

        <div className="space-y-5">

          <div>

            <label className="text-gray-300 text-sm">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full mt-2 p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-blue-400"
              onChange={handleChange}
              required
            />

          </div>

          <div>

            <label className="text-gray-300 text-sm">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full mt-2 p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-blue-400"
              onChange={handleChange}
              required
            />

          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 py-4 rounded-xl font-bold text-lg"
          >
            Login
          </button>

        </div>

        <div className="text-center mt-6">

          <p className="text-gray-300">

            New User?{" "}

            <Link
              to="/register"
              className="text-blue-400 font-semibold"
            >
              Register
            </Link>

          </p>

        </div>

      </form>

    </div>

  )

}

export default Login