// src/pages/student/GroupManagementPage.tsx
// หน้าจัดการกลุ่มวิทยานิพนธ์

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiPlus, FiMail, FiRefreshCw, FiLoader, FiInbox } from 'react-icons/fi';
import { useTitle } from '@/hooks/useTitle';
import { useAuth } from '@/contexts/AuthContext';

// Components
import { GroupTable, GroupTableData } from '@/components/features/group/GroupTable';
// import { GroupDetailModal } from '@/components/features/group/GroupDetailModal';
import { CreateThesisForm } from '@/components/features/thesis/CreateThesisForm';
import { InvitationCard } from '@/components/features/invitation/InvitationCard';

// Services & Types
import { groupMemberService } from '@/services/group-member.service';
import { InvitationCardData, InvitationStatus, GroupMemberRole } from '@/types/thesis';

type TabType = 'my-groups' | 'create' | 'invitations';

interface TabConfig {
    key: TabType;
    label: string;
    icon: React.ElementType;
}

/**
 * GroupManagementPage - หน้าจัดการกลุ่มวิทยานิพนธ์
 * 
 * Route: /student/group-management
 * 
 * Features:
 * - Tab: My Groups - แสดงกลุ่มเป็นตาราง
 * - Tab: Create Group - สร้างกลุ่มใหม่
 * - Tab: Invitations - ดูคำเชิญ
 * 
 * SOLID:
 * - Single Responsibility: แต่ละ tab จัดการหน้าที่ของตัวเอง
 * - Open/Closed: Tab system ขยายได้ง่าย
 */
const GroupManagementPage: React.FC = () => {
    useTitle('จัดการกลุ่มวิทยานิพนธ์');

    const [activeTab, setActiveTab] = useState<TabType>('my-groups');
    const [invitationCount, setInvitationCount] = useState(0);

    // Fetch invitation count
    const fetchInvitationCount = useCallback(async () => {
        try {
            const invitations = await groupMemberService.getPendingInvitations();
            setInvitationCount(invitations.length);
        } catch (error) {
            console.error('Error fetching invitation count:', error);
        }
    }, []);

    useEffect(() => {
        fetchInvitationCount();
    }, [fetchInvitationCount]);

    // Tab configuration
    const tabs: TabConfig[] = [
        { key: 'my-groups', label: 'กลุ่มของฉัน', icon: FiUsers },
        { key: 'create', label: 'สร้างกลุ่ม', icon: FiPlus },
        { key: 'invitations', label: 'คำเชิญ', icon: FiMail },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-8"
                >
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <span>หน้าหลัก</span>
                        <span>/</span>
                        <span className="text-blue-600 font-medium">จัดการกลุ่ม</span>
                    </div>

                    {/* Title */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200">
                            <FiUsers className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                จัดการกลุ่มวิทยานิพนธ์
                            </h1>
                            <p className="text-gray-500 mt-1">
                                ดูกลุ่ม สร้างกลุ่ม และจัดการคำเชิญ
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mb-6"
                >
                    <div className="flex items-center gap-1 p-1.5 bg-gray-100 rounded-xl overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`
                                        flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap
                                        transition-all duration-200
                                        ${activeTab === tab.key
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }
                                    `}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                    {tab.key === 'invitations' && invitationCount > 0 && (
                                        <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[1.25rem] text-center">
                                            {invitationCount}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'my-groups' && <MyGroupsTab />}
                        {activeTab === 'create' && <CreateGroupTab />}
                        {activeTab === 'invitations' && <InvitationsTab onUpdate={fetchInvitationCount} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

// ============================================
// TAB COMPONENTS (Single Responsibility)
// ============================================

/**
 * MyGroupsTab - แสดงกลุ่มของฉันเป็นตาราง
 */
const MyGroupsTab: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [groups, setGroups] = useState<GroupTableData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchGroups = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await groupMemberService.getMyGroups();


            // Transform to GroupTableData
            const tableData: GroupTableData[] = data.map((group) => {
                // Find current user's role in this group
                const currentMember = group.members?.find(
                    (m) => m.student_uuid === user?.id
                );
                // Check ownership by role or creator
                const creatorId = typeof group.created_by === 'object' ? group.created_by?.user_uuid : group.created_by;
                const isOwner = (currentMember?.role?.toLowerCase() === GroupMemberRole.OWNER.toLowerCase()) || (creatorId === user?.id);

                return {
                    group_id: group.group_id,
                    thesis_code: group.thesis?.thesis_code || '-',
                    thesis_name_th: group.thesis?.thesis_name_th || 'ไม่มีชื่อ',
                    member_count: group.members?.length || 0,
                    status: group.status ? 'active' : 'pending',
                    role: isOwner ? 'owner' : 'member',
                    created_at: group.created_at,
                };
            });
            setGroups(tableData);
        } catch (error) {
            console.error('Error fetching groups:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const handleView = (groupId: string) => {
        navigate(`/student/groups/${groupId}`);
    };



    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">กลุ่มของฉัน</h2>
                        <p className="text-sm text-gray-500 mt-0.5">
                            รายการกลุ่มวิทยานิพนธ์ที่คุณเป็นสมาชิก ({groups.length} กลุ่ม)
                        </p>
                    </div>
                    <button
                        onClick={fetchGroups}
                        disabled={isLoading}
                        className="p-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        <FiRefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Table */}
                <div className="p-6">
                    <GroupTable
                        groups={groups}
                        isLoading={isLoading}
                        onView={handleView}
                    />
                </div>
            </div>

        </>
    );
};

/**
 * CreateGroupTab - สร้างกลุ่มใหม่
 */
const CreateGroupTab: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">สร้างกลุ่มวิทยานิพนธ์</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                    กรอกข้อมูลเพื่อสร้างกลุ่มวิทยานิพนธ์ใหม่
                </p>
            </div>

            {/* Form */}
            <div className="p-6">
                <CreateThesisForm />
            </div>
        </div>
    );
};

/**
 * InvitationsTab - ดูคำเชิญ
 */
interface InvitationsTabProps {
    onUpdate?: () => void;
}

const InvitationsTab: React.FC<InvitationsTabProps> = ({ onUpdate }) => {
    const [invitations, setInvitations] = useState<InvitationCardData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInvitations = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await groupMemberService.getMyInvitations();
            setInvitations(data);
            onUpdate?.(); // Notify parent to update badge count
        } catch (err) {
            setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
        } finally {
            setIsLoading(false);
        }
    }, [onUpdate]);

    useEffect(() => {
        fetchInvitations();
    }, [fetchInvitations]);

    const handleActionSuccess = (memberId: string, action: 'accept' | 'reject') => {
        setInvitations((prev) =>
            prev.map((inv) =>
                inv.member_id === memberId
                    ? {
                        ...inv,
                        invitation_status:
                            action === 'accept'
                                ? InvitationStatus.APPROVED
                                : InvitationStatus.REJECTED,
                    }
                    : inv
            )
        );
        onUpdate?.(); // Update badge count immediately
    };

    // Filter pending invitations
    const pendingInvitations = invitations.filter(
        (inv) => inv.invitation_status === InvitationStatus.PENDING
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">คำเชิญเข้าร่วมกลุ่ม</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        คำเชิญที่รอการตอบรับ ({pendingInvitations.length})
                    </p>
                </div>
                <button
                    onClick={fetchInvitations}
                    disabled={isLoading}
                    className="p-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                    <FiRefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Content */}
            <div className="p-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <FiLoader className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                        <p className="text-gray-500">กำลังโหลดคำเชิญ...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <FiMail className="w-8 h-8 text-red-500" />
                        </div>
                        <p className="text-gray-900 font-medium mb-2">เกิดข้อผิดพลาด</p>
                        <p className="text-gray-500 text-sm mb-4">{error}</p>
                        <button
                            onClick={fetchInvitations}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            ลองใหม่อีกครั้ง
                        </button>
                    </div>
                ) : pendingInvitations.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-12"
                    >
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FiInbox className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-900 font-medium mb-2">ไม่มีคำเชิญ</p>
                        <p className="text-gray-500 text-sm">
                            คุณไม่มีคำเชิญที่รอการตอบรับ
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {pendingInvitations.map((invitation) => (
                                <InvitationCard
                                    key={invitation.member_id}
                                    invitation={invitation}
                                    onActionSuccess={handleActionSuccess}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupManagementPage;
