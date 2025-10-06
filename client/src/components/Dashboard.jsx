import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:3000/api/applications") // adjust backend port if needed
      .then(res => {
        // Ensure status has default "pending"
        const apps = res.data.data.map(app => ({
          ...app,
          status: app.status || "pending"
        }));
        setApplications(apps);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching applications:", err);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = (id, newStatus) => {
    // Update locally for instant feedback
    setApplications(prev =>
      prev.map(app => (app.id === id ? { ...app, status: newStatus } : app))
    );

    // Call backend to persist change
    axios.put(`http://localhost:3000/api/applications/${id}/status`, { status: newStatus })
      .then(res => console.log("Status updated:", res.data))
      .catch(err => console.error("Error updating status:", err));
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
            <tr key={app.id}>
              <td>{app.university_id}</td>
              <td>{app.full_name}</td>
              <td>{app.faculty}</td>
              <td>{app.email}</td>
              <td>
                <select
                  value={app.status}
                  onChange={e => handleStatusChange(app.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="denied">Denied</option>
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
