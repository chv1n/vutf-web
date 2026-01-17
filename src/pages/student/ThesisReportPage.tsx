// src/pages/student/ThesisReportPage.tsx
// หน้า Thesis Report แสดงประวัติการส่งไฟล์

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiLoader, FiInbox } from 'react-icons/fi';
import { useTitle } from '@/hooks/useTitle';
import { useAuth } from '@/contexts/AuthContext';
import { groupMemberService } from '@/services/group-member.service';
import { submissionService } from '@/services/submission.service';
import { ThesisGroup } from '@/types/thesis';
import { Submission } from '@/types/submission';

// Components
import { GroupSelector } from '@/components/features/submission/GroupSelector';
import { ReviewRoundSection } from '@/components/features/submission/ReviewRoundSection';

interface GroupOption {
    groupId: string;
    thesisNameTh: string;
    thesisNameEn: string;
    thesisCode: string;
}

/**
 * ThesisReportPage - หน้าแสดงประวัติการส่งไฟล์
 * * Features:
 * - เลือกกลุ่ม (ถ้ามีหลายกลุ่ม)
 * - แสดง submissions grouped by inspection round
 * - Original/Report cards
 * - Download files
 */
const ThesisReportPage: React.FC = () => {
    useTitle('Thesis Report');
    const { user } = useAuth();

    // State
    const [groups, setGroups] = useState<GroupOption[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoadingGroups, setIsLoadingGroups] = useState(true);
    const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

    /**
     * Fetch user's groups
     */
    const fetchGroups = useCallback(async () => {
        if (!user?.id) return;
        setIsLoadingGroups(true);

        try {
            const myGroups = await groupMemberService.getMyGroups();

            // Map to GroupOption format
            const groupOptions: GroupOption[] = myGroups.map((g: ThesisGroup) => ({
                groupId: g.group_id,
                thesisNameTh: g.thesis?.thesis_name_th || 'ไม่มีชื่อ',
                thesisNameEn: g.thesis?.thesis_name_en || '-',
                thesisCode: g.thesis?.thesis_code || '-',
            }));

            setGroups(groupOptions);

            // Auto-select first group
            if (groupOptions.length > 0 && !selectedGroupId) {
                setSelectedGroupId(groupOptions[0].groupId);
            }
        } catch (error) {
            console.error('Error fetching groups:', error);
        } finally {
            setIsLoadingGroups(false);
        }
    }, [user?.id, selectedGroupId]);

    /**
     * Fetch submissions for selected group
     */
    const fetchSubmissions = useCallback(async () => {
        if (!selectedGroupId) return;
        setIsLoadingSubmissions(true);

        try {
            const data = await submissionService.getByGroup(selectedGroupId);
            // Sort by submittedAt descending (newest first)
            const sorted = data.sort((a, b) =>
                new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
            );
            setSubmissions(sorted);
        } catch (error) {
            console.error('Error fetching submissions:', error);
            setSubmissions([]);
        } finally {
            setIsLoadingSubmissions(false);
        }
    }, [selectedGroupId]);

    // Fetch groups on mount
    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    // Fetch submissions when group changes
    useEffect(() => {
        if (selectedGroupId) {
            fetchSubmissions();
        }
    }, [selectedGroupId, fetchSubmissions]);

    /**
     * Handle download
     */
    const handleDownload = async (submissionId: number) => {
        try {
            const { url } = await submissionService.getFileUrl(submissionId);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error getting download URL:', error);
        }
    };

    // Loading groups
    if (isLoadingGroups) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <FiLoader className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    // No groups
    if (groups.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <FiInbox className="w-16 h-16 mb-4" />
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300">คุณยังไม่มีกลุ่ม</p>
                <p className="text-sm mt-1">กรุณาสร้างกลุ่มหรือรอรับคำเชิญจากหัวหน้ากลุ่ม</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-[80vh] space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
            >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
                    <FiFileText className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Thesis Report</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">ประวัติการส่งไฟล์ตรวจความก้าวหน้า</p>
                </div>
            </motion.div>

            {/* Group Selector */}
            {groups.length > 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
                >
                    <GroupSelector
                        groups={groups}
                        selectedGroupId={selectedGroupId}
                        onSelect={setSelectedGroupId}
                    />
                </motion.div>
            )}

            {/* Single group info */}
            {groups.length === 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
                >
                    <GroupSelector
                        groups={groups}
                        selectedGroupId={groups[0].groupId}
                        onSelect={() => { }}
                    />
                </motion.div>
            )}

            {/* Submissions List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
            >
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                    <FiFileText className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    ประวัติการส่งไฟล์
                </h2>

                {/* Loading */}
                {isLoadingSubmissions && (
                    <div className="flex items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                        <FiLoader className="w-8 h-8 animate-spin" />
                    </div>
                )}

                {/* Empty */}
                {!isLoadingSubmissions && submissions.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                        <FiInbox className="w-12 h-12 mb-3" />
                        <p className="text-base font-medium text-gray-500 dark:text-gray-400">ยังไม่มีประวัติการส่งไฟล์</p>
                        <p className="text-sm mt-1">ไฟล์ที่ส่งจะแสดงที่นี่</p>
                    </div>
                )}

                {/* Submissions by round */}
                {!isLoadingSubmissions && submissions.length > 0 && (
                    <div className="space-y-6">
                        {submissions.map((submission, index) => (
                            <ReviewRoundSection
                                key={submission.submissionId}
                                roundNumber={submissions.length - index}
                                roundTitle={`รอบที่ ${submissions.length - index}`}
                                submission={submission}
                                onDownloadOriginal={() => handleDownload(submission.submissionId)}
                                onDownloadReport={() => handleDownload(submission.submissionId)}
                            />
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ThesisReportPage;