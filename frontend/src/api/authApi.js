import axios from 'axios';
import { CONSTANTS } from '../constants/constant';

const API_BASE_URL = CONSTANTS.API_BASE_URL;

const API = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authApi = {
    login: async (credentials) => {
        try {
            const response = await API.post(CONSTANTS.API_ENDPOINTS.LOGIN, credentials);
            return response.data;
        }
        catch(error) {
            throw error.response ? error.response.data : error;
        }
    },

    register: async (userData) => {
        try {
            console.log(userData)
            const response = await API.post(CONSTANTS.API_ENDPOINTS.REGISTER, userData);
            return response.data;
        }
        catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    logout: async () => {
        try {
            const response = await API.post(CONSTANTS.API_ENDPOINTS.LOGOUT);
            return response.data;
        }
        catch (error) {
            throw error.response ? error.response.data : error;
        }
    },
};  