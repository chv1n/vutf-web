// src/services/submission.service.ts
// Service สำหรับจัดการ Submission API

import { api } from './api';
import type { Submission, SubmissionFileUrl } from '@/types/submission';

/**
 * Submission Service
 * 
 * Single Responsibility: จัดการ API calls สำหรับ Submission
 * 
 * Methods:
 * - createSubmission: ส่งไฟล์ (OWNER only)
 * - getByGroup: ดู submissions ของกลุ่ม
 * - getById: ดู submission by ID
 * - getFileUrl: Get download URL (presigned)
 */
export const submissionService = {
    /**
     * ส่งไฟล์ Submission (OWNER only)
     * 
     * @param data - ข้อมูลสำหรับสร้าง submission
     * @returns Promise<Submission>
     */
    async createSubmission(data: {
        file: File;
        inspectionId: number;
        groupId: string;
    }): Promise<Submission> {
        const formData = new FormData();
        formData.append('file', data.file);
        formData.append('inspectionId', String(data.inspectionId));
        formData.append('groupId', data.groupId);

        return api.postFormData<Submission>('/submissions', formData);
    },

    /**
     * ดู submissions ของกลุ่ม
     * 
     * @param groupId - ID ของกลุ่ม
     * @returns Promise<Submission[]>
     */
    async getByGroup(groupId: string): Promise<Submission[]> {
        const response = await api.get<{ data: Submission[] }>(`/submissions/group/${groupId}`);
        return response.data || [];
    },

    /**
     * ดู submission by ID
     * 
     * @param id - Submission ID
     * @returns Promise<Submission>
     */
    async getById(id: number): Promise<Submission> {
        return api.get<Submission>(`/submissions/${id}`);
    },

    /**
     * Get download URL (presigned)
     * URL มีอายุ 1 ชั่วโมง
     * 
     * @param id - Submission ID
     * @returns Promise<SubmissionFileUrl>
     */
    async getFileUrl(id: number): Promise<SubmissionFileUrl> {
        return api.get<SubmissionFileUrl>(`/submissions/${id}/file`);
    },
};
