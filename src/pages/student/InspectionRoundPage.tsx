// src/pages/student/InspectionRoundPage.tsx
// หน้า Inspection Round สำหรับนักศึกษา

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiArrowLeft,
    FiLoader,
    FiClipboard,
    FiCalendar,
    FiClock,
    FiUploadCloud,
    FiFileText,
    FiAlertCircle,
    FiInfo
} from 'react-icons/fi';
import { useTitle } from '@/hooks/useTitle';
import { useOwnerGroups } from '@/hooks/useOwnerGroups';
import { inspectionService } from '@/services/inspection.service';
import { InspectionRound } from '@/types/inspection';

// Components
import { GroupSelector } from '@/components/features/submission/GroupSelector';
import { SubmissionUploadForm, SubmissionList } from '@/components/features/submission';

/**
 * InspectionRoundPage - หน้า Inspection Round
 * * Features:
 * - แสดง Active Inspection Round
 * - เลือกกลุ่มสำหรับ Owner หลายกลุ่ม
 * - ส่งไฟล์ (Owner only)
 * - แสดงประวัติการส่งไฟล์
 */
const InspectionRoundPage: React.FC = () => {
    useTitle('รอบตรวจ');
    const navigate = useNavigate();

    // State
    const [activeRound, setActiveRound] = useState<InspectionRound | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [roundError, setRoundError] = useState<string | null>(null);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Hooks
    const { groups, loading: groupsLoading, isOwner, hasMultipleGroups } = useOwnerGroups();

    /**
     * Fetch active round
     */
    const fetchActiveRound = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await inspectionService.getActiveRound();
            setActiveRound(data);
            setRoundError(null);
        } catch (error) {
            console.error('Error fetching active round:', error);
            setRoundError('ไม่มีรอบตรวจที่เปิดรับไฟล์ในขณะนี้');
            setActiveRound(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchActiveRound();
    }, [fetchActiveRound]);

    // Auto-select if single group
    useEffect(() => {
        if (groups.length === 1 && !selectedGroupId) {
            setSelectedGroupId(groups[0].groupId);
        }
    }, [groups, selectedGroupId]);

    /**
     * Check if submission is allowed
     */
    const isSubmissionAllowed = useCallback(() => {
        if (!activeRound) return false;
        if (activeRound.status !== 'OPEN' || !activeRound.isActive) return false;

        const now = new Date();
        const start = new Date(activeRound.startDate);
        const end = new Date(activeRound.endDate);

        return now >= start && now <= end;
    }, [activeRound]);

    /**
     * Format date
     */
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    /**
     * Get countdown info
     */
    const getCountdown = () => {
        if (!activeRound) return null;

        const now = new Date();
        const end = new Date(activeRound.endDate);
        const start = new Date(activeRound.startDate);

        if (now < start) {
            const diff = start.getTime() - now.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            return { type: 'waiting', text: `เริ่มใน ${days > 0 ? `${days} วัน ` : ''}${hours} ชั่วโมง` };
        }

        if (now >= start && now <= end) {
            const diff = end.getTime() - now.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            return { type: 'active', text: `เหลือเวลา ${days > 0 ? `${days} วัน ` : ''}${hours} ชั่วโมง` };
        }

        return { type: 'ended', text: 'หมดเวลาส่งแล้ว' };
    };

    /**
     * Handle upload success
     */
    const handleUploadSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const countdown = getCountdown();

    // Loading
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
                <FiLoader className="w-10 h-10 text-blue-500 dark:text-blue-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/30 transition-colors">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors"
                >
                    <FiArrowLeft /> ย้อนกลับ
                </button>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <FiClipboard className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                        รอบตรวจความก้าวหน้า
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">ส่งไฟล์รายงานความก้าวหน้าตามรอบที่กำหนด</p>
                </div>

                {/* No Active Round */}
                {roundError && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-8 text-center transition-colors"
                    >
                        <FiAlertCircle className="w-12 h-12 text-amber-400 dark:text-amber-500 mx-auto mb-4" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">ไม่มีรอบตรวจที่เปิดรับไฟล์</h2>
                        <p className="text-gray-600 dark:text-gray-300">กรุณารอประกาศเปิดรับไฟล์ใหม่จากทางคณะ</p>
                    </motion.div>
                )}

                {/* Active Round Info */}
                {activeRound && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6 transition-colors"
                        >
                            {/* Round Header */}
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none flex-shrink-0">
                                    <FiClipboard className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{activeRound.title}</h2>
                                    <p className="text-gray-500 dark:text-gray-400 mt-1">{activeRound.description || `รอบที่ ${activeRound.roundNumber}`}</p>

                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                                            ภาคเรียน {activeRound.term}/{activeRound.academicYear}
                                        </span>
                                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium">
                                            รอบที่ {activeRound.roundNumber}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Date Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3 transition-colors">
                                    <FiCalendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">เริ่มต้น</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(activeRound.startDate)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3 transition-colors">
                                    <FiCalendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">สิ้นสุด</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(activeRound.endDate)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Countdown */}
                            {countdown && (
                                <div className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                  ${countdown.type === 'active' ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800' : ''}
                  ${countdown.type === 'waiting' ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800' : ''}
                  ${countdown.type === 'ended' ? 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800' : ''}
                `}>
                                    <FiClock className={`w-5 h-5
                    ${countdown.type === 'active' ? 'text-emerald-500 dark:text-emerald-400' : ''}
                    ${countdown.type === 'waiting' ? 'text-amber-500 dark:text-amber-400' : ''}
                    ${countdown.type === 'ended' ? 'text-red-500 dark:text-red-400' : ''}
                  `} />
                                    <span className={`font-medium
                    ${countdown.type === 'active' ? 'text-emerald-700 dark:text-emerald-300' : ''}
                    ${countdown.type === 'waiting' ? 'text-amber-700 dark:text-amber-300' : ''}
                    ${countdown.type === 'ended' ? 'text-red-700 dark:text-red-300' : ''}
                  `}>
                                        {countdown.text}
                                    </span>
                                </div>
                            )}
                        </motion.div>

                        {/* Owner Section: Group Select + Upload */}
                        {isOwner && isSubmissionAllowed() && !groupsLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6 transition-colors"
                            >
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                    <FiUploadCloud className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                                    ส่งไฟล์
                                </h3>

                                {/* Group Selector */}
                                {hasMultipleGroups && (
                                    <div className="mb-6">
                                        <GroupSelector
                                            groups={groups}
                                            selectedGroupId={selectedGroupId}
                                            onSelect={setSelectedGroupId}
                                        />
                                    </div>
                                )}

                                {/* Single group info */}
                                {!hasMultipleGroups && groups.length === 1 && (
                                    <div className="mb-6">
                                        <GroupSelector
                                            groups={groups}
                                            selectedGroupId={groups[0].groupId}
                                            onSelect={() => { }}
                                        />
                                    </div>
                                )}

                                {/* Upload Form */}
                                {selectedGroupId && (
                                    <SubmissionUploadForm
                                        groupId={selectedGroupId}
                                        inspectionId={activeRound.inspectionId}
                                        onSuccess={handleUploadSuccess}
                                    />
                                )}

                                {/* No group selected message */}
                                {!selectedGroupId && hasMultipleGroups && (
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                        <FiInfo className="w-4 h-4" />
                                        <span>กรุณาเลือกกลุ่มเพื่อส่งไฟล์</span>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Not Owner Message */}
                        {!isOwner && !groupsLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-6 mb-6 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <FiInfo className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-medium text-blue-900 dark:text-blue-200">คุณไม่ได้เป็นหัวหน้ากลุ่ม</h3>
                                        <p className="text-blue-700 dark:text-blue-300 mt-1 text-sm">
                                            เฉพาะหัวหน้ากลุ่ม (Owner) เท่านั้นที่สามารถส่งไฟล์ได้
                                            กรุณาติดต่อหัวหน้ากลุ่มของคุณ หรือหากคุณยังไม่มีกลุ่ม กรุณาสร้างกลุ่มใหม่
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Submission History */}
                        {selectedGroupId && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
                            >
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                    <FiFileText className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                                    ประวัติการส่งไฟล์
                                </h3>
                                <SubmissionList
                                    groupId={selectedGroupId}
                                    refreshTrigger={refreshTrigger}
                                />
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default InspectionRoundPage;