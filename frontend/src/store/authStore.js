import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      const res = await api.post('/login', formData);
      const { user, token } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, loading: false });
      return user;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  register: async (data) => {
    set({ loading: true });
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => formData.append(k, v));
      const res = await api.post('/register', formData);
      const { user, token } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, loading: false });
      return user;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await api.post('/logout');
    } catch (_) {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  fetchUser: async () => {
    try {
      const res = await api.get('/user');
      const user = res.data.user;
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
    } catch (_) {}
  },
}));

export default useAuthStore;


