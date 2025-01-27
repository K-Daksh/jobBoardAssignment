import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const JobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedApplicants, setSelectedApplicants] = useState([]);

  useEffect(() => {
    fetchJobAndApplicants();
  }, [jobId]);

  const fetchJobAndApplicants = async () => {
    try {
      const [jobRes, applicantsRes] = await Promise.all([
        axios.get(`http://localhost:4000/company/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get(`http://localhost:4000/company/jobs/${jobId}/applicants`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);
      setJob(jobRes.data.job);
      setApplicants(applicantsRes.data.applicants);
    } catch (error) {
      toast.error("Failed to fetch data");
      navigate("/company/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedApplicants.length === applicants.length) {
      setSelectedApplicants([]); // Deselect all
    } else {
      setSelectedApplicants(applicants.map((app) => app.email)); // Select all
    }
  };

  const handleEmailSelected = () => {
    if (selectedApplicants.length === 0) {
      toast.error("Please select at least one applicant");
      return;
    }
    console.log(job);
    navigate("/company/compose-email", {
      state: {
        recipients: selectedApplicants,
        job,
      },
    });
  };

  const filteredApplicants = applicants.filter(
    (applicant) =>
      applicant.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    if (sortBy === "name") return a.fullname.localeCompare(b.fullname);
    return a.email.localeCompare(b.email);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">{job?.title}</h1>
            <p className="text-gray-400 mt-1">Applicants List</p>
          </div>
          <button
            onClick={() => navigate("/company/dashboard")}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="p-6">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
            >
              <option value="name">Sort by Name</option>
              <option value="email">Sort by Email</option>
            </select>
            <button
              onClick={handleSelectAll}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {selectedApplicants.length === applicants.length
                ? "Deselect All"
                : "Select All"}
            </button>
            <button
              onClick={handleEmailSelected}
              disabled={selectedApplicants.length === 0}
              className={`bg-indigo-500 px-4 py-2 rounded-lg text-white ${
                selectedApplicants.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-600"
              }`}
            >
              Email Selected ({selectedApplicants.length})
            </button>
          </div>

          <div className="space-y-2">
            {sortedApplicants.map((applicant) => (
              <div
                key={applicant.email}
                className="flex items-center gap-4 p-4 bg-slate-900 rounded-lg"
              >
                <input
                  type="checkbox"
                  checked={selectedApplicants.includes(applicant.email)}
                  onChange={() => {
                    setSelectedApplicants((prev) =>
                      prev.includes(applicant.email)
                        ? prev.filter((email) => email !== applicant.email)
                        : [...prev, applicant.email]
                    );
                  }}
                  className="w-5 h-5 rounded border-slate-500"
                />
                <div>
                  <div className="text-white font-medium">
                    {applicant.fullname}
                  </div>
                  <div className="text-gray-400 text-sm">{applicant.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobApplicants;
