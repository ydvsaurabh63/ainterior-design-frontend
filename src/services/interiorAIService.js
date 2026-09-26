import api from './api';

/**
 * Service to handle AI Room Redesign API requests
 */
export const interiorAIService = {
  /**
   * Generates a photorealistic room redesign using FormData payload
   * @param {FormData} formData - Contains image file, roomType, style, customInstruction
   * @returns {Promise<Object>} API response data
   */
  generateRoomDesign: async (formData) => {
    try {
      const response = await api.post('/interior/redesign', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        const fallbackResponse = await api.post('/redesign-room', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return fallbackResponse.data;
      }
      throw err;
    }
  }
};

export default interiorAIService;
