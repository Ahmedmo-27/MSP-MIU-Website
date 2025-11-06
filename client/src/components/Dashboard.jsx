import React, { useEffect, useState, useCallback, useRef, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/api";
import { getDepartmentNameById } from "../data/departments";

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Comment Modal Component - moved outside to prevent re-renders
const CommentModal = memo(({ commentModal, setCommentModal, closeCommentModal, saveComment, textareaRef }) => {
  if (!commentModal.isOpen) return null;

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
        maxWidth: '800px',
        width: '90vw',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        position: 'relative'
      }}>
        <button
          onClick={closeCommentModal}
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
          Interview Comment - {commentModal.application?.full_name}
        </h3>
        <textarea
          ref={textareaRef}
          value={commentModal.comment}
          onChange={(e) => setCommentModal(prev => ({ ...prev, comment: e.target.value }))}
          placeholder="Enter interview comment here..."
          style={{
            width: '100%',
            minHeight: '200px',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            color: '#395a7f',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.5',
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => e.target.style.borderColor = '#395a7f'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          marginTop: '20px'
        }}>
          <button
            onClick={closeCommentModal}
            style={{
              padding: '10px 20px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f8f9fa',
              color: '#666',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'Arial, sans-serif'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e9ecef'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#f8f9fa'}
          >
            Cancel
          </button>
          <button
            onClick={saveComment}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#395a7f',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'Arial, sans-serif'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2c4a66'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#395a7f'}
          >
            Save Comment
          </button>
        </div>
      </div>
    </div>
  );
});

CommentModal.displayName = 'CommentModal';

const Dashboard = memo(() => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [expandedText, setExpandedText] = useState({ field: null, appId: null });
  const [commentModal, setCommentModal] = useState({ isOpen: false, application: null, comment: '' });
  const textareaRef = useRef(null);

  // Chart colors - memoized to prevent recreation
  const chartColors = useMemo(() => [
    '#395a7f', '#e74c3c', '#27ae60', '#f39c12', '#9b59b6', '#1abc9c',
    '#34495e', '#e67e22', '#3498db', '#2ecc71', '#8e44ad', '#f1c40f',
    '#e91e63', '#00bcd4', '#4caf50', '#ff9800', '#795548', '#607d8b'
  ], []);

  // Process data for charts - memoized
  const getChartData = useCallback((applications, field, fieldName = 'Unknown') => {
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
  }, [chartColors]);

  const firstChoiceData = useMemo(() => getChartData(applications, 'first_choice'), [applications, getChartData]);
  const secondChoiceData = useMemo(() => getChartData(applications, 'second_choice'), [applications, getChartData]);
  const facultyData = useMemo(() => getChartData(applications, 'faculty'), [applications, getChartData]);

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

  // Function to open comment modal
  const openCommentModal = (application) => {
    setCommentModal({
      isOpen: true,
      application: application,
      comment: application.comment || ''
    });
  };

  // Function to close comment modal
  const closeCommentModal = () => {
    setCommentModal({ isOpen: false, application: null, comment: '' });
  };

  // Focus textarea when modal opens
  useEffect(() => {
    if (commentModal.isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [commentModal.isOpen]);

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#27ae60'; // Green color from the palette
      case 'rejected':
        return '#e74c3c'; // Red color from the palette
      case 'pending':
      default:
        return '#395a7f'; // Default blue color from the palette
    }
  };

  // Function to save comment
  const saveComment = async () => {
    try {
      await ApiService.updateApplicationComment(commentModal.application.application_id, commentModal.comment);
      
      // Update local state
      setApplications(prev =>
        prev.map(app => 
          app.application_id === commentModal.application.application_id 
            ? { ...app, comment: commentModal.comment }
            : app
        )
      );
      
      // Also update filtered applications to reflect the change immediately
      setFilteredApplications(prev =>
        prev.map(app => 
          app.application_id === commentModal.application.application_id 
            ? { ...app, comment: commentModal.comment }
            : app
        )
      );
      
      closeCommentModal();
    } catch (error) {
      console.error('Error saving comment:', error);
      alert('Failed to save comment. Please try again.');
    }
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


  // Pie Chart Component
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
    // Authentication check removed for now - page is accessible without login
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
        // Show error message to user
        alert(`Error loading applications: ${err.message || 'Unknown error'}`);
      }
    };

    fetchApplications();
  }, [navigate]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term, apps) => {
      if (!term) {
        setFilteredApplications(apps);
        return;
      }
      
      const searchLower = term.toLowerCase();
      
      // Helper function to safely convert to string and check
      const checkField = (field) => {
        if (field === null || field === undefined) return false;
        return String(field).toLowerCase().includes(searchLower);
      };
      
      const filtered = apps.filter(app => (
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
        checkField(app.status) ||
        checkField(app.comment)
      ));
      
      setFilteredApplications(filtered);
    }, 300),
    []
  );

  // Filter applications based on search term
  useEffect(() => {
    debouncedSearch(searchTerm, applications);
  }, [searchTerm, applications, debouncedSearch]);

  const handleStatusChange = async (application_id, newStatus) => {
    // Store original status for potential rollback
    const originalStatus = applications.find(app => app.application_id === application_id)?.status;
    
    // Update locally for instant feedback
    setApplications(prev =>
      prev.map(app => (app.application_id === application_id ? { ...app, status: newStatus } : app))
    );
    
    // Also update filtered applications to reflect the change immediately
    setFilteredApplications(prev =>
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
      // Also revert filtered applications
      setFilteredApplications(prev =>
        prev.map(app => (app.application_id === application_id ? { ...app, status: originalStatus } : app))
      );
    }
  };

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await ApiService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      navigate('/login');
    }
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ 
        padding: "20px", 
        textAlign: "center",
        color: "#eaf2ff",
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <p style={{ fontSize: "18px", margin: "20px 0" }}>Loading applications...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", color: "#eaf2ff" }}>
      <TextModal />
      <CommentModal 
        commentModal={commentModal}
        setCommentModal={setCommentModal}
        closeCommentModal={closeCommentModal}
        saveComment={saveComment}
        textareaRef={textareaRef}
      />
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: "#eaf2ff", margin: 0 }}>Applications Dashboard</h2>
      </div>
      
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
                <td style={{ padding: "8px" }}>
                  <div>
                    <span
                      onClick={() => openCommentModal(app)}
                      style={{
                        cursor: 'pointer',
                        color: 'inherit',
                        textDecoration: 'underline',
                        fontWeight: '500'
                      }}
                      title="Click to add/edit interview comment"
                    >
                      {app.full_name}
                    </span>
                    <div style={{ fontSize: "10px", color: "#666", marginTop: "2px", fontStyle: "italic" }}>
                      Click to add comment
                    </div>
                  </div>
                </td>
                <td style={{ padding: "8px" }}>
                  <div>
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
                    <div style={{ fontSize: "10px", color: "#666", marginTop: "2px", fontStyle: "italic" }}>
                      Click to send mail
                    </div>
                  </div>
                </td>
                <td style={{ padding: "8px" }}>{app.faculty}</td>
                <td style={{ padding: "8px" }}>{app.year}</td>
                <td style={{ padding: "8px" }}>
                  <div>
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
                    <div style={{ fontSize: "10px", color: "#666", marginTop: "2px", fontStyle: "italic" }}>
                      Click to chat on WhatsApp
                    </div>
                  </div>
                </td>
                <td style={{ padding: "8px" }}>{getDepartmentNameById(app.first_choice)}</td>
                <td style={{ padding: "8px" }}>
                  {app.second_choice ? getDepartmentNameById(app.second_choice) : "N/A"}
                </td>
                <td style={{ padding: "8px", maxWidth: "200px", wordWrap: "break-word" }}>
                  <div>
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
                    {app.skills.length > 100 && (
                      <div style={{ fontSize: "10px", color: "#666", marginTop: "2px", fontStyle: "italic" }}>
                        Click to view more
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ padding: "8px", maxWidth: "200px", wordWrap: "break-word" }}>
                  <div>
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
                    {app.motivation.length > 100 && (
                      <div style={{ fontSize: "10px", color: "#666", marginTop: "2px", fontStyle: "italic" }}>
                        Click to view more
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ padding: "8px" }}>{app.interview}</td>
                <td style={{ padding: "8px" }}>
                  <select
                    value={app.status}
                    onChange={e => handleStatusChange(app.application_id, e.target.value)}
                    style={{ 
                      padding: "4px", 
                      fontSize: "12px", 
                      backgroundColor: getStatusColor(app.status),
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer"
                    }}
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
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;