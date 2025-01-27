import React, { useState, useEffect } from "react";
import { useStudent } from "../context/StudentContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";

const StudentHome = () => {
  const { student, setStudent } = useStudent();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("newJobs");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when tab changes
    fetchJobs(1);
  }, [activeTab]);

  const fetchJobs = async (page) => {
    setLoading(true);
    try {
      const endpoint =
        activeTab === "newJobs"
          ? `${
              import.meta.env.VITE_BACKEND_URL
            }/student/jobs?page=${page}&limit=4`
          : `${
              import.meta.env.VITE_BACKEND_URL
            }/student/applied-jobs?page=${page}&limit=4`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setJobs(response.data.jobs);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Error fetching jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/student/logout`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      localStorage.removeItem("token");
      setStudent(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/student/apply-job/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Successfully applied to job!");
      fetchJobs(); // Refresh the jobs list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply for job");
    }
  };

  const handleRefresh = () => {
    fetchJobs();
    toast.info("Refreshing jobs...");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchJobs(page);
  };

  const JobCard = ({ job }) => (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 mb-4">
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
        <div className="flex items-center gap-4">
          {activeTab === "appliedJobs" ? (
            <span className="text-green-500 font-medium">Applied</span>
          ) : (
            <button
              onClick={() => handleApply(job._id)}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
            >
              Apply
            </button>
          )}
          {activeTab === "newJobs" && job.endDate && (
            <span className="text-gray-400 text-sm">
              Ends: {new Date(job.endDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <div className="text-gray-300">{student?.fullname}</div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-slate-800 border-r border-slate-700 h-[calc(100vh-73px)]">
          <nav className="p-4">
            <button
              onClick={() => setActiveTab("newJobs")}
              className={`w-full text-left px-4 py-2 rounded-lg mb-2 ${
                activeTab === "newJobs"
                  ? "bg-indigo-500 text-white"
                  : "text-gray-400 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              New Jobs
            </button>
            <button
              onClick={() => setActiveTab("appliedJobs")}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                activeTab === "appliedJobs"
                  ? "bg-indigo-500 text-white"
                  : "text-gray-400 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              Applied Jobs
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">
              {activeTab === "newJobs" ? "New Job Postings" : "Applied Jobs"}
            </h2>
            {activeTab === "newJobs" && (
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
            )}
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div>
              <div className="grid gap-6 mb-8">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>

              {jobs.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  {activeTab === "newJobs"
                    ? "No jobs available at the moment"
                    : "You haven't applied to any jobs yet"}
                </div>
              )}

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          )}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default StudentHome;
