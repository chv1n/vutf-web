import React from 'react';

const STATUS_CONFIG = {
  PENDING: { color: 'bg-gray-100 text-gray-700', label: 'รอตรวจสอบ' },
  IN_PROGRESS: { color: 'bg-yellow-100 text-yellow-700', label: 'กำลังดำเนินการ' },
  COMPLETED: { color: 'bg-green-100 text-green-700', label: 'ตรวจแล้ว' },
};

export const StatusBadge: React.FC<{ status: keyof typeof STATUS_CONFIG }> = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};