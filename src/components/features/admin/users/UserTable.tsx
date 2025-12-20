// src/components/features/admin/users/UserTable.tsx
import { useState, useEffect, useRef } from 'react';
import { FiEdit2, FiTrash2, FiMoreHorizontal, FiEye } from 'react-icons/fi';
import { User, InstructorProfile } from '../../../../types/user';

interface UserTableProps {
  data: (User | InstructorProfile)[];
  role: 'student' | 'instructor';
  isLoading: boolean;
  onEdit: (user: any) => void;
  onDelete: (id: string) => void;
  onDetail: (user: any) => void;
}

export const UserTable = ({ data, role, isLoading, onEdit, onDelete, onDetail }: UserTableProps) => {
  // State สำหรับเก็บว่า ID ไหนกำลังเปิดเมนูอยู่
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // Ref สำหรับตรวจสอบการคลิกนอกพื้นที่ (Click Outside)
  const menuRef = useRef<HTMLDivElement>(null);

  // Effect: ปิดเมนูเมื่อคลิกที่อื่น
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenActionId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // ป้องกันไม่ให้ event ทะลุไปถึง document
    setOpenActionId(prev => prev === id ? null : id);
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!data || data.length === 0) return <div className="p-8 text-center text-gray-500">No data found</div>;

  return (
    <div className="overflow-x-visible bg-white rounded-xl shadow-sm border border-gray-100 ">

      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">{role === 'student' ? 'Student ID' : 'Instructor ID'}</th>
            <th className="p-4">Email</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {data.map((item, index) => {
            // console.log('Row Data:', item);
            const isStudent = role === 'student';
            const studentItem = item as User;
            const instructorItem = item as InstructorProfile;

            const uuid = isStudent ? studentItem.user_uuid : instructorItem.instructor_uuid;
            const id = uuid || `row-${index}`;

            const name = isStudent
              ? `${studentItem.student?.first_name} ${studentItem.student?.last_name}`
              : `${instructorItem.firstName} ${instructorItem.lastName}`;

            const code = isStudent ? studentItem.student?.student_code : instructorItem.instructor_code;
            const email = isStudent ? studentItem.email : (instructorItem.email || '-');

            const isActive = isStudent
              ? studentItem.isActive
              : (instructorItem.hasAccount ? instructorItem.isActive ?? true : false);

            const hasAccount = isStudent ? true : instructorItem.hasAccount;

            const isOpen = openActionId === id;

            return (
              <tr key={id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      {name.charAt(0)}
                    </div>
                    {name}
                  </div>
                </td>
                <td className="p-4 text-gray-600 font-mono">{code}</td>
                <td className="p-4 text-gray-600">{email}</td>
                <td className="p-4">
                  {hasAccount ? (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                      No Account
                    </span>
                  )}
                </td>

                {/* Action Column */}
                <td className="p-4 text-center relative">
                  <button
                    onClick={(e) => handleToggleMenu(id, e)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FiMoreHorizontal size={20} />
                  </button>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div
                      ref={menuRef}
                      className="absolute right-8 top-8 w-40 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => { onEdit(item); setOpenActionId(null); }}
                          className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 font-medium"
                        >
                          <FiEdit2 size={16} /> Edit
                        </button>

                        <button
                          onClick={() => { onDelete(id); setOpenActionId(null); }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                        >
                          <FiTrash2 size={16} /> Delete
                        </button>

                        <button
                          onClick={() => { onDetail(item); setOpenActionId(null); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 font-medium"
                        >
                          <FiEye size={16} /> Detail
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};