// src/pages/student/InspectionRoundPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiLoader, FiClipboard, FiUploadCloud, FiFileText, FiInfo } from 'react-icons/fi';
import { useTitle } from '@/hooks/useTitle';
import { useOwnerGroups } from '@/hooks/useOwnerGroups';
import { inspectionService } from '@/services/inspection.service';
import { InspectionRound } from '@/types/inspection';

// Components
import { GroupSelector } from '@/components/features/submission/GroupSelector';
import { SubmissionUploadForm, SubmissionList } from '@/components/features/submission';
import { RoundSelector } from '@/components/features/inspection/RoundSelector';
import { ActiveRoundInfo } from '@/components/features/inspection/ActiveRoundInfo';
import { NoGroupAlert, SelectGroupAlert, NoRoundAlert, NotOwnerAlert, ThesisPassedAlert } from '@/components/features/inspection/InspectionAlerts';

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
    const location = useLocation();
    const preSelectedRoundId = location.state?.selectedRoundId;

    // State
    const [availableRounds, setAvailableRounds] = useState<InspectionRound[]>([]);
    const [activeRound, setActiveRound] = useState<InspectionRound | null>(null);
    const [isLoadingRounds, setIsLoadingRounds] = useState(false);
    const [roundError, setRoundError] = useState<string | null>(null);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Hooks
    const { groups, loading: groupsLoading, isOwner, hasMultipleGroups } = useOwnerGroups();

    const selectedGroupData = groups.find(g => g.groupId === selectedGroupId);
    const isThesisPassed = selectedGroupData?.thesisStatus === 'PASSED';

    // Auto-select if single group
    useEffect(() => {
        if (groups.length === 1 && !selectedGroupId) {
            setSelectedGroupId(groups[0].groupId);
        }
    }, [groups, selectedGroupId]);

    const fetchAvailableRounds = useCallback(async (groupId: string) => {
        setIsLoadingRounds(true);
        try {
            const rounds = await inspectionService.getAvailableRoundsForGroup(groupId);
            setAvailableRounds(rounds);
            if (rounds.length > 0) {
                if (preSelectedRoundId) {
                    const foundRound = rounds.find(r => r.inspectionId === preSelectedRoundId);
                    setActiveRound(foundRound || rounds[0]);
                } else {
                    setActiveRound(rounds[0]);
                }
                setRoundError(null);
            } else {
                setActiveRound(null);
                setRoundError('ขณะนี้ยังไม่มีรอบการส่งงานที่เปิดรับสำหรับกลุ่มของคุณ');
            }
        } catch (error) {
            console.error('Error fetching available rounds:', error);
            setRoundError('เกิดข้อผิดพลาดในการดึงข้อมูลรอบส่งงาน');
            setActiveRound(null);
            setAvailableRounds([]);
        } finally {
            setIsLoadingRounds(false);
        }
    }, [preSelectedRoundId]);

    useEffect(() => {
        if (selectedGroupId) {
            fetchAvailableRounds(selectedGroupId);
        } else {
            setActiveRound(null);
            setAvailableRounds([]);
            setRoundError(null);
        }
    }, [selectedGroupId, fetchAvailableRounds]);

    const isSubmissionAllowed = useCallback(() => {
        if (!activeRound) return false;
        if (activeRound.status !== 'OPEN' || !activeRound.isActive) return false;
        const now = new Date();
        const start = new Date(activeRound.startDate);
        const end = new Date(activeRound.endDate);
        return now >= start && now <= end;
    }, [activeRound]);

    const handleUploadSuccess = () => setRefreshTrigger(prev => prev + 1);

    if (groupsLoading) {
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

                {!groupsLoading && groups.length === 0 && <NoGroupAlert />}

                {/* 1. Group Selector */}
                {hasMultipleGroups && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6 transition-colors"
                    >
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            เลือกกลุ่มโครงงาน
                        </h3>
                        <GroupSelector
                            groups={groups}
                            selectedGroupId={selectedGroupId}
                            onSelect={setSelectedGroupId}
                        />
                    </motion.div>
                )}

                {/* Single group info (ซ่อน selector ถ้ามีกลุ่มเดียว) */}
                {!hasMultipleGroups && groups.length === 1 && (
                    <div className="mb-6">
                        <GroupSelector
                            groups={groups}
                            selectedGroupId={groups[0].groupId}
                            onSelect={() => { }}
                        />
                    </div>
                )}

                {/* No group selected message */}
                {!selectedGroupId && hasMultipleGroups && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-8 text-center mb-6 transition-colors"
                    >
                        <FiInfo className="w-12 h-12 text-blue-400 dark:text-blue-500 mx-auto mb-4" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">กรุณาเลือกกลุ่มโครงงาน</h2>
                        <p className="text-gray-600 dark:text-gray-300">เพื่อตรวจสอบรอบส่งงานที่เปิดรับสำหรับกลุ่มของคุณ</p>
                    </motion.div>
                )}

                {/* Loading Rounds Spinner */}
                {isLoadingRounds && selectedGroupId && (
                    <div className="flex justify-center py-12">
                        <FiLoader className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                )}

                {/* 2. No Active Round Error */}
                {!isLoadingRounds && selectedGroupId && availableRounds.length === 0 && (
                    isThesisPassed ? (
                        <ThesisPassedAlert />
                    ) : (
                        roundError && <NoRoundAlert error={roundError} />
                    )
                )}

                {/* 3. Multiple Rounds Dropdown */}
                {!isLoadingRounds && selectedGroupId && availableRounds.length > 1 && (
                    <RoundSelector
                        availableRounds={availableRounds}
                        activeRound={activeRound}
                        onSelect={setActiveRound}
                    />
                )}

                {/* 4. Active Round Info & Upload */}
                {!isLoadingRounds && activeRound && selectedGroupId && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6 transition-colors"
                        >
                            <ActiveRoundInfo activeRound={activeRound} />
                        </motion.div>

                        {/* Owner Section: Upload */}
                        {isOwner && isSubmissionAllowed() && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6 transition-colors"
                            >
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                    <FiUploadCloud className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                                    ส่งไฟล์
                                </h3>
                                <SubmissionUploadForm
                                    groupId={selectedGroupId}
                                    inspectionId={activeRound.inspectionId}
                                    onSuccess={handleUploadSuccess}
                                />
                            </motion.div>
                        )}

                        {/* Not Owner Message */}
                        {!isOwner && <NotOwnerAlert />}

                        {/* Submission History */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
                        >
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                <FiFileText className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                                ประวัติการส่งไฟล์
                            </h3>
                            <SubmissionList
                                groupId={selectedGroupId}
                                inspectionId={activeRound.inspectionId}
                                refreshTrigger={refreshTrigger}
                            />
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
};

export default InspectionRoundPage;