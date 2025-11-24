// src/pages/instructor/InstructorHome.tsx
import React, { useState } from 'react';
import { FiSearch, FiFileText, FiCheck, FiClock, FiAlertCircle, FiDownloadCloud, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// --- 1. Types & Mock Data ---
interface DocumentItem {
  id: string;
  fileName: string;
  fileSize: string;
  uploadedBy: { id: string; avatar: string };
  projectName: string;
  date: string;
  status: 'Passed' | 'Awaiting Review' | 'Needs Editing';
}

const MOCK_DATA: DocumentItem[] = [
  {
    id: '1',
    fileName: 'Venue and building reservation system',
    fileSize: 'Docx - 5.9 MB',
    uploadedBy: { id: '010000', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random' },
    projectName: 'Venue and building reservation system',
    date: '17 Dec 2024, 11:05:24',
    status: 'Passed',
  },
  {
    id: '2',
    fileName: 'Online Movie Ticket Booking System',
    fileSize: 'Docx - 5.9 MB',
    uploadedBy: { id: '020000', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random' },
    projectName: 'Online Movie Ticket Booking System',
    date: '16 Dec 2024, 11:05:24',
    status: 'Awaiting Review',
  },
  {
    id: '3',
    fileName: 'Online Sales System',
    fileSize: 'Docx - 5.8 MB',
    uploadedBy: { id: '030000', avatar: 'https://ui-avatars.com/api/?name=Mike+Ross&background=random' },
    projectName: 'Online Sales System',
    date: '16 Dec 2024, 12:05:24',
    status: 'Needs Editing',
  },
   {
    id: '4',
    fileName: 'Venue and building reservation system',
    fileSize: 'Docx - 5.9 MB',
    uploadedBy: { id: '040000', avatar: 'https://ui-avatars.com/api/?name=Sarah+C&background=random' },
    projectName: 'Venue and building reservation system',
    date: '17 Dec 2024, 11:05:24',
    status: 'Passed',
  },
];

// --- 2. Component ---
export const InstructorHome = () => {
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Helper สำหรับเลือกสีตามสถานะ
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Passed':
        return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-medium"><FiCheck /> Passed</span>;
      case 'Awaiting Review':
        return <span className="flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-1 rounded-md text-xs font-medium">Awaiting Review</span>;
      case 'Needs Editing':
        return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md text-xs font-medium"><FiClock /> Needs Editing</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm min-h-[80vh]">
      
      {/* --- Top Bar: Title & Filters --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">Document List</h2>
          <span className="text-sm font-medium text-gray-500">15-20 December 2024</span>
          <span className="text-sm font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded-lg">52/56</span>
        </div>

        <div className="flex items-center gap-4 flex-1 justify-end">
          {/* Search Bar */}
          <div className="relative w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-800 mr-2">Verification :</span>
            <button 
                onClick={() => setFilterStatus('ALL')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${filterStatus === 'ALL' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
                ALL
            </button>
            <select className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-md text-gray-600 outline-none cursor-pointer">
                <option>1st Review</option>
                <option>2nd Review</option>
            </select>
             <select className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-md text-gray-600 outline-none cursor-pointer">
                <option>Term 2/2567</option>
                <option>Term 1/2567</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-gray-500 uppercase border-b border-gray-100">
              <th className="py-4 pl-4 w-10"><input type="checkbox" className="rounded text-blue-600" /></th>
              <th className="py-4 font-medium">File name</th>
              <th className="py-4 font-medium">Uploaded by</th>
              <th className="py-4 font-medium">Project Name</th>
              <th className="py-4 font-medium">Date/Time</th>
              <th className="py-4 font-medium">Status</th>
              <th className="py-4 font-medium text-center">Verification</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {MOCK_DATA.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                <td className="py-4 pl-4"><input type="checkbox" className="rounded text-blue-600" /></td>
                
                {/* File Name Column */}
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <FiFileText size={20} />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{item.fileName}</p>
                        <p className="text-xs text-gray-400">{item.fileSize}</p>
                    </div>
                  </div>
                </td>

                {/* Uploaded By Column */}
                <td className="py-4">
                    <div className="flex items-center gap-2">
                        <img src={item.uploadedBy.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                        <span className="font-medium text-gray-600">{item.uploadedBy.id}</span>
                    </div>
                </td>

                {/* Project Name */}
                <td className="py-4">
                    <a href="#" className="underline decoration-gray-300 hover:text-blue-600 transition-colors">
                        {item.projectName}
                    </a>
                </td>

                {/* Date */}
                <td className="py-4 text-gray-500 text-xs">
                    {item.date}
                </td>

                {/* Status */}
                <td className="py-4">
                    {getStatusBadge(item.status)}
                </td>

                {/* Verification Action */}
                <td className="py-4 text-center">
                    {item.status === 'Awaiting Review' && (
                         <button className="text-red-400 hover:text-red-600 p-2 bg-red-50 rounded-full transition-colors">
                            <FiDownloadCloud />
                         </button>
                    )}
                     {/* ตัวอย่าง: ถ้าผ่านแล้วอาจจะไม่มีปุ่ม หรือเป็นปุ่มดูรายละเอียด */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Pagination --- */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Doc per page</span>
            <select className="border border-gray-200 rounded p-1 bg-white outline-none">
                <option>7</option>
                <option>10</option>
                <option>20</option>
            </select>
        </div>

        <div className="flex items-center gap-2">
            <button className="p-1 text-gray-400 hover:text-gray-600"><FiChevronLeft /></button>
            <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-md text-xs font-bold shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md text-xs transition-colors">2</button>
            <span className="text-gray-400 text-xs">...</span>
            <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md text-xs transition-colors">4</button>
            <button className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors ml-2">
                Next <FiChevronRight />
            </button>
        </div>
      </div>

    </div>
  );
};