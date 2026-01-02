// src/components/features/thesis/CreateThesisForm.tsx
// ฟอร์มหลักสำหรับสร้าง Thesis Group

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { FiSend, FiLoader, FiArrowLeft } from 'react-icons/fi';

import { ThesisInfoSection } from './ThesisInfoSection';
import { MemberSelectSection } from './MemberSelectSection';
import { AdvisorSelectSection } from './AdvisorSelectSection';
import { thesisGroupService } from '@/services/thesis-group.service';
import {
    CreateThesisGroupFormData,
    CreateThesisGroupPayload,
    AdvisorRole,
    GroupMemberRole,
} from '@/types/thesis';

/**
 * CreateThesisForm - ฟอร์มหลักสำหรับสร้างกลุ่มวิทยานิพนธ์
 * 
 * Composition Pattern: รวม sub-components (ThesisInfoSection, MemberSelectSection, AdvisorSelectSection)
 * Single Responsibility: จัดการ form submission และ error handling
 * 
 * Features:
 * - Form validation ด้วย react-hook-form
 * - API integration สำหรับสร้าง thesis group
 * - Error handling และแสดง feedback ด้วย SweetAlert2
 */
export const CreateThesisForm: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<CreateThesisGroupFormData>({
        defaultValues: {
            thesis_code: '',
            thesis_name_th: '',
            thesis_name_en: '',
            graduation_year: undefined,
            group_members: [],
            advisors: [],
        },
    });

    // Watch advisors for validation
    const advisors = watch('advisors');

    // ตรวจสอบว่ามี main advisor หรือยัง
    const hasMainAdvisor = advisors?.some((a) => a.role === AdvisorRole.MAIN);

    /**
     * Submit handler - แปลง form data เป็น API payload และส่ง request
     */
    const onSubmit = async (data: CreateThesisGroupFormData) => {
        // Validate: ต้องมี main advisor อย่างน้อย 1 คน
        if (!hasMainAdvisor) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณาเลือกอาจารย์ที่ปรึกษาหลัก',
                text: 'ต้องมีอาจารย์ที่ปรึกษาหลักอย่างน้อย 1 คน',
                confirmButtonColor: '#3b82f6',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // แปลง form data เป็น API payload
            const payload: CreateThesisGroupPayload = {
                thesis: {
                    thesis_code: data.thesis_code,
                    thesis_name_th: data.thesis_name_th,
                    thesis_name_en: data.thesis_name_en,
                    graduation_year: data.graduation_year,
                },
                group_member: data.group_members.map((m) => ({
                    student_uuid: m.student_uuid,
                    role: GroupMemberRole.MEMBER,
                })),
                advisor: data.advisors.map((a) => ({
                    instructor_id: a.instructor_id,
                    role: a.role,
                })),
            };

            // เรียก API
            await thesisGroupService.createThesisGroup(payload);

            // แสดง success message
            await Swal.fire({
                icon: 'success',
                title: 'สร้างกลุ่มวิทยานิพนธ์สำเร็จ!',
                text: 'คำเชิญถูกส่งไปยังสมาชิกเรียบร้อยแล้ว',
                confirmButtonColor: '#10b981',
                timer: 2000,
                timerProgressBar: true,
            });

            // Redirect ไปหน้า dashboard
            navigate('/student/dashboard');
        } catch (error) {
            // Handle specific errors
            const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาด';

            // ตรวจสอบ error types
            if (errorMessage.includes('already exists')) {
                Swal.fire({
                    icon: 'error',
                    title: 'รหัสวิทยานิพนธ์ซ้ำ',
                    text: 'กรุณาใช้รหัสวิทยานิพนธ์อื่น',
                    confirmButtonColor: '#ef4444',
                });
            } else if (errorMessage.includes('not found')) {
                Swal.fire({
                    icon: 'error',
                    title: 'ข้อมูลไม่ถูกต้อง',
                    text: errorMessage,
                    confirmButtonColor: '#ef4444',
                });
            } else if (errorMessage.includes('Unauthorized')) {
                Swal.fire({
                    icon: 'error',
                    title: 'ไม่ได้รับอนุญาต',
                    text: 'กรุณาเข้าสู่ระบบใหม่',
                    confirmButtonColor: '#ef4444',
                }).then(() => {
                    navigate('/login');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: errorMessage,
                    confirmButtonColor: '#ef4444',
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Section 1: Thesis Info */}
                <ThesisInfoSection register={register} errors={errors} />

                {/* Section 2: Group Members */}
                <MemberSelectSection watch={watch} setValue={setValue} />

                {/* Section 3: Advisors */}
                <AdvisorSelectSection watch={watch} setValue={setValue} errors={errors} />

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                        ย้อนกลับ
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`
              flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white
              transition-all duration-200 shadow-lg
              ${isSubmitting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5'
                            }
            `}
                    >
                        {isSubmitting ? (
                            <>
                                <FiLoader className="w-5 h-5 animate-spin" />
                                กำลังสร้าง...
                            </>
                        ) : (
                            <>
                                <FiSend className="w-5 h-5" />
                                สร้างกลุ่มวิทยานิพนธ์
                            </>
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default CreateThesisForm;
