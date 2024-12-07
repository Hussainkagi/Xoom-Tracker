// apiHelper.js
import axios from "axios";

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Common function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with a status other than 2xx
    console.error("API error:", error.response.data);
    return {
      status: error.response.status,
      message: error.response.data.message || "An error occurred",
    };
  } else if (error.request) {
    // Request was made but no response received
    console.error("No response:", error.request);
    return {
      status: 500,
      message: "No response from server",
    };
  } else {
    // Something else happened while setting up the request
    console.error("Error:", error.message);
    return {
      status: 500,
      message: error.message,
    };
  }
};

// API Helper object
const apiHelper = {
  get: async (endpoint, params = {}, headers = {}) => {
    try {
      const response = await api.get(endpoint, {
        params: params,
        headers: headers,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  post: async (endpoint, data, headers = {}) => {
    try {
      const response = await api.post(endpoint, data, {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  put: async (endpoint, data, headers = {}) => {
    try {
      const response = await api.put(endpoint, data, {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  patch: async (endpoint, data, headers = {}) => {
    try {
      const response = await api.patch(endpoint, data, {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  del: async (endpoint, headers = {}, data = {}) => {
    try {
      const response = await api.delete(endpoint, {
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        data: data,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  customRequest: async (config) => {
    try {
      const response = await api.request(config);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default apiHelper;
