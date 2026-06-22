import { useEffect, useState } from "react"
import axios from "axios"

const Students = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  // Roster filters
  const [searchQuery, setSearchQuery] = useState("")
  const [branchFilter, setBranchFilter] = useState("")
  const [minCgpa, setMinCgpa] = useState("")

  const getStudents = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/students/all`,
        {
          withCredentials: true
        }
      )

      if (Array.isArray(res.data)) {
        setStudents(res.data)
      } else {
        setStudents([])
      }
    } catch (error) {
      console.log(error)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getStudents()
  }, [])

  // Collect unique uppercase branches present in student list dynamically
  const uniqueBranches = Array.from(
    new Set(
      students
        .map((student) => student.branch?.trim().toUpperCase())
        .filter(Boolean)
    )
  ).sort();

  // Filter students based on search inputs
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBranch =
      !branchFilter ||
      (student.branch && student.branch.trim().toUpperCase() === branchFilter);

    const matchesCgpa =
      !minCgpa ||
      (student.cgpa !== undefined &&
        student.cgpa !== null &&
        Number(student.cgpa) >= Number(minCgpa));

    return matchesSearch && matchesBranch && matchesCgpa;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
        <span className="ml-4 text-cyan-400 font-medium text-lg">Loading Students...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Registered Students
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Showing {filteredStudents.length} of {students.length} students (excluding TPOs/admins).
            </p>
          </div>
        </div>

        {/* Search and Filters Widget */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-xl mb-8 flex flex-col md:flex-row gap-4 items-center">
          
          {/* Roster Search */}
          <div className="w-full md:w-1/2 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Search Student</label>
            <input
              type="text"
              placeholder="Search by student name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm placeholder-slate-500 transition-colors"
            />
          </div>

          {/* Dynamic Branch Dropdown */}
          <div className="w-full md:w-1/4 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Academic Branch</label>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-slate-300 focus:outline-none focus:border-cyan-400 text-sm cursor-pointer transition-colors"
            >
              <option value="" className="bg-slate-900 text-white">All Branches</option>
              {uniqueBranches.map((branch) => (
                <option key={branch} value={branch} className="bg-slate-900 text-white">
                  {branch}
                </option>
              ))}
            </select>
          </div>

          {/* Min CGPA Filter */}
          <div className="w-full md:w-1/4 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Min CGPA Filter</label>
            <input
              type="number"
              step="0.1"
              placeholder="E.g. 7.5 (view cgpa >= 7.5)"
              value={minCgpa}
              onChange={(e) => setMinCgpa(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/60 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm placeholder-slate-500 transition-colors"
            />
          </div>

        </div>

        {/* Table container */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-slate-400 text-sm font-semibold">
                <th className="p-4 rounded-tl-2xl">Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Department / Branch</th>
                <th className="p-4 text-center rounded-tr-2xl">Cumulative CGPA</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr
                    key={student._id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                  >
                    <td className="p-4 font-semibold text-white">
                      {student.name}
                    </td>
                    <td className="p-4 text-slate-300 text-sm font-mono">
                      {student.email}
                    </td>
                    <td className="p-4 text-slate-300 text-sm">
                      <span className="bg-slate-900/60 border border-white/5 text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
                        {student.branch || "N/A"}
                      </span>
                    </td>
                    <td className="p-4 text-center text-slate-100 font-semibold font-mono">
                      <span className="text-amber-400 font-bold bg-amber-400/10 px-3 py-1 rounded-lg border border-amber-400/25">
                        {student.cgpa ? student.cgpa.toFixed(2) : "N/A"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-12 text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-3xl">📭</span>
                      <p className="font-semibold text-slate-400">No Eligible Students Found</p>
                      <p className="text-xs text-slate-500">Try adjusting your roster search queries or minimum criteria threshold.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default Students