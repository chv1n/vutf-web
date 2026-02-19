import React from 'react';
import {
    FiFile, FiZap, FiCheckCircle, FiClock, FiUsers, FiSearch, FiFilter,
    FiMoreHorizontal, FiServer, FiActivity, FiPieChart, FiArrowRight,
    FiUserPlus, FiCheck, FiX, FiLayers, FiAlertCircle, FiTrendingUp, FiLoader,
    FiPlay
} from 'react-icons/fi';

const AdminDashboard = () => {

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'In Progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Passed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'Failed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="p-6 bg-slate-50 dark:bg-gray-900 min-h-screen transition-colors duration-200 font-sans">

            {/* --- Section 1: Project Group Status Overview (New!) --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                {/* 1. Active Groups */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border-l-4 border-blue-500 flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Active Groups</p>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">45</h3>
                        <p className="text-xs text-blue-500 font-medium mt-1">+2 from last week</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                        <FiLayers size={24} />
                    </div>
                </div>

                {/* 2. Passed Groups */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border-l-4 border-green-500 flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Passed (Complete)</p>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">12</h3>
                        <p className="text-xs text-green-500 font-medium mt-1">Ready for Defense</p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                        <FiCheckCircle size={24} />
                    </div>
                </div>

                {/* 3. In Progress */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border-l-4 border-yellow-500 flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">In Progress</p>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">28</h3>
                        <p className="text-xs text-yellow-500 font-medium mt-1">Editing / Revising</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition-transform">
                        <FiClock size={24} />
                    </div>
                </div>

                {/* 4. Failed / Issues */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border-l-4 border-red-500 flex items-center justify-between group hover:shadow-md transition-all">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Needs Attention</p>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">5</h3>
                        <p className="text-xs text-red-500 font-medium mt-1">Format Failed - 3 times</p>
                    </div>
                    <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                        <FiAlertCircle size={24} />
                    </div>
                </div>
            </div>


            {/* --- Section 2: Thesis & System Stats (Split 2/3 and 1/3) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* Left Column: Thesis File Statistics */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm transition-colors">

                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <FiPieChart className="text-indigo-500" /> Thesis Verification Stats
                            </h2>
                            {/* <p className="text-sm text-gray-400">Term 1/2568 • Round 2</p> */}
                        </div>
                        {/* Storage Pill */}
                        <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-full border border-gray-100 dark:border-gray-600">
                            <FiServer />
                            <span className="font-medium">Storage: 60% Used</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* 1. First Pass Rate (Gradient Card) */}
                        <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <p className="text-indigo-100 text-sm font-medium mb-1">First Pass Rate</p>
                                    <h3 className="text-3xl font-bold">65%</h3>
                                    <p className="text-xs text-indigo-100 mt-2 bg-white/20 inline-block px-2 py-1 rounded-lg">High Difficulty</p>
                                </div>
                                <div className="w-12 h-12 rounded-full border-4 border-white/30 flex items-center justify-center text-xs font-bold">
                                    R1
                                </div>
                            </div>
                            {/* Decorative Circle */}
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                        </div>

                        {/* 2. Second Pass Rate (Gradient Card - Updated!) */}
                        <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none">
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <p className="text-emerald-100 text-sm font-medium mb-1">Second Pass Rate</p>
                                    <h3 className="text-3xl font-bold">88%</h3>
                                    <p className="text-xs text-emerald-100 mt-2 bg-white/20 inline-block px-2 py-1 rounded-lg">
                                        <FiTrendingUp className="inline mr-1" />Improved
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full border-4 border-white/30 flex items-center justify-center text-xs font-bold">
                                    R2
                                </div>
                            </div>
                            {/* Decorative Circle */}
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                        </div>

                        {/* 3. Total Files Processed */}
                        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-5 flex items-center justify-between border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-100 dark:hover:border-blue-900/50 transition-all duration-300 group">
                            <div className="flex items-center gap-5">
                                {/* Icon: เปลี่ยนพื้นหลังเป็นสีฟ้าอ่อน ให้ดูเข้ากับ theme เอกสาร */}
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-blue-100 dark:shadow-none">
                                    <FiFile size={26} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">Total Files Processed</p>
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
                                        1,240
                                        <span className="text-sm font-normal text-gray-400 ml-1.5">files</span>
                                    </h3>
                                </div>
                            </div>

                            {/* Right Side: Speed Stat */}
                            <div className="text-right pl-6 border-l border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-end gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                                    <FiZap className="text-yellow-500" size={14} /> {/* เพิ่มไอคอนสายฟ้าสื่อถึงความเร็ว */}
                                    Avg. Speed
                                </div>
                                <p className="text-xl font-bold text-gray-800 dark:text-white font-mono">1.2s</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Column: System & User Health */}
                <div className="space-y-6">
                    {/* System Status */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm flex items-center justify-between border-b-4 border-green-500 transition-colors">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Python Engine</p>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                Online
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                            </h3>
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">Latency: 45ms</p>
                        </div>
                        <FiServer className="text-green-500 text-3xl opacity-80" />
                    </div>

                    {/* User Stats Compact */}
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm flex flex-col justify-center items-center text-center h-[calc(100%-130px)]">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                            <FiUsers size={32} />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-white">351</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Active Students</p>
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 w-full flex justify-between px-4 text-xs">
                            <span className="text-gray-400">Instructors: <b className="text-gray-700 dark:text-gray-300">3</b></span>
                            <span className="text-gray-400">Admins: <b className="text-gray-700 dark:text-gray-300">2</b></span>
                        </div>
                    </div>
                </div>

            </div>

            {/* --- Section 3: Recent Activity & Requests --- */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

                {/* Left Column (2/3): Recent File Submissions & Verification Queue */}
                <div className="xl:col-span-2 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Recent Uploads</h2>
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-xs font-bold">
                                2 Waiting for Verify
                            </span>
                        </div>
                        <button className="text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                            View All History
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {mockProjects.map((project, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-transparent hover:border-blue-100 dark:hover:border-blue-900 transition-all group relative overflow-hidden">

                                {/* Progress Bar Background (เฉพาะตอนกำลังตรวจ) */}
                                {project.status === 'In Progress' && (
                                    <div className="absolute bottom-0 left-0 h-1 bg-blue-500 animate-[loading_2s_ease-in-out_infinite] w-full opacity-50"></div>
                                )}

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                                    {/* File Info */}
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl flex-shrink-0 ${project.status === 'Pending' ? 'bg-amber-50 text-amber-500 dark:bg-amber-900/20' :
                                            project.status === 'In Progress' ? 'bg-blue-50 text-blue-500 dark:bg-blue-900/20' :
                                                'bg-gray-50 text-gray-500 dark:bg-gray-700'
                                            }`}>
                                            <FiFile size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-xs font-bold text-gray-400 dark:text-gray-500">{project.groupNum}</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getStatusColor(project.status)}`}>
                                                    {project.status}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm md:text-base line-clamp-1">{project.nameEng}</h4>
                                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                <FiClock size={10} /> Uploaded {project.timeAgo}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions Area */}
                                    <div className="flex-shrink-0 flex items-center justify-end sm:border-l sm:border-gray-100 dark:sm:border-gray-700 sm:pl-6">

                                        {/* Case 1: Pending -> Show Verify Button */}
                                        {project.status === 'Pending' && (
                                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-200 dark:shadow-none transition-all hover:scale-105 active:scale-95">
                                                <FiPlay size={16} className="fill-current" /> Verify
                                            </button>
                                        )}

                                        {/* Case 2: In Progress -> Show Spinner */}
                                        {project.status === 'In Progress' && (
                                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium px-2">
                                                <FiLoader size={18} className="animate-spin" />
                                                Processing...
                                            </div>
                                        )}

                                        {/* Case 3: Finished -> Show Details Link */}
                                        {(project.status === 'Passed' || project.status === 'Failed') && (
                                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                <FiArrowRight size={20} />
                                            </button>
                                        )}
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column (1/3): Pending Group Requests */}
                <div className="xl:col-span-1 flex flex-col gap-4">
                    <div className="flex justify-between items-center h-[28px]"> {/* Align height with left header */}
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            Group Requests
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                            </span>
                        </h2>
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 px-2 py-1 rounded-md">3 Pending</span>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full">
                        <div className="divide-y divide-gray-50 dark:divide-gray-700">
                            {mockGroupRequests.map((req, i) => (
                                <div key={i} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">

                                    {/* Header: User & Info */}
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                                                <span className="text-xs font-bold">{req.studentName.charAt(0)}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Request by | {req.studentName}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-mono bg-gray-100 dark:bg-gray-700 text-gray-500 dark:bg-gray-800 dark:text-gray-300 px-1.5 py-0.5 rounded">
                                            {req.year_term}
                                        </span>
                                    </div>

                                    {/* Topic Info */}
                                    <div className="mb-4 pl-[52px]">
                                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-200 leading-snug line-clamp-2 mb-2">
                                            {req.topicTH}
                                        </h5>
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <span className="flex items-center gap-1"><FiUsers size={12} /> {req.members} Members</span>
                                            <span className="flex items-center gap-1"><FiUserPlus size={12} /> {req.advisor} Advisors</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pl-[52px]">
                                        <button className="flex-1 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 dark:bg-white dark:text-gray-900 dark:hover:bg-blue-700 dark:hover:text-white text-xs font-bold transition-all shadow-sm">
                                            Approve
                                        </button>
                                        <button className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all text-xs font-bold">
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="mt-auto py-3 text-center text-xs font-bold text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 bg-gray-50 dark:bg-gray-700/30 transition-colors border-t border-gray-100 dark:border-gray-700">
                            View All Requests
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Mock Data
const mockProjects = [
    { groupNum: 'INE-01', nameEng: 'Venue and Building Reservation System', status: 'Pending', timeAgo: '2 mins ago' },
    { groupNum: 'INE-02', nameEng: 'Online Movie Ticket Booking App', status: 'In Progress', timeAgo: '5 mins ago' },
    { groupNum: 'INE-03', nameEng: 'E-Commerce Online Sales System', status: 'Passed', timeAgo: '1 hour ago' },
    { groupNum: 'INE-04', nameEng: 'Job Application Website', status: 'Failed', timeAgo: '2 hours ago' },
];

const mockGroupRequests = [
    { topicTH: 'ระบบจัดการคลังสินค้าอัจฉริยะด้วย IoT', studentName: 'Kittiphum Inthachot', members: 2, advisor: 2, year_term: '2568/1' },
    { topicTH: 'แอปพลิเคชันเรียนรู้ภาษาอังกฤษ', studentName: 'Somchai Jaidee', members: 3, advisor: 1, year_term: '2568/1' },
    { topicTH: 'ระบบสแกนใบหน้าเข้างาน Face ID', studentName: 'Mana Rakdee', members: 1, advisor: 1, year_term: '2568/1' },
];

export default AdminDashboard;

{/* Queue / Load Card */ }
// <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm flex items-center justify-between border-b-4 border-blue-500 transition-colors">
//     <div>
//         <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Verification Queue</p>
//         <h3 className="text-xl font-bold text-gray-800 dark:text-white">Idle</h3>
//         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ready for new uploads</p>
//     </div>
//     <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
//         <FiActivity size={24} />
//     </div>
// </div>