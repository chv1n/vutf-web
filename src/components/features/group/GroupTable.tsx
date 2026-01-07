// src/components/features/group/GroupTable.tsx
// Component แสดงตารางกลุ่มวิทยานิพนธ์

import React from 'react';
import { FiUsers, FiUser, FiEye, FiEdit, FiTrash2, FiLoader, FiInbox } from 'react-icons/fi';
import { motion } from 'framer-motion';

/**
 * ข้อมูลกลุ่มสำหรับแสดงในตาราง
 */
export interface GroupTableData {
    group_id: string;
    thesis_code: string;
    thesis_name_th: string;
    member_count: number;
    status: 'active' | 'pending' | 'completed';
    role: 'owner' | 'member';
    created_at: string;
}

interface GroupTableProps {
    /** ข้อมูลกลุ่ม */
    groups: GroupTableData[];
    /** สถานะกำลังโหลด */
    isLoading?: boolean;
    /** Callback เมื่อคลิกดูรายละเอียด */
    onView?: (groupId: string) => void;
    /** Callback เมื่อคลิกแก้ไข */
    onEdit?: (groupId: string) => void;
    /** Callback เมื่อคลิกลบ */
    onDelete?: (groupId: string) => void;
}

/**
 * GroupTable - ตารางแสดงกลุ่มวิทยานิพนธ์
 * 
 * Single Responsibility: แสดงข้อมูลกลุ่มในรูปแบบตาราง
 * 
 * Features:
 * - Responsive design
 * - Loading/Empty states
 * - Action buttons
 */
export const GroupTable: React.FC<GroupTableProps> = ({
    groups,
    isLoading = false,
    onView,
    onEdit,
    onDelete,
}) => {
    // Status badge styles
    const getStatusStyle = (status: GroupTableData['status']) => {
        switch (status) {
            case 'active':
                return 'bg-emerald-100 text-emerald-700';
            case 'pending':
                return 'bg-amber-100 text-amber-700';
            case 'completed':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusLabel = (status: GroupTableData['status']) => {
        switch (status) {
            case 'active':
                return 'ดำเนินการสำเร็จ';
            case 'pending':
                return 'รอดำเนินการ';
            case 'completed':
                return 'เสร็จสิ้น';
            default:
                return status;
        }
    };

    // Role badge styles
    const getRoleStyle = (role: GroupTableData['role']) => {
        return role === 'owner'
            ? 'bg-purple-100 text-purple-700'
            : 'bg-gray-100 text-gray-600';
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <FiLoader className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-500">กำลังโหลดข้อมูลกลุ่ม...</p>
            </div>
        );
    }

    // Empty state
    if (groups.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16"
            >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FiInbox className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-900 font-medium mb-2">ยังไม่มีกลุ่มวิทยานิพนธ์</p>
                <p className="text-gray-500 text-sm">
                    คุณยังไม่ได้เป็นสมาชิกในกลุ่มวิทยานิพนธ์ใดๆ
                </p>
            </motion.div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-100">
                        <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">
                            รหัสวิทยานิพนธ์
                        </th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700 text-sm">
                            ชื่อวิทยานิพนธ์
                        </th>
                        <th className="text-center py-4 px-4 font-semibold text-gray-700 text-sm">
                            สมาชิก
                        </th>
                        <th className="text-center py-4 px-4 font-semibold text-gray-700 text-sm">
                            บทบาท
                        </th>
                        <th className="text-center py-4 px-4 font-semibold text-gray-700 text-sm">
                            สถานะ
                        </th>
                        <th className="text-center py-4 px-4 font-semibold text-gray-700 text-sm">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map((group, index) => (
                        <motion.tr
                            key={group.group_id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                        >
                            {/* รหัสวิทยานิพนธ์ */}
                            <td className="py-4 px-4">
                                <span className="font-mono text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                    {group.thesis_code}
                                </span>
                            </td>

                            {/* ชื่อวิทยานิพนธ์ */}
                            <td className="py-4 px-4">
                                <p className="text-gray-900 font-medium text-sm line-clamp-2 max-w-xs">
                                    {group.thesis_name_th}
                                </p>
                            </td>

                            {/* จำนวนสมาชิก */}
                            <td className="py-4 px-4 text-center">
                                <div className="inline-flex items-center gap-1.5 text-gray-600">
                                    <FiUsers className="w-4 h-4" />
                                    <span className="text-sm font-medium">{group.member_count}</span>
                                </div>
                            </td>

                            {/* บทบาท */}
                            <td className="py-4 px-4 text-center">
                                <span className={`
                                    inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                                    ${getRoleStyle(group.role)}
                                `}>
                                    {group.role === 'owner' ? (
                                        <>
                                            <FiUser className="w-3 h-3" />
                                            เจ้าของ
                                        </>
                                    ) : (
                                        'สมาชิก'
                                    )}
                                </span>
                            </td>

                            {/* สถานะ */}
                            <td className="py-4 px-4 text-center">
                                <span className={`
                                    inline-block px-2.5 py-1 rounded-full text-xs font-medium
                                    ${getStatusStyle(group.status)}
                                `}>
                                    {getStatusLabel(group.status)}
                                </span>
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-4">
                                <div className="flex items-center justify-center gap-1">
                                    {onView && (
                                        <button
                                            onClick={() => onView(group.group_id)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="ดูรายละเอียด"
                                        >
                                            <FiEye className="w-4 h-4" />
                                        </button>
                                    )}
                                    {onEdit && group.role === 'owner' && (
                                        <button
                                            onClick={() => onEdit(group.group_id)}
                                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                            title="แก้ไข"
                                        >
                                            <FiEdit className="w-4 h-4" />
                                        </button>
                                    )}
                                    {onDelete && group.role === 'owner' && (
                                        <button
                                            onClick={() => onDelete(group.group_id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="ลบ"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GroupTable;
