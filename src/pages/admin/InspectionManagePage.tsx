// src/pages/admin/InspectionManagePage.tsx
import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { FiMoreHorizontal, FiEye, FiTrash2, FiPlus, FiEdit2, FiCalendar, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import CreateInspectionForm from '@/components/features/admin/inspection/CreateInspectionForm';
import { inspectionService } from '@/services/inspection.service';
import { InspectionRound } from '@/types/inspection';

// --- 1. Component เมนูจุดสามจุด (Dropdown) ---
interface ActionMenuProps {
    onEdit: () => void;
    onDelete: () => void;
    onDetail: () => void;
}

const ActionMenu = ({ onEdit, onDelete, onDetail }: ActionMenuProps) => {
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
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <button onClick={() => { setIsOpen(false); onEdit(); }} className="w-full text-left px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 font-medium">
                        <FiEdit2 size={16} /> Edit
                    </button>
                    <button onClick={() => { setIsOpen(false); onDelete(); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium">
                        <FiTrash2 size={16} /> Delete
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button onClick={() => { setIsOpen(false); onDetail(); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium">
                        <FiEye size={16} className="text-gray-500" /> Detail
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
    onDetail,
    onToggleStatus
}: {
    data: InspectionRound[],
    onEdit: (item: InspectionRound) => void,
    onDelete: (id: number) => void,
    onDetail: (item: InspectionRound) => void,
    onToggleStatus: (id: number) => void
}) => (
    <div className="overflow-x-visible bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="uppercase tracking-wider border-b border-gray-200 bg-gray-50/50 text-gray-500">
                <tr>
                    <th className="px-6 py-4 font-semibold text-xs">ID</th>
                    <th className="px-6 py-4 font-semibold text-xs w-full">หัวข้อ</th>
                    <th className="px-6 py-4 font-semibold text-xs text-center">สถานะ</th>
                    <th className="px-6 py-4 font-semibold text-xs">เริ่ม</th>
                    <th className="px-6 py-4 font-semibold text-xs">สิ้นสุด</th>
                    <th className="px-6 py-4 font-semibold text-xs text-right">Action</th>
                </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
                {data.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">ไม่พบข้อมูล</td></tr>
                ) : (
                    data.map((item) => (
                        <tr key={item.inspectionId} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">#{item.inspectionId}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>

                            {/* Status ปุ่ม Switch Toggle */}
                            <td className="px-6 py-4 text-center">
                                <div className="flex flex-col items-center justify-center gap-1">
                                    <button
                                        onClick={() => onToggleStatus(item.inspectionId)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${item.status === 'OPEN' ? 'bg-green-500' : 'bg-gray-300'}`}
                                    >
                                        <span className={`${item.status === 'OPEN' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                                    </button>
                                    <span className={`text-[10px] font-bold ${item.status === 'OPEN' ? 'text-green-600' : 'text-gray-400'}`}>
                                        {item.status === 'OPEN' ? 'OPEN' : 'CLOSED'}
                                    </span>
                                </div>
                            </td>

                            <td className="px-6 py-4 text-gray-500">{new Date(item.startDate).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                            <td className="px-6 py-4 text-gray-500">{new Date(item.endDate).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end">
                                    <ActionMenu
                                        onEdit={() => onEdit(item)}
                                        onDelete={() => onDelete(item.inspectionId)}
                                        onDetail={() => onDetail(item)}
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
            setInspections((response as any).data); 
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => { fetchInspections(); }, []);

    // ฟังก์ชันดูรายละเอียด
    const handleDetail = (item: InspectionRound) => {
        const isOpen = item.status === 'OPEN';
        
        // Format Date Helper
        const formatDate = (date: string | Date) => {
            return new Date(date).toLocaleString('th-TH', { 
                year: 'numeric', month: 'long', day: 'numeric', 
                hour: '2-digit', minute: '2-digit' 
            });
        };

        Swal.fire({
            html: `
                <div class="text-left font-sans">
                    <div class="flex items-start justify-between mb-2">
                        <div>
                             <h3 class="text-xl font-bold text-gray-800 mb-1">${item.title}</h3>
                             <span class="text-xs font-semibold px-2.5 py-1 rounded-full ${isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                                ${isOpen ? '● กำลังเปิดรับ (OPEN)' : '● ปิดรับแล้ว (CLOSED)'}
                             </span>
                        </div>
                    </div>
                    
                    <div class="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <label class="text-xs font-bold text-gray-400 uppercase tracking-wider">รายละเอียด</label>
                        <p class="text-gray-700 mt-1 text-sm leading-relaxed">${item.description || '<span class="text-gray-400 italic">ไม่มีรายละเอียดระบุ</span>'}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4 mt-4">
                        <div class="p-3 border border-gray-100 rounded-xl">
                            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">วันที่เริ่ม</label>
                            <p class="text-sm font-semibold text-gray-800">
                                ${formatDate(item.startDate)}
                            </p>
                        </div>
                        <div class="p-3 border border-gray-100 rounded-xl">
                            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">วันที่สิ้นสุด</label>
                            <p class="text-sm font-semibold text-gray-800">
                                ${formatDate(item.endDate)}
                            </p>
                        </div>
                    </div>
                </div>
            `,
            showCloseButton: true,
            showConfirmButton: false,
            customClass: {
                popup: 'rounded-2xl shadow-2xl p-0 overflow-hidden',
                htmlContainer: '!p-6 !m-0 !text-left',
                closeButton: 'focus:outline-none'
            },
            width: '500px'
        });
    };

    const handleToggleStatus = async (id: number) => {
        try {
            await inspectionService.toggleStatus(id);
            await fetchInspections();
            
            const Toast = Swal.mixin({
                toast: true, position: 'top-end', showConfirmButton: false, timer: 1500, timerProgressBar: true,
            });
            Toast.fire({ icon: 'success', title: 'อัปเดตสถานะเรียบร้อย' });
        } catch (error) {
            console.error(error);
            Swal.fire('ผิดพลาด', 'ไม่สามารถเปลี่ยนสถานะได้', 'error');
        }
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'ยืนยันการลบ?',
            text: "คุณต้องการลบรอบการตรวจนี้ใช่หรือไม่",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ลบเลย',
            cancelButtonText: 'ยกเลิก',
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'rounded-lg',
                cancelButton: 'rounded-lg'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await inspectionService.remove(id);
                    Swal.fire({
                        icon: 'success',
                        title: 'ลบสำเร็จ!',
                        text: 'ข้อมูลถูกลบเรียบร้อยแล้ว',
                        timer: 1500,
                        showConfirmButton: false
                    });
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
        <div className="max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Inspection Rounds</h1>
                    <p className="text-gray-500 text-sm mt-1">จัดการรอบการสอบและส่งเล่มวิทยานิพนธ์</p>
                </div>
                {!showForm && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all font-medium"
                    >
                        <FiPlus size={20} /> สร้างรอบการตรวจ
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
                isFetching ? 
                    <div className="p-12 text-center text-gray-500 animate-pulse">กำลังโหลดข้อมูล...</div> 
                    :
                    <InspectionTable
                        data={inspections}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onDetail={handleDetail}
                        onToggleStatus={handleToggleStatus}
                    />
            )}
        </div>
    );
};

export default InspectionManagePage;