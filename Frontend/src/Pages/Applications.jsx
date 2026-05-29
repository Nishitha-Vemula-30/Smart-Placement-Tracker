import { useEffect, useState } from "react";
import axios from "axios";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/application/my-applications`,
        { withCredentials: true }
      );

      console.log("My Applications:", res.data);
      if (Array.isArray(res.data)) {
        setApplications(res.data);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.log(error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Standard Pipeline Stages for Stepper Visualization
  const pipelineStages = [
    { key: "Applied", label: "Applied" },
    { key: "Round1", label: "Round 1" },
    { key: "Round2", label: "Round 2" },
    { key: "HR", label: "HR Interview" },
  ];

  // Helper to determine status node styling
  const getStageStatus = (appStatus, stageKey, index) => {
    if (appStatus === "Rejected") {
      return "pending"; // Rejection is handled with red color in the status card
    }
    if (appStatus === "Selected") {
      return "completed";
    }

    const currentStatusIndex = pipelineStages.findIndex((s) => s.key === appStatus);
    const stageIndex = pipelineStages.findIndex((s) => s.key === stageKey);

    if (stageIndex < currentStatusIndex) {
      return "completed";
    }
    if (stageIndex === currentStatusIndex) {
      return "active";
    }
    return "pending";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
        <span className="ml-4 text-cyan-400 font-medium text-lg">Loading Your Applications...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            My Applications & Selection Pipeline
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Monitor recruitment timeline, interview status, and results.
          </p>
        </div>

        {/* Applications list */}
        {applications.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl shadow-xl">
            <p className="text-3xl mb-4">💼</p>
            <p className="text-xl text-rose-400 font-semibold mb-2">No Applications Found</p>
            <p className="text-slate-400 text-sm">
              You haven't applied to any recruitment drives yet. Go to the Companies page to apply!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {applications.map((app) => {
              const comp = app.company || {};
              const isSelected = app.status === "Selected";
              const isRejected = app.status === "Rejected";

              return (
                <div
                  key={app._id}
                  className={`bg-white/5 border backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl transition-all duration-300 ${
                    isSelected
                      ? "border-emerald-500/20 shadow-emerald-500/5 bg-gradient-to-r from-white/5 to-emerald-950/10"
                      : isRejected
                      ? "border-rose-500/20 shadow-rose-500/5 bg-gradient-to-r from-white/5 to-rose-950/10"
                      : "border-white/10"
                  }`}
                >
                  {/* Card Top Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-white">{comp.companyName || "N/A"}</h2>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                        <span className="font-semibold text-slate-300 bg-slate-900 border border-white/5 px-2 py-0.5 rounded">
                          {comp.role || "N/A"}
                        </span>
                        <span>•</span>
                        <span className="font-mono">Applied on {new Date(app.appliedDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* CTC Package Badge */}
                      <span className="bg-cyan-500/10 border border-cyan-400/25 text-cyan-300 font-bold font-mono px-3.5 py-1.5 rounded-xl text-sm">
                        💰 {comp.packageValue || "N/A"} LPA
                      </span>
                    </div>
                  </div>

                  <div className="h-[1px] bg-white/5 mb-8"></div>

                  {/* Horizontal visual linear stepper progress tracker */}
                  <div className="mb-8">
                    <div className="relative flex items-center justify-between w-full">
                      {/* Connection Line Background */}
                      <div className="absolute left-0 right-0 h-0.5 bg-slate-800 top-1/2 -translate-y-1/2 -z-10"></div>
                      
                      {/* Interactive Progress Line */}
                      {!isRejected && (
                        <div
                          className="absolute left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-500 top-1/2 -translate-y-1/2 -z-10 transition-all duration-500"
                          style={{
                            width:
                              app.status === "Applied"
                                ? "0%"
                                : app.status === "Round1"
                                ? "33.33%"
                                : app.status === "Round2"
                                ? "66.66%"
                                : "100%",
                          }}
                        ></div>
                      )}

                      {/* Stepper nodes */}
                      {pipelineStages.map((stage, idx) => {
                        const status = getStageStatus(app.status, stage.key, idx);

                        return (
                          <div key={stage.key} className="flex flex-col items-center relative">
                            {/* Circle Node */}
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all duration-300 ${
                                status === "completed"
                                  ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950 scale-110"
                                  : status === "active"
                                  ? "bg-slate-900 border-2 border-indigo-400 text-indigo-300 ring-4 ring-indigo-500/20 scale-125"
                                  : "bg-slate-900 border border-slate-700 text-slate-500"
                              }`}
                            >
                              {status === "completed" ? "✓" : idx + 1}
                            </div>
                            
                            {/* Text label */}
                            <span
                              className={`text-[10px] md:text-xs font-bold mt-2.5 tracking-wide text-center absolute top-full whitespace-nowrap ${
                                status === "completed"
                                  ? "text-cyan-300"
                                  : status === "active"
                                  ? "text-indigo-400 font-extrabold"
                                  : "text-slate-500"
                              }`}
                            >
                              {stage.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="h-[20px]"></div>

                  {/* Card Bottom status Banner */}
                  <div className="mt-4 pt-4 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Timeline Outcome:</span>
                      {isSelected ? (
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider animate-pulse">
                          🎉 Hired & Placed!
                        </span>
                      ) : isRejected ? (
                        <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">
                          ❌ Rejected
                        </span>
                      ) : (
                        <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                          ⚙️ Active in {app.status === "Applied" ? "Initial Stage" : app.status}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 font-medium">
                      {isSelected ? (
                        <span className="text-emerald-400 font-bold">Congratulations! The TPO team has released your placement offer. 🎓</span>
                      ) : isRejected ? (
                        <span className="text-slate-500">We appreciate your effort. Your application has been closed for this drive.</span>
                      ) : (
                        <span>Your profile is currently under review for the next selection filter. Keep preparing!</span>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Applications;
