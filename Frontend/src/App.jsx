import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

import Navbar from "./Components/Navbar"

import Home from "./Pages/Home"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import Dashboard from "./Pages/Dashboard"
import Notifications from "./Pages/Notifications"
import Companies from "./Pages/Companies"
import Statistics from "./Pages/Statistics"
import StudentDashboard from "./Pages/StudentDashboard"
import AddCompany from "./Pages/AddCompany"
import Students from "./Pages/Students"
import Applications from "./Pages/Applications"
import AdminApplications from "./Pages/AdminApplications"
import Profile from "./Pages/Profile"

import ProtectedRoute from "./Components/ProtectedRoute"

function App() {
  const [authUser, setAuthUser] = useState(null)
  const [isAuthResolved, setIsAuthResolved] = useState(false)

  useEffect(() => {
    axios.defaults.baseURL = import.meta.env.VITE_API_URL
    axios.defaults.withCredentials = true

    const verifyAuth = async () => {
      try {
        const res = await axios.get("/api/students/me")
        setAuthUser(res.data)
      } catch (error) {
        setAuthUser(null)
      } finally {
        setIsAuthResolved(true)
      }
    }

    verifyAuth()
  }, [])

  return (
    <BrowserRouter>
      <Navbar authUser={authUser} setAuthUser={setAuthUser} />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login setAuthUser={setAuthUser} />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              isLoggedIn={Boolean(authUser)}
              isAuthResolved={isAuthResolved}
              userRole={authUser?.role}
              requiredRole="admin"
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute isLoggedIn={Boolean(authUser)} isAuthResolved={isAuthResolved}>
              <Notifications authUser={authUser} />
            </ProtectedRoute>
          }
        />
         <Route
          path="/companies"
          element={
            <ProtectedRoute isLoggedIn={Boolean(authUser)} isAuthResolved={isAuthResolved}>
              <Companies authUser={authUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-company"
          element={
            <ProtectedRoute
              isLoggedIn={Boolean(authUser)}
              isAuthResolved={isAuthResolved}
              userRole={authUser?.role}
              requiredRole="admin"
            >
              <AddCompany />
            </ProtectedRoute>
          }
        />

        <Route
          path="/students"
          element={
            <ProtectedRoute
              isLoggedIn={Boolean(authUser)}
              isAuthResolved={isAuthResolved}
              userRole={authUser?.role}
              requiredRole="admin"
            >
              <Students />
            </ProtectedRoute>
          }
        />

        <Route
          path="/statistics"
          element={
            <ProtectedRoute
              isLoggedIn={Boolean(authUser)}
              isAuthResolved={isAuthResolved}
              userRole={authUser?.role}
              requiredRole="admin"
            >
              <Statistics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute
              isLoggedIn={Boolean(authUser)}
              isAuthResolved={isAuthResolved}
              userRole={authUser?.role}
              requiredRole="student"
            >
              <StudentDashboard authUser={authUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute
              isLoggedIn={Boolean(authUser)}
              isAuthResolved={isAuthResolved}
            >
              <Profile authUser={authUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute
              isLoggedIn={Boolean(authUser)}
              isAuthResolved={isAuthResolved}
              userRole={authUser?.role}
              requiredRole="student"
            >
              <Applications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-applications"
          element={
            <ProtectedRoute
              isLoggedIn={Boolean(authUser)}
              isAuthResolved={isAuthResolved}
              userRole={authUser?.role}
              requiredRole="admin"
            >
              <AdminApplications />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App