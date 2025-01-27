import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";

const JobCard = ({ job }) => {
  const handleApply = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/student/apply-job/${job._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Successfully applied to job!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply");
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
      <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>
      <p className="text-gray-300 mb-4">{job.description}</p>
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
        <button
          onClick={handleApply}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/student/jobs?page=${page}&limit=4`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setJobs(response.data.jobs);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error("Error fetching jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handlePageChange = (page) => {
    fetchJobs(page);
  };

  return (
    <div className="container mx-auto">
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
              No jobs available at the moment
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
