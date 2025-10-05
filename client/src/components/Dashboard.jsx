import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:3000/api/applications") // adjust backend port if needed
      .then(res => {
        setApplications(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching applications:", err);
        setLoading(false);
      });
  }, []);

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
            <th>Approved</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id}>
              <td>{app.university_id}</td>
              <td>{app.full_name}</td>
              <td>{app.faculty}</td>
              <td>{app.email}</td>
              <td>{app.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Total Applications: {applications.length}</p>
    </div>
  );
};

export default Dashboard;
