import { useState, useEffect, useRef } from 'react';
import {
  FiEdit2,
  FiTrash2,
  FiMoreHorizontal,
  FiEye,
  FiUser,
  FiInbox,
  FiLayers,
  FiUsers,
  FiRefreshCw,
  FiMail,
  FiActivity,
  FiSettings,
  FiHash,
} from 'react-icons/fi';
import { User } from '../../../../types/user';

interface UserTableProps {
  data: User[];
  role: 'student' | 'instructor';
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onDetail: (user: User) => void;
  onRefresh?: () => void;
}

export const UserTable = ({ data, role, isLoading, onEdit, onDelete, onDetail, onRefresh }: UserTableProps) => {
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // ปิดเมนูเมื่อคลิกข้างนอก
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

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center gap-3 animate-pulse">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm font-medium">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  // --- Empty State ---
  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
          <FiInbox size={32} />
        </div>
        <div>
          <h3 className="text-gray-800 font-semibold">ไม่พบข้อมูล</h3>
          <p className="text-gray-500 text-sm mt-1">ลองเปลี่ยนคำค้นหา หรือตัวกรองข้อมูล</p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="mt-4 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            โหลดข้อมูลใหม่
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {/* ส่วนหัวตาราง*/}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          {/* Icon Box */}
          <div className={`p-2.5 rounded-xl ${role === 'student' ? 'bg-blue-50 text-blue-600' : 'bg-blue-50 text-blue-600'
            }`}>
            {role === 'student' ? <FiUser size={20} /> : <FiUsers size={20} />}
          </div>

          {/* Title & Count */}
          <div>
            <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
              {role === 'student' ? 'ข้อมูลนักศึกษา' : 'ข้อมูลอาจารย์'}
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                {data.length}
              </span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              รายชื่อ{role === 'student' ? 'นักศึกษา' : 'อาจารย์'}ทั้งหมดในระบบ
            </p>
          </div>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            title="รีเฟรชข้อมูล"
          >
            <FiRefreshCw size={20} />
          </button>
        )}
      </div>
      <div className="overflow-x-auto overflow-y-visible pb-24 sm:pb-0 min-h-[300px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs uppercase font-bold tracking-wider">
              <th className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <FiUser size={14} /> ชื่อ - นามสกุล
                </div>
              </th>
              <th className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <FiHash size={14} />
                  {role === 'student' ? 'รหัสนักศึกษา' : 'รหัสอาจารย์'}
                </div>
              </th>

              {role === 'student' && (
                <th className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <FiLayers size={14} /> กลุ่มเรียน
                  </div>
                </th>
              )}

              <th className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <FiMail size={14} /> อีเมล
                </div>
              </th>

              <th className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <FiActivity size={14} /> สถานะ
                </div>
              </th>

              <th className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <FiSettings size={14} /> จัดการ
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {data.map((item) => {
              const id = item.user_uuid;

              // Extract Data logic
              let name = '-';
              let code = '-';
              let sectionName = null;

              if (role === 'student' && item.student) {
                name = `${item.student.prefix_name || ''}${item.student.first_name} ${item.student.last_name}`;
                code = item.student.student_code;
                sectionName = item.student.section?.section_name;
              } else if (role === 'instructor' && item.instructor) {
                name = `${item.instructor.first_name} ${item.instructor.last_name}`;
                code = item.instructor.instructor_code;
              }

              const isOpen = openActionId === id;
              const firstChar = name !== '-' ? name.charAt(0) : '?';

              // Random avatar color based on name length (simple cosmetic)
              const colors = ['bg-blue-100 text-blue-600', 'bg-indigo-100 text-indigo-600', 'bg-purple-100 text-purple-600', 'bg-emerald-100 text-emerald-600'];
              const colorClass = colors[name.length % colors.length];

              return (
                <tr key={id} className="hover:bg-blue-50/30 transition-colors duration-150 group">

                  {/* Column 1: Name & Avatar */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${colorClass}`}>
                        {firstChar}
                      </div>
                      <div>
                        <div className="text-sm text-gray-800">{name}</div>
                        {/* Mobile view only: show email below name */}
                        <div className="text-xs text-gray-400 sm:hidden">{item.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Code */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100 text-xs">
                      {code}
                    </span>
                  </td>

                  {/* Column 3: Section (Student Only) */}
                  {role === 'student' && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sectionName ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {sectionName}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-sm">-</span>
                      )}
                    </td>
                  )}

                  {/* Column 4: Email */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                    {item.email}
                  </td>

                  {/* Column 5: Status */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${item.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      {item.isActive ? 'ใช้งานปกติ' : 'ถูกระงับ'}
                    </span>
                  </td>

                  {/* Column 6: Action */}
                  <td className="px-6 py-4 whitespace-nowrap text-center relative">
                    <button
                      onClick={(e) => handleToggleMenu(id, e)}
                      className={`p-2 rounded-lg transition-all duration-200 outline-none
                        ${isOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}
                      `}
                    >
                      <FiMoreHorizontal size={20} />
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                      <div
                        ref={menuRef}
                        className="absolute right-8 top-8 w-44 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right"
                      >
                        <div className="p-1">
                          <button
                            onClick={() => { onDetail(item); setOpenActionId(null); }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg flex items-center gap-2.5 transition-colors"
                          >
                            <FiEye size={16} className="text-gray-400" /> ดูรายละเอียด
                          </button>

                          <button
                            onClick={() => { onEdit(item); setOpenActionId(null); }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-600 rounded-lg flex items-center gap-2.5 transition-colors"
                          >
                            <FiEdit2 size={16} className="text-gray-400" /> แก้ไขข้อมูล
                          </button>

                          <div className="h-px bg-gray-100 my-1 mx-2"></div>

                          <button
                            onClick={() => { onDelete(id); setOpenActionId(null); }}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2.5 transition-colors group/del"
                          >
                            <FiTrash2 size={16} className="text-red-400 group-hover/del:text-red-600" />
                            {item.isActive ? 'ระงับการใช้งาน' : 'ลบออกจากระบบ'}
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
    </div>
  );
};