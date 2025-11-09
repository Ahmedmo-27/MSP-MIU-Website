import React, { memo } from 'react';
import { departments } from '../data/departments';

const FiltersSection = memo(({ 
  filters, 
  searchTerm, 
  filteredApplications, 
  handleFilterChange, 
  handleSearchChange, 
  clearFilters,
  applyFilters,
  isFiltering
}) => {
  return (
    <div style={{ 
      marginBottom: "20px", 
      padding: "20px", 
      backgroundColor: "#f8f9fa", 
      borderRadius: "8px",
      border: "1px solid #e9ecef"
    }}>
      <h3 style={{ margin: "0 0 15px 0", color: "#395a7f" }}>Filters</h3>
      
      {/* Search Input */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Search applications..."
          value={searchTerm}
          onChange={e => handleSearchChange(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            border: "1px solid #ccc",
            color: "#395a7f",
            borderRadius: "4px",
            fontSize: "14px"
          }}
        />
      </div>
      
      {/* Filter Dropdowns */}
      <div style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: "15px", 
        color: "#395a7f",
        alignItems: "center",
        marginBottom: "15px"
      }}>
        {/* First Choice Filter */}
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "#395a7f" }}>
            First Choice:
          </label>
          <select
            value={filters.first_choice}
            onChange={e => handleFilterChange('first_choice', e.target.value)}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
              color: "#395a7f",
              minWidth: "150px"
            }}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
        
        {/* Second Choice Filter */}
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "#395a7f" }}>
            Second Choice:
          </label>
          <select
            value={filters.second_choice}
            onChange={e => handleFilterChange('second_choice', e.target.value)}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
              color: "#395a7f",
              minWidth: "150px"
            }}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
        
        {/* Status Filter */}
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "#395a7f" }}>
            Status:
          </label>
          <select
            value={filters.status}
            onChange={e => handleFilterChange('status', e.target.value)}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
              color: "#395a7f",
              minWidth: "120px"
            }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        {/* Faculty Filter */}
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "#395a7f" }}>
            Faculty:
          </label>
          <select
            value={filters.faculty}
            onChange={e => handleFilterChange('faculty', e.target.value)}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
              color: "#395a7f",
              minWidth: "150px"
            }}
          >
            <option value="">All Faculties</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Engineering Sciences & Arts - ECE">Engineering Sciences & Arts - ECE</option>
            <option value="Mass Communication">Mass Communication</option>
            <option value="Dentistry">Dentistry</option>
            <option value="Engineering Sciences & Arts - Architecture">Engineering Sciences & Arts - Architecture</option>
            <option value="Pharmacy">Pharmacy</option>
            <option value="Business">Business</option>
            <option value="Alsun">Alsun</option>
          </select>
        </div>
        
        {/* Year Filter */}
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "#395a7f" }}>
            Year:
          </label>
          <select
            value={filters.year}
            onChange={e => handleFilterChange('year', e.target.value)}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
              color: "#395a7f",
              minWidth: "100px"
            }}
          >
            <option value="">All Years</option>
            <option value="1">Freshman</option>
            <option value="2">Sophomore</option>
            <option value="3">Junior</option>
            <option value="4">Senior</option>
            <option value="5">Senior 2</option>
          </select>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div style={{ 
        display: "flex", 
        gap: "10px", 
        alignItems: "center",
        marginBottom: "15px"
      }}>
        <button
          onClick={applyFilters}
          disabled={isFiltering}
          style={{
            padding: "10px 20px",
            backgroundColor: isFiltering ? "#ccc" : "#395a7f",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            cursor: isFiltering ? "not-allowed" : "pointer",
            fontWeight: "500"
          }}
        >
          {isFiltering ? "Filtering..." : "Apply Filters"}
        </button>
        
        <button
          onClick={clearFilters}
          style={{
            padding: "10px 16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            cursor: "pointer"
          }}
        >
          Clear All Filters
        </button>
      </div>
      
      <p style={{ margin: "10px 0 0 0", color: "#666", fontSize: "14px" }}>
        Showing {filteredApplications.length} applications
      </p>
    </div>
  );
});

FiltersSection.displayName = 'FiltersSection';

export default FiltersSection;
