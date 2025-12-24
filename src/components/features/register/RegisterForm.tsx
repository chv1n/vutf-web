import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.service';
import { validatePassword, validateThaiName, validateThaiPhone } from '../../../utils/validation';
import { Input } from '../../common/Input';
import { FiUser, FiPhone, FiLock, FiAlertCircle } from 'react-icons/fi';

export const RegisterForm = () => {
  const navigate = useNavigate();

  // 1. State สำหรับ Form Data
  const [formData, setFormData] = useState({
    prefixName: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // 2. ดึง Email จาก SessionStorage (ที่เก็บมาจากขั้นตอน OTP)
  const [email, setEmail] = useState('');
  
  // *** เพิ่ม State สำหรับตรวจสอบสิทธิ์การเข้าถึง ***
  const [isAuthorized, setIsAuthorized] = useState(false);

  // ตรวจสอบสิทธิ์ก่อนแสดงผล
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('registerEmail');
    const storedToken = sessionStorage.getItem('registrationToken'); // เช็ค Token ที่ได้จาก OTP

    // ถ้าไม่มี Email หรือ ไม่มี Token (แปลว่ายังไม่ผ่าน OTP)
    if (!storedEmail || !storedToken) {
      // ดีดกลับไปหน้าแรกทันที (ใช้ replace เพื่อไม่ให้กด Back กลับมาได้)
      navigate('/register/email', { replace: true });
    } else {
      setEmail(storedEmail);
      setIsAuthorized(true); // อนุญาตให้แสดงฟอร์ม
    }
  }, [navigate]);

  // 3. State สำหรับ UX
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<any>({});

  // Handle Change Input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // เคลียร์ Error ของช่องนั้นๆ ทันทีที่พิมพ์แก้
    if (fieldErrors[name]) {
      setFieldErrors((prev: any) => ({ ...prev, [name]: null }));
    }
  };

  // 4. Validation Logic
  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.prefixName) newErrors.prefixName = 'กรุณาเลือกคำนำหน้า';
    
    if (!validateThaiName(formData.firstName)) newErrors.firstName = 'ชื่อต้องเป็นภาษาไทยเท่านั้น';
    if (!validateThaiName(formData.lastName)) newErrors.lastName = 'นามสกุลต้องเป็นภาษาไทยเท่านั้น';
    
    if (!validateThaiPhone(formData.phone)) newErrors.phone = 'รูปแบบหมายเลขโทรศัพท์ไม่ถูกต้อง (06/08/09)';
    
    if (!validatePassword(formData.password)) newErrors.password = 'รหัสผ่านต้องมีตัวอักษรและตัวเลข (อย่างน้อย 8 ตัวอักษร)';
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0; // ถ้าไม่มี Error เลย คืนค่า true
  };

  // 5. Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // เช็ค Validation หน้าบ้านก่อน
    if (!validateForm()) return;

    setLoading(true);
    try {
      await authService.register(formData as any);

      // Clear Session เมื่อสมัครเสร็จ
      sessionStorage.removeItem('registerEmail');
      sessionStorage.removeItem('registrationToken');

      // Success -> ไปหน้า Login
      navigate('/login'); 

    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('409')) {
        setError('อีเมลนี้ลงทะเบียนไปแล้ว กรุณาเข้าสู่ระบบ');
      } else {
        setError(err.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* Global Error Banner */}
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
          <FiAlertCircle /> {error}
        </div>
      )}

      {/* --- ส่วนที่ 1: ข้อมูลส่วนตัว --- */}
      <div className="grid grid-cols-3 gap-4">
        {/* คำนำหน้า (Dropdown) */}
        <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">คำนำหน้า</label>
            <div className="relative">
                <select
                    name="prefixName"
                    value={formData.prefixName}
                    onChange={handleChange}
                    className={`w-full px-2 py-2 bg-gray-50 text-gray-500 border rounded-xl appearance-none focus:ring-2 focus:outline-none transition-all ${
                        fieldErrors.prefixName ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-500'
                    }`}
                    disabled={loading}
                >
                    <option value="">เลือก</option>
                    <option value="นาย">นาย</option>
                    <option value="นาง">นาง</option>
                    <option value="นางสาว">นางสาว</option>
                </select>
                {/* Custom Arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
            {fieldErrors.prefixName && <p className="text-red-500 text-xs mt-1">{fieldErrors.prefixName}</p>}
        </div>

        {/* ชื่อจริง */}
        <div className="col-span-2">
            <Input
                label="ชื่อจริง (ภาษาไทย)"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                icon={<FiUser />}
                placeholder="ชื่อ"
                disabled={loading}
                className={fieldErrors.firstName ? 'border-red-500 focus:ring-red-200' : ''}
            />
            {fieldErrors.firstName && <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>}
        </div>
      </div>

      {/* นามสกุล */}
      <div>
        <Input
            label="นามสกุล (ภาษาไทย)"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            icon={<FiUser />}
            placeholder="นามสกุล"
            disabled={loading}
            className={fieldErrors.lastName ? 'border-red-500 focus:ring-red-200' : ''}
        />
        {fieldErrors.lastName && <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>}
      </div>

      {/* เบอร์โทร */}
      <div>
        <Input
            label="เบอร์โทรศัพท์"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            icon={<FiPhone />}
            placeholder="08xxxxxxxx"
            maxLength={10}
            disabled={loading}
            className={fieldErrors.phone ? 'border-red-500 focus:ring-red-200' : ''}
        />
        {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
      </div>

      {/* --- ส่วนที่ 2: รหัสผ่าน --- */}
      <div>
        <Input
            label="รหัสผ่าน"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            icon={<FiLock />}
            placeholder="อย่างน้อย 8 ตัวอักษร (ตัวเลขและตัวอักษร)"
            disabled={loading}
            className={fieldErrors.password ? 'border-red-500 focus:ring-red-200' : ''}
        />
        {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
      </div>

      <div>
        <Input
            label="ยืนยันรหัสผ่าน"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            icon={<FiLock />}
            placeholder="กรอกรหัสผ่านอีกครั้ง"
            disabled={loading}
            className={fieldErrors.confirmPassword ? 'border-red-500 focus:ring-red-200' : ''}
        />
        {fieldErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all mt-6 disabled:opacity-50"
      >
        {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
      </button>

    </form>
  );
};