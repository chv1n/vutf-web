import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';
import { createInspectionSchema, CreateInspectionSchema } from './inspection.schema';
import { inspectionService } from '@/services/inspection.service';
import { InspectionRound } from '@/types/inspection';

interface Props {
    initialData?: InspectionRound | null;
    onSuccess: () => void;
    onCancel: () => void;
}

const CreateInspectionForm: React.FC<Props> = ({ initialData, onSuccess, onCancel }) => {
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = !!initialData; // เช็คว่าเป็นโหมดแก้ไขไหม

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<CreateInspectionSchema>({
        resolver: zodResolver(createInspectionSchema),
    });

    // ถ้ามีข้อมูลเดิม (กดแก้ไข) ให้ยัดข้อมูลลง Form
    useEffect(() => {
        if (initialData) {
            setValue('title', initialData.title);
            setValue('description', initialData.description || ''); // ถ้า description ไม่มี ให้ใส่ string ว่าง
            // แปลงวันที่ให้ html input เข้าใจ (YYYY-MM-DDTHH:mm)
            setValue('startDate', new Date(initialData.startDate).toISOString().slice(0, 16));
            setValue('endDate', new Date(initialData.endDate).toISOString().slice(0, 16));
            setValue('status', initialData.status as 'OPEN' | 'CLOSED');
        }
    }, [initialData, setValue]);

    const onSubmit = async (data: CreateInspectionSchema) => {
        setIsLoading(true);
        try {
            if (isEditMode && initialData) {
                // --- กรณีแก้ไข (Update) ---
                await inspectionService.update(initialData.inspectionId, data);
                Swal.fire('สำเร็จ', 'แก้ไขข้อมูลเรียบร้อยแล้ว', 'success');
            } else {
                // --- กรณีสร้างใหม่ (Create) ---
                await inspectionService.create(data);
                Swal.fire('สำเร็จ', 'สร้างรอบการตรวจเรียบร้อยแล้ว', 'success');
            }
            onSuccess();
        } catch (error: any) {
            console.error(error);
            Swal.fire('ผิดพลาด', error.message || 'ไม่สามารถบันทึกข้อมูลได้', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
                {isEditMode ? 'แก้ไขรอบการตรวจ' : 'สร้างรอบการตรวจใหม่'}
            </h2>

            {/* ... (Input Fields) ... */}
            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700">หัวข้อ</label>
                <input
                    {...register('title')}
                    type="text"
                    className={`mt-1 block w-full rounded-md border p-2 text-gray-600 ${errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700">รายละเอียด</label>
                <textarea
                    {...register('description')}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-600"
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">วันที่เริ่ม</label>
                    <input
                        {...register('startDate')}
                        type="datetime-local"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-600"
                    />
                    {errors.startDate && <span className="text-xs text-red-500">{errors.startDate.message}</span>}
                </div>

                {/* End Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">วันที่สิ้นสุด</label>
                    <input
                        {...register('endDate')}
                        type="datetime-local"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-600"
                    />
                    {errors.endDate && <span className="text-xs text-red-500">{errors.endDate.message}</span>}
                </div>
            </div>

            {isEditMode && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">สถานะ (Status)</label>
                    <select
                        {...register('status')}
                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                    >
                        <option value="OPEN">🟢 OPEN (เปิดรับ)</option>
                        <option value="CLOSED">🔴 CLOSED (ปิดรับ)</option>
                    </select>
                </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                    ยกเลิก
                </button>
                <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? 'กำลังบันทึก...' : (isEditMode ? 'บันทึกการแก้ไข' : 'สร้างข้อมูล')}
                </button>
            </div>
        </form>
    );
};

export default CreateInspectionForm;