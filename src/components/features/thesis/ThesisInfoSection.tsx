// src/components/features/thesis/ThesisInfoSection.tsx
// ส่วนกรอกข้อมูลวิทยานิพนธ์

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CreateThesisGroupFormData } from '@/types/thesis';
import { FiFileText, FiHash, FiCalendar } from 'react-icons/fi';

interface ThesisInfoSectionProps {
    /** Register function จาก react-hook-form */
    register: UseFormRegister<CreateThesisGroupFormData>;
    /** Errors จาก react-hook-form */
    errors: FieldErrors<CreateThesisGroupFormData>;
}

/**
 * ThesisInfoSection - ส่วนกรอกข้อมูลวิทยานิพนธ์
 * 
 * Single Responsibility: จัดการเฉพาะ form fields ของข้อมูลวิทยานิพนธ์
 * 
 * Fields:
 * - thesis_code: รหัสวิทยานิพนธ์ (required)
 * - thesis_name_th: ชื่อภาษาไทย (required)
 * - thesis_name_en: ชื่อภาษาอังกฤษ (required)
 * - graduation_year: ปีที่จบการศึกษา (optional)
 */
export const ThesisInfoSection: React.FC<ThesisInfoSectionProps> = ({
    register,
    errors,
}) => {
    // สร้าง year options (ปีปัจจุบัน +/- 5 ปี)
    const currentYear = new Date().getFullYear() + 543; // พ.ศ.
    const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    return (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <FiFileText className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">ข้อมูลวิทยานิพนธ์</h2>
                    <p className="text-sm text-gray-500">กรุณากรอกข้อมูลวิทยานิพนธ์ของคุณ</p>
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
                {/* Thesis Code */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FiHash className="w-4 h-4 text-gray-400" />
                        รหัสวิทยานิพนธ์ <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="เช่น THS-2024-001"
                        className={`
              w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-sm
              transition-all duration-200
              placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white
              ${errors.thesis_code
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }
            `}
                        {...register('thesis_code', {
                            required: 'กรุณากรอกรหัสวิทยานิพนธ์',
                        })}
                    />
                    {errors.thesis_code && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-500 rounded-full" />
                            {errors.thesis_code.message}
                        </p>
                    )}
                </div>

                {/* Thesis Name TH */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FiFileText className="w-4 h-4 text-gray-400" />
                        ชื่อวิทยานิพนธ์ (ภาษาไทย) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="กรอกชื่อวิทยานิพนธ์ภาษาไทย"
                        className={`
              w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-sm
              transition-all duration-200
              placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white
              ${errors.thesis_name_th
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }
            `}
                        {...register('thesis_name_th', {
                            required: 'กรุณากรอกชื่อวิทยานิพนธ์ภาษาไทย',
                        })}
                    />
                    {errors.thesis_name_th && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-500 rounded-full" />
                            {errors.thesis_name_th.message}
                        </p>
                    )}
                </div>

                {/* Thesis Name EN */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FiFileText className="w-4 h-4 text-gray-400" />
                        ชื่อวิทยานิพนธ์ (ภาษาอังกฤษ) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter thesis title in English"
                        className={`
              w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-sm
              transition-all duration-200
              placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white
              ${errors.thesis_name_en
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }
            `}
                        {...register('thesis_name_en', {
                            required: 'กรุณากรอกชื่อวิทยานิพนธ์ภาษาอังกฤษ',
                        })}
                    />
                    {errors.thesis_name_en && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-500 rounded-full" />
                            {errors.thesis_name_en.message}
                        </p>
                    )}
                </div>

                {/* Graduation Year */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FiCalendar className="w-4 h-4 text-gray-400" />
                        ปีการศึกษาที่คาดว่าจะจบ
                    </label>
                    <select
                        className={`
              w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 text-sm
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white
              border-gray-200 hover:border-gray-300
            `}
                        {...register('graduation_year', {
                            setValueAs: (v) => (v === '' ? undefined : parseInt(v, 10)),
                        })}
                    >
                        <option value="">-- เลือกปีการศึกษา --</option>
                        {yearOptions.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </section>
    );
};

export default ThesisInfoSection;
