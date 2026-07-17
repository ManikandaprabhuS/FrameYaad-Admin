import api from './api';
import { User } from '../types';

export const authService = {
  login: async (email: string, password: string) => {
  const response = await api.post('/auth/admin/login', {
    email,   
    password,
  });

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

  changePassword: async (password: string): Promise<void> => {
    await api.patch('/auth/password', { password });
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    sessionStorage.removeItem('fy_auth_token');
    localStorage.removeItem('fy_auth_token');
  },
};
