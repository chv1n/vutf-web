import { useState, useEffect, useRef } from 'react';
import { FiEdit2, FiTrash2, FiMoreHorizontal, FiLayers, FiInbox, FiRefreshCw, FiSettings, FiCalendar, FiUsers, } from 'react-icons/fi';
import { ClassSection } from '../../../../types/class-section';

interface Props {
  data: ClassSection[];
  isLoading: boolean;
  onEdit: (item: ClassSection) => void;
  onDelete: (id: number) => void;
  onRefresh?: () => void;
}

export const SectionTable = ({ data, isLoading, onEdit, onDelete, onRefresh }: Props) => {
  const [openActionId, setOpenActionId] = useState<number | null>(null);
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

  const handleToggleMenu = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenActionId(prev => prev === id ? null : id);
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center gap-3 animate-pulse">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
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
          <h3 className="text-gray-800 font-semibold">ไม่พบข้อมูลกลุ่มเรียน</h3>
          <p className="text-gray-500 text-sm mt-1">ลองเพิ่มกลุ่มเรียนใหม่ หรือเปลี่ยนเงื่อนไขการค้นหา</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">

      {/* ส่วนหัวตาราง */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <FiLayers size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
              ข้อมูลกลุ่มเรียน
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                {data.length}
              </span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              จัดการรายชื่อกลุ่มเรียน ปีการศึกษา และเทอม
            </p>
          </div>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
            title="รีเฟรชข้อมูล"
          >
            <FiRefreshCw size={20} />
          </button>
        )}
      </div>

      {/* ตารางข้อมูล */}
      <div className="overflow-x-auto overflow-y-visible pb-24 sm:pb-0 min-h-[300px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs uppercase font-bold tracking-wider">
              <th className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <FiCalendar size={14} /> ปีการศึกษา / เทอม
                </div>
              </th>

              <th className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <FiUsers size={14} /> ชื่อกลุ่มเรียน
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
              const id = item.section_id;
              const isOpen = openActionId === id;

              return (
                <tr key={id} className="hover:bg-indigo-50/30 transition-colors duration-150 group">

                  {/* Column 1: Year/Term */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-gray-600 shadow-sm">
                        {item.academic_year}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.term === '1' ? 'bg-green-50 text-green-700 border-green-100' :
                        item.term === '2' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          'bg-orange-50 text-orange-700 border-orange-100'
                        }`}>
                        เทอม {item.term} {item.term === '3' && '(Summer)'}
                      </span>
                    </div>
                  </td>

                  {/* Column 2: Section Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-700 text-sm">
                      {item.section_name}
                    </span>
                  </td>

                  {/* Column 3: Action Dropdown */}
                  <td className="px-6 py-4 whitespace-nowrap text-center relative">
                    <button
                      onClick={(e) => handleToggleMenu(id, e)}
                      className={`p-2 rounded-lg transition-all duration-200 outline-none
                        ${isOpen ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}
                      `}
                    >
                      <FiMoreHorizontal size={20} />
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                      <div
                        ref={menuRef}
                        className="absolute right-8 top-8 w-40 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right"
                      >
                        <div className="p-1">
                          <button
                            onClick={() => { onEdit(item); setOpenActionId(null); }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-lg flex items-center gap-2.5 transition-colors"
                          >
                            <FiEdit2 size={16} className="text-gray-400" /> แก้ไข
                          </button>

                          <div className="h-px bg-gray-100 my-1 mx-2"></div>

                          <button
                            onClick={() => { onDelete(id); setOpenActionId(null); }}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2.5 transition-colors group/del"
                          >
                            <FiTrash2 size={16} className="text-red-400 group-hover/del:text-red-600" />
                            ลบข้อมูล
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