// src/services/auth.service.ts

import { api } from './api';
import { ApiResponse } from '../types';
import { LoginRequest, LoginResponseData, RegisterRequest, RegisterResponse } from '../types/auth';

// DTO สำหรับการ Request OTP
interface RequestOtpDto {
  email: string;
}

// DTO สำหรับการ Verify OTP
interface VerifyOtpDto {
  email: string;
  otp: string;
}

// Response ของ Verify OTP
interface VerifyOtpResponse {
  registrationToken: string;
}

export const authService = {
  login: async (credentials: LoginRequest) => {
    return api.post<LoginResponseData>('/v1/auth/login', credentials);
  },

  logout: async () => {
    // ต้องยิง API ไปบอก Backend ให้ลบ Cookie ออก
    await api.post('/v1/auth/logout', {});

    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  setSession: (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // ขอ OTP
  requestRegistrationOtp: async (data: RequestOtpDto) => {
    return api.post('/v1/auth/request-registration-otp', data);
  },

  // ยืนยัน OTP
  verifyRegistrationOtp: async (data: VerifyOtpDto) => {
    return api.post<VerifyOtpResponse>('/v1/auth/verify-registration-otp', data);
  },

  // สมัครสมาชิก (ส่ง Cookie registrationToken ไปอัตโนมัติ)
  register: async (data: RegisterRequest) => {
    return api.post<RegisterResponse>('/v1/auth/register', data);
  }
};