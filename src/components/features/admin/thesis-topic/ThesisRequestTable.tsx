// src/components/features/admin/thesis-topic/ThesisRequestTable.tsx
import { useState, useRef, useEffect } from 'react';
import { FiMoreVertical, FiTrash2, FiEye, FiCheck, FiX, FiRefreshCw, FiList, FiUsers, FiUser } from 'react-icons/fi';
import { AdminThesisGroup } from '../../../../types/admin-thesis';
import Swal from 'sweetalert2';

interface Props {
    data: AdminThesisGroup[];
    isLoading: boolean;
    onApprove: (group: AdminThesisGroup) => void;
    onReject: (group: AdminThesisGroup) => void;
    onDelete: (thesisId: string) => void;
    onViewDetails: (group: AdminThesisGroup) => void;
    onRefresh?: () => void;
}

export const ThesisRequestTable = ({
    data,
    isLoading,
    onApprove,
    onReject,
    onDelete,
    onViewDetails,
    onRefresh
}: Props) => {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDelete = async (group: AdminThesisGroup) => {
        // ปิดเมนู Dropdown ก่อน
        setOpenMenuId(null);

        const result = await Swal.fire({
            title: 'ยืนยันการลบ?',
            text: `คุณต้องการลบข้อมูลโครงงาน "${group.thesis?.thesis_name_th || 'ไม่ระบุชื่อ'}" ใช่หรือไม่?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#b9babb',
            confirmButtonText: 'ใช่, ลบเลย',
            cancelButtonText: 'ยกเลิก',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'rounded-xl',
                cancelButton: 'rounded-xl'
            }
        });

        if (result.isConfirmed) {
            onDelete(group.thesis.thesis_id);
            Swal.fire('ลบสำเร็จ!', 'ข้อมูลถูกลบเรียบร้อยแล้ว', 'success');
        }
    };

    const renderStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-yellow-50 text-yellow-700 border-yellow-200 ring-1 ring-yellow-200/50',
            approved: 'bg-green-50 text-green-700 border-green-200 ring-1 ring-green-200/50',
            rejected: 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-200/50',
            incomplete: 'bg-gray-50 text-gray-600 border-gray-200 ring-1 ring-gray-200/50',
        };
        const style = styles[status as keyof typeof styles] || styles.incomplete;

        const labels = {
            pending: 'รออนุมัติ',
            approved: 'อนุมัติแล้ว',
            rejected: 'ปฏิเสธ',
            incomplete: 'ไม่สมบูรณ์'
        }

        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${style} capitalize`}>
                {labels[status as keyof typeof labels] || status}
            </span>
        );
    };

    return (
        <div className="flex flex-col h-full">
            {/* --- Header Bar --- */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <FiList size={18} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-800">รายการคำขอ</h3>
                        <p className="text-xs text-gray-500">จัดการคำขอตั้งกลุ่มวิทยานิพนธ์</p>
                    </div>
                </div>

                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                        title="รีเฟรชข้อมูล"
                    >
                        <FiRefreshCw size={18} />
                    </button>
                )}
            </div>

            {/* --- Table Content --- */}
            <div className="overflow-visible flex-1">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                        <span className="text-gray-500 text-sm">กำลังโหลดข้อมูล...</span>
                    </div>
                ) : data.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <p>ไม่พบรายการคำขอในขณะนี้</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[25%]">ข้อมูลโครงงาน</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%]">สมาชิก</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%]">ที่ปรึกษา</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">สถานะ</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">การจัดการ</th>
                                <th className="px-4 py-3 w-[5%]"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {data.map((group) => {
                                const isPending = group.status === 'pending';

                                // จัดเรียง Advisor เอา Main ขึ้นก่อน
                                const sortedAdvisors = group.advisor?.sort((a, b) => (a.role === 'main' ? -1 : 1)) || [];

                                return (
                                    <tr key={group.group_id} className="hover:bg-gray-50/80 transition-colors group">

                                        {/* 1. ข้อมูลโครงงาน */}
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex flex-col gap-0.5">
                                                    <button
                                                        onClick={() => onViewDetails(group)}
                                                        className="text-left group/title focus:outline-none w-full"
                                                    >
                                                        <span
                                                            className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug group-hover/title:text-blue-600 transition-colors cursor-pointer"
                                                            title={group.thesis?.thesis_name_th}
                                                        >
                                                            {group.thesis?.thesis_name_th || 'ไม่ระบุชื่อโครงงาน'}
                                                        </span>
                                                        <span
                                                            className="text-xs text-gray-500 line-clamp-1 italic group-hover/title:text-blue-500 transition-colors cursor-pointer"
                                                            title={group.thesis?.thesis_name_en}
                                                        >
                                                            {group.thesis?.thesis_name_en || '-'}
                                                        </span>
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                                                        {group.thesis?.thesis_code || 'NO CODE'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* 2. สมาชิก (ปรับปรุงใหม่: ลบรูป, แสดงจำนวน, แสดงชื่อ) */}
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex flex-col gap-2">
                                                {/* จำนวนสมาชิก */}
                                                <div className="flex items-center gap-1.5">
                                                    <div className="p-1 bg-blue-50 text-blue-600 rounded">
                                                        <FiUsers size={12} />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-700">
                                                        {group.members.length} สมาชิก
                                                    </span>
                                                </div>

                                                {/* รายชื่อ */}
                                                <div className="flex flex-col gap-1 pl-1 border-l-2 border-gray-100">
                                                    {group.members.map((m, i) => (
                                                        <div key={i} className="text-xs text-gray-600 flex items-center gap-1">
                                                            <span>• {m.student.first_name} {m.student.last_name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>

                                        {/* 3. อาจารย์ที่ปรึกษา */}
                                        <td className="px-6 py-4 align-top">
                                            {sortedAdvisors.length > 0 ? (
                                                <div className="flex flex-col gap-2">
                                                    {/* แสดงจำนวน */}
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="p-1 bg-indigo-50 text-indigo-600 rounded">
                                                            <FiUser size={12} />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-700">
                                                            {sortedAdvisors.length} ท่าน
                                                        </span>
                                                    </div>

                                                    {/* แสดงรายชื่อ */}
                                                    <div className="flex flex-col gap-1 pl-1 border-l-2 border-gray-100">
                                                        {sortedAdvisors.map((adv, i) => (
                                                            <div key={i} className="text-xs text-gray-600 flex items-center gap-1">
                                                                <span>• {adv.instructor.first_name} {adv.instructor.last_name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm italic">- ไม่ระบุ -</span>
                                            )}
                                        </td>

                                        {/* 4. สถานะ */}
                                        <td className="px-6 py-4 align-top text-center">
                                            <div className="flex flex-col items-center gap-1.5">
                                                {renderStatusBadge(group.status)}
                                                {group.memberProgress && (
                                                    <span className="text-[10px] text-gray-400">
                                                        ตอบรับแล้ว {group.memberProgress}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* 5. ปุ่ม Action (Logic ใหม่) */}
                                        <td className="px-6 py-4 align-top">
                                            {group.status === 'pending' ? (
                                                // Case 1: รออนุมัติ -> แสดงปุ่ม
                                                <div className="flex flex-col gap-2 items-center">
                                                    <button
                                                        onClick={() => onApprove(group)}
                                                        disabled={!group.isReadyForAdminAction}
                                                        className="w-full max-w-[110px] h-8 px-3 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-1.5"
                                                    >
                                                        <FiCheck size={14} /> อนุมัติ
                                                    </button>
                                                    <button
                                                        onClick={() => onReject(group)}
                                                        disabled={!group.isReadyForAdminAction}
                                                        className="w-full max-w-[110px] h-8 px-3 text-xs font-medium text-red-600 bg-white border border-red-200 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 flex items-center justify-center gap-1.5"
                                                    >
                                                        <FiX size={14} /> ปฏิเสธ
                                                    </button>
                                                </div>
                                            ) : (group.status === 'incomplete' || group.status === 'rejected') ? (
                                                // Case 2: ไม่สมบูรณ์ หรือ ปฏิเสธ -> รอนักศึกษาแก้
                                                <div className="h-full flex items-center justify-center pt-2">
                                                    <span className="text-[11px] text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100 whitespace-nowrap">
                                                        รอนักศึกษาดำเนินการ
                                                    </span>
                                                </div>
                                            ) : (
                                                // Case 3: อนุมัติแล้ว (Approved) -> ดำเนินการแล้ว
                                                <div className="h-full flex items-center justify-center pt-2">
                                                    <span className="text-xs text-green-600 italic flex items-center gap-1">
                                                        <FiCheck size={12} /> ดำเนินการแล้ว
                                                    </span>
                                                </div>
                                            )}
                                        </td>

                                        {/* 6. More Options */}
                                        <td className="px-4 py-4 align-top text-right relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuId(openMenuId === group.group_id ? null : group.group_id);
                                                }}
                                                className={`p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors ${openMenuId === group.group_id ? 'bg-gray-100 text-gray-600' : ''}`}
                                            >
                                                <FiMoreVertical size={18} />
                                            </button>

                                            {openMenuId === group.group_id && (
                                                <div
                                                    ref={menuRef}
                                                    className="absolute right-8 top-10 z-20 w-44 rounded-xl bg-white shadow-xl shadow-gray-200/50 border border-gray-200 focus:outline-none py-1.5 text-left animate-fade-in-down origin-top-right"
                                                >
                                                    <div className="px-1">
                                                        <button
                                                            onClick={() => {
                                                                onViewDetails(group);
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-lg flex items-center gap-3 transition-colors"
                                                        >
                                                            <FiEye size={16} className="text-gray-400 group-hover:text-indigo-500" />
                                                            <span className="font-medium">ดูรายละเอียด</span>
                                                        </button>

                                                        {group.status !== 'approved' && (
                                                            <button
                                                                onClick={() => handleDelete(group)}
                                                                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-3 transition-colors mt-1"
                                                            >
                                                                <FiTrash2 size={16} className="text-red-400 group-hover:text-red-600" />
                                                                <span className="font-medium">ลบข้อมูล</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};