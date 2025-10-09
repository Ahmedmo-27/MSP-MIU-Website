import React, { memo } from 'react';
import { getDepartmentNameById } from '../data/departments';

const ApplicationsTable = memo(({ 
  filteredApplications, 
  handleTextClick, 
  openCommentModal, 
  handleStatusChange, 
  getStatusColor 
}) => {
  return (
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
  );
});

ApplicationsTable.displayName = 'ApplicationsTable';

export default ApplicationsTable;
