// src/pages/instructor/SubmissionDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { submissionService } from '../../services/submission.service';
import { SubmissionDetail } from '../../types/submission';

import { SubmissionHeaderCard } from '../../components/features/instructor/submission-detail/SubmissionHeaderCard';
import { SubmissionFileCard } from '../../components/features/instructor/submission-detail/SubmissionFileCard';
import { SubmissionCommentCard } from '../../components/features/instructor/submission-detail/SubmissionCommentCard';
import { GroupMembersCard } from '../../components/features/instructor/submission-detail/GroupMembersCard';
import { ActionCard } from '../../components/features/instructor/submission-detail/ActionCard';
import { AdvisorCard } from '../../components/features/instructor/submission-detail/AdvisorCard';

export const SubmissionDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<SubmissionDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchDetail(Number(id));
    }, [id]);

    const fetchDetail = async (submissionId: number) => {
        try {
            setLoading(true);
            const res = await submissionService.getById(submissionId);
            setData(res);
        } catch (error) {
            console.error(error);
            alert('ไม่สามารถโหลดข้อมูลได้ หรือข้อมูลไม่ถูกต้อง');
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveComment = async (newComment: string) => {
        if (!data) return;
        try {
            await submissionService.updateComment(data.submissionId, newComment);
            // อัปเดต State หน้าจอทันทีโดยไม่ต้องโหลดใหม่
            setData(prev => prev ? { ...prev, comment: newComment } : null);
            // หรือถ้าอยากชัวร์ก็ fetchDetail(data.submissionId);
        } catch (error) {
            alert('บันทึกคอมเมนต์ไม่สำเร็จ');
            throw error; // ส่ง error กลับไปให้ Card รู้ว่า save ไม่ผ่าน
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500 dark:text-gray-400">กำลังโหลดข้อมูล...</div>;
    if (!data) return null;

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-6 transition-colors font-medium"
            >
                <FiArrowLeft /> ย้อนกลับ
            </button>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* === Left Column: Main Content === */}
                <div className="flex-1 space-y-6">
                    <SubmissionHeaderCard data={data} />

                    <SubmissionFileCard
                        fileName={data.fileName}
                        fileSize={data.fileSize}
                        fileUrl={data.fileUrl}
                    />

                    <SubmissionCommentCard
                        comment={data.comment}
                        onSave={handleSaveComment}
                    />
                </div>

                {/* === Right Column: Sidebar === */}
                <div className="w-full lg:w-[360px] space-y-6">
                    <GroupMembersCard members={data.groupMembers} />
                    
                    <AdvisorCard advisors={data.advisors} />

                    <ActionCard status={data.status} />
                </div>

            </div>
        </div>
    );
};