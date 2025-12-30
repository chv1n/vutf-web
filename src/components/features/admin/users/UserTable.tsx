// src/components/features/admin/users/UserTable.tsx
import { useState, useEffect, useRef } from 'react';
import { FiEdit2, FiTrash2, FiMoreHorizontal, FiEye } from 'react-icons/fi';
import { User } from '../../../../types/user';

interface UserTableProps {
  data: User[];
  role: 'student' | 'instructor';
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onDetail: (user: User) => void;
}

export const UserTable = ({ data, role, isLoading, onEdit, onDelete, onDetail }: UserTableProps) => {
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
    e.stopPropagation();
    setOpenActionId(prev => prev === id ? null : id);
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!data || data.length === 0) return <div className="p-8 text-center text-gray-500">No data found</div>;

  return (
    <div className="overflow-x-visible bg-white rounded-xl shadow-sm border border-gray-100 pb-20 sm:pb-0"> 
      {/* เพิ่ม pb เพื่อกัน Dropdown ตกขอบล่างถ้ามี */}
      
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
            const id = item.user_uuid;
            
            // Logic การดึงข้อมูลแยกตาม Role
            let name = '-';
            let code = '-';

            if (role === 'student' && item.student) {
                name = `${item.student.prefix_name || ''}${item.student.first_name} ${item.student.last_name}`;
                code = item.student.student_code;
            } else if (role === 'instructor' && item.instructor) {
                // Backend ส่ง snake_case มา
                name = `${item.instructor.first_name} ${item.instructor.last_name}`;
                code = item.instructor.instructor_code;
            }

            const isOpen = openActionId === id;

            return (
              <tr key={id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold uppercase">
                      {name !== '-' ? name.charAt(0) : '?'}
                    </div>
                    {name}
                  </div>
                </td>
                <td className="p-4 text-gray-600 font-mono">{code}</td>
                <td className="p-4 text-gray-600">{item.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>

                {/* Action Column */}
                <td className="p-4 text-center relative">
                  <button
                    onClick={(e) => handleToggleMenu(id, e)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
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
                          className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 font-medium cursor-pointer"
                        >
                          <FiEdit2 size={16} /> Edit
                        </button>

                        <button
                          onClick={() => { onDelete(id); setOpenActionId(null); }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium cursor-pointer"
                        >
                          <FiTrash2 size={16} /> Delete
                        </button>

                        <button
                          onClick={() => { onDetail(item); setOpenActionId(null); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 font-medium cursor-pointer"
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