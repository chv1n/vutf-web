// src/components/features/instructor/submission-detail/ActionCard.tsx
import React from 'react';
import { SubmissionStatus } from '@/types/submission';

interface Props {
  status: SubmissionStatus;
}

export const ActionCard: React.FC<Props> = ({ status }) => {
  if (status !== 'PENDING') return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">การดำเนินการ</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        *ปุ่ม Verify จะถูกเพิ่มในภายหลัง
      </p>
    </div>
  );
};