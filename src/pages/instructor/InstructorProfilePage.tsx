// src/pages/instructor/InstructorProfilePage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiUser, FiMail, FiHash, FiAward, FiEdit2, FiCheck, FiX,
    FiBookOpen, FiTag, FiSearch, FiChevronLeft, FiChevronRight, FiFilter
} from 'react-icons/fi';
import Swal from 'sweetalert2';

// Services & Types
import { getInstructorProfile, updateInstructorProfile, getMyAdvisedGroups } from '../../services/instructor.service';
import { InstructorProfile } from '../../types/profile.types';
import { AdvisedGroupResponse } from '../../types/group.types';

// Components
import { ProfileHeader } from '../../components/features/profile/ProfileHeader';
import { InfoRow } from '../../components/features/profile/InfoRow';

export const InstructorProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<InstructorProfile | null>(null);

    // State สำหรับเก็บรายการกลุ่มที่ปรึกษา
    const [advisedGroups, setAdvisedGroups] = useState<AdvisedGroupResponse[]>([]);

    const [loading, setLoading] = useState(true);

    // State สำหรับโหมดแก้ไข
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
    });

    // State สำหรับ Filter & Pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | 'main' | 'co'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    useEffect(() => {
        fetchData();
    }, []);

    // ฟังก์ชันให้ดึงทั้ง Profile และ Groups พร้อมกัน
    const fetchData = async () => {
        try {
            setLoading(true);
            const [profileData, groupsData] = await Promise.all([
                getInstructorProfile(),
                getMyAdvisedGroups()
            ]);

            setProfile(profileData);
            setAdvisedGroups(groupsData);

            // เตรียมข้อมูลลง FormData
            setFormData({
                firstName: profileData.first_name,
                lastName: profileData.last_name,
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'โหลดข้อมูลไม่สำเร็จ',
                text: 'กรุณาลองใหม่อีกครั้ง'
            });
        } finally {
            setLoading(false);
        }
    };

    // เริ่มแก้ไข
    const handleStartEdit = () => {
        if (profile) {
            setFormData({
                firstName: profile.first_name,
                lastName: profile.last_name,
            });
            setIsEditing(true);
        }
    };

    // ยกเลิกแก้ไข
    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    // บันทึกข้อมูล
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateInstructorProfile(formData);

            // อัปเดตข้อมูลใน Profile State โดยไม่ต้อง Fetch ใหม่ทั้งหมดเพื่อความลื่นไหล
            if (profile) {
                setProfile({
                    ...profile,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    full_name: `${formData.firstName} ${formData.lastName}`
                });
            }

            setIsEditing(false);

            Swal.fire({
                icon: 'success',
                title: 'บันทึกสำเร็จ',
                timer: 1500,
                showConfirmButton: false,
                position: 'top-end',
                toast: true
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถบันทึกข้อมูลได้'
            });
        } finally {
            setIsSaving(false);
        }
    };

    // ฟังก์ชันเมื่อคลิกการ์ดกลุ่ม
    const handleGroupClick = (group: AdvisedGroupResponse) => {
        navigate('/instructor/groups', {
            state: { selectedGroupId: group.groupId }
        });
    };

    const filteredGroups = advisedGroups.filter(group => {
        const matchesSearch =
            group.thesisName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.thesisCode.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole =
            filterRole === 'all' ? true :
                filterRole === 'main' ? group.advisorRole === 'main' :
                    group.advisorRole === 'co';

        return matchesSearch && matchesRole;
    });

    const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
    const paginatedGroups = filteredGroups.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset หน้าเมื่อเปลี่ยน filter
    useEffect(() => { setCurrentPage(1); }, [searchTerm, filterRole]);

    // Style สำหรับ Input
    const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-gray-800 text-base sm:text-sm";

    const rowClass = "flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100 px-2 min-h-[50px] gap-1 sm:gap-0";
    const labelClass = "w-full sm:w-1/3 text-gray-500 font-medium text-sm";
    const valueClass = "w-full sm:w-2/3";

    if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading profile...</div>;
    if (!profile) return null;

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fade-in">
            <ProfileHeader
                fullName={profile.full_name}
                role="Instructor"
                code={profile.instructor_code}
                email={profile.email}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-enter-up">

                {/* ================= Card 1: ข้อมูลอาจารย์ (Inline Edit) ================= */}
                <div className={`bg-white rounded-2xl shadow-sm border p-4 sm:p-6 relative transition-all duration-300 h-fit ${isEditing ? 'border-blue-200 shadow-md ring-4 ring-blue-50/50' : 'border-gray-100'}`}>

                    <div className="flex items-center justify-between mb-6 h-8">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <FiUser className="text-blue-500" />
                            ข้อมูลอาจารย์
                        </h2>

                        {/* ปุ่มควบคุม */}
                        {isEditing ? (
                            <div className="flex items-center gap-2 animate-scale-up">
                                <button
                                    onClick={handleCancelEdit}
                                    disabled={isSaving}
                                    className="px-3 py-1 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
                                >
                                    <FiX /> <span className="hidden sm:inline">ยกเลิก</span>
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1"
                                >
                                    {isSaving ? '...' : <><FiCheck /> <span>บันทึก</span></>}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleStartEdit}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                                title="แก้ไขข้อมูล"
                            >
                                <FiEdit2 size={18} />
                            </button>
                        )}
                    </div>

                    <div className="space-y-1">
                        {/* 1. ชื่อจริง */}
                        <div className={rowClass}>
                            <div className={labelClass}>ชื่อจริง</div>
                            <div className={valueClass}>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className={inputClass}
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                ) : (
                                    <span className="text-gray-800 font-medium text-base sm:text-sm">{profile.first_name}</span>
                                )}
                            </div>
                        </div>

                        {/* 2. นามสกุล */}
                        <div className={rowClass}>
                            <div className={labelClass}>นามสกุล</div>
                            <div className={valueClass}>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className={inputClass}
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                ) : (
                                    <span className="text-gray-800 font-medium text-base sm:text-sm">{profile.last_name}</span>
                                )}
                            </div>
                        </div>

                        {/* 3. รหัสอาจารย์ */}
                        <InfoRow label="รหัสอาจารย์" value={profile.instructor_code} icon={<FiHash />} />

                        {/* 4. อีเมล */}
                        <InfoRow label="อีเมล" value={profile.email} icon={<FiMail />} />
                    </div>
                </div>

                {/* ================= Card 2: กลุ่มที่ปรึกษา (Clickable Cards) ================= */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <FiAward className="text-purple-500" />
                            กลุ่มที่ปรึกษา ({advisedGroups.length})
                        </h2>
                    </div>

                    {/* 🔹 ส่วน Filter & Search */}
                    <div className="space-y-3 mb-4">
                        {/* Search Input */}
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="ค้นหาชื่อโครงงาน หรือ รหัส..."
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-2 text-xs">
                            {[
                                { id: 'all', label: 'ทั้งหมด' },
                                { id: 'main', label: 'ที่ปรึกษาหลัก' },
                                { id: 'co', label: 'ที่ปรึกษาร่วม' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setFilterRole(tab.id as any)}
                                    className={`px-3 py-1.5 rounded-md transition-colors border ${filterRole === tab.id
                                        ? 'bg-blue-50 text-blue-700 border-blue-200 font-medium'
                                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 🔹 รายการการ์ด (Paginated) */}
                    <div className="space-y-3 flex-1 min-h-[200px]">
                        {paginatedGroups.length > 0 ? (
                            paginatedGroups.map((group) => (
                                <div
                                    key={group.groupId}
                                    onClick={() => handleGroupClick(group)}
                                    className="p-4 rounded-xl border border-gray-200 bg-gray-50/30 hover:bg-white hover:border-blue-400 hover:shadow-md cursor-pointer transition-all duration-200 group"
                                >
                                    <div className="flex flex-col gap-2">
                                        <h3 className="font-bold text-gray-800 text-sm line-clamp-2 group-hover:text-blue-700 transition-colors">
                                            <FiBookOpen className="inline mr-2 text-gray-400 group-hover:text-blue-500" size={14} />
                                            {group.thesisName || 'ไม่ระบุชื่อโครงงาน'}
                                        </h3>

                                        <div className="flex items-end justify-between gap-2 mt-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1 ${group.courseType === 'PROJECT' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    <FiTag size={10} /> {group.courseType}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                                                    {group.thesisCode}
                                                </span>
                                            </div>

                                            <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-md font-medium border ${group.advisorRole === 'main' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                                {group.advisorRole === 'main' ? 'ที่ปรึกษาหลัก' : 'ที่ปรึกษาร่วม'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center h-full text-gray-400">
                                <div className="bg-gray-50 p-3 rounded-full mb-2">
                                    <FiFilter className="text-gray-300" size={24} />
                                </div>
                                <p className="text-sm">ไม่พบข้อมูลตามเงื่อนไข</p>
                            </div>
                        )}
                    </div>

                    {/* 🔹 ส่วน Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            >
                                <FiChevronLeft className="text-gray-600" />
                            </button>

                            <span className="text-xs font-medium text-gray-500">
                                หน้า {currentPage} จาก {totalPages}
                            </span>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            >
                                <FiChevronRight className="text-gray-600" />
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};