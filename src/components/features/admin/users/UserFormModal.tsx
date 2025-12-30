import { useState, useEffect } from 'react';
import { FiX, FiAlertCircle, FiLoader } from 'react-icons/fi'; 
import { User } from '../../../../types/user';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: User | null;
  role: 'student' | 'instructor';
  isSubmitting?: boolean;
}

export const UserFormModal = ({ isOpen, onClose, onSubmit, initialData, role, isSubmitting = false }: Props) => {
  const isEditMode = !!initialData;
  const isAddStudent = role === 'student' && !isEditMode;
  
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

  // Load Data
  useEffect(() => {
    if (initialData && isOpen) {
        if (role === 'student' && initialData.student) {
            setFormData({
                email: initialData.email || '', 
                password: '', 
                prefixName: initialData.student.prefix_name || 'นาย',
                firstName: initialData.student.first_name || '',
                lastName: initialData.student.last_name || '',
                code: initialData.student.student_code || '',
                phone: initialData.student.phone || '',
                isActive: initialData.isActive ?? true
            });
        } else if (role === 'instructor' && initialData.instructor) {
             setFormData({
                email: initialData.email || '',
                password: '', 
                prefixName: '',
                firstName: initialData.instructor.first_name || '',
                lastName: initialData.instructor.last_name || '',
                code: initialData.instructor.instructor_code || '',
                phone: '',
                isActive: initialData.isActive ?? true 
            });
        }
    } else if (!isOpen) {
        setFormData({ email: '', password: '', prefixName: 'นาย', firstName: '', lastName: '', code: '', phone: '', isActive: true });
    }
  }, [initialData, role, isOpen]);

  // Validation
  const validateBulkEmails = (text: string) => {
    if (!text) return true;
    const emails = text.split(/[\n,\s]+/).filter(e => e.trim() !== '');
    return emails.every(email => email.endsWith('@mail.rmutt.ac.th'));
  };

  const validateSingleEmail = (email: string) => {
      if (!email) return true; 
      if (role === 'student') return email.endsWith('@mail.rmutt.ac.th');
      if (role === 'instructor') {
          if (isEditMode && initialData) {
              const currentEmail = initialData.email;
              const isEmailChanged = email !== currentEmail;
              const isPasswordChanged = !!formData.password;

              if (isEmailChanged || isPasswordChanged) {
                  return email.endsWith('@mail.rmutt.ac.th');
              }
              return true;
          }
          return true; 
      }
      return true; 
  };

  const validatePassword = (password: string) => {
      if (password && password.length < 6) return false;
      return true;
  };

  const emailError = isAddStudent 
        ? (formData.email && !validateBulkEmails(formData.email))
        : (formData.email && !validateSingleEmail(formData.email));

  const passwordError = formData.password && !validatePassword(formData.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError || passwordError) return;

    if (isAddStudent) {
        onSubmit({ email: formData.email });
        return;
    }

    const payload: any = {
       firstName: formData.firstName,
       lastName: formData.lastName,
    };

    if (role === 'student') {
        payload.studentCode = formData.code;
        payload.phone = formData.phone;
        payload.prefixName = formData.prefixName;
        if (isEditMode) payload.isActive = formData.isActive;

    } else {
        payload.instructorCode = formData.code;
        if (formData.email && formData.email !== initialData?.email) {
             payload.email = formData.email;
        }
        if (!isEditMode && formData.password) {
             payload.password = formData.password;
        }
        if (isEditMode) {
            if (formData.password) {
                payload.password = formData.password;
            }
            payload.isActive = formData.isActive;
        }
    }
    onSubmit(payload);
  };

  if (!isOpen) return null;

  const isEmailDisabled = isEditMode && role === 'student'; 
  const isCodeDisabled = isEditMode && role === 'student'; 
  
  const isSubmitDisabled = !!emailError || !!passwordError || (isAddStudent && !formData.email) || isSubmitting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditMode ? 'Edit' : (isAddStudent ? 'Invite New' : 'Add New')} {role === 'student' ? 'Student' : 'Instructor'}
          </h2>
          <button 
            onClick={onClose} 
            disabled={isSubmitting} 
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isAddStudent && (
            <>
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

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {role === 'student' ? 'Student ID' : 'Instructor ID'}
                        {isCodeDisabled && <span className="text-xs text-gray-400 font-normal ml-2">(Cannot be changed)</span>}
                    </label>
                    <input 
                        required 
                        type="text" 
                        disabled={isCodeDisabled}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                        value={formData.code} 
                        onChange={e => setFormData({...formData, code: e.target.value})} 
                    />
                </div>

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
            </>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Email {role === 'student' ? '(RMUTT Only)' : ''}
                {!isEditMode && role === 'instructor' && <span className="text-xs text-gray-400 font-normal ml-2">(Optional - Auto Generated if empty)</span>}
                {isEmailDisabled && <span className="text-xs text-gray-400 font-normal ml-2">(Cannot be changed)</span>}
            </label>
            
            {isAddStudent ? (
                <>
                    <textarea 
                        required
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none text-gray-900 bg-white min-h-[150px] ${
                            emailError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        placeholder={`student1@mail.rmutt.ac.th\nstudent2@mail.rmutt.ac.th`}
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        * สามารถกรอกหลายอีเมลได้โดยการคั่นด้วยเครื่องหมายจุลภาค (,) หรือขึ้นบรรทัดใหม่
                    </p>
                </>
            ) : (
                <input 
                    type="email" 
                    required={role === 'student'} 
                    disabled={isEmailDisabled}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none text-gray-900 bg-white disabled:bg-gray-100 disabled:text-gray-500 ${
                        emailError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="example@mail.rmutt.ac.th"
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                />
            )}

            {emailError && (
                <div className="flex items-center gap-1 mt-1.5 text-red-500 animate-fadeIn">
                    <FiAlertCircle size={14} />
                    <span className="text-xs">
                        {role === 'instructor' && isEditMode 
                            ? "หากแก้ไขอีเมลหรือรหัสผ่าน ต้องใช้อีเมล @mail.rmutt.ac.th เท่านั้น"
                            : "อีเมลต้องลงท้ายด้วย @mail.rmutt.ac.th เท่านั้น"
                        }
                    </span>
                </div>
            )}
          </div>

          {/* Password Field */}
          {(!isAddStudent) && (
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                    {!isEditMode && role === 'instructor' && <span className="text-xs text-gray-400 font-normal ml-2">(Optional)</span>}
                    {isEditMode && <span className="text-xs text-gray-400 font-normal ml-2">(Leave blank to keep current)</span>}
                </label>
                <input 
                    type="password" 
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none text-gray-900 bg-white ${
                        passwordError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    placeholder={isEditMode ? "••••••••" : "อย่างน้อย 6 ตัวอักษร"}
                />
                {passwordError && (
                    <div className="flex items-center gap-1 mt-1.5 text-red-500 animate-fadeIn">
                        <FiAlertCircle size={14} />
                        <span className="text-xs">รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร</span>
                    </div>
                )}
            </div>
          )}

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
             <button 
                type="button" 
                onClick={onClose} 
                disabled={isSubmitting} 
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 cursor-pointer"
             >
                Cancel
             </button>
             
             <button 
                type="submit" 
                disabled={isSubmitDisabled}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-blue-400 disabled:shadow-none flex justify-center items-center gap-2 cursor-pointer"
             >
                {/* ส่วนแสดงผล Loading */}
                {isSubmitting ? (
                    <>
                        <FiLoader className="animate-spin" />
                        {isAddStudent ? 'Sending Invite...' : 'Saving...'}
                    </>
                ) : (
                    isAddStudent ? 'Send Invite' : 'Save'
                )}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};