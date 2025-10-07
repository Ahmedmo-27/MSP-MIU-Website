import React, { useEffect, useState } from "react";
import ApiService from "../services/api";
import { getDepartmentNameById } from "../data/departments";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [expandedText, setExpandedText] = useState({ field: null, appId: null });

  // Chart colors - more distinguished and vibrant
  const chartColors = [
    '#395a7f', '#e74c3c', '#27ae60', '#f39c12', '#9b59b6', '#1abc9c',
    '#34495e', '#e67e22', '#3498db', '#2ecc71', '#8e44ad', '#f1c40f',
    '#e91e63', '#00bcd4', '#4caf50', '#ff9800', '#795548', '#607d8b'
  ];

  // Process data for charts
  const getChartData = (applications, field, fieldName = 'Unknown') => {
    const counts = {};
    applications.forEach(app => {
      let value = app[field];
      if (field === 'first_choice' || field === 'second_choice') {
        if (value) {
          value = getDepartmentNameById(value);
        }
      }
      if (!value || value === null || value === undefined) value = 'N/A';
      counts[value] = (counts[value] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([label, count], index) => ({
        label,
        count,
        percentage: Math.round((count / applications.length) * 100),
        color: chartColors[index % chartColors.length]
      }))
      .sort((a, b) => b.count - a.count); // Sort by count (highest to lowest)
  };

  const firstChoiceData = getChartData(applications, 'first_choice');
  const secondChoiceData = getChartData(applications, 'second_choice');
  const facultyData = getChartData(applications, 'faculty');

  // Function to handle text expansion
  const handleTextClick = (field, appId, text) => {
    if (text && text.length > 100) {
      setExpandedText({ field, appId, text });
    }
  };

  // Function to close expanded text
  const closeExpandedText = () => {
    setExpandedText({ field: null, appId: null });
  };

  // Text Modal Component
  const TextModal = () => {
    if (!expandedText.field) return null;

    const fieldTitle = expandedText.field === 'skills' ? 'Skills' : 'Why Join MSP?';
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '30px',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          position: 'relative'
        }}>
          <button
            onClick={closeExpandedText}
            style={{
              position: 'absolute',
              top: '10px',
              right: '15px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
          <h3 style={{
            margin: '0 0 20px 0',
            color: '#395a7f',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            {fieldTitle}
          </h3>
          <div style={{
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6',
            color: '#333',
            fontSize: '14px'
          }}>
            {expandedText.text}
          </div>
        </div>
      </div>
    );
  };

  // Simple Pie Chart Component
  const PieChart = ({ data, title, size = 200 }) => {
    if (!data || data.length === 0) return <div style={{ 
      textAlign: 'center', 
      margin: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#666'
    }}>No data available</div>;

    let cumulativePercentage = 0;
    
    return (
      <div style={{ 
        textAlign: 'center', 
        margin: '20px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h3 style={{ 
          marginBottom: '15px', 
          color: '#395a7f',
          fontSize: '16px',
          fontWeight: '600',
          fontFamily: 'Arial, sans-serif'
        }}>{title}</h3>
        
        <div style={{ position: 'relative', display: 'inline-block', width: size, height: size }}>
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            {data.map((item, index) => {
              const circumference = 2 * Math.PI * (size / 2 - 10);
              const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -(cumulativePercentage / 100) * circumference;
              
              cumulativePercentage += item.percentage;
              
              return (
                <circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={size / 2 - 10}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="18"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  style={{ 
                    transition: 'all 0.3s ease',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}
                />
              );
            })}
          </svg>
          
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '18px',
            fontWeight: '700',
            color: '#395a7f',
            fontFamily: 'Arial, sans-serif'
          }}>
            {data.reduce((sum, item) => sum + item.count, 0)}
          </div>
        </div>
        
        <div style={{ 
          marginTop: '15px', 
          textAlign: 'left',
          maxWidth: '250px'
        }}>
          {data.map((item, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              margin: '8px 0',
              padding: '4px 0'
            }}>
              <div style={{
                width: '14px',
                height: '14px',
                backgroundColor: item.color,
                borderRadius: '3px',
                marginRight: '10px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }}></div>
              <span style={{ 
                fontSize: '13px',
                fontFamily: 'Arial, sans-serif',
                color: '#333',
                fontWeight: '500'
              }}>
                {item.label}: {item.count} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
      <TextModal />
      <h2>Applications Dashboard</h2>
      
      {/* Charts Section */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'space-around', 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <PieChart 
          data={firstChoiceData} 
          title="First Choice Departments" 
          size={180}
        />
        <PieChart 
          data={secondChoiceData} 
          title="Second Choice Departments" 
          size={180}
        />
        <PieChart 
          data={facultyData} 
          title="Faculties Distribution" 
          size={180}
        />
      </div>
      
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
              <th style={{ padding: "10px", textAlign: "left" }}>Why Join MSP?</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Interview</th>
              <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map(app => (
              <tr key={app.application_id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "8px" }}>{app.university_id}</td>
                <td style={{ padding: "8px" }}>{app.full_name}</td>
                <td style={{ padding: "8px" }}>
                  <a 
                    href={`mailto:${app.email}`}
                    style={{ 
                      color: 'inherit', 
                      textDecoration: 'underline',
                      fontWeight: '500'
                    }}
                    onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseOut={(e) => e.target.style.textDecoration = 'underline'}
                  >
                    {app.email}
                  </a>
                </td>
                <td style={{ padding: "8px" }}>{app.faculty}</td>
                <td style={{ padding: "8px" }}>{app.year}</td>
                <td style={{ padding: "8px" }}>
                  <a 
                    href={`https://wa.me/${app.phone_number.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      color: 'inherit', 
                      textDecoration: 'underline',
                      fontWeight: '500'
                    }}
                    onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseOut={(e) => e.target.style.textDecoration = 'underline'}
                  >
                    {app.phone_number}
                  </a>
                </td>
                <td style={{ padding: "8px" }}>{getDepartmentNameById(app.first_choice)}</td>
                <td style={{ padding: "8px" }}>
                  {app.second_choice ? getDepartmentNameById(app.second_choice) : "N/A"}
                </td>
                <td style={{ padding: "8px", maxWidth: "200px", wordWrap: "break-word" }}>
                  <span
                    onClick={() => handleTextClick('skills', app.application_id, app.skills)}
                    style={{
                      cursor: app.skills.length > 100 ? 'pointer' : 'default',
                      color: 'inherit',
                      textDecoration: app.skills.length > 100 ? 'underline' : 'none'
                    }}
                    title={app.skills.length > 100 ? 'Click to view full text' : ''}
                  >
                    {app.skills.length > 100 ? `${app.skills.substring(0, 100)}...` : app.skills}
                  </span>
                </td>
                <td style={{ padding: "8px", maxWidth: "200px", wordWrap: "break-word" }}>
                  <span
                    onClick={() => handleTextClick('motivation', app.application_id, app.motivation)}
                    style={{
                      cursor: app.motivation.length > 100 ? 'pointer' : 'default',
                      color: 'inherit',
                      textDecoration: app.motivation.length > 100 ? 'underline' : 'none'
                    }}
                    title={app.motivation.length > 100 ? 'Click to view full text' : ''}
                  >
                    {app.motivation.length > 100 ? `${app.motivation.substring(0, 100)}...` : app.motivation}
                  </span>
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