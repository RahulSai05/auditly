import { useEffect, useState } from "react";
import axios from "axios";

type PendingUser = {
  auditly_user_id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
};

export default function PendingUserApprovals() {
  const [rows, setRows] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [approvingId, setApprovingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://auditlyai.com/api/admin/pending-users");
      setRows(res.data?.data ?? []);
    } catch (e) {
      console.error(e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (auditly_user_id: number) => {
    try {
      setApprovingId(auditly_user_id);
      await axios.post("https://auditlyai.com/api/admin/approve-user", { auditly_user_id });
      setRows((prev) => prev.filter((u) => u.auditly_user_id !== auditly_user_id));
    } catch (e) {
      console.error(e);
      alert("Approve failed");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Approvals</h1>
          <p className="text-slate-600">Approve users waiting for access.</p>
        </div>

        <button
          onClick={load}
          className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 font-semibold text-slate-700">
          Pending Users ({rows.length})
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-slate-600">
                <th className="p-3">First Name</th>
                <th className="p-3">Last Name</th>
                <th className="p-3">Email</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td className="p-6 text-slate-500" colSpan={4}>
                    No pending users.
                  </td>
                </tr>
              ) : (
                rows.map((u) => (
                  <tr key={u.auditly_user_id} className="border-t border-slate-100">
                    <td className="p-3 text-slate-900">{u.first_name || "-"}</td>
                    <td className="p-3 text-slate-900">{u.last_name || "-"}</td>
                    <td className="p-3 text-slate-700">{u.email || "-"}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => approve(u.auditly_user_id)}
                        disabled={approvingId === u.auditly_user_id}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60"
                      >
                        {approvingId === u.auditly_user_id ? "Approving..." : "Approve"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}