import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../services/auth.service';
import { showError, showSuccess } from '../utils/toast';

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
  const errMsg = response.message || "Login failed";
  set({
    error: errMsg,
    loading: false,
  });
  showError(errMsg);
  return false;
}
const user = response.user;

    set({
      user,
      token: null,
      isAuthenticated: true,
      loading: false,
    });
    showSuccess('Logged in successfully');
    return true;
  } catch (err: any) {
    const errMsg =
      err.response?.data?.message ||
      "Login failed";
    set({
      error: errMsg,
      loading: false,
    });
    showError(errMsg);
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
    showSuccess('Logged out successfully');

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
    showSuccess('Logged out successfully');
  }
},
  checkAuth: async () => {

  set({
    loading: true,
  });
  try {
    const user =await authService.me();

   set({
  user,
  token: null,
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
  }
},

  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await authService.updateProfile(profileData);
      set({ user: updatedUser, loading: false });
      showSuccess('Profile updated successfully');
      return true;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to update profile';
      set({ error: errMsg, loading: false });
      showError(errMsg);
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
