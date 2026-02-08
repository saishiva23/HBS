const API_BASE_URL = 'http://52.66.52.254:8080/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    // Only add Authorization header if token exists and is valid
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token && token.trim().length > 0 && token.includes('.')) {
      headers.Authorization = `Bearer ${token.trim()}`;
    }
    
    const config = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Test connection
  async testConnection() {
    try {
      console.log('Testing connection to:', `${API_BASE_URL}/hotels`);
      const response = await fetch(`${API_BASE_URL}/hotels`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      return response.ok;
    } catch (error) {
      console.error('Connection test error:', error);
      return false;
    }
  }

  // HTTP Methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }

  // Authentication
  async login(email, password) {
    return this.post('/users/signin', { email, password });
  }

  // Hotels
  async getHotels() {
    return this.request('/hotels');
  }

  // Bookings
  async getUserBookings() {
    return this.request('/bookings/my-bookings');
  }
}

export default new ApiService();