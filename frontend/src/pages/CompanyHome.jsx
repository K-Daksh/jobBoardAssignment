import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCompany } from "../context/CompanyContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import ApplicantsModal from "../components/ApplicantsModal";

const CompanyHome = () => {
  const { company, setCompany } = useCompany();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("postedJobs");
  const [jobs, setJobs] = useState([]);
  const [isPostingJob, setIsPostingJob] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    experienceLevel: "BEGINNER",
    endDate: "",
    emails: "",
  });
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:4000/company/jobs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setJobs(response.data.jobs);
    } catch (error) {
      console.log(error);
      toast.error("Error fetching jobs");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:4000/company/logout", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      localStorage.removeItem("token");
      setCompany(null);
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const jobPayload = {
        ...newJob,
        emails: newJob.emails
          ? newJob.emails.split(",").map((em) => em.trim())
          : [],
      };
      await axios.post("http://localhost:4000/company/jobs", jobPayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Job posted successfully!");
      setIsPostingJob(false);
      setNewJob({
        title: "",
        description: "",
        experienceLevel: "BEGINNER",
        endDate: "",
        emails: "",
      });
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error posting job");
    }
  };

  const handleSendOtp = async () => {
    try {
      await axios.post(
        "http://localhost:4000/company/send-verification",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("OTP sent to your email!");
      setShowOtpInput(true);
    } catch (error) {
      toast.error("Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/company/verify-otp",
        { otp },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCompany(response.data.company);
      toast.success("Company verified successfully!");
      setShowOtpInput(false);
    } catch (error) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message || "Invalid OTP");
    }
  };

  const handleRefresh = () => {
    fetchJobs();
    toast.info("Refreshing jobs list...");
  };

  const renderVerificationSection = () => (
    <div className="text-center space-y-6">
      <h2 className="text-xl font-semibold text-white mb-6">
        Verify Your Company
      </h2>
      <p className="text-gray-300">Verify your email to start posting jobs</p>
      <p className="text-gray-400">{company?.email}</p>

      {!showOtpInput ? (
        <button
          onClick={handleSendOtp}
          className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-6 rounded-lg transition-colors"
        >
          Send Verification OTP
        </button>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-64 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white text-center"
          />
          <button
            onClick={handleVerifyOtp}
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-6 rounded-lg transition-colors"
          >
            Verify OTP
          </button>
        </div>
      )}
    </div>
  );

  const JobCard = ({ job }) => (
    <div
      onClick={() => navigate(`/company/jobs/${job._id}/applicants`)}
      className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 mb-4 cursor-pointer hover:bg-slate-700/50 transition-colors"
    >
      <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>
      <p className="text-gray-300 mb-3">{job.description}</p>
      <div className="flex justify-between items-center">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium
          ${
            job.experienceLevel === "BEGINNER" &&
            "bg-green-500/10 text-green-500"
          }
          ${
            job.experienceLevel === "INTERMEDIATE" &&
            "bg-yellow-500/10 text-yellow-500"
          }
          ${job.experienceLevel === "EXPERT" && "bg-red-500/10 text-red-500"}
        `}
        >
          {job.experienceLevel}
        </span>
        <span className="text-gray-400 text-sm">
          Applications: {job.candidates?.length || 0}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900">
      <ToastContainer />
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-white">Company Dashboard</h1>
            <div className="text-gray-300">{company?.name}</div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-slate-800 border-r border-slate-700 h-[calc(100vh-73px)]">
          <nav className="p-4">
            <button
              onClick={() => {
                setActiveTab("postedJobs");
                setIsPostingJob(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-lg mb-2 ${
                activeTab === "postedJobs" && !isPostingJob
                  ? "bg-indigo-500 text-white"
                  : "text-gray-400 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              Posted Jobs
            </button>
            <button
              onClick={() => {
                setIsPostingJob(true);
                setActiveTab("newJob");
              }}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                isPostingJob
                  ? "bg-indigo-500 text-white"
                  : "text-gray-400 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              Post New Job
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {isPostingJob ? (
            company?.verified ? (
              <div>
                <h2 className="text-xl font-semibold text-white mb-6">
                  Post New Job
                </h2>
                <form onSubmit={handlePostJob} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={newJob.title}
                      onChange={(e) =>
                        setNewJob({ ...newJob, title: e.target.value })
                      }
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newJob.description}
                      onChange={(e) =>
                        setNewJob({ ...newJob, description: e.target.value })
                      }
                      required
                      rows="4"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Experience Level
                    </label>
                    <select
                      value={newJob.experienceLevel}
                      onChange={(e) =>
                        setNewJob({
                          ...newJob,
                          experienceLevel: e.target.value,
                        })
                      }
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="EXPERT">Expert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newJob.endDate}
                      onChange={(e) =>
                        setNewJob({ ...newJob, endDate: e.target.value })
                      }
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Additional Emails (comma separated)
                    </label>
                    <textarea
                      value={newJob.emails}
                      onChange={(e) =>
                        setNewJob({ ...newJob, emails: e.target.value })
                      }
                      rows="2"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded-lg transition-colors"
                  >
                    Post Job
                  </button>
                </form>
              </div>
            ) : (
              renderVerificationSection()
            )
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Posted Jobs
                </h2>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Refresh
                </button>
              </div>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {selectedJob && (
        <ApplicantsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};

export default CompanyHome;
