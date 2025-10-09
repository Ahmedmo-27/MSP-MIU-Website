const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

// Simple cache implementation
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCacheKey(url, options = {}) {
  return `${url}_${JSON.stringify(options)}`;
}

function getCachedData(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCachedData(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

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
      const cacheKey = getCacheKey(`${API_BASE_URL}/applications`);
      const cachedData = getCachedData(cacheKey);
      
      if (cachedData) {
        console.log('Returning cached applications data');
        return cachedData;
      }

      const response = await fetch(`${API_BASE_URL}/applications`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch applications');
      }

      // Cache the result
      setCachedData(cacheKey, result);
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

      // Invalidate cache when data is updated
      const cacheKey = getCacheKey(`${API_BASE_URL}/applications`);
      cache.delete(cacheKey);

      return result;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  static async updateApplicationComment(id, comment) {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}/comment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update application comment');
      }

      // Invalidate cache when data is updated
      const cacheKey = getCacheKey(`${API_BASE_URL}/applications`);
      cache.delete(cacheKey);

      return result;
    } catch (error) {
      console.error('Error updating application comment:', error);
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

      // Invalidate cache when data is updated
      const cacheKey = getCacheKey(`${API_BASE_URL}/applications`);
      cache.delete(cacheKey);

      return result;
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  }
}

export default ApiService;
