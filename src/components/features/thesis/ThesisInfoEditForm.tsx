import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiFileText, FiSave, FiLoader } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { Thesis, UpdateThesisDto } from '@/types/thesis';
import { thesisGroupService } from '@/services/thesis-group.service';

interface ThesisInfoEditFormProps {
    thesis: Thesis;
    groupId: string;
    onUpdate: () => void;
}

export const ThesisInfoEditForm: React.FC<ThesisInfoEditFormProps> = ({
    thesis,
    groupId: _groupId,
    onUpdate,
}) => {
    // Suppress unused
    // console.log(groupId);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UpdateThesisDto>({
        defaultValues: {
            thesis_name_th: thesis.thesis_name_th,
            thesis_name_en: thesis.thesis_name_en,
            graduation_year: thesis.graduation_year || undefined,
        },
    });

    useEffect(() => {
        reset({
            thesis_name_th: thesis.thesis_name_th,
            thesis_name_en: thesis.thesis_name_en,
            graduation_year: thesis.graduation_year || undefined,
        });
    }, [thesis, reset]);

    const onSubmit = async (data: UpdateThesisDto) => {
        setIsSubmitting(true);
        try {
            await thesisGroupService.updateThesisInfo(thesis.thesis_id, data);

            Swal.fire({
                icon: 'success',
                title: 'บันทึกสำเร็จ',
                text: 'แก้ไขข้อมูลวิทยานิพนธ์เรียบร้อยแล้ว',
                showConfirmButton: false,
                timer: 1500,
            });
            onUpdate();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'บันทึกไม่สำเร็จ',
                text: error instanceof Error ? error.message : 'เกิดข้อผิดพลาด',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate year options (Current year +/- 5)
    const currentYear = new Date().getFullYear() + 543;
    const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiFileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">ข้อมูลวิทยานิพนธ์</h2>
                    <p className="text-sm text-gray-500">แก้ไขรายละเอียดวิทยานิพนธ์</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Read-only Thesis Code */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">รหัสวิทยานิพนธ์</label>
                    <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 text-sm">
                        {thesis.thesis_code}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        ชื่อวิทยานิพนธ์ (ภาษาไทย) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className={`text-black w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none
                            ${errors.thesis_name_th ? 'border-red-300' : 'border-gray-200'}
                        `}
                        {...register('thesis_name_th', { required: 'กรุณากรอกชื่อภาษาไทย' })}
                    />
                    {errors.thesis_name_th && <p className="mt-1 text-xs text-red-500">{errors.thesis_name_th.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        ชื่อวิทยานิพนธ์ (ภาษาอังกฤษ) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className={`text-black w-full px-4 py-2.5 bg-white border rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none
                            ${errors.thesis_name_en ? 'border-red-300' : 'border-gray-200'}
                        `}
                        {...register('thesis_name_en', { required: 'กรุณากรอกชื่อภาษาอังกฤษ' })}
                    />
                    {errors.thesis_name_en && <p className="mt-1 text-xs text-red-500">{errors.thesis_name_en.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        ปีการศึกษาที่จบ
                    </label>
                    <select
                        className="text-black w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        {...register('graduation_year', { valueAsNumber: true })}
                    >
                        <option value="">-- เลือกปี --</option>
                        {yearOptions.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? <FiLoader className="animate-spin" /> : <FiSave />}
                        บันทึกการเปลี่ยนแปลง
                    </button>
                </div>
            </div>
        </form>
    );
};
