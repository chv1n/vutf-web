// src/components/features/admin/users/UserFormModal.tsx
import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  role: 'student' | 'instructor';
}

export const UserFormModal = ({ isOpen, onClose, onSubmit, initialData, role }: Props) => {
  const isEditMode = !!initialData;
  
  // State สำหรับ Form
  const [formData, setFormData] = useState({
    email: '', 
    password: '', 
    prefixName: 'นาย',
    firstName: '', 
    lastName: '', 
    code: '', 
    phone: '', 
    isActive: true
  });

  // Load ข้อมูลตอนกด Edit
  useEffect(() => {
    if (initialData) {
        if (role === 'student') {
            setFormData({
                email: initialData.email,
                password: '', 
                prefixName: initialData.student?.prefix_name || 'นาย',
                firstName: initialData.student?.first_name || '',
                lastName: initialData.student?.last_name || '',
                code: initialData.student?.student_code || '',
                phone: initialData.student?.phone || '',
                isActive: initialData.isActive
            });
        } else {
             // Instructor
             setFormData({
                email: initialData.email || '',
                password: '',
                prefixName: '',
                firstName: initialData.firstName || '',
                lastName: initialData.lastName || '',
                code: initialData.instructor_code || '',
                phone: '',
                isActive: initialData.hasAccount 
            });
        }
    } else {
        // Reset Form ตอนกด Add New
        setFormData({ email: '', password: '', prefixName: 'นาย', firstName: '', lastName: '', code: '', phone: '', isActive: true });
    }
  }, [initialData, role, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
       firstName: formData.firstName,
       lastName: formData.lastName,
    };

    if (role === 'student') {
        payload.studentCode = formData.code;
        payload.phone = formData.phone;
        payload.prefixName = formData.prefixName;

        // ส่ง Email/Pass เฉพาะตอนสร้างใหม่
        if (!isEditMode) {
             payload.email = formData.email;
             payload.password = formData.password;
        }
        // ตอน Edit ส่ง isActive ได้
        if (isEditMode) payload.isActive = formData.isActive;

    } else {
        // Instructor
        payload.instructorCode = formData.code;
        
        const canAddAccount = !isEditMode || (isEditMode && !initialData.hasAccount);
        
        if (canAddAccount && formData.email) {
             payload.email = formData.email;
             if (formData.password) payload.password = formData.password;
        }

        if (initialData?.hasAccount) {
            payload.isActive = formData.isActive;
        }
    }
    
    onSubmit(payload);
  };

  if (!isOpen) return null;

  const isEmailDisabled = isEditMode && (role === 'student' || (role === 'instructor' && initialData?.hasAccount));
  const showPasswordField = !isEditMode || (role === 'instructor' && !initialData?.hasAccount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditMode ? 'Edit' : 'Add New'} {role === 'student' ? 'Student' : 'Instructor'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* ส่วนเลือกคำนำหน้าชื่อ */}
          {role === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prefix Name</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                value={formData.prefixName}
                onChange={e => setFormData({...formData, prefixName: e.target.value})}
              >
                <option value="นาย">นาย (Mr.)</option>
                <option value="นางสาว">นางสาว (Ms.)</option>
                <option value="นาง">นาง (Mrs.)</option>
              </select>
            </div>
          )}

          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                    required 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" 
                    value={formData.firstName} 
                    onChange={e => setFormData({...formData, firstName: e.target.value})} 
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                    required 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" 
                    value={formData.lastName} 
                    onChange={e => setFormData({...formData, lastName: e.target.value})} 
                />
            </div>
          </div>

          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{role === 'student' ? 'Student ID' : 'Instructor ID'}</label>
            <input 
                required 
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                value={formData.code} 
                onChange={e => setFormData({...formData, code: e.target.value})} 
            />
          </div>

          {/* Phone (Student Only) */}
          {role === 'student' && (
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input 
                    type="tel" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                />
            </div>
          )}

          <hr className="my-4 border-gray-100" />

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Email {role === 'student' ? '(RMUTT Only)' : ''}
                {isEmailDisabled && <span className="text-xs text-gray-400 font-normal ml-2">(Cannot be changed)</span>}
            </label>
            <input 
                type="email" 
                disabled={isEmailDisabled}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white disabled:bg-gray-100 disabled:text-gray-500" 
                placeholder="example@mail.rmutt.ac.th"
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
            />
            {/* แสดงข้อความเตือนถ้ากรอกผิดรูปแบบ */}
            {role === 'student' && formData.email && !formData.email.endsWith('@mail.rmutt.ac.th') && (
                <p className="text-xs text-red-500 mt-1">* Must end with @mail.rmutt.ac.th</p>
            )}
            {role === 'instructor' && !isEditMode && <p className="text-xs text-gray-500 mt-1">* Optional for Instructor (Create without account)</p>}
          </div>

          {/* Password */}
          {showPasswordField && (
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                    type="password" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                />
            </div>
          )}

          {/* Status (Active) */}
          {isEditMode && (
             <div className="flex items-center gap-2 pt-2">
                <input 
                    type="checkbox" 
                    id="isActive"
                    checked={formData.isActive}
                    onChange={e => setFormData({...formData, isActive: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">Active Status</label>
             </div>
          )}

          <div className="pt-6 flex gap-3">
             <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">Cancel</button>
             <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md font-medium transition-colors">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};