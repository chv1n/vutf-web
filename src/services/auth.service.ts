// src/services/auth.service.ts

import { api } from './api';
import { LoginRequest, LoginResponseData } from '../types/auth';

export const authService = {
  login: async (credentials: LoginRequest) => {
    // Backend จะเป็นคน Set-Cookie เอง เราแค่รอรับ Response 200 OK
    return api.post<LoginResponseData>('/v1/auth/login', credentials);
  },

  logout: async () => {
    // ต้องยิง API ไปบอก Backend ให้ลบ Cookie ออก
    await api.post('/v1/auth/logout', {});
    
    // ลบข้อมูล User ในเครื่องเรา (แต่ Token ไม่ต้องลบ เพราะเราแตะไม่ได้อยู่แล้ว)
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  setSession: (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
  }
};