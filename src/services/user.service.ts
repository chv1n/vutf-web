// src/services/user.service.ts
import { api } from './api'; 
import { UserResponse, User, InstructorProfile } from '../types/user';

// Helper function
const buildQuery = (params: Record<string, any>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });
  return query.toString() ? `?${query.toString()}` : '';
};

export const userService = {
  // ดึงรายชื่อนักเรียน
  getStudents: async (page = 1, limit = 10, search = '') => {
    const queryString = buildQuery({ page, limit, search, role: 'student' });
    const response = await api.get<UserResponse<User>>(`/users${queryString}`);
    return response; 
  },

  // ดึงรายชื่ออาจารย์
  getInstructors: async (page = 1, limit = 10, search = '') => {
    const queryString = buildQuery({ page, limit, search });
    const response = await api.get<UserResponse<InstructorProfile>>(`/users/instructors${queryString}`);
    return response;
  },

  // สร้าง Instructor
  createInstructor: async (data: any) => {
    return await api.post('/users/instructor', data);
  },

  // ลบ User (Student)
  deleteUser: async (id: string) => {
    return await api.delete(`/users/${id}`);
  },

  // ลบ Instructor
  deleteInstructor: async (id: string) => {
    return await api.delete(`/users/instructors/${id}`);
  },

  // แก้ไข User (Student)
  updateUser: async (id: string, data: any) => {
    return await api.patch(`/users/${id}`, data);
  },

  // แก้ไข Instructor
  updateInstructor: async (id: string, data: any) => {
    return await api.patch(`/users/instructors/${id}`, data);
  },

  // API สำหรับ Invite Student (Admin ใช้)
  inviteStudents: async (emails: string[]) => {
    const response = await api.post('/users/invite-students', { emails });
    return response.data;
  },

  validateInviteToken: async (token: string) => {
    const response = await api.get<any>(`/users/validate-invite-token?token=${token}`);
    return response.data;
  },

  // API สำหรับ Setup Profile (Student ใช้เมื่อกดลิงก์)
  setupProfile: async (data: {
    token: string;
    password: string;
    prefixName: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) => {
    const response = await api.post('/users/setup-profile', data);
    return response.data;
  }
};