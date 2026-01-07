// src/services/group-member.service.ts
// Service สำหรับจัดการ Group Member APIs

import { api } from './api';
import {
    GroupMember,
    ThesisGroup,
    InvitationStatus,
    UpdateInvitationStatusPayload,
    UpdateInvitationStatusResponse,
    InvitationCardData,
} from '@/types/thesis';

/**
 * GroupMemberService - จัดการ API เกี่ยวกับสมาชิกกลุ่ม
 * 
 * Responsibilities:
 * - อัปเดตสถานะคำเชิญ (ตอบรับ/ปฏิเสธ)
 * - ดึงรายการคำเชิญ
 */
export const groupMemberService = {
    /**
     * อัปเดตสถานะการตอบรับคำเชิญ
     * 
     * @param memberId - รหัสสมาชิก (member_id)
     * @param status - สถานะใหม่ ('approved' หรือ 'rejected')
     * @returns Promise<UpdateInvitationStatusResponse>
     * 
     * @throws Error เมื่อ:
     * - 400: Student not found หรือ Member not found
     * - 400: Status must be approved or rejected
     * - 401: Unauthorized
     * - 500: Update failed
     */
    updateInvitationStatus: async (
        memberId: string,
        status: InvitationStatus.APPROVED | InvitationStatus.REJECTED
    ): Promise<UpdateInvitationStatusResponse> => {
        const payload: UpdateInvitationStatusPayload = {
            invitation_status: status,
        };

        const response = await api.patch<UpdateInvitationStatusResponse>(
            `/group-member/${memberId}/invitation-status`,
            payload
        );
        return response;
    },

    /**
     * ตอบรับคำเชิญ (Helper function)
     * 
     * @param memberId - รหัสสมาชิก
     */
    acceptInvitation: async (
        memberId: string
    ): Promise<UpdateInvitationStatusResponse> => {
        return groupMemberService.updateInvitationStatus(
            memberId,
            InvitationStatus.APPROVED
        );
    },

    /**
     * ปฏิเสธคำเชิญ (Helper function)
     * 
     * @param memberId - รหัสสมาชิก
     */
    rejectInvitation: async (
        memberId: string
    ): Promise<UpdateInvitationStatusResponse> => {
        return groupMemberService.updateInvitationStatus(
            memberId,
            InvitationStatus.REJECTED
        );
    },

    /**
     * ดึงรายการคำเชิญของผู้ใช้ปัจจุบัน
     * 
     * @returns Promise<InvitationCardData[]>
     */
    getMyInvitations: async (): Promise<InvitationCardData[]> => {
        const response = await api.get<{ data: InvitationCardData[] }>(
            '/group-member/my-invitations'
        );
        return response.data;
    },

    /**
     * ดึงรายการคำเชิญที่รอตอบรับ (status = pending)
     * 
     * @returns Promise<InvitationCardData[]>
     */
    getPendingInvitations: async (): Promise<InvitationCardData[]> => {
        const response = await api.get<{ data: InvitationCardData[] }>(
            '/group-member/my-invitations',
            { status: 'pending' }
        );
        return response.data;
    },

    /**
     * ดึงข้อมูลสมาชิกตาม ID
     * 
     * @param memberId - รหัสสมาชิก
     * @returns Promise<GroupMember>
     */
    getMemberById: async (memberId: string): Promise<GroupMember> => {
        const response = await api.get<{ data: GroupMember }>(
            `/group-member/${memberId}`
        );
        return response.data;
    },

    /**
     * ดึงรายการกลุ่มของผู้ใช้ปัจจุบัน
     * 
     * @returns Promise<ThesisGroup[]>
     */
    getMyGroups: async (): Promise<ThesisGroup[]> => {
        const response = await api.get<{ data: ThesisGroup[] }>(
            '/group-member/my-group'
        );
        return response.data;
    },

    /**
     * เชิญสมาชิกใหม่เข้ากลุ่ม
     * 
     * @param groupId - รหัสกลุ่ม
     * @param studentUuid - รหัสนักศึกษา
     * @returns Promise<GroupMember>
     */
    inviteMember: async (groupId: string, studentUuid: string): Promise<GroupMember> => {
        const response = await api.post<GroupMember>(
            `/group-member`,
            { group_id: groupId, student_uuid: studentUuid, role: 'member' }
        );
        return response.data;
    },
};

export default groupMemberService;
