import api from './api';
import { User } from '../types';

export const authService = {
  login: async (email: string, password: string) => {
  const response = await api.post('/auth/admin/login', {
    email,   
    password,
  });

console.log("Login response:", response.data);
console.log("Status:", response.status);
return response.data;
},

 me: async (): Promise<User> => {
  const response = await api.get("/auth/profile");
  return response.data.user;
},

  updateProfile: async (
  profileData: Partial<User>
): Promise<User> => {

  const response =
    await api.put(
      "/auth/profile",
      profileData
    );

  return response.data.user;
},

  logout: async (): Promise<void> => {
    localStorage.removeItem('fy_auth_token');
  },
};
