import axios from 'axios';
const API_URL = '/api'; // This points to your Next.js API routes

interface LoginResponse {
  message: string;
  token: string;
  userId: string;
}

interface RegisterResponse {
  message: string;
  userId: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'An error occurred during login');
    }
    throw new Error('An unexpected error occurred during login');
  }
};

export const register = async (username: string, email: string, password: string): Promise<RegisterResponse> => {
  try {
    const response = await axios.post<RegisterResponse>(`${API_URL}/register`, { username, email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'An error occurred during registration');
    }
    throw new Error('An unexpected error occurred during registration');
  }
};
