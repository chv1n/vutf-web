// src/components/features/instructor/submission-detail/GroupMembersCard.tsx
import React from 'react';
import { FiUsers } from 'react-icons/fi';
import { GroupMember } from '@/types/submission';

interface Props {
  members: GroupMember[];
}

export const GroupMembersCard: React.FC<Props> = ({ members }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FiUsers className="text-indigo-500" /> สมาชิกในกลุ่ม
      </h3>
      <div className="space-y-4">
        {members && members.length > 0 ? (
          members.map((member) => {
            const isOwner = member.role?.toLowerCase() === 'owner';

            return (
              <div key={member.studentId} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                
                {/* Avatar */}
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold overflow-hidden border shadow-sm ${
                  isOwner 
                    ? 'bg-indigo-100 text-indigo-600 border-indigo-200' 
                    : 'bg-gray-100 text-gray-500 border-gray-200'
                }`}>
                  {member.avatarUrl ? (
                    <img src={member.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    member.firstName.charAt(0)
                  )}
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {member.firstName} {member.lastName}
                    </p>
                    
                    {isOwner && (
                      <span className="shrink-0 text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 font-semibold shadow-sm">
                        ผู้ส่งงาน
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                      {member.studentCode || '-'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-400 text-center italic py-4">ไม่พบข้อมูลสมาชิกในกลุ่ม</p>
        )}
      </div>
    </div>
  );
};