import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const ComposeEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobInfo, setJobInfo] = useState(null);
  const [recipients, setRecipients] = useState([]);

  useEffect(() => {
    const { recipients, job } = location.state || {};
    setJobInfo(job);
    console.log("recipients", recipients);
    setRecipients(recipients);
  }, [location]);

  // Destructure the additional properties here:

  const [emailData, setEmailData] = useState({
    subject: "",
    body: "",
  });
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!emailData.subject || !emailData.body) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!jobInfo) {
      toast.error("No job data found");
      return;
    }
    const emailBodyData = {
      recipients,
      ...emailData,
      jobId: jobInfo._id,
      companyName: jobInfo.companyName,
    };

    setSending(true);
    try {
      await axios.post(
        "http://localhost:4000/company/send-email",
        emailBodyData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Emails sent successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Failed to send emails:", error);
      toast.error("Failed to send emails");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {sending && <LoadingSpinner />}
      <ToastContainer />
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Compose Email</h1>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 hover:text-white rounded-lg transition-colors"
            >
              Back
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Recipients ({recipients?.length || 0})
              </label>
              <div className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-gray-400">
                {recipients?.join(", ")}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Job Title
              </label>
              <div className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white">
                {jobInfo?.title || "N/A"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={emailData.subject}
                onChange={(e) =>
                  setEmailData({ ...emailData, subject: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white"
                placeholder="Enter email subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Message
              </label>
              <textarea
                value={emailData.body}
                onChange={(e) =>
                  setEmailData({ ...emailData, body: e.target.value })
                }
                rows={10}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white resize-none"
                placeholder="Enter your message"
              />
            </div>

            <button
              onClick={() => {
                console.log("handleSend");
                handleSend();
              }}
              disabled={sending}
              className={`w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded-lg transition-colors ${
                sending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {sending ? "Sending..." : "Send Email"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposeEmail;
