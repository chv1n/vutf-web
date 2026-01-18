// src/pages/student/StudentHome.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiUsers, FiBell, FiLoader, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Services & Types
import { announcementService } from '@/services/announcement.service';
import { inspectionService } from '@/services/inspection.service';
import { Announcement } from '@/types/announcement';
import { InspectionRound } from '@/types/inspection';
import { useDebounce } from '@/hooks/useDebounce';

// Components
import { ActiveInspectionCard } from '@/components/features/inspection';
import { AnnouncementDetailModal } from '@/components/features/announcements/AnnouncementDetailModal';

// Helper: Format date
const formatDateDisplay = (dateString: string) => {
  if (!dateString) return { top: '-', bottom: '-' };
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok' };
  const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', timeZone: 'Asia/Bangkok' };

  if (isToday) {
    return { top: 'Today', bottom: date.toLocaleTimeString('th-TH', timeOptions) };
  } else {
    return { top: date.toLocaleDateString('en-US', dateOptions), bottom: date.getFullYear().toString() };
  }
};

const StudentHome: React.FC = () => {
  const navigate = useNavigate();

  // Announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [viewingItem, setViewingItem] = useState<Announcement | null>(null);

  // Active Inspection Round state
  const [activeRound, setActiveRound] = useState<InspectionRound | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      setIsLoading(true);
      try {
        const res = await announcementService.getAll(1, 5, debouncedSearch);
        setAnnouncements(res.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, [debouncedSearch]);

  // Fetch active inspection round
  useEffect(() => {
    const fetchActiveRound = async () => {
      try {
        const data = await inspectionService.getActiveRound();
        setActiveRound(data);
      } catch (error) {
        setActiveRound(null);
      }
    };

    fetchActiveRound();
  }, []);

  return (
    <div className="w-full min-h-[80vh] space-y-8">
      {/* --- Section 1: Quick Actions --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
      >
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 uppercase tracking-wider">
          Quick Actions
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => navigate('/student/group-management')}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 dark:bg-blue-600 text-white text-sm rounded-full font-medium shadow-md hover:bg-blue-700 dark:hover:bg-blue-500 hover:shadow-lg transition-all active:scale-95"
          >
            <FiUsers />
            <span>จัดการกลุ่ม</span>
          </button>

          <button
            onClick={() => navigate('/student/upload')}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 dark:bg-indigo-600 text-white text-sm rounded-full font-medium shadow-md hover:bg-indigo-700 dark:hover:bg-indigo-500 hover:shadow-lg transition-all active:scale-95"
          >
            <span>Thesis Upload</span>
            <FiArrowRight />
          </button>
        </div>
      </motion.div>

      {/* --- Section 2: Active Inspection Round --- */}
      {activeRound && (
        <ActiveInspectionCard round={activeRound} size="md" />
      )}

      {/* --- Section 3: Announcements --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors"
      >
        {/* Banner Header */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden transition-colors">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-100 dark:bg-indigo-500/20 rounded-full opacity-50 blur-2xl"></div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 z-10 text-center md:text-left">
            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm text-blue-500 dark:text-blue-400 shrink-0 transition-colors">
              <FiBell size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Announcements</h1>
              <p className="text-indigo-600 dark:text-indigo-400 text-sm">Stay updated with the latest news</p>
            </div>
          </div>

          <div className="relative w-full md:w-80 z-10">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 dark:text-indigo-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border-none rounded-xl text-gray-700 dark:text-gray-200 shadow-sm placeholder-indigo-300 dark:placeholder-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 outline-none transition-all"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8">
          {isLoading ? (
            <div className="flex justify-center py-12 text-indigo-300 dark:text-indigo-500">
              <FiLoader className="animate-spin text-3xl" />
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500">
              <p>No announcements found.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {announcements.map((item) => {
                const dateDisplay = formatDateDisplay(item.createdAt);

                return (
                  <div key={item.announceId} className="flex flex-col sm:flex-row gap-2 sm:gap-6 group">
                    {/* Date Column */}
                    <div className="w-full sm:w-24 flex-shrink-0 text-left sm:text-right pt-1 flex sm:block items-center gap-2 sm:gap-0">
                      <div className="text-gray-500 dark:text-gray-400 font-medium text-sm">{dateDisplay.top}</div>
                      <span className="sm:hidden text-gray-300 dark:text-gray-600">•</span>
                      <div className="text-gray-400 dark:text-gray-500 text-xs sm:mt-1">{dateDisplay.bottom}</div>
                    </div>

                    {/* Divider Line */}
                    <div className="hidden sm:block w-px bg-gray-200 dark:bg-gray-700 relative"></div>

                    {/* Content Column */}
                    <div className="flex-1 pb-6 sm:pb-8 border-b border-gray-50 dark:border-gray-700 last:border-0">
                      <h3 
                        // onClick เพื่อเปิด Modal
                        onClick={() => setViewingItem(item)}
                        className="text-lg font-bold text-gray-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer"
                      >
                        {item.title}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal Component */}
      <AnnouncementDetailModal 
        isOpen={!!viewingItem}
        onClose={() => setViewingItem(null)}
        data={viewingItem}
      />
    </div>
  );
};

export default StudentHome;