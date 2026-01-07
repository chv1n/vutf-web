import React, { useState } from 'react';
import { FiUsers, FiUser, FiTrash2, FiUserPlus, FiClock, FiCheck, FiXCircle } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { GroupMember, GroupMemberRole, InvitationStatus } from '@/types/thesis';
import { groupMemberService } from '@/services/group-member.service';
import { InviteMemberModal } from '@/components/features/group/InviteMemberModal';

interface MemberManagementListProps {
    members: GroupMember[];
    groupId: string;
    isOwner: boolean;
    currentUserId: string;
    onUpdate: () => void;
}

export const MemberManagementList: React.FC<MemberManagementListProps> = ({
    members,
    groupId,
    isOwner,
    currentUserId,
    onUpdate,
}) => {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const handleRemoveMember = async (member: GroupMember) => {
        const result = await Swal.fire({
            title: 'ต้องการลบสมาชิก?',
            text: `ต้องการลบ ${member.student?.first_name} ออกจากกลุ่มหรือไม่?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'ลบสมาชิก',
            cancelButtonText: 'ยกเลิก',
        });

        if (result.isConfirmed) {
            try {
                await groupMemberService.removeMember(groupId, member.member_id);

                Swal.fire('Deleted!', 'ลบสมาชิกเรียบร้อยแล้ว', 'success');
                onUpdate();
            } catch (error) {
                Swal.fire('Error', 'ไม่สามารถลบสมาชิกได้', 'error');
            }
        }
    };

    const getStatusBadge = (status: InvitationStatus | string) => {
        switch (status) {
            case InvitationStatus.APPROVED:
                return <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full"><FiCheck className="w-3" /> ตอบรับแล้ว</span>;
            case InvitationStatus.PENDING:
                return <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full"><FiClock className="w-3" /> รอตอบรับ</span>;
            case InvitationStatus.REJECTED:
                return <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full"><FiXCircle className="w-3" /> ปฏิเสธ</span>;
            default:
                return null;
        }
    };

    // Sort: Owner first
    const sortedMembers = [...members].sort((a, b) => {
        if (a.role === GroupMemberRole.OWNER) return -1;
        if (b.role === GroupMemberRole.OWNER) return 1;
        return 0;
    });

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <FiUsers className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">สมาชิกกลุ่ม ({members.length})</h2>
                        <p className="text-sm text-gray-500">จัดการสมาชิกในกลุ่ม</p>
                    </div>
                </div>
                {isOwner && (
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <FiUserPlus /> เชิญสมาชิก
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {sortedMembers.map((member) => (
                    <div key={member.member_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${member.role === GroupMemberRole.OWNER ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-500'}`}>
                                <FiUser className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-gray-900">
                                        {member.student?.prefix_name} {member.student?.first_name} {member.student?.last_name}
                                    </h3>
                                    {member.role === GroupMemberRole.OWNER && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">OWNER</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-sm text-gray-500">{member.student?.student_code}</span>
                                    {getStatusBadge(member.invitation_status)}
                                </div>
                            </div>
                        </div>

                        {isOwner && member.role !== GroupMemberRole.OWNER && member.student_uuid !== currentUserId && (
                            <button
                                onClick={() => handleRemoveMember(member)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="ลบสมาชิก"
                            >
                                <FiTrash2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {isInviteModalOpen && (
                <InviteMemberModal
                    groupId={groupId}
                    onClose={() => setIsInviteModalOpen(false)}
                    onSuccess={() => {
                        setIsInviteModalOpen(false);
                        onUpdate();
                    }}
                />
            )}
        </div>
    );
};
