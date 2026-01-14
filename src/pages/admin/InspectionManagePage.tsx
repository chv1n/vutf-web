import React, { useEffect, useState, useRef, useMemo } from 'react';
import Swal from 'sweetalert2';
import {
    FiMoreHorizontal, FiEye, FiTrash2, FiPlus, FiEdit2,
    FiCheckCircle, FiXCircle, FiSearch, FiChevronLeft, FiChevronRight,
    FiFilter, FiRefreshCw, FiCalendar
} from 'react-icons/fi';
import CreateInspectionForm from '@/components/features/admin/inspection/CreateInspectionForm';
import { inspectionService } from '@/services/inspection.service';
import { InspectionRound } from '@/types/inspection';
import { showApiErrorAlert } from '@/utils/error-handler';

// --- Types ---
interface MetaData {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
}

interface FilterState {
    academicYear: string;
    term: string;
    roundNumber: string;
    courseType: string;
}

// --- 1. Component: Action Menu ---
const ActionMenu = ({ onEdit, onDelete, onDetail }: { onEdit: () => void; onDelete: () => void; onDetail: () => void; }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-all active:scale-95"
            >
                <FiMoreHorizontal size={20} />
            </button>
            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <button onClick={() => { setIsOpen(false); onEdit(); }} className="cursor-pointer w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 font-medium transition-colors">
                        <FiEdit2 size={16} /> แก้ไขข้อมูล
                    </button>
                    <button onClick={() => { setIsOpen(false); onDelete(); }} className="cursor-pointer w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-3 font-medium transition-colors">
                        <FiTrash2 size={16} /> ลบข้อมูล
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button onClick={() => { setIsOpen(false); onDetail(); }} className="cursor-pointer w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 font-medium transition-colors">
                        <FiEye size={16} /> ดูรายละเอียด
                    </button>
                </div>
            )}
        </div>
    );
};

// --- 2. Component: Filter Bar ---
const FilterBar = ({
    filters,
    onChange,
    onClear,
    availableYears
}: {
    filters: FilterState,
    onChange: (key: keyof FilterState, value: string) => void,
    onClear: () => void,
    availableYears: string[]
}) => {
    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-wrap gap-5 items-end animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2 text-gray-700 font-bold mb-1 w-full sm:w-auto">
                <FiFilter className="text-blue-600" /> ตัวกรอง:
            </div>

            {/* ปีการศึกษา (Dropdown) */}
            <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600 font-medium">ปีการศึกษา</label>
                <select
                    value={filters.academicYear}
                    onChange={(e) => onChange('academicYear', e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white w-32 cursor-pointer hover:border-blue-300 transition-colors"
                >
                    <option value="">ทั้งหมด</option>
                    {availableYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            {/* เทอม */}
            <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600 font-medium">เทอม</label>
                <select
                    value={filters.term}
                    onChange={(e) => onChange('term', e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white w-28 cursor-pointer hover:border-blue-300 transition-colors"
                >
                    <option value="">ทั้งหมด</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3 (Summer)</option>
                </select>
            </div>

            {/* รอบที่ */}
            <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600 font-medium">รอบที่</label>
                <select
                    value={filters.roundNumber}
                    onChange={(e) => onChange('roundNumber', e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white w-28 cursor-pointer hover:border-blue-300 transition-colors"
                >
                    <option value="">ทั้งหมด</option>
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
            </div>

            {/* ประเภทโครงงาน */}
            <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-600 font-medium">ประเภทโครงงาน</label>
                <select
                    value={filters.courseType}
                    onChange={(e) => onChange('courseType', e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white w-48 cursor-pointer hover:border-blue-300 transition-colors"
                >
                    <option value="">ทั้งหมด</option>
                    <option value="ALL">All Types</option>
                    <option value="PRE_PROJECT">Pre-Project</option>
                    <option value="PROJECT">Project</option>
                </select>
            </div>

            {/* ปุ่มล้างค่า */}
            <button
                onClick={onClear}
                className="ml-auto px-4 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
                <FiRefreshCw size={14} /> ล้างค่า
            </button>
        </div>
    );
};

// --- 3. Component: Pagination ---
const Pagination = ({ meta, onPageChange }: { meta: MetaData, onPageChange: (page: number) => void }) => {
    if (meta.lastPage <= 1) return null;

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => onPageChange(meta.page - 1)}
                    disabled={meta.page === 1}
                    className="cursor-pointer relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(meta.page + 1)}
                    disabled={meta.page === meta.lastPage}
                    className="cursor-pointer relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-500">
                        แสดง <span className="font-medium text-gray-900">{(meta.page - 1) * meta.limit + 1}</span> ถึง <span className="font-medium text-gray-900">{Math.min(meta.page * meta.limit, meta.total)}</span> จาก <span className="font-medium text-gray-900">{meta.total}</span> รายการ
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            onClick={() => onPageChange(meta.page - 1)}
                            disabled={meta.page === 1}
                            className="cursor-pointer relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                            <span className="sr-only">Previous</span>
                            <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>

                        {Array.from({ length: meta.lastPage }, (_, i) => i + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                aria-current={meta.page === pageNum ? 'page' : undefined}
                                className={`cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ring-1 ring-inset ring-gray-300
                                    ${meta.page === pageNum
                                        ? 'z-10 bg-blue-600 text-white focus-visible:outline-blue-600'
                                        : 'text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        ))}

                        <button
                            onClick={() => onPageChange(meta.page + 1)}
                            disabled={meta.page === meta.lastPage}
                            className="cursor-pointer relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                            <span className="sr-only">Next</span>
                            <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

// --- 4. Component: Table ---
const InspectionTable = ({ data, onEdit, onDelete, onDetail, onToggleStatus, isLoading }: any) => {
    return (
        <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 relative min-h-[200px]">
            {/* Loading Overlay */}
            {isLoading && data.length > 0 && (
                <div className="absolute inset-0 bg-white/50 z-10 flex justify-center items-start pt-20">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50/80 text-gray-600 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">ปีการศึกษา/เทอม</th>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">รอบที่</th>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider w-full">หัวข้อการตรวจ</th>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">ระยะเวลา</th>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">ประเภท</th>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-center">สถานะ</th>
                            <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.length === 0 && !isLoading ? (
                            <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400 font-light">ไม่พบข้อมูล</td></tr>
                        ) : (
                            data.map((item: InspectionRound) => (
                                <tr key={item.inspectionId} className="hover:bg-gray-50/60 transition-colors group">
                                    {/* ปีการศึกษา และ เทอม */}
                                    <td className="px-6 py-4 font-medium text-gray-700">
                                        <div className="flex items-center gap-2 ">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold border border-blue-100">
                                                {item.academicYear} / {item.term}
                                            </span>
                                        </div>
                                    </td>

                                    {/* รอบที่ */}
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-bold">
                                            #{item.roundNumber}
                                        </span>
                                    </td>

                                    {/* หัวข้อ (เพิ่มขนาดตัวอักษร) */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 text-base">{item.title}</span>
                                            {item.description && (
                                                <span className="text-gray-500 text-sm mt-1 truncate max-w-xs block">
                                                    {item.description}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* ระยะเวลา (แยก Column มาใหม่) */}
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col gap-1 items-center justify-center">
                                            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 whitespace-nowrap">
                                                เริ่ม: {new Date(item.startDate).toLocaleString('th-TH', {
                                                    year: 'numeric',
                                                    month: 'short', // ใช้ 'short' จะได้ ธ.ค. (ถ้า 'long' จะได้ ธันวาคม)
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })} น.
                                            </span>
                                            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 whitespace-nowrap">
                                                สิ้นสุด: {new Date(item.endDate).toLocaleString('th-TH', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })} น.
                                            </span>
                                        </div>
                                    </td>

                                    {/* ประเภทโครงงาน (Badge) */}
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex px-2 py-1 text-[11px] font-bold rounded-md border
                                            ${item.courseType === 'ALL' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                item.courseType === 'PRE_PROJECT' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                    'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>
                                            {item.courseType === 'ALL' ? 'ทั้งหมด' : item.courseType === 'PRE_PROJECT' ? 'Pre-Project' : 'Project'}
                                        </span>
                                    </td>

                                    {/* สถานะ */}
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => onToggleStatus(item.inspectionId)}
                                            title={item.status === 'OPEN' ? 'คลิกเพื่อปิดรับ' : 'คลิกเพื่อเปิดรับ'}
                                            className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm transition-all duration-200 transform hover:scale-105 active:scale-95
                                                ${item.status === 'OPEN'
                                                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300'
                                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                                                }`}
                                        >
                                            {item.status === 'OPEN' ? <FiCheckCircle size={12} /> : <FiXCircle size={12} />}
                                            {item.status === 'OPEN' ? 'OPEN' : 'CLOSED'}
                                        </button>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end">
                                            <ActionMenu
                                                onEdit={() => onEdit(item)}
                                                onDelete={() => onDelete(item.inspectionId)}
                                                onDetail={() => onDetail(item)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Main Page ---
const InspectionManagePage = () => {
    const [showForm, setShowForm] = useState(false);
    const [inspections, setInspections] = useState<InspectionRound[]>([]);
    const [meta, setMeta] = useState<MetaData>({ total: 0, page: 1, lastPage: 1, limit: 10 });
    const [isFetching, setIsFetching] = useState(true);
    const [selectedItem, setSelectedItem] = useState<InspectionRound | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // State สำหรับ Filter
    const [filters, setFilters] = useState<FilterState>({
        academicYear: '',
        term: '',
        roundNumber: '',
        courseType: ''
    });

    // สร้างรายการปีสำหรับ Dropdown (คำนวณจากปีปัจจุบัน + ข้อมูลที่มีใน DB)
    const availableYears = useMemo(() => {
        const currentYear = new Date().getFullYear() + 543;
        const yearsSet = new Set<string>();

        // 1. เพิ่มปีปัจจุบัน และ บวกลบ 2 ปี
        for (let i = -2; i <= 2; i++) {
            yearsSet.add(String(currentYear + i));
        }

        // 2. เพิ่มปีจากข้อมูลที่โหลดมาแล้ว (เผื่อมีข้อมูลเก่ามาก)
        inspections.forEach(item => {
            if (item.academicYear) yearsSet.add(item.academicYear);
        });

        // เรียงลำดับจากมากไปน้อย
        return Array.from(yearsSet).sort((a, b) => Number(b) - Number(a));
    }, [inspections]);

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        fetchInspections(1, searchQuery, false, { ...filters, [key]: value });
    };

    const clearFilters = () => {
        const emptyFilters = { academicYear: '', term: '', roundNumber: '', courseType: '' };
        setFilters(emptyFilters);
        fetchInspections(1, searchQuery, false, emptyFilters);
    };

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchInspections(1, searchQuery, false, filters);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Auto Refresh Logic (30s)
    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchInspections(meta.page, searchQuery, true, filters);
        }, 30000);
        return () => clearInterval(intervalId);
    }, [meta.page, searchQuery, filters]);

    // Fetch Function (รองรับ Filter Params)
    const fetchInspections = async (page = 1, search = '', isBackground = false, currentFilters = filters) => {
        if (!isBackground) setIsFetching(true);
        try {
            const params = {
                page,
                limit: 10,
                search,
                ...currentFilters
            };

            const response = await inspectionService.getAll(params);

            setInspections(response.data);
            setMeta(response.meta);
        } catch (error) {
            console.error(error);
            if (!isBackground) {
                Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: 'โหลดข้อมูลไม่สำเร็จ', showConfirmButton: false, timer: 3000 });
            }
        } finally {
            if (!isBackground) setIsFetching(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        fetchInspections(newPage, searchQuery, false, filters);
    };

    const handleToggleStatus = async (id: number) => {
        try {
            await inspectionService.toggleStatus(id);
            fetchInspections(meta.page, searchQuery, true, filters);
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'อัปเดตสถานะสำเร็จ', showConfirmButton: false, timer: 1500 });
        } catch (error) {
            showApiErrorAlert(error, 'เปลี่ยนสถานะไม่สำเร็จ');
        }
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'ยืนยันการลบ?',
            text: "ข้อมูลจะถูกซ่อนจากระบบ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#9ca3af',
            confirmButtonText: 'ใช่, ลบเลย',
            cancelButtonText: 'ยกเลิก',
            customClass: { popup: 'rounded-2xl' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await inspectionService.remove(id);
                    fetchInspections(meta.page, searchQuery, false, filters);
                    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'ลบข้อมูลสำเร็จ', showConfirmButton: false, timer: 1500 });
                } catch (error: any) {
                    showApiErrorAlert(error, 'ลบข้อมูลไม่สำเร็จ');
                }
            }
        });
    };

    // Detail Popup
    const handleDetail = (item: InspectionRound) => {
        const isOpen = item.status === 'OPEN';

        // Helper สำหรับแปลงวันที่เป็นไทย (Format: 28 ธ.ค. 2568 23:50 น.)
        const formatDate = (dateStr: string) => {
            return new Date(dateStr).toLocaleString('th-TH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }) + ' น.';
        };

        // กำหนดสีและข้อความของประเภทโครงงาน
        let courseTypeBadge = '';
        let courseTypeText = '';

        switch (item.courseType) {
            case 'PRE_PROJECT':
                courseTypeBadge = 'bg-orange-50 text-orange-700 border-orange-100';
                courseTypeText = 'Pre-Project';
                break;
            case 'PROJECT':
                courseTypeBadge = 'bg-indigo-50 text-indigo-700 border-indigo-100';
                courseTypeText = 'Project';
                break;
            default:
                courseTypeBadge = 'bg-purple-50 text-purple-700 border-purple-100';
                courseTypeText = 'ทั้งหมด (All Types)';
        }

        Swal.fire({
            html: `
                <div class="text-left font-sans">
                    <div class="flex items-start gap-4 mb-5 border-b border-gray-100 pb-4">
                        <div class="p-3 ${isOpen ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'} rounded-2xl shadow-sm mt-1">
                             ${isOpen
                    ? '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" width="28" height="28"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
                    : '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" width="28" height="28"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
                }
                        </div>
                        <div class="flex-1">
                             <div class="flex flex-wrap items-center gap-2 mb-1">
                                <span class="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                                    ปี ${item.academicYear} / เทอม ${item.term}
                                </span>
                                <span class="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">
                                    รอบที่ ${item.roundNumber}
                                </span>
                             </div>
                             <h3 class="text-xl font-bold text-gray-800 leading-snug">${item.title}</h3>
                             <p class="text-sm ${isOpen ? 'text-green-600' : 'text-gray-500'} font-medium mt-1 flex items-center gap-1">
                                ${isOpen ? '● กำลังเปิดรับเอกสาร' : '● ปิดรับเอกสารแล้ว'}
                             </p>
                        </div>
                    </div>
                    
                    <div class="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-5 relative">
                        <span class="absolute top-3 left-3 text-gray-300">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="20" width="20"><path fill="none" d="M0 0h24v24H0z"></path><path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z"></path></svg>
                        </span>
                        <p class="text-sm text-gray-600 leading-relaxed pl-7">
                            ${item.description || '<span class="text-gray-400 italic">ไม่มีรายละเอียดเพิ่มเติม</span>'}
                        </p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div class="p-3 border border-gray-100 rounded-xl bg-white shadow-sm flex flex-col justify-center">
                            <span class="text-xs text-gray-400 mb-1 flex items-center gap-1">
                                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" width="14" height="14"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                                ประเภท
                            </span>
                            <span class="font-bold px-2 py-1 rounded-md text-xs w-fit border ${courseTypeBadge}">
                                ${courseTypeText}
                            </span>
                        </div>

                        <div class="p-3 border border-gray-100 rounded-xl bg-white shadow-sm flex flex-col justify-center">
                            <span class="text-xs text-gray-400 mb-1 flex items-center gap-1">
                                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" width="14" height="14"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                สถานะปัจจุบัน
                            </span>
                            <span class="font-bold ${isOpen ? 'text-green-600' : 'text-gray-500'}">
                                ${item.status}
                            </span>
                        </div>

                        <div class="p-3 border border-gray-100 rounded-xl bg-white shadow-sm">
                            <span class="text-xs text-gray-400 mb-1 flex items-center gap-1">
                                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                เริ่มต้น
                            </span>
                            <span class="font-semibold text-gray-700 block mt-0.5">
                                ${formatDate(item.startDate)}
                            </span>
                        </div>

                        <div class="p-3 border border-gray-100 rounded-xl bg-white shadow-sm">
                            <span class="text-xs text-gray-400 mb-1 flex items-center gap-1">
                                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" width="14" height="14"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                สิ้นสุด
                            </span>
                            <span class="font-semibold text-gray-700 block mt-0.5">
                                ${formatDate(item.endDate)}
                            </span>
                        </div>
                    </div>
                </div>
            `,
            showConfirmButton: false,
            showCloseButton: true,
            width: '500px',
            padding: '1.5rem',
            customClass: {
                popup: 'rounded-2xl shadow-2xl',
                closeButton: 'text-gray-400 hover:text-gray-600 focus:outline-none'
            }
        });
    };

    return (
        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pt-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">จัดการรอบการส่งเอกสารปริญญานิพนธ์</h1>
                    {/* <p className="text-gray-500 mt-2">จัดการกำหนดการส่งเอกสารปริญญานิพนธ์</p> */}
                </div>
                {!showForm && (
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative group w-full md:w-72">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="ค้นหาหัวข้อ..."
                                className="pl-10 pr-4 py-2.5 w-full bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm placeholder-gray-400 text-gray-700"
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => { setSelectedItem(null); setShowForm(true); }}
                            className="cursor-pointer flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all font-medium whitespace-nowrap"
                        >
                            <FiPlus size={20} /> สร้างใหม่
                        </button>
                    </div>
                )}
            </div>

            {showForm ? (
                <div className="animate-in slide-in-from-right duration-300">
                    <CreateInspectionForm
                        initialData={selectedItem}
                        onSuccess={() => { setShowForm(false); fetchInspections(meta.page, searchQuery, false, filters); }}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <FilterBar
                        filters={filters}
                        onChange={handleFilterChange}
                        onClear={clearFilters}
                        availableYears={availableYears}
                    />

                    <InspectionTable
                        data={inspections}
                        onEdit={(item: InspectionRound) => { setSelectedItem(item); setShowForm(true); }}
                        onDelete={handleDelete}
                        onDetail={handleDetail}
                        onToggleStatus={handleToggleStatus}
                        isLoading={isFetching}
                    />
                    <Pagination meta={meta} onPageChange={handlePageChange} />
                </div>
            )}
        </div>
    );
};

export default InspectionManagePage;