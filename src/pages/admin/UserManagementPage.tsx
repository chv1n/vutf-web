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
  
  // Debounce Search
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
      
      setData(res.data);
      setMeta(res.meta);

    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่', 'error');
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
                <p><strong>ชื่อ-นามสกุล:</strong> ${s?.prefix_name || ''}${s?.first_name} ${s?.last_name}</p>
                <p><strong>รหัสนักศึกษา:</strong> ${s?.student_code || '-'}</p>
                <p><strong>อีเมล:</strong> ${user.email}</p>
                <p><strong>เบอร์โทร:</strong> ${s?.phone || '-'}</p>
                <p><strong>สถานะบัญชี:</strong> ${user.isActive ? '<span style="color:green">ใช้งานปกติ</span>' : '<span style="color:red">ถูกระงับ/ยังไม่ยืนยัน</span>'}</p>
            </div>
        `;
    } else {
        infoHtml = `
            <div style="text-align: left; font-size: 0.95rem; line-height: 1.6;">
                <p><strong>ชื่อ-นามสกุล:</strong> ${user.firstName} ${user.lastName}</p>
                <p><strong>รหัสอาจารย์:</strong> ${user.instructor_code || '-'}</p>
                <p><strong>อีเมล:</strong> ${user.email || 'ไม่มีบัญชีผู้ใช้'}</p>
                <p><strong>สถานะบัญชี:</strong> ${user.hasAccount ? (user.isActive ? '<span style="color:green">ใช้งานปกติ</span>' : '<span style="color:red">ถูกระงับ</span>') : '<span style="color:gray">ยังไม่สร้างบัญชี</span>'}</p>
            </div>
        `;
    }

    Swal.fire({
        title: 'รายละเอียดผู้ใช้',
        html: infoHtml,
        icon: 'info',
        confirmButtonText: 'ปิด',
        confirmButtonColor: '#3b82f6'
    });
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: "ข้อมูลที่ถูกลบจะไม่สามารถกู้คืนได้!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'ยืนยันการลบ',
        cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
        try {
            if (activeTab === 'student') {
                await userService.deleteUser(id);
            } else {
                await userService.deleteInstructor(id);
            }
            
            Swal.fire('ลบสำเร็จ!', 'ข้อมูลผู้ใช้ถูกลบออกจากระบบแล้ว', 'success');
            fetchData(); 
        } catch (error: any) {
            Swal.fire('เกิดข้อผิดพลาด', error.response?.data?.message || 'ไม่สามารถลบข้อมูลได้', 'error');
        }
    }
  };

  // --- ฟังก์ชันบันทึก ---
  const handleSave = async (formData: any) => {
    try {
        if (selectedUser) {
             // แก้ไข
             if (activeTab === 'student') {
                 await userService.updateUser(selectedUser.user_uuid, formData);
             } else {
                 await userService.updateInstructor(selectedUser.instructor_uuid, formData);
             }
             
             setIsModalOpen(false);
             fetchData();
             Swal.fire('บันทึกสำเร็จ', 'แก้ไขข้อมูลเรียบร้อยแล้ว', 'success');

        } else {
             // เพิ่มใหม่
             if (activeTab === 'student') {
                 // Invite นักศึกษา
                 const rawEmails = formData.email || '';
                 const emailList = rawEmails.split(/[\n,\s]+/).map((e: string) => e.trim()).filter((e: string) => e !== '');

                 if (emailList.length === 0) {
                    Swal.fire('แจ้งเตือน', 'กรุณาระบุอีเมลอย่างน้อย 1 รายการ', 'warning');
                    return;
                 }

                 const res: any = await userService.inviteStudents(emailList);
                 
                 setIsModalOpen(false);
                 fetchData();

                 const results = res.results || [];
                 const successCount = results.filter((r: any) => r.status === 'success' || r.status === 'resent').length;
                 const failCount = results.filter((r: any) => r.status === 'failed' || r.status === 'warning').length;

                 if (failCount === 0) {
                     Swal.fire('ส่งคำเชิญสำเร็จ', `ส่งลิงก์ครบทั้ง ${successCount} รายการเรียบร้อยแล้ว`, 'success');
                 } else {
                     const failedEmails = results
                        .filter((r: any) => r.status === 'failed' || r.status === 'warning')
                        .map((r: any) => r.email)
                        .join(', ');

                     Swal.fire({
                         title: 'ดำเนินการเสร็จสิ้น',
                         html: `
                            <div style="text-align: left;">
                                <p style="color: green; margin-bottom: 5px;">✔ ส่งสำเร็จ: ${successCount} รายการ</p>
                                <p style="color: red; margin-bottom: 5px;">❌ ไม่ส่ง (ซ้ำ/Activeแล้ว): ${failCount} รายการ</p>
                                <hr style="margin: 10px 0; border-color: #eee;">
                                <p style="font-size: 0.9em; color: #666; word-break: break-all;">
                                    <strong>รายการที่ไม่ถูกส่ง:</strong><br/>
                                    ${failedEmails.length > 150 ? failedEmails.substring(0, 150) + '...' : failedEmails}
                                </p>
                            </div>
                         `,
                         icon: 'info'
                     });
                 }

             } else {
                 // สร้างอาจารย์ใหม่
                 await userService.createInstructor(formData);
                 setIsModalOpen(false);
                 fetchData();
                 Swal.fire('บันทึกสำเร็จ', 'เพิ่มข้อมูลอาจารย์เรียบร้อยแล้ว', 'success');
             }
        }

    } catch (error: any) {
        console.error('Save Error:', error);       
        let msg = error.response?.data?.message;

        if (!msg) {
            msg = error.message;
        }

        if (!msg || msg === 'Network Error') {
            msg = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง';
        }
        
        if (typeof msg === 'string' && (msg.includes('email already exists') || msg.includes('UQ_'))) {
            Swal.fire('บันทึกไม่สำเร็จ', 'อีเมลหรือรหัสประจำตัวนี้มีอยู่ในระบบแล้ว', 'warning');
        } else {
            Swal.fire('Error', msg, 'error');
        }
    }
  };

  const handleAddNew = () => {
      setSelectedUser(null);
      setIsModalOpen(true);
  };

  const handleEdit = (user: any) => {
      setSelectedUser(user);
      setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto pb-10 px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pt-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">จัดการข้อมูลผู้ใช้งาน</h1>
           <p className="text-gray-500 text-sm mt-1">เพิ่ม ลบ แก้ไข ข้อมูลนักศึกษาและอาจารย์</p>
        </div>
        <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 font-medium"
        >
          <FiPlus size={20} /> เพิ่มผู้ใช้งานใหม่
        </button>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <UserTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="relative w-full sm:w-72">
           <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
           <input 
             type="text" 
             placeholder="ค้นหา ชื่อ, อีเมล, รหัส..." 
             className="w-full pl-10 pr-4 py-2 text-gray-600 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDetail={handleDetail}
      />

      {/* Pagination UI */}
      {meta && meta.totalPages > 0 && (
        <div className="flex items-center justify-between mt-6 px-2">
            <div className="text-sm text-gray-500">
                แสดง <span className="font-medium">{(page - 1) * limit + 1}</span> ถึง <span className="font-medium">{Math.min(page * limit, meta.totalItems)}</span> จากทั้งหมด <span className="font-medium">{meta.totalItems}</span> รายการ
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
                    หน้า {page} / {meta.totalPages}
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