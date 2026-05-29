const AdminDashboard = () => {

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-5xl font-bold text-center text-indigo-700 mb-10">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <h1 className="text-2xl font-bold mb-4">
            Total Students
          </h1>

          <p className="text-5xl text-blue-600 font-bold">
            120
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <h1 className="text-2xl font-bold mb-4">
            Companies
          </h1>

          <p className="text-5xl text-green-600 font-bold">
            25
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <h1 className="text-2xl font-bold mb-4">
            Selections
          </h1>

          <p className="text-5xl text-purple-600 font-bold">
            45
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <h1 className="text-2xl font-bold mb-4">
            Drives
          </h1>

          <p className="text-5xl text-red-600 font-bold">
            10
          </p>
        </div>

      </div>

    </div>
  )
}

export default AdminDashboard