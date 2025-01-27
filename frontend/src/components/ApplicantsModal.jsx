import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ApplicantsModal = ({ job, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailData, setEmailData] = useState({
    subject: "",
    body: "",
  });

  useEffect(() => {
    fetchApplicants();
  }, [job._id]);

  const fetchApplicants = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/company/jobs/${
          job._id
        }/applicants`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setApplicants(response.data.applicants);
    } catch (error) {
      toast.error("Failed to fetch applicants");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedApplicants.length === applicants.length) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(applicants.map((app) => app.email));
    }
  };

  const handleSelect = (email) => {
    if (selectedApplicants.includes(email)) {
      setSelectedApplicants(selectedApplicants.filter((e) => e !== email));
    } else {
      setSelectedApplicants([...selectedApplicants, email]);
    }
  };

  const handleSendEmail = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/company/send-email`,
        {
          recipients: selectedApplicants,
          subject: emailData.subject,
          body: emailData.body,
          jobId: job._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Emails sent successfully!");
      setShowEmailForm(false);
    } catch (error) {
      toast.error("Failed to send emails");
    }
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg w-full max-w-4xl shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            {job.title} - Applicants
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-white">Loading applicants...</div>
            </div>
          ) : applicants.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-white">No applicants yet</div>
            </div>
          ) : (
            <>
              {/* Controls */}
              <div className="space-y-4 mb-4">
                <div className="flex gap-4">
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
                    <option value="date">Sort by Date</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleSelectAll}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {selectedApplicants.length === applicants.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                  <button
                    onClick={() => setShowEmailForm(true)}
                    disabled={selectedApplicants.length === 0}
                    className={`bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors ${
                      selectedApplicants.length === 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    Email Selected ({selectedApplicants.length})
                  </button>
                </div>
              </div>

              {/* Applicants List */}
              <div className="flex-1 overflow-y-auto min-h-0 rounded-lg border border-slate-700">
                {sortedApplicants.map((applicant) => (
                  <div
                    key={applicant.email}
                    className="flex items-center gap-4 p-4 hover:bg-slate-700/50 border-b border-slate-700 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedApplicants.includes(applicant.email)}
                      onChange={() => handleSelect(applicant.email)}
                      className="w-5 h-5 rounded border-slate-500"
                    />
                    <div>
                      <div className="text-white font-medium">
                        {applicant.fullname}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {applicant.email}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Email Form Modal */}
      {showEmailForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-slate-800 rounded-lg w-full max-w-2xl shadow-xl">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Send Email</h3>
              <button
                onClick={() => setShowEmailForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Subject"
                value={emailData.subject}
                onChange={(e) =>
                  setEmailData({ ...emailData, subject: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
              />
              <textarea
                placeholder="Email body..."
                value={emailData.body}
                onChange={(e) =>
                  setEmailData({ ...emailData, body: e.target.value })
                }
                rows={6}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white resize-none"
              />
              <button
                onClick={handleSendEmail}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantsModal;
