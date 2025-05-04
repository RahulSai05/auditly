import { useState } from "react";

export default function RequestAccess() {
  const [form, setForm] = useState({
    reason: "",
    duration: "",
    additionalNotes: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("https://auditlyai.com/api/request-privileged-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit request:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Request Privileged Access</h2>
      {submitted ? (
        <p className="text-green-600 font-medium">Your request has been submitted!</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Reason for Access</label>
            <input
              type="text"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Requested Duration</label>
            <input
              type="text"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Additional Notes</label>
            <textarea
              name="additionalNotes"
              value={form.additionalNotes}
              onChange={handleChange}
              rows={4}
              className="w-full border p-2 rounded"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit Request
          </button>
        </form>
      )}
    </div>
  );
}
