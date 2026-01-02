// src/services/thesis-group.service.ts
// Service สำหรับจัดการ Thesis Group APIs

import { api } from './api';
import {
    CreateThesisGroupPayload,
    CreateThesisGroupResponse,
    ThesisGroup,
} from '@/types/thesis';

/**
 * ThesisGroupService - จัดการ API เกี่ยวกับกลุ่มวิทยานิพนธ์
 * 
 * Responsibilities:
 * - สร้างกลุ่มวิทยานิพนธ์ใหม่
 * - ดึงข้อมูลกลุ่มวิทยานิพนธ์
 */
export const thesisGroupService = {
    /**
     * สร้างกลุ่มวิทยานิพนธ์พร้อมข้อมูลทั้งหมด
     * 
     * @param payload - ข้อมูลสำหรับสร้างกลุ่ม (thesis, members, advisors)
     * @returns Promise<CreateThesisGroupResponse>
     * 
     * @throws Error เมื่อ:
     * - 400: Validation errors หรือ Student UUID ไม่ถูกต้อง
     * - 401: Unauthorized (ไม่มี token หรือ token หมดอายุ)
     * - 404: Owner not found
     * - 409: Thesis code ซ้ำ
     */
    createThesisGroup: async (
        payload: CreateThesisGroupPayload
    ): Promise<CreateThesisGroupResponse> => {
        const response = await api.post<CreateThesisGroupResponse>(
            '/thesis-group',
            payload
        );
        return response.data;
    },

    /**
     * ดึงรายการกลุ่มวิทยานิพนธ์ของผู้ใช้ปัจจุบัน
     * 
     * @returns Promise<ThesisGroup[]>
     */
    getMyThesisGroups: async (): Promise<ThesisGroup[]> => {
        const response = await api.get<{ data: ThesisGroup[] }>('/thesis-group/my-groups');
        return response.data;
    },

    /**
     * ดึงข้อมูลกลุ่มวิทยานิพนธ์ตาม ID
     * 
     * @param groupId - รหัสกลุ่ม
     * @returns Promise<ThesisGroup>
     */
    getThesisGroupById: async (groupId: string): Promise<ThesisGroup> => {
        const response = await api.get<{ data: ThesisGroup }>(`/thesis-group/${groupId}`);
        return response.data;
    },
};

export default thesisGroupService;
