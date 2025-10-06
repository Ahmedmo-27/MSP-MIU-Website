import React, { useEffect, useState } from "react";
import ApiService from "../services/api";
import { getDepartmentNameById } from "../data/departments";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApplications, setFilteredApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const result = await ApiService.getAllApplications();
        console.log("Fetched applications:", result.data);
        setApplications(result.data);
        setFilteredApplications(result.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Filter applications based on search term
  useEffect(() => {
    console.log("Search term:", searchTerm);
    console.log("Applications count:", applications.length);
    
    const filtered = applications.filter(app => {
      if (!searchTerm) return true; // Show all if no search term
      
      const searchLower = searchTerm.toLowerCase();
      
      // Helper function to safely convert to string and check
      const checkField = (field) => {
        if (field === null || field === undefined) return false;
        return String(field).toLowerCase().includes(searchLower);
      };
      
      return (
        checkField(app.university_id) ||
        checkField(app.full_name) ||
        checkField(app.email) ||
        checkField(app.faculty) ||
        checkField(app.phone_number) ||
        checkField(app.year) ||
        checkField(getDepartmentNameById(app.first_choice)) ||
        (app.second_choice && checkField(getDepartmentNameById(app.second_choice))) ||
        checkField(app.skills) ||
        checkField(app.motivation) ||
        checkField(app.interview) ||
        checkField(app.status)
      );
    });
    
    console.log("Filtered applications count:", filtered.length);
    setFilteredApplications(filtered);
  }, [searchTerm, applications]);

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
      
      {/* Search Input */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search applications..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            border: "1px solid #ccc",
            color: "#395a7f",
            borderRadius: "4px",
            fontSize: "14px"
          }}
        />
        <p style={{ margin: "5px 0", color: "#666", fontSize: "14px" }}>
          Showing {filteredApplications.length} of {applications.length} applications
        </p>
      </div>

      {/* Applications Table */}
      <div style={{ overflowX: "auto" }}>
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ backgroundColor: "#395a7f" }}>
              <th style={{ padding: "10px", textAlign: "left" }}>University ID</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Full Name</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Email</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Faculty</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Year</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Phone</th>
              <th style={{ padding: "10px", textAlign: "left" }}>First Choice</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Second Choice</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Skills</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Motivation</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Interview</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map(app => (
              <tr key={app.application_id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "8px" }}>{app.university_id}</td>
                <td style={{ padding: "8px" }}>{app.full_name}</td>
                <td style={{ padding: "8px" }}>{app.email}</td>
                <td style={{ padding: "8px" }}>{app.faculty}</td>
                <td style={{ padding: "8px" }}>{app.year}</td>
                <td style={{ padding: "8px" }}>{app.phone_number}</td>
                <td style={{ padding: "8px" }}>{getDepartmentNameById(app.first_choice)}</td>
                <td style={{ padding: "8px" }}>
                  {app.second_choice ? getDepartmentNameById(app.second_choice) : "N/A"}
                </td>
                <td style={{ padding: "8px", maxWidth: "200px", wordWrap: "break-word" }}>
                  {app.skills.length > 100 ? `${app.skills.substring(0, 100)}...` : app.skills}
                </td>
                <td style={{ padding: "8px", maxWidth: "200px", wordWrap: "break-word" }}>
                  {app.motivation.length > 100 ? `${app.motivation.substring(0, 100)}...` : app.motivation}
                </td>
                <td style={{ padding: "8px" }}>{app.interview}</td>
                <td style={{ padding: "8px" }}>
                  <select
                    value={app.status}
                    onChange={e => handleStatusChange(app.application_id, e.target.value)}
                    style={{ padding: "4px", fontSize: "12px", backgroundColor: "#395a7f" }}
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
      </div>
      
      <p style={{ marginTop: "20px", color: "#666" }}>
        Total Applications: {applications.length} | Filtered: {filteredApplications.length}
      </p>
    </div>
  );
};

export default Dashboard;