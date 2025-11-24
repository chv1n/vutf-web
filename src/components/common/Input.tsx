import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, className, ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2">
        {label}
      </label>
      <div className="relative">
        {/* ส่วนแสดง Icon */}
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        <input
          className={`w-full bg-gray-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 ${icon ? 'pl-10' : ''} outline-none transition-all ${className}`}
          {...props}
        />
        {/* ส่วนแสดง Eye Icon (สำหรับ Password) ถ้าอยากทำเพิ่มใส่ตรงนี้ */}
      </div>
    </div>
  );
};