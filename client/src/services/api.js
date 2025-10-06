const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

class ApiService {
  static async submitApplication(formData) {
    try {
      console.log('API Service - Sending data:', formData);
      console.log('API Service - JSON stringified:', JSON.stringify(formData));
      
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('API Service - Response status:', response.status);
      const result = await response.json();
      console.log('API Service - Response data:', result);
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application');
      }

      return result;
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  }


  static async getAllApplications() {
    try {
      const response = await fetch(`${API_BASE_URL}/applications`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch applications');
      }

      return result;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

  static async updateApplicationStatus(id, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update application status');
      }

      return result;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  static async deleteApplication(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete application');
      }

      return result;
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  }
}

export default ApiService;
