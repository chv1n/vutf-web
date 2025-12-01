import React from 'react';
import { FiFile, FiCheckCircle, FiClock, FiUsers, FiSearch, FiFilter, FiMoreHorizontal } from 'react-icons/fi';

const AdminDashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back, Admin</p>
        </div>
        
        {/* Search Bar (Mock) */}
        <div className="flex items-center gap-4">
            <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search here..." 
                    className="pl-10 pr-4 py-2 rounded-xl border-none bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
                />
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm">
                <img src="https://flagcdn.com/w20/us.png" alt="US" className="w-5 h-auto rounded-sm"/>
                <span className="text-sm font-medium text-gray-600">Eng (US)</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Left Column: Thesis File Summary */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-lg font-bold text-gray-800">Thesis File</h2>
                <p className="text-sm text-gray-400">File Summary</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>500GB</span>
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[60%]"></div>
                    </div>
                    <span>60%</span>
                </div>
                <select className="text-sm border-gray-200 rounded-lg text-gray-500 bg-gray-50 border px-2 py-1">
                    <option>Term 1/2568</option>
                </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="bg-pink-50 p-6 rounded-2xl">
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-pink-200">
                    <FiFile size={20} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">112</h3>
                <p className="text-gray-500 font-medium">ไฟล์ทั้งหมด</p>
            </div>
            {/* Card 2 */}
            <div className="bg-green-50 p-6 rounded-2xl">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-green-200">
                    <FiCheckCircle size={20} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">50</h3>
                <p className="text-gray-500 font-medium">ไฟล์ที่ตรวจแล้ว</p>
            </div>
            {/* Card 3 */}
            <div className="bg-purple-50 p-6 rounded-2xl">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-purple-200">
                    <FiClock size={20} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">88</h3>
                <p className="text-gray-500 font-medium">ไฟล์ที่รอตรวจ</p>
            </div>
          </div>
        </div>

        {/* Right Column: Total User */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <div>
                <h2 className="text-lg font-bold text-gray-800">Total User</h2>
                <p className="text-sm text-gray-400">User Summary</p>
             </div>
             <FiUsers className="text-gray-400" />
          </div>

          <div className="grid grid-cols-2 gap-4 h-full pb-4">
             <div className="bg-pink-50 rounded-2xl p-4 flex flex-col justify-center items-center text-center">
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white mb-2 shadow-md shadow-pink-200">
                    <FiUsers />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">3</h3>
                <p className="text-sm text-gray-500">Instructor</p>
             </div>
             <div className="bg-green-50 rounded-2xl p-4 flex flex-col justify-center items-center text-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white mb-2 shadow-md shadow-green-200">
                    <FiUsers />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">351</h3>
                <p className="text-sm text-gray-500">Student</p>
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Test Results (Table) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-lg font-bold text-gray-800">Project Group Form response</h2>
            <div className="flex items-center gap-3">
                 <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search" className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                 </div>
                 <select className="border border-gray-200 rounded-lg text-sm px-3 py-2 text-gray-600 bg-white">
                    <option>Term 2/2567</option>
                 </select>
                 <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
                    <FiFilter />
                 </button>
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-xs text-gray-400 border-b border-gray-100">
                        <th className="py-3 px-2 font-medium"><input type="checkbox" className="rounded border-gray-300"/></th>
                        <th className="py-3 px-2 font-medium">Group-Num</th>
                        <th className="py-3 px-2 font-medium">Name-ENG</th>
                        <th className="py-3 px-2 font-medium">Name-TH</th>
                        <th className="py-3 px-2 font-medium">Student</th>
                        <th className="py-3 px-2 font-medium text-center">Status</th>
                        <th className="py-3 px-2 font-medium text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {mockProjects.map((project, index) => (
                        <tr key={index} className="hover:bg-gray-50 border-b border-gray-50 last:border-none transition-colors">
                            <td className="py-4 px-2"><input type="checkbox" className="rounded border-gray-300"/></td>
                            <td className="py-4 px-2 text-gray-500">{project.groupNum}</td>
                            <td className="py-4 px-2 font-medium text-gray-800">{project.nameEng}</td>
                            <td className="py-4 px-2 text-gray-500">{project.nameTh}</td>
                            <td className="py-4 px-2 text-gray-500 text-center">{project.students}</td>
                            <td className="py-4 px-2 text-center">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    project.status === 'Passed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                }`}>
                                    {project.status === 'Passed' ? '✔ Passed' : '✘ Failed'}
                                </span>
                            </td>
                            <td className="py-4 px-2 text-center">
                                <button className="text-gray-400 hover:text-gray-600"><FiMoreHorizontal /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        {/* Pagination Mock */}
        <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
                <span>Display</span>
                <select className="border border-gray-200 rounded px-2 py-1"><option>4</option></select>
            </div>
            <div className="flex items-center gap-2">
                <button className="px-2 disabled:opacity-50">{'< Previous'}</button>
                <button className="w-8 h-8 bg-blue-600 text-white rounded-lg">1</button>
                <button className="w-8 h-8 hover:bg-gray-100 rounded-lg">2</button>
                <span>...</span>
                <button className="w-8 h-8 hover:bg-gray-100 rounded-lg">4</button>
                <button className="px-2">{'Next >'}</button>
            </div>
        </div>
      </div>
    </div>
  );
};

// Mock Data
const mockProjects = [
    { groupNum: '66344 INE1', nameEng: 'Venue and Building Reservation...', nameTh: 'ระบบจองสถานที่ อาคาร', students: 2, status: 'Passed' },
    { groupNum: '66344 INE1', nameEng: 'Online Movie Ticket Booking...', nameTh: 'ระบบจองตั๋วหนังออนไลน์', students: 2, status: 'Failed' },
    { groupNum: '66344 INE2', nameEng: 'Online Sales System', nameTh: 'ระบบขายสินค้าออนไลน์', students: 3, status: 'Passed' },
    { groupNum: '66344 INE2', nameEng: 'Job Application Website', nameTh: 'เว็บไซต์กรอกใบสมัครงาน', students: 2, status: 'Passed' },
    { groupNum: '66344 INE1', nameEng: 'Car Rental Management...', nameTh: 'ระบบจัดการรถเช่า', students: 2, status: 'Passed' },
];

export default AdminDashboard;