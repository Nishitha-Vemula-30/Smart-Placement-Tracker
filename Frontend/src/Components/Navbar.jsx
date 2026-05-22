import { Link } from "react-router"

const Navbar = () => {
  return (
    <div className="bg-blue-600 text-white px-10 py-4 flex justify-between items-center shadow-lg">

      <h1 className="text-2xl font-bold">
        Smart Placement Tracker
      </h1>

      <div className="flex gap-6 text-lg">

        <Link to="/">Home</Link>

        <Link to="/register">Register</Link>

        <Link to="/login">Login</Link>

        <Link to="/companies">Companies</Link>

      </div>
    </div>
  )
}

export default Navbar