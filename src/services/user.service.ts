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
  // 1. ดึงรายชื่อนักเรียน
  getStudents: async (page = 1, limit = 10, search = '') => {
    const queryString = buildQuery({ page, limit, search, role: 'student' });
    const response = await api.get<UserResponse<User>>(`/users${queryString}`);
    return response; 
  },

  // 2. ดึงรายชื่ออาจารย์
  getInstructors: async (page = 1, limit = 10, search = '') => {
    const queryString = buildQuery({ page, limit, search });
    const response = await api.get<UserResponse<InstructorProfile>>(`/users/instructors${queryString}`);
    return response;
  },

  // 3. สร้าง Student
  createStudent: async (data: any) => {
    return await api.post('/users/student', data);
  },

  // 4. สร้าง Instructor
  createInstructor: async (data: any) => {
    return await api.post('/users/instructor', data);
  },

  // 5. ลบ User (Student)
  deleteUser: async (id: string) => {
    return await api.delete(`/users/${id}`);
  },

  // 6. ลบ Instructor
  deleteInstructor: async (id: string) => {
    return await api.delete(`/users/instructors/${id}`);
  },

  // 7. แก้ไข User (Student)
  updateUser: async (id: string, data: any) => {
    return await api.patch(`/users/${id}`, data);
  },

  // 8. แก้ไข Instructor
  updateInstructor: async (id: string, data: any) => {
    return await api.patch(`/users/instructors/${id}`, data);
  }
};