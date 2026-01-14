// src/hooks/useOwnerGroups.ts
// Hook สำหรับ fetch กลุ่มที่ user เป็น Owner

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { groupMemberService } from '@/services/group-member.service';

interface OwnerGroup {
    groupId: string;
    thesisNameTh: string;
    thesisNameEn: string;
    thesisCode: string;
}

/**
 * useOwnerGroups Hook
 * 
 * Single Responsibility: Fetch กลุ่มที่ user เป็น Owner
 * 
 * Returns:
 * - groups: รายการกลุ่มที่เป็น Owner
 * - loading: สถานะการโหลด
 * - error: ข้อความ error
 * - refresh: function สำหรับ reload
 */
export function useOwnerGroups() {
    const { user } = useAuth();
    const [groups, setGroups] = useState<OwnerGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOwnerGroups = useCallback(async () => {
        console.log("----------------------------------------------------- start fetchOwnerGroup ")
        if (!user?.id) return;

        setLoading(true);
        setError(null);

        try {
            // Fetch กลุ่มทั้งหมดที่เป็นสมาชิก - returns ThesisGroup[]
            const myGroups = await groupMemberService.getMyGroups();


            // Filter เฉพาะที่เป็น Owner และ approved
            const ownerGroups: OwnerGroup[] = [];

            for (const group of myGroups) {
                // Check if current user is the creator (Owner) of this group
                // created_by can be string (user_uuid) or object { user_uuid: string }
                const creatorId = typeof group.created_by === 'object'
                    ? group.created_by?.user_uuid
                    : group.created_by;

                const isOwner = creatorId === user.id;

                console.log('Group:', group.group_id, 'Creator:', creatorId, 'User:', user.id, 'isOwner:', isOwner);

                if (isOwner) {
                    ownerGroups.push({
                        groupId: group.group_id,
                        thesisNameTh: group.thesis?.thesis_name_th || 'ไม่มีชื่อ',
                        thesisNameEn: group.thesis?.thesis_name_en || '-',
                        thesisCode: group.thesis?.thesis_code || '-',
                    });
                }
            }

            setGroups(ownerGroups);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'เกิดข้อผิดพลาดในการโหลดข้อมูลกลุ่ม';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchOwnerGroups();
    }, [fetchOwnerGroups]);

    return {
        groups,
        loading,
        error,
        refresh: fetchOwnerGroups,
        isOwner: groups.length > 0,
        hasMultipleGroups: groups.length > 1,
    };
}

export type { OwnerGroup };
