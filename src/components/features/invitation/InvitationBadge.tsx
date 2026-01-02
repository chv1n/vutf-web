// src/components/features/invitation/InvitationBadge.tsx
// Badge แสดงสถานะคำเชิญ

import React from 'react';
import { InvitationStatus } from '@/types/thesis';
import { FiClock, FiCheck, FiX } from 'react-icons/fi';

interface InvitationBadgeProps {
    /** สถานะคำเชิญ */
    status: InvitationStatus;
    /** ขนาดของ badge */
    size?: 'sm' | 'md' | 'lg';
}

/**
 * InvitationBadge - Badge แสดงสถานะคำเชิญ
 * 
 * Single Responsibility: แสดงสถานะคำเชิญด้วย style ที่เหมาะสม
 * Open/Closed: extend ได้ผ่าน props (size, status)
 * 
 * Status colors:
 * - pending: yellow/orange
 * - approved: green
 * - rejected: red
 */
export const InvitationBadge: React.FC<InvitationBadgeProps> = ({
    status,
    size = 'md',
}) => {
    // Configuration ตาม status
    const statusConfig = {
        [InvitationStatus.PENDING]: {
            bgColor: 'bg-amber-100',
            textColor: 'text-amber-700',
            borderColor: 'border-amber-200',
            icon: FiClock,
            label: 'รอตอบรับ',
        },
        [InvitationStatus.APPROVED]: {
            bgColor: 'bg-emerald-100',
            textColor: 'text-emerald-700',
            borderColor: 'border-emerald-200',
            icon: FiCheck,
            label: 'ตอบรับแล้ว',
        },
        [InvitationStatus.REJECTED]: {
            bgColor: 'bg-red-100',
            textColor: 'text-red-700',
            borderColor: 'border-red-200',
            icon: FiX,
            label: 'ปฏิเสธแล้ว',
        },
    };

    // Size configuration
    const sizeConfig = {
        sm: {
            padding: 'px-2 py-0.5',
            fontSize: 'text-xs',
            iconSize: 'w-3 h-3',
            gap: 'gap-1',
        },
        md: {
            padding: 'px-3 py-1',
            fontSize: 'text-sm',
            iconSize: 'w-4 h-4',
            gap: 'gap-1.5',
        },
        lg: {
            padding: 'px-4 py-1.5',
            fontSize: 'text-base',
            iconSize: 'w-5 h-5',
            gap: 'gap-2',
        },
    };

    const config = statusConfig[status];
    const sizing = sizeConfig[size];
    const Icon = config.icon;

    return (
        <span
            className={`
        inline-flex items-center ${sizing.gap} ${sizing.padding}
        ${config.bgColor} ${config.textColor}
        border ${config.borderColor}
        rounded-full font-medium ${sizing.fontSize}
        transition-all duration-200
      `}
        >
            <Icon className={sizing.iconSize} />
            {config.label}
        </span>
    );
};

export default InvitationBadge;
