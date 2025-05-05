import React, { useEffect, useState } from "react";

interface Agent {
  agent_id: number;
  agent_name: string;
  delivery_type: string;
  current_address: string;
  servicing_state: string;
  servicing_city: string;
  is_verified: boolean;
  gender: string;
  dob: string;
  created_at: string;
  updated_at: string;
}

interface User {
  auditly_user_id: number;
  auditly_user_name: string;
  email: string;
  user_type: string;
  is_agent: boolean;
  is_inspection_user: boolean;
  is_admin: boolean;
}

interface PendingAgent {
  agent: Agent;
  user: User;
}

const UserPermissionRequests: React.FC = () => {
  const [pendingAgents, setPendingAgents] = useState<PendingAgent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingAgents();
  }, []);

  const fetchPendingAgents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/pending-agent-approval");
      if (!response.ok) {
        throw new Error("Failed to fetch pending agents");
      }
      const data = await response.json();
      setPendingAgents(data.agents);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAgent = async (agentId: number) => {
    try {
      setLoading(true);
      const auditlyUserId = localStorage.getItem("userId");
      if (!auditlyUserId) {
        throw new Error("User ID not found in local storage");
      }

      const response = await fetch("/api/approve-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId,
          auditly_user_id: parseInt(auditlyUserId),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve agent");
      }

      setSuccessMessage("Agent approved successfully!");
      // Refresh the list after approval
      await fetchPendingAgents();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && pendingAgents.length === 0) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Agent Permission Requests</h1>
      
      {successMessage && (
        <div style={{ color: "green", marginBottom: "20px" }}>
          {successMessage}
        </div>
      )}

      {pendingAgents.length === 0 ? (
        <div>No pending agent requests</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Agent Name</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>User Name</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Delivery Type</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Location</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingAgents.map(({ agent, user }) => (
              <tr key={agent.agent_id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>{agent.agent_name}</td>
                <td style={{ padding: "10px" }}>{user.auditly_user_name}</td>
                <td style={{ padding: "10px" }}>{user.email}</td>
                <td style={{ padding: "10px" }}>{agent.delivery_type}</td>
                <td style={{ padding: "10px" }}>
                  {agent.servicing_city}, {agent.servicing_state}
                </td>
                <td style={{ padding: "10px" }}>
                  <button
                    onClick={() => handleApproveAgent(agent.agent_id)}
                    disabled={loading}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {loading ? "Processing..." : "Approve"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserPermissionRequests;
