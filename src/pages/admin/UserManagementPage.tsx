// src/pages/admin/UserManagementPage.tsx
import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Swal from 'sweetalert2';

import { UserTabs } from '../../components/features/admin/users/UserTabs';
import { UserTable } from '../../components/features/admin/users/UserTable';
import { UserFormModal } from '../../components/features/admin/users/UserFormModal';
import { userService } from '../../services/user.service';
import { useDebounce } from '../../hooks/useDebounce';

export const UserManagementPage = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'instructor'>('student');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(10); 
  const [meta, setMeta] = useState<any>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let res;
      if (activeTab === 'student') {
        res = await userService.getStudents(page, limit, debouncedSearch);
      } else {
        res = await userService.getInstructors(page, limit, debouncedSearch);
      }
      
      // เก็บ Data และ Meta
      setData(res.data);
      setMeta(res.meta);

    } catch (error) {
      console.error(error);
      // ถ้า Error 401 มันจะเด้งตรงนี้
      Swal.fire('Error', 'Failed to fetch data. Please login again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [activeTab, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [activeTab, debouncedSearch, page]);

  const handleDetail = (user: any) => {
    let infoHtml = '';
    
    if (activeTab === 'student') {
        const s = user.student;
        infoHtml = `
            <div style="text-align: left; font-size: 0.95rem; line-height: 1.6;">
                <p><strong>Name:</strong> ${s?.prefix_name || ''} ${s?.first_name} ${s?.last_name}</p>
                <p><strong>Student ID:</strong> ${s?.student_code}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${s?.phone || '-'}</p>
                <p><strong>Status:</strong> ${user.isActive ? '<span style="color:green">Active</span>' : '<span style="color:red">Inactive</span>'}</p>
            </div>
        `;
    } else {
        infoHtml = `
            <div style="text-align: left; font-size: 0.95rem; line-height: 1.6;">
                <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
                <p><strong>Instructor ID:</strong> ${user.instructor_code}</p>
                <p><strong>Email:</strong> ${user.email || '-'}</p>
                <p><strong>Account Status:</strong> ${user.hasAccount ? (user.isActive ? '<span style="color:green">Active</span>' : '<span style="color:red">Inactive</span>') : '<span style="color:gray">No Account</span>'}</p>
            </div>
        `;
    }

    Swal.fire({
        title: 'User Details',
        html: infoHtml,
        icon: 'info',
        confirmButtonText: 'Close',
        confirmButtonColor: '#3b82f6'
    });
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
            if (activeTab === 'student') {
                await userService.deleteUser(id);
            } else {
                await userService.deleteInstructor(id);
            }
            Swal.fire('Deleted!', 'User has been deleted.', 'success');
            fetchData();
        } catch (error) {
            Swal.fire('Error', 'Failed to delete', 'error');
        }
    }
  };

  const handleSave = async (formData: any) => {
    try {
        if (selectedUser) {
             if (activeTab === 'student') {
                 await userService.updateUser(selectedUser.user_uuid, formData);
             } else {
                 await userService.updateInstructor(selectedUser.instructor_uuid, formData);
             }
        } else {
             if (activeTab === 'student') {
                 await userService.createStudent(formData);
             } else {
                 await userService.createInstructor(formData);
             }
        }
        setIsModalOpen(false);
        fetchData();
        Swal.fire('Success', 'Data saved successfully', 'success');
    } catch (error: any) {
        Swal.fire('Error', error.response?.data?.message || 'Something went wrong', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
           <p className="text-gray-500 text-sm mt-1">Manage student and instructor accounts</p>
        </div>
        <button 
            onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 font-medium"
        >
          <FiPlus size={20} /> Add New
        </button>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <UserTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="relative w-full sm:w-72">
           <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
           <input 
             type="text" 
             placeholder="Search users..." 
             className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* Table Section */}
      <UserTable 
        data={data} 
        role={activeTab} 
        isLoading={isLoading} 
        onEdit={(user) => { setSelectedUser(user); setIsModalOpen(true); }}
        onDelete={handleDelete}
        onDetail={handleDetail}
      />

      {/* Pagination UI */}
      {meta && meta.totalPages > 0 && (
        <div className="flex items-center justify-between mt-6 px-2">
            <div className="text-sm text-gray-500">
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

      {/* Modal */}
      <UserFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        role={activeTab}
        initialData={selectedUser}
        onSubmit={handleSave}
      />
    </div>
  );
};