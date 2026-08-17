import { create } from 'zustand';
import axios from 'axios';
import { User } from '../types';
import { authService, type CustomerRegistrationInput } from '../services/auth.service';

const AUTH_TOKEN_KEY = 'fy_auth_token';

const getStoredAuthToken = () => {
  const sessionToken = sessionStorage.getItem(AUTH_TOKEN_KEY);
  const legacyLocalToken = localStorage.getItem(AUTH_TOKEN_KEY);

  if (!sessionToken && legacyLocalToken) {
    sessionStorage.setItem(AUTH_TOKEN_KEY, legacyLocalToken);
  }

  if (legacyLocalToken) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  return sessionToken || legacyLocalToken;
};

const setStoredAuthToken = (token: string) => {
  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

const clearStoredAuthToken = () => {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

const getAuthErrorMessage = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError<{ message?: string; error?: { message?: string } }>(error)) return fallback;
  return error.response?.data?.error?.message ?? error.response?.data?.message ?? fallback;
};

export type CustomerRegistrationResult = {
  success: boolean;
  confirmationRequired: boolean;
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginCustomer: (email: string, password: string) => Promise<boolean>;
  registerCustomer: (input: CustomerRegistrationInput) => Promise<CustomerRegistrationResult>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
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

const user = response.user;
const token = response.accessToken;

if (user?.role === 'CUSTOMER') {
  clearStoredAuthToken();
  set({
    user: null,
    token: null,
    isAuthenticated: false,
    error: 'Access Denied: customers cannot access the admin dashboard.',
    loading: false,
  });
  return false;
}

if (token) {
  setStoredAuthToken(token);
}

    set({
      user,
      token,
      isAuthenticated: true,
      loading: false,
    });
    return true;
  } catch (err: unknown) {
    const errMsg = getAuthErrorMessage(err, 'Login failed');
    set({
      error: errMsg,
      loading: false,
    });
    return false;
  }
},

  loginCustomer: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.customerLogin(email, password);
      if (response.user.role !== 'CUSTOMER') {
        clearStoredAuthToken();
        set({ user: null, token: null, isAuthenticated: false, loading: false, error: 'This account is not a customer account.' });
        return false;
      }
      setStoredAuthToken(response.accessToken);
      set({
        user: response.user,
        token: response.accessToken,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      return true;
    } catch (err: unknown) {
      clearStoredAuthToken();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: getAuthErrorMessage(err, 'Email or password is incorrect'),
      });
      return false;
    }
  },

  registerCustomer: async (input) => {
    set({ loading: true, error: null });
    try {
      const registration = await authService.registerCustomer(input);
      if (registration.emailConfirmationRequired) {
        clearStoredAuthToken();
        set({ user: null, token: null, isAuthenticated: false, loading: false, error: null });
        return { success: true, confirmationRequired: true };
      }

      const login = await authService.customerLogin(input.email, input.password);
      setStoredAuthToken(login.accessToken);
      set({
        user: login.user,
        token: login.accessToken,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      return { success: true, confirmationRequired: false };
    } catch (err: unknown) {
      clearStoredAuthToken();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: getAuthErrorMessage(err, 'Registration failed'),
      });
      return { success: false, confirmationRequired: false };
    }
  },

  logout: async () => {
  set({ loading: true });

  try {
    await authService.logout();

    clearStoredAuthToken();

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });

  } catch {

    clearStoredAuthToken();

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
   const token = getStoredAuthToken();

   set({
  user,
  token,
  isAuthenticated: true,
  loading: false,
});

  } catch {

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
    clearStoredAuthToken();
  }
},

  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await authService.updateProfile(profileData);
      set({ user: updatedUser, loading: false });
      return true;
    } catch (err: unknown) {
      set({ error: getAuthErrorMessage(err, 'Update failed'), loading: false });
      return false;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    set({ loading: true, error: null });
    try {
      await authService.changePassword(currentPassword, newPassword);
      clearStoredAuthToken();
      set({ user: null, token: null, isAuthenticated: false, loading: false });
      return true;
    } catch (err: unknown) {
      set({ error: getAuthErrorMessage(err, 'Password update failed'), loading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
