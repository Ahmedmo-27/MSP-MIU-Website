import React, { useEffect, useState } from "react";
import ApiService from "../services/api";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const result = await ApiService.getAllApplications();
        setApplications(result.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusChange = async (application_id, newStatus) => {
    // Store original status for potential rollback
    const originalStatus = applications.find(app => app.application_id === application_id)?.status;
    
    // Update locally for instant feedback
    setApplications(prev =>
      prev.map(app => (app.application_id === application_id ? { ...app, status: newStatus } : app))
    );

    // Call backend to persist change
    try {
      const result = await ApiService.updateApplicationStatus(application_id, newStatus);
      console.log("Status updated:", result);
    } catch (err) {
      console.error("Error updating status:", err);
      // Revert the local change on error
      setApplications(prev =>
        prev.map(app => (app.application_id === application_id ? { ...app, status: originalStatus } : app))
      );
    }
  };

  if (loading) return <p>Loading applications...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Applications Dashboard</h2>
      <table border="1" cellPadding="10" style={{ marginTop: "20px", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Faculty</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.application_id}>
              <td>{app.university_id}</td>
              <td>{app.full_name}</td>
              <td>{app.faculty}</td>
              <td>{app.email}</td>
              <td>
                <select
                  value={app.status}
                  onChange={e => handleStatusChange(app.application_id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Total Applications: {applications.length}</p>
    </div>
  );
};

export default Dashboard;