// src/components/features/thesis/AdvisorSelectSection.tsx
// ส่วนเลือกอาจารย์ที่ปรึกษา

import React, { useState, useRef, useEffect } from 'react';
import { UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { CreateThesisGroupFormData, InstructorInfo, FormAdvisor, AdvisorRole } from '@/types/thesis';
import { FiUser, FiPlus, FiX, FiSearch, FiLoader, FiAward, FiUsers } from 'react-icons/fi';
import { useInstructorSearch } from '@/hooks/useInstructorSearch';
import { motion, AnimatePresence } from 'framer-motion';

interface AdvisorSelectSectionProps {
    /** Watch function จาก react-hook-form */
    watch: UseFormWatch<CreateThesisGroupFormData>;
    /** SetValue function จาก react-hook-form */
    setValue: UseFormSetValue<CreateThesisGroupFormData>;
    /** Errors จาก react-hook-form */
    errors: FieldErrors<CreateThesisGroupFormData>;
}

/**
 * AdvisorSelectSection - ส่วนเลือกอาจารย์ที่ปรึกษา
 * 
 * Single Responsibility: จัดการเฉพาะการเลือกอาจารย์ที่ปรึกษา
 * 
 * Features:
 * - Searchable autocomplete ค้นหาอาจารย์
 * - เลือก role (main/co)
 * - ต้องมี main advisor อย่างน้อย 1 คน
 */
export const AdvisorSelectSection: React.FC<AdvisorSelectSectionProps> = ({
    watch,
    setValue,
    errors,
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<AdvisorRole>(AdvisorRole.MAIN);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { query, setQuery, results, isLoading, clearResults } = useInstructorSearch();
    const selectedAdvisors = watch('advisors') || [];

    // ตรวจสอบว่ามี main advisor หรือยัง
    const hasMainAdvisor = selectedAdvisors.some((a) => a.role === AdvisorRole.MAIN);

    // ปิด dropdown เมื่อคลิกข้างนอก
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // เพิ่มอาจารย์
    const addAdvisor = (instructor: InstructorInfo) => {
        // ตรวจสอบว่าซ้ำหรือไม่
        const isAlreadySelected = selectedAdvisors.some(
            (a) => a.instructor_uuid === instructor.instructor_uuid
        );

        if (!isAlreadySelected) {
            const newAdvisor: FormAdvisor = {
                instructor_uuid: instructor.instructor_uuid,
                role: selectedRole,
                instructorInfo: instructor,
            };
            setValue('advisors', [...selectedAdvisors, newAdvisor]);
        }

        clearResults();
        setIsDropdownOpen(false);
    };

    // ลบอาจารย์
    const removeAdvisor = (instructorUuid: string) => {
        const updatedAdvisors = selectedAdvisors.filter(
            (a) => a.instructor_uuid !== instructorUuid
        );
        setValue('advisors', updatedAdvisors);
    };

    // เปลี่ยน role ของอาจารย์
    const changeAdvisorRole = (instructorUuid: string, newRole: AdvisorRole) => {
        const updatedAdvisors = selectedAdvisors.map((a) =>
            a.instructor_uuid === instructorUuid ? { ...a, role: newRole } : a
        );
        setValue('advisors', updatedAdvisors);
    };


    // กรองผลลัพธ์ที่เลือกแล้วออก
    const filteredResults = results.filter(
        (instructor) => !selectedAdvisors.some((a) => a.instructor_uuid === instructor.instructor_uuid)
    );


    return (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                        <FiAward className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">อาจารย์ที่ปรึกษา</h2>
                        <p className="text-sm text-gray-500">เลือกอาจารย์ที่ปรึกษาวิทยานิพนธ์</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!hasMainAdvisor && (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                            ต้องมีที่ปรึกษาหลัก
                        </span>
                    )}
                    {selectedAdvisors.length > 0 && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                            {selectedAdvisors.length} คน
                        </span>
                    )}
                </div>
            </div>

            {/* Role Selection */}
            {/* <div className="flex gap-2 mb-4">
                <button
                    type="button"
                    onClick={() => setSelectedRole(AdvisorRole.MAIN)}
                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${selectedRole === AdvisorRole.MAIN
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <FiAward className="inline-block w-4 h-4 mr-2" />
                    ที่ปรึกษาหลัก
                </button>
                <button
                    type="button"
                    onClick={() => setSelectedRole(AdvisorRole.CO)}
                    className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${selectedRole === AdvisorRole.CO
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <FiUsers className="inline-block w-4 h-4 mr-2" />
                    ที่ปรึกษาร่วม
                </button>
            </div> */}

            {/* Search Input */}
            <div className="relative mb-4" ref={dropdownRef}>
                <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="ค้นหาอาจารย์ด้วยชื่อ..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white hover:border-gray-300"
                    />
                    {isLoading && (
                        <FiLoader className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
                    )}
                </div>

                {/* Dropdown Results */}
                <AnimatePresence>
                    {isDropdownOpen && query.length >= 2 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                        >
                            {isLoading ? (
                                <div className="p-4 text-center text-gray-500">
                                    <FiLoader className="w-5 h-5 animate-spin mx-auto mb-2" />
                                    กำลังค้นหา...
                                </div>
                            ) : filteredResults.length > 0 ? (
                                <ul className="max-h-60 overflow-y-auto">
                                    {filteredResults.map((instructor) => (
                                        <li key={instructor.instructor_uuid}>
                                            <button
                                                type="button"
                                                onClick={() => addAdvisor(instructor)}
                                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                                            >
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                                                    <FiUser className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {instructor.first_name} {instructor.last_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {instructor.department || instructor.email || 'อาจารย์'}
                                                    </p>
                                                </div>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-lg ${selectedRole === AdvisorRole.MAIN
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {selectedRole === AdvisorRole.MAIN ? 'หลัก' : 'ร่วม'}
                                                </span>
                                                <FiPlus className="w-5 h-5 text-purple-500 flex-shrink-0" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    ไม่พบอาจารย์ที่ค้นหา
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Error Message */}
            {errors.advisors && (
                <p className="mb-4 text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                    {errors.advisors.message}
                </p>
            )}

            {/* Selected Advisors List */}
            <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                    {selectedAdvisors.map((advisor) => (
                        <motion.div
                            key={advisor.instructor_uuid}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl group"
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${advisor.role === AdvisorRole.MAIN
                                ? 'bg-gradient-to-br from-purple-100 to-purple-200'
                                : 'bg-gradient-to-br from-gray-100 to-gray-200'
                                }`}>
                                {advisor.role === AdvisorRole.MAIN ? (
                                    <FiAward className="w-5 h-5 text-purple-600" />
                                ) : (
                                    <FiUser className="w-5 h-5 text-gray-600" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {advisor.instructorInfo
                                        ? `${advisor.instructorInfo.first_name} ${advisor.instructorInfo.last_name}`
                                        : advisor.instructor_uuid
                                    }
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {advisor.instructorInfo?.department || 'อาจารย์'}
                                </p>
                            </div>

                            {/* Role Toggle */}
                            <select
                                value={advisor.role}
                                onChange={(e) => changeAdvisorRole(advisor.instructor_uuid, e.target.value as AdvisorRole)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg border-0 cursor-pointer transition-colors ${advisor.role === AdvisorRole.MAIN
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-gray-100 text-gray-600'
                                    }`}
                            >
                                <option value={AdvisorRole.MAIN}>ที่ปรึกษาหลัก</option>
                                <option value={AdvisorRole.CO}>ที่ปรึกษาร่วม</option>
                            </select>

                            <button
                                type="button"
                                onClick={() => removeAdvisor(advisor.instructor_uuid)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {selectedAdvisors.length === 0 && (
                    <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
                        <FiAward className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">ยังไม่มีอาจารย์ที่ปรึกษา</p>
                        <p className="text-xs text-gray-400 mt-1">ค้นหาและเพิ่มอาจารย์ด้านบน</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AdvisorSelectSection;
