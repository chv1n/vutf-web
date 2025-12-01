// src/pages/admin/InspectionManagePage.tsx
import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { FiMoreHorizontal, FiEye, FiTrash2, FiPlus } from 'react-icons/fi';
import CreateInspectionForm from '@/components/features/admin/inspection/CreateInspectionForm';
import { inspectionService } from '@/services/inspection.service';
import { InspectionRound } from '@/types/inspection';

// --- 1. Component เมนูจุดสามจุด (Dropdown) ---
const ActionMenu = ({ onDelete, onDetail }: { onDelete: () => void; onDetail: () => void; }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                <FiMoreHorizontal size={20} />
            </button>
            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-100 z-10 py-1 overflow-hidden">
                    <button onClick={() => { setIsOpen(false); onDetail(); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <FiEye className="text-gray-500" /> Detail
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button onClick={() => { setIsOpen(false); onDelete(); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <FiTrash2 /> Delete
                    </button>
                </div>
            )}
        </div>
    );
};

// --- 2. Component ตาราง ---
const InspectionTable = ({
    data,
    onEdit,
    onDelete,
    onToggleStatus
}: {
    data: InspectionRound[],
    onEdit: (item: InspectionRound) => void,
    onDelete: (id: number) => void,
    onToggleStatus: (id: number) => void // Type definition
}) => (
    <div className="overflow-x-visible bg-white rounded-lg shadow mt-4 pb-24">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="uppercase tracking-wider border-b-2 border-gray-200 bg-gray-50 text-gray-700">
                <tr>
                    <th className="px-6 py-4 font-semibold">ID</th>
                    <th className="px-6 py-4 font-semibold w-full">หัวข้อ</th>
                    <th className="px-6 py-4 font-semibold text-center">สถานะ</th>
                    <th className="px-6 py-4 font-semibold">เริ่ม</th>
                    <th className="px-6 py-4 font-semibold">สิ้นสุด</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
            </thead>
            <tbody className="text-gray-700">
                {data.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">ไม่พบข้อมูล</td></tr>
                ) : (
                    data.map((item) => (
                        <tr key={item.inspectionId} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">{item.inspectionId}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>

                            {/* Status ปุ่ม Switch Toggle */}
                            <td className="px-6 py-4 text-center">
                                <div className="flex flex-col items-center justify-center gap-1">
                                    <button
                                        onClick={() => onToggleStatus(item.inspectionId)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${item.status === 'OPEN' ? 'bg-green-500' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span
                                            className={`${item.status === 'OPEN' ? 'translate-x-6' : 'translate-x-1'
                                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                        />
                                    </button>
                                    <span className={`text-[10px] font-bold ${item.status === 'OPEN' ? 'text-green-600' : 'text-gray-400'}`}>
                                        {item.status === 'OPEN' ? 'OPEN' : 'CLOSED'}
                                    </span>
                                </div>
                            </td>

                            <td className="px-6 py-4 text-gray-600">{new Date(item.startDate).toLocaleString('th-TH')}</td>
                            <td className="px-6 py-4 text-gray-600">{new Date(item.endDate).toLocaleString('th-TH')}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end">
                                    <ActionMenu
                                        onDetail={() => onEdit(item)}
                                        onDelete={() => onDelete(item.inspectionId)}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>
);

// --- 3. Main Page ---
const InspectionManagePage = () => {
    const [showForm, setShowForm] = useState(false);
    const [inspections, setInspections] = useState<InspectionRound[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InspectionRound | null>(null);

    const fetchInspections = async () => {
        setIsFetching(true);
        try {
            const response = await inspectionService.getAll();
            setInspections(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => { fetchInspections(); }, []);

    // ฟังก์ชัน Toggle Status
    const handleToggleStatus = async (id: number) => {
        try {
            // เรียก API สลับสถานะ
            await inspectionService.toggleStatus(id);
            // โหลดข้อมูลใหม่เพื่อให้ UI อัปเดตทันที
            await fetchInspections();

            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
            });
            Toast.fire({
                icon: 'success',
                title: 'อัปเดตสถานะเรียบร้อย'
            });

        } catch (error) {
            console.error(error);
            Swal.fire('ผิดพลาด', 'ไม่สามารถเปลี่ยนสถานะได้', 'error');
        }
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'ยืนยันการลบ?',
            text: "คุณต้องการลบรอบการตรวจนี้ใช่หรือไม่ การกระทำนี้ไม่สามารถย้อนกลับได้",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ใช่, ลบเลย',
            cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await inspectionService.remove(id);
                    Swal.fire('ลบสำเร็จ!', 'ข้อมูลถูกลบเรียบร้อยแล้ว', 'success');
                    fetchInspections();
                } catch (error) {
                    Swal.fire('ผิดพลาด', 'ไม่สามารถลบข้อมูลได้', 'error');
                }
            }
        });
    };

    const handleEdit = (item: InspectionRound) => {
        setSelectedItem(item);
        setShowForm(true);
    };

    const handleCreate = () => {
        setSelectedItem(null);
        setShowForm(true);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">จัดการรอบการตรวจ (Inspection Rounds)</h1>
                {!showForm && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        <FiPlus /> สร้างรอบการตรวจ
                    </button>
                )}
            </div>

            {showForm ? (
                <CreateInspectionForm
                    initialData={selectedItem}
                    onSuccess={() => {
                        setShowForm(false);
                        fetchInspections();
                    }}
                    onCancel={() => setShowForm(false)}
                />
            ) : (
                isFetching ? <p className="text-gray-500">Loading...</p> :
                    <InspectionTable
                        data={inspections}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleStatus={handleToggleStatus} // ส่ง prop นี้เข้าไป
                    />
            )}
        </div>
    );
};

export default InspectionManagePage;