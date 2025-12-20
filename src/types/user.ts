// src/types/user.ts

export interface User {
  user_uuid: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  isActive: boolean;
  student?: StudentProfile;
  instructor?: InstructorProfile;
}

export interface StudentProfile {
  student_uuid: string;
  student_code: string;
  prefix_name: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface InstructorProfile {
  instructor_uuid: string;
  instructor_code: string;
  firstName: string;
  lastName: string;
  hasAccount?: boolean;
  email?: string | null;
  user_uuid?: string | null;
  isActive?: boolean;
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface UserResponse<T> {
  data: T[];
  meta: PaginationMeta;
}