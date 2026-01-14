// src/components/features/instructor/submission-detail/ActionCard.tsx
import React from 'react';
import { SubmissionStatus } from '@/types/submission';

interface Props {
  status: SubmissionStatus;
}

export const ActionCard: React.FC<Props> = ({ status }) => {
  if (status !== 'PENDING') return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">การดำเนินการ</h3>
      <p className="text-sm text-gray-500 mb-4">
        *ปุ่ม Verify จะถูกเพิ่มในภายหลัง
      </p>
    </div>
  );
};