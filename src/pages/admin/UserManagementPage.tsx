// src/pages/admin/UserManagementPage.tsx
import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiFilter, FiRotateCcw } from 'react-icons/fi';

// Components
import { UserTabs } from '../../components/features/admin/users/UserTabs';
import { UserTable } from '../../components/features/admin/users/UserTable';
import { SectionTable } from '../../components/features/admin/class-sections/SectionTable';
import { Pagination } from '../../components/common/Pagination';

// Modals
import { UserFormModal } from '../../components/features/admin/users/UserFormModal';
import { SectionFormModal } from '../../components/features/admin/class-sections/SectionFormModal';

// Hooks (Logic)
import { useUserManagement } from '../../hooks/admin/useUserManagement';
import { useSectionManagement } from '../../hooks/admin/useSectionManagement';
import { useDebounce } from '../../hooks/useDebounce';

// Services (เรียกใช้เพื่อดึงข้อมูลลง Dropdown)
import { classSectionService } from '../../services/class-section.service';

// Types
import { User } from '../../types/user';
import { ClassSection } from '../../types/class-section';

export const UserManagementPage = () => {
  // --- UI State ---
  const [activeTab, setActiveTab] = useState<'student' | 'instructor' | 'section'>('student');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;
  const debouncedSearch = useDebounce(searchTerm, 500);

  // --- Filter State (เพิ่มใหม่) ---
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [dropdownSections, setDropdownSections] = useState<ClassSection[]>([]);

  // --- Modal State ---
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<ClassSection | null>(null);

  // --- Custom Hooks ---
  const userMgr = useUserManagement();
  const sectionMgr = useSectionManagement();

  // --- Effects ---
  useEffect(() => {
    setPage(1); // Reset page when tab or search changes
  }, [activeTab, debouncedSearch, selectedYear, selectedTerm, selectedSectionId]);

  // Effect: โหลดรายชื่อ Section มาใส่ Dropdown (ทำครั้งเดียวตอนโหลดหน้า)
  useEffect(() => {
    const loadSectionsForDropdown = async () => {
      try {
        const res = await classSectionService.getAll({ page: 1, limit: 1000 });
        setDropdownSections(res.data);
      } catch (error) {
        console.error("Failed to load sections for dropdown", error);
      }
    };
    loadSectionsForDropdown();
  }, []);

  // Effect: Fetch Data หลัก
  useEffect(() => {
    if (activeTab === 'section') {
      sectionMgr.fetchSections(page, limit, debouncedSearch, {
        academic_year: selectedYear ? Number(selectedYear) : undefined,
        term: selectedTerm || undefined
      });
    } else {
      userMgr.fetchUsers(activeTab, page, limit, debouncedSearch, {
        academicYear: selectedYear,
        term: selectedTerm,
        sectionId: selectedSectionId ? Number(selectedSectionId) : undefined
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, debouncedSearch, page, selectedYear, selectedTerm, selectedSectionId]);

  // --- Handlers ---
  const handleAddNew = () => {
    if (activeTab === 'section') {
      setSelectedSection(null);
      setIsSectionModalOpen(true);
    } else {
      setSelectedUser(null);
      setIsUserModalOpen(true);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedYear('');
    setSelectedTerm('');
    setSelectedSectionId('');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto pb-10 px-4">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pt-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">จัดการข้อมูลระบบ</h1>
          <p className="text-gray-500 text-sm mt-1">จัดการข้อมูล นักศึกษา อาจารย์ และกลุ่มเรียน</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg font-medium cursor-pointer"
        >
          <FiPlus size={20} />
          {activeTab === 'section' ? 'เพิ่มกลุ่มเรียน' : 'เพิ่มผู้ใช้งาน'}
        </button>
      </div>

      {/* 2. Controls Section (Search & Filters on Top, Tabs on Bottom) */}
      <div className="flex flex-col gap-6 mb-6">

        {/* --- ค้นหา และ ตัวกรอง --- */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">

          {/* ค้นหา */}
          <div className="relative w-full lg:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 'section' ? "ค้นหารหัสกลุ่มเรียน..." : "ค้นหา ชื่อ, อีเมล, รหัส..."}
              className="w-full pl-10 pr-4 py-2 text-gray-600 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* ตัวกรอง (แสดงเฉพาะ Student และ Section) */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            {(activeTab === 'student' || activeTab === 'section') && (
              <>
                <div className="flex items-center gap-2 px-3 py-2 text-gray-400 text-sm italic">
                  <FiFilter /> กรองข้อมูล:
                </div>

                {/* ปีการศึกษา */}
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-2 text-gray-600 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white min-w-[100px]"
                >
                  <option value="">ทุกปีการศึกษา</option>
                  {[...new Set(dropdownSections.map(s => s.academic_year))]
                    .sort((a, b) => b - a)
                    .map(year => (
                      <option key={year} value={String(year)}>{year}</option>
                    ))
                  }
                </select>

                {/* เทอม */}
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="px-3 py-2 text-gray-600 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white min-w-[100px]"
                >
                  <option value="">ทุกเทอม</option>
                  <option value="1">เทอม 1</option>
                  <option value="2">เทอม 2</option>
                  <option value="3">เทอม 3 (Summer)</option>
                </select>

                {/* กลุ่มเรียน (แสดงเฉพาะแท็บนักศึกษา) */}
                {activeTab === 'student' && (
                  <select
                    value={selectedSectionId}
                    onChange={(e) => setSelectedSectionId(e.target.value)}
                    className="px-3 py-2 text-gray-600 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white min-w-[150px]"
                  >
                    <option value="">ทุกกลุ่มเรียน</option>
                    {dropdownSections
                      .filter(s =>
                        (!selectedYear || s.academic_year === Number(selectedYear)) &&
                        (!selectedTerm || String(s.term) === selectedTerm)
                      )
                      .map(section => (
                        <option key={section.section_id} value={section.section_id}>
                          {section.section_name}
                        </option>
                      ))
                    }
                  </select>
                )}

                {/* ปุ่มรีเซ็ตค่า (แสดงเฉพาะเมื่อมีการเลือกค่าใดค่าหนึ่ง) */}
                {(searchTerm || selectedYear || selectedTerm || selectedSectionId) && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1.5 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                    title="ล้างตัวกรองทั้งหมด"
                  >
                    <FiRotateCcw size={14} /> รีเซ็ต
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* --- แถบ (Tabs) --- */}
        <div className="flex items-center">
          <UserTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* 3. Content Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {activeTab === 'section' ? (
          <SectionTable
            data={sectionMgr.data}
            isLoading={sectionMgr.isLoading}
            onEdit={(item) => { setSelectedSection(item); setIsSectionModalOpen(true); }}
            onDelete={(id) => sectionMgr.deleteSection(id, () => sectionMgr.fetchSections(page, limit, debouncedSearch, {
              academic_year: selectedYear ? Number(selectedYear) : undefined,
              term: selectedTerm || undefined
            }))}
            onRefresh={() => sectionMgr.fetchSections(page, limit, debouncedSearch, {
              academic_year: selectedYear ? Number(selectedYear) : undefined,
              term: selectedTerm || undefined
            })}
          />
        ) : (
          <UserTable
            data={userMgr.data}
            role={activeTab}
            isLoading={userMgr.isLoading}
            onEdit={(user) => { setSelectedUser(user); setIsUserModalOpen(true); }}
            onDelete={(id) => userMgr.deleteUser(id, () => userMgr.fetchUsers(activeTab, page, limit, debouncedSearch, {
              academicYear: selectedYear,
              term: selectedTerm,
              sectionId: selectedSectionId ? Number(selectedSectionId) : undefined
            }))}
            onDetail={(user) => userMgr.showDetail(user, activeTab)}
            onRefresh={() => userMgr.fetchUsers(activeTab, page, limit, debouncedSearch, {
              academicYear: selectedYear,
              term: selectedTerm,
              sectionId: selectedSectionId ? Number(selectedSectionId) : undefined
            })}
          />
        )}
      </div>

      {/* 4. Pagination */}
      <div className="mt-6">
        <Pagination
          page={page}
          setPage={setPage}
          limit={limit}
          meta={activeTab === 'section' ? sectionMgr.meta : userMgr.meta}
        />
      </div>

      {/* Modals */}
      <UserFormModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        role={activeTab === 'section' ? 'student' : activeTab}
        initialData={selectedUser}
        isSubmitting={userMgr.isSaving}
        onSubmit={(formData) =>
          userMgr.saveUser(
            formData,
            activeTab as 'student' | 'instructor',
            !!selectedUser,
            selectedUser?.user_uuid,
            () => {
              setIsUserModalOpen(false);
              userMgr.fetchUsers(activeTab as any, page, limit, debouncedSearch, {
                academicYear: selectedYear,
                term: selectedTerm,
                sectionId: selectedSectionId ? Number(selectedSectionId) : undefined
              });
            }
          )
        }
      />

      <SectionFormModal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        initialData={selectedSection}
        isSubmitting={sectionMgr.isSaving}
        onSubmit={(formData) =>
          sectionMgr.saveSection(
            formData,
            selectedSection?.section_id,
            () => { setIsSectionModalOpen(false); sectionMgr.fetchSections(page, limit, debouncedSearch); }
          )
        }
      />
    </div>
  );
};