// src/components/features/register/SetupProfileForm.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { userService } from '../../../services/user.service';
import { validatePassword, validateThaiName, validateThaiPhone } from '../../../utils/validation';
import { Input } from '../../common/Input';
import { FiUser, FiPhone, FiLock, FiAlertCircle } from 'react-icons/fi';

export const SetupProfileForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // State สำหรับควบคุมการแสดงผล
  const [isCheckingToken, setIsCheckingToken] = useState(true); // เริ่มต้นด้วยการโหลด
  const [loading, setLoading] = useState(false); // สำหรับตอนกด Submit
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<any>({});

  const [formData, setFormData] = useState({
    prefixName: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // -------------------------------------------------------------------
  // 1. ตรวจสอบ Token ทันทีที่โหลดหน้าเว็บ (Pre-check)
  // -------------------------------------------------------------------
  useEffect(() => {
    const verifyToken = async () => {
      // ถ้าไม่มี Token ใน URL ให้ดีดกลับไปหน้า Login
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // เรียก API เช็คสถานะ Token
        const status = await userService.validateInviteToken(token);

        // กรณี A: สมัครไปแล้ว (isSetup = true) -> ดีดไปหน้า Login เลย
        if (status.isSetup) {
          navigate('/login', { 
            state: { 
              message: 'บัญชีนี้ถูกเปิดใช้งานไปแล้ว กรุณาเข้าสู่ระบบ', 
              type: 'info' 
            },
            replace: true // ใช้ replace เพื่อไม่ให้กด Back กลับมาหน้านี้ได้
          });
          return;
        }

        // กรณี B: ยังไม่สมัคร -> อนุญาตให้แสดงฟอร์ม
        setIsCheckingToken(false);

      } catch (err: any) {
        console.error(err);
        // กรณี Token หมดอายุ หรือไม่ถูกต้อง -> แสดง Error ค้างไว้ที่หน้านี้
        const msg = err.response?.data?.message || err.message;
        if (msg.includes('expired') || msg.includes('token')) {
            setError('ลิงก์คำเชิญหมดอายุ หรือไม่ถูกต้อง กรุณาติดต่อเจ้าหน้าที่เพื่อขอลิงก์ใหม่');
        } else {
            setError('เกิดข้อผิดพลาดในการตรวจสอบข้อมูล: ' + msg);
        }
        setIsCheckingToken(false); // หยุดโหลดเพื่อแสดง Error
      }
    };

    verifyToken();
  }, [token, navigate]);

  // -------------------------------------------------------------------
  // Event Handlers
  // -------------------------------------------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev: any) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.prefixName) newErrors.prefixName = 'กรุณาเลือกคำนำหน้า';
    if (!validateThaiName(formData.firstName)) newErrors.firstName = 'ชื่อต้องเป็นภาษาไทยเท่านั้น';
    if (!validateThaiName(formData.lastName)) newErrors.lastName = 'นามสกุลต้องเป็นภาษาไทยเท่านั้น';
    if (!validateThaiPhone(formData.phone)) newErrors.phone = 'รูปแบบหมายเลขโทรศัพท์ไม่ถูกต้อง (เช่น 0812345678)';
    if (!validatePassword(formData.password)) newErrors.password = 'รหัสผ่านต้องมีตัวอักษรและตัวเลข (อย่างน้อย 8 ตัวอักษร)';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
    
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;
    if (!token) return;

    setLoading(true);
    try {
      await userService.setupProfile({
        token: token,
        password: formData.password,
        prefixName: formData.prefixName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });

      // สมัครสำเร็จ -> ไปหน้า Login พร้อมข้อความสีเขียว
      navigate('/login', { 
        state: { 
            message: 'ตั้งค่าบัญชีสำเร็จ กรุณาเข้าสู่ระบบ', 
            type: 'success' 
        } 
      });

    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message;
      setError('เกิดข้อผิดพลาด: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------
  // UI: หน้าจอ Loading (แสดงตอนกำลังเช็ค Token)
  // -------------------------------------------------------------------
  if (isCheckingToken) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-gray-500">
        <svg className="animate-spin h-10 w-10 text-green-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="font-medium">กำลังตรวจสอบสถานะบัญชี...</p>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // UI: หน้าจอ Form (แสดงเมื่อ Token Valid และยังไม่ Setup)
  // -------------------------------------------------------------------
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-start gap-2 border border-red-100">
          <FiAlertCircle className="shrink-0 mt-0.5" size={18} /> 
          <span>{error}</span>
        </div>
      )}

      {/* ถ้ามี Error (เช่น Token หมดอายุ) ให้ซ่อนฟอร์มไปเลย เพื่อไม่ให้กรอกเก้อ */}
      {!error && (
        <>
          {/* --- ส่วนที่ 1: ข้อมูลส่วนตัว --- */}
          <div className="grid grid-cols-3 gap-4">
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
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
                {fieldErrors.prefixName && <p className="text-red-500 text-xs mt-1">{fieldErrors.prefixName}</p>}
            </div>

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
                label="ตั้งรหัสผ่านใหม่"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                icon={<FiLock />}
                placeholder="อย่างน้อย 8 ตัวอักษร"
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 transition-all mt-6 disabled:opacity-50"
          >
            {loading ? 'กำลังบันทึก...' : 'ยืนยันข้อมูล'}
          </button>
        </>
      )}

    </form>
  );
};