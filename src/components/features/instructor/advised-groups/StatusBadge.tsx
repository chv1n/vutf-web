// src/components/features/instructor/advised-groups/StatusBadge.tsx
import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Logic เลือกสีตามสถานะของ Thesis
  const getStatusStyle = (s: string) => {
    switch (s.toUpperCase()) {
      case 'PASSED':
      case 'APPROVED':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'FAILED':
      case 'REJECTED':
        return 'bg-red-100 text-red-700 border-red-200';
      default: 
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(status)}`}>
      {status}
    </span>
  );
};