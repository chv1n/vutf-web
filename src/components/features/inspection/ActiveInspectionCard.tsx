// src/components/features/inspection/ActiveInspectionCard.tsx
// Card แสดง Active Inspection Round

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClipboard, FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi';
import { InspectionRound } from '@/types/inspection';

interface ActiveInspectionCardProps {
    /** ข้อมูล Inspection Round */
    round: InspectionRound;
    /** ขนาด card */
    size?: 'sm' | 'md' | 'lg';
}

/**
 * ActiveInspectionCard - แสดง Active Inspection Round
 * * Features:
 * - แสดง title, term/year
 * - แสดง start/end date
 * - Countdown แสดงเวลาที่เหลือ
 * - Click to navigate
 */
export const ActiveInspectionCard: React.FC<ActiveInspectionCardProps> = ({
    round,
    size = 'md',
}) => {
    const navigate = useNavigate();

    /**
     * Format date
     */
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    /**
     * Calculate countdown
     */
    const countdown = useMemo(() => {
        const now = new Date();
        const end = new Date(round.endDate);
        const start = new Date(round.startDate);

        // ถ้ายังไม่ถึงเวลาเริ่ม
        if (now < start) {
            const diff = start.getTime() - now.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            return {
                type: 'waiting' as const,
                text: `เริ่มใน ${days > 0 ? `${days} วัน ` : ''}${hours} ชั่วโมง`,
            };
        }

        // ถ้าอยู่ในช่วงเวลา
        if (now >= start && now <= end) {
            const diff = end.getTime() - now.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            return {
                type: 'active' as const,
                text: `เหลือเวลา ${days > 0 ? `${days} วัน ` : ''}${hours} ชั่วโมง`,
            };
        }

        // หมดเวลา
        return {
            type: 'ended' as const,
            text: 'หมดเวลาส่งแล้ว',
        };
    }, [round.startDate, round.endDate]);

    /**
     * Handle click
     */
    const handleClick = () => {
        navigate('/student/inspections');
    };

    const sizeClasses = {
        sm: 'p-4',
        md: 'p-5',
        lg: 'p-6',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleClick}
            className={`
        bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700
        dark:from-blue-600 dark:via-blue-700 dark:to-indigo-800
        rounded-2xl shadow-xl shadow-blue-200 dark:shadow-blue-900/30 cursor-pointer
        hover:shadow-2xl hover:shadow-blue-300 dark:hover:shadow-blue-900/50 hover:-translate-y-1
        transition-all duration-300 overflow-hidden relative
        ${sizeClasses[size]}
      `}
        >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <FiClipboard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-white/70 text-xs uppercase tracking-wider">รอบตรวจที่เปิดรับไฟล์</p>
                            <h3 className="text-white font-bold text-lg leading-tight">
                                {round.title}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                        <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                            {round.term}/{round.academicYear}
                        </span>
                        <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                            รอบที่ {round.roundNumber}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-white/70 text-sm">
                        <FiCalendar className="w-4 h-4" />
                        <span>{formatDate(round.startDate)} - {formatDate(round.endDate)}</span>
                    </div>
                </div>

                {/* Countdown */}
                <div className="flex items-center justify-between">
                    <div className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
            ${countdown.type === 'active' ? 'bg-emerald-500/30 text-emerald-100' : ''}
            ${countdown.type === 'waiting' ? 'bg-amber-500/30 text-amber-100' : ''}
            ${countdown.type === 'ended' ? 'bg-red-500/30 text-red-100' : ''}
          `}>
                        <FiClock className="w-4 h-4" />
                        {countdown.text}
                    </div>

                    <div className="flex items-center gap-1 text-white/80 text-sm font-medium">
                        <span>ส่งไฟล์</span>
                        <FiArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ActiveInspectionCard;