import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiLoader, FiEdit2, FiTrash2, FiBell, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Swal from 'sweetalert2';

// Imports
import { announcementService } from '../../services/announcement.service';
import { Announcement, MetaData } from '../../types/announcement';
import { useAuth } from '../../contexts/AuthContext';
import { useDebounce } from '../../hooks/useDebounce'; 

// Components
import { AnnouncementModal } from '../../components/features/announcements/AnnouncementModal';
import { AnnouncementDetailModal } from '../../components/features/announcements/AnnouncementDetailModal';

// Helper Function
const formatDateDisplay = (dateString: string) => {
  if (!dateString) return { top: "-", bottom: "-" };
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok' };
  const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', timeZone: 'Asia/Bangkok' };

  if (isToday) {
    return { top: "Today", bottom: date.toLocaleTimeString('th-TH', timeOptions) };
  } else {
    return { top: date.toLocaleDateString('en-US', dateOptions), bottom: date.getFullYear().toString() };
  }
};

export const AnnouncementsPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Data State
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [meta, setMeta] = useState<MetaData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter & Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(10); 
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [activeTab, setActiveTab] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Announcement | null>(null);
  const [viewingItem, setViewingItem] = useState<Announcement | null>(null);

  // Fetch Data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await announcementService.getAll(page, limit, debouncedSearch);
      setAnnouncements(res.data);
      setMeta(res.meta);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to fetch data.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeTab]);

  useEffect(() => {
    fetchData();
  }, [page, debouncedSearch, activeTab]);

  // --- Handlers ---
  const handleSave = async (data: Partial<Announcement>) => {
    try {
      if (selectedItem) {
        await announcementService.update(selectedItem.announceId, data);
      } else {
        await announcementService.create(data);
      }
      setIsModalOpen(false);
      setSelectedItem(null);
      fetchData();
      Swal.fire('Success', 'Data saved successfully', 'success');
    } catch (error: any) {
      Swal.fire('Error', error.response?.data?.message || 'Something went wrong', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await announcementService.delete(id);
        Swal.fire('Deleted!', 'Announcement has been deleted.', 'success');
        fetchData();
      } catch (error) {
        Swal.fire('Error', 'Failed to delete', 'error');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-10">
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* --- Banner Header --- */}
        {/* Responsive: p-6 บนมือถือ, p-8 บนจอใหญ่ */}
        <div className="bg-indigo-50 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-100 rounded-full opacity-50 blur-2xl"></div>
          
          {/* Responsive: จัดกึ่งกลางบนมือถือ */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 z-10 text-center md:text-left">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-500 shrink-0">
               <FiBell size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
              <p className="text-indigo-600 text-sm">Stay updated with the latest news</p>
            </div>
          </div>
          
          <div className="relative w-full md:w-80 z-10">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border-none rounded-xl text-gray-700 shadow-sm placeholder-indigo-300 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
          </div>
        </div>

        {/* --- Content --- */}
        <div className="p-4 md:p-8">
          
          {/* Controls Section */}
          {/* Responsive: flex-col บนมือถือ, flex-row บนจอใหญ่ */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
            
            {/* Tabs: Scroll แนวนอนได้ถ้ายาวเกิน */}
            <div className="flex gap-4 sm:gap-8 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              {['All', 'News', 'Activities'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm font-semibold transition-colors whitespace-nowrap relative ${
                    activeTab === tab 
                      ? 'text-blue-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-900' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {isAdmin && (
                 <button 
                    onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                 >
                   <FiPlus /> Create
                 </button>
              )}
            </div>
          </div>

          {/* List Content */}
          {isLoading ? (
            <div className="flex justify-center py-20 text-indigo-300">
               <FiLoader className="animate-spin text-3xl" />
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p>No announcements found.</p>
            </div>
          ) : (
            <div className="space-y-6 md:space-y-8">
              {announcements.map((item) => {
                const dateDisplay = formatDateDisplay(item.createdAt);
                
                return (
                  <div key={item.announceId} className="flex flex-col sm:flex-row gap-2 sm:gap-6 group">
                    
                    {/* Date Column */}
                    {/* Responsive: จัดซ้ายบนมือถือ, จัดขวาบนจอใหญ่ */}
                    <div className="w-full sm:w-24 flex-shrink-0 text-left sm:text-right pt-1 flex sm:block items-center gap-2 sm:gap-0">
                      <div className="text-gray-500 font-medium text-sm">{dateDisplay.top}</div>
                      {/* บนมือถือ ใส่เครื่องหมายขีดคั่นกลาง */}
                      <span className="sm:hidden text-gray-300">•</span>
                      <div className="text-gray-400 text-xs sm:mt-1">{dateDisplay.bottom}</div>
                    </div>

                    {/* Divider Line: ซ่อนบนมือถือ, แสดงบนจอใหญ่ */}
                    <div className="hidden sm:block w-px bg-gray-200 relative"></div>

                    {/* Content Column */}
                    <div className="flex-1 pb-6 sm:pb-8 border-b border-gray-50 last:border-0 relative">
                      <h3 
                        className="text-lg font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors cursor-pointer" 
                        onClick={() => setViewingItem(item)}
                      >
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                      
                      {/* Actions */}
                      {isAdmin && (
                        // Responsive: แสดงตลอดบนมือถือ, แสดงเมื่อ Hover บนจอใหญ่
                        <div className="mt-3 sm:mt-0 sm:absolute sm:right-0 sm:top-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex gap-2">
                           <button 
                             onClick={(e) => { e.stopPropagation(); setSelectedItem(item); setIsModalOpen(true); }}
                             className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                           >
                             <FiEdit2 size={16} />
                           </button>
                           <button 
                             onClick={(e) => { e.stopPropagation(); handleDelete(item.announceId); }}
                             className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                           >
                             <FiTrash2 size={16} />
                           </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {meta && meta.totalPages > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-gray-50">
                <div className="text-sm text-gray-500 text-center sm:text-left">
                   Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to <span className="font-medium">{Math.min(page * limit, meta.totalItems)}</span> of <span className="font-medium">{meta.totalItems}</span> entries
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <FiChevronLeft size={20} className="text-gray-600" />
                    </button>
                    
                    <div className="px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg text-sm">
                        Page {page} of {meta.totalPages}
                    </div>

                    <button
                        onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                        disabled={page === meta.totalPages}
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <FiChevronRight size={20} className="text-gray-600" />
                    </button>
                </div>
            </div>
          )}

        </div>
      </div>

      <AnnouncementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSave}
        initialData={selectedItem}
        isLoading={isLoading}
      />

      <AnnouncementDetailModal 
        isOpen={!!viewingItem}
        onClose={() => setViewingItem(null)}
        data={viewingItem}
      />
    </div>
  );
};