import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  // รอตรวจสอบสิทธิ์ (แสดง Loading หมุนๆ ระหว่างรอ API /me)
  if (isLoading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  // ถ้าไม่มี User -> ดีดไป Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ถ้า Role ไม่ตรง -> ดีดไปหน้า Unauthorized
  if (allowedRoles && !allowedRoles.includes(user.role.toLowerCase())) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ผ่าน -> แสดงผล
  return <Outlet />;
};