import { useNavigate } from "react-router-dom"

const Home = () => {

  const navigate = useNavigate()

  const features = [
    {
      title: "Track Companies",
      desc: "Manage placement companies, drives, packages and interview rounds.",
      icon: "🏢",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Student Dashboard",
      desc: "Students can track applications, eligibility and placement status.",
      icon: "🎓",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Notifications",
      desc: "Receive instant updates about drives, interviews and results.",
      icon: "🔔",
      color: "from-pink-500 to-rose-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">

      {/* Hero Section */}
      <div className="relative px-6 lg:px-20 py-20">

        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>

        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              Smart
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {" "}Placement{" "}
              </span>
              Tracker
            </h1>

            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl">
              A modern placement management platform that helps colleges manage
              students, companies, applications, interview rounds,
              notifications and placement analytics efficiently.
            </p>

            <div className="flex flex-wrap gap-4">

              {/* Navigate To Login */}
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105"
              >
                Get Started
              </button>

              <button className="border border-gray-500 hover:border-blue-400 hover:bg-blue-500/10 transition-all duration-300 px-8 py-3 rounded-xl font-semibold">
                Learn More
              </button>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-5 mt-12">

              <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-5 text-center">
                <h2 className="text-3xl font-bold text-blue-400">
                  100+
                </h2>

                <p className="text-gray-300 text-sm mt-1">
                  Students
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-5 text-center">
                <h2 className="text-3xl font-bold text-green-400">
                  25+
                </h2>

                <p className="text-gray-300 text-sm mt-1">
                  Companies
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-5 text-center">
                <h2 className="text-3xl font-bold text-pink-400">
                  80%
                </h2>

                <p className="text-gray-300 text-sm mt-1">
                  Placements
                </p>
              </div>

            </div>
          </div>

          {/* Right Dashboard Preview */}
          <div className="relative">

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

              <div className="flex justify-between items-center mb-8">

                <h2 className="text-2xl font-bold">
                  Dashboard Preview
                </h2>

                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>

              </div>

              <div className="space-y-5">

                <div className="bg-blue-500/20 border border-blue-400/20 rounded-2xl p-5">
                  <h3 className="font-bold text-lg">
                    Upcoming Drive
                  </h3>

                  <p className="text-gray-300 mt-1">
                    TCS Ninja Hiring - Tomorrow
                  </p>
                </div>

                <div className="bg-green-500/20 border border-green-400/20 rounded-2xl p-5">
                  <h3 className="font-bold text-lg">
                    Applications
                  </h3>

                  <p className="text-gray-300 mt-1">
                    12 Active Applications
                  </p>
                </div>

                <div className="bg-pink-500/20 border border-pink-400/20 rounded-2xl p-5">
                  <h3 className="font-bold text-lg">
                    Notifications
                  </h3>

                  <p className="text-gray-300 mt-1">
                    5 New Placement Updates
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 lg:px-20 py-20">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">

            <h2 className="text-4xl font-bold mb-4">
              Powerful Features
            </h2>

            <p className="text-gray-400 text-lg">
              Everything needed for a modern placement management system.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {features.map((item, index) => (

              <div
                key={index}
                className="group bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl"
              >

                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-3xl mb-6`}
                >
                  {item.icon}
                </div>

                <h2 className="text-2xl font-bold mb-4">
                  {item.title}
                </h2>

                <p className="text-gray-300 leading-relaxed">
                  {item.desc}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-8 text-center text-gray-400">
         2026 Smart Placement Tracker 
      </div>

    </div>
  )
}

export default Home
