import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { StudentHome } from './pages/student/StudentHome';
import { InstructorHome } from './pages/instructor/InstructorHome';
import { LoginForm } from './components/features/auth/LoginForm';
import LoginPage from './pages/LoginPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/student" element={<MainLayout />}>
            {/* ถ้าเข้า /student เฉยๆ ให้เด้งไป /student/dashboard */}
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            
            {/* หน้า Dashboard (Create Group) */}
            <Route path="dashboard" element={<StudentHome />} />
            
            {/* หน้าอื่นๆ สร้างไฟล์เปล่าๆ มารอไว้ก่อนก็ได้ครับ */}
            <Route path="profile" element={<div>Profile Page</div>} />
            <Route path="report" element={<div>Thesis Report Page</div>} />
        </Route>

        <Route path="/instructor" element={<MainLayout />}>
             <Route index element={<Navigate to="/instructor/dashboard" replace />} />
             <Route path="dashboard" element={<InstructorHome />} />
             {/* หน้าอื่นๆ ของอาจารย์ */}
        </Route>

        {/* Redirect Root to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;