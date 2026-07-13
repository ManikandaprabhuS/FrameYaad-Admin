import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<boolean>;
  changePassword: (password: string) => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

 login: async (email, password) => {
  set({
    loading: true,
    error: null,
  });

  try {
    const response = await authService.login(
        email,
        password
      );

    if (!response.success) {
  set({
    error: response.message || "Login failed",
    loading: false,
  });
  return false;
}
const user = response.user;
const token = response.token ?? null;

if (token) {
  localStorage.setItem("fy_auth_token", token);
}

    set({
      user,
      token,
      isAuthenticated: true,
      loading: false,
    });
    return true;
  } catch (err: any) {
    const errMsg =
      err.response?.data?.message ||
      "Login failed";
    set({
      error: errMsg,
      loading: false,
    });
    return false;
  }
},

  logout: async () => {
  set({ loading: true });

  try {
    await authService.logout();

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });

  } catch {

    localStorage.removeItem(
      "fy_auth_token"
    );

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  }
},
  checkAuth: async () => {

  set({
    loading: true,
  });
  try {
    const user =await authService.me();
   const token = localStorage.getItem("fy_auth_token");

   set({
  user,
  token,
  isAuthenticated: true,
  loading: false,
});

  } catch (err) {

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
    localStorage.removeItem("fy_auth_token");
  }
},

  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await authService.updateProfile(profileData);
      set({ user: updatedUser, loading: false });
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Update failed', loading: false });
      return false;
    }
  },

  changePassword: async (password) => {
    set({ loading: true, error: null });
    try {
      await authService.changePassword(password);
      set({ loading: false });
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Password update failed', loading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
