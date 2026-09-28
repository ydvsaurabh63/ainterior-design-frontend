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
    const response = await api.post('/interior/redesign', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default interiorAIService;
