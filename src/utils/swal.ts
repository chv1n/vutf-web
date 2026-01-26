// src/utils/swal.ts
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const swal = MySwal.mixin({
    customClass: {
        // ✅ เพิ่ม ! หน้า bg เพื่อบังคับสี (Important)
        popup: 'rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 !bg-white dark:!bg-gray-800',
        title: 'text-xl font-bold text-gray-900 dark:text-white',
        htmlContainer: 'text-sm text-gray-600 dark:text-gray-300',
        confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-xl shadow-sm transition-all focus:outline-none',
        cancelButton: 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 font-medium py-2.5 px-5 rounded-xl transition-all focus:outline-none',
        denyButton: 'bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-5 rounded-xl shadow-sm transition-all focus:outline-none',
        closeButton: '!text-gray-400 hover:!text-gray-600 dark:hover:!text-gray-200 focus:outline-none',
    },
    buttonsStyling: false,
    // ❌ ลบบรรทัด background: 'transparent' ออกครับ
});

export const toast = MySwal.mixin({
    toast: true,
    position: 'bottom-end', // เปลี่ยนจาก top-end เป็น bottom-end
    showConfirmButton: false,
    timer: 3000, // แนะนำให้ลดลงเหลือประมาณ 3-5 วินาทีเพื่อให้ดูเป็น alert ปกติ
    timerProgressBar: true,
    width: 'auto', // กำหนดความกว้างเป็น auto เพื่อไม่ให้ยืด
    showClass: {
        popup: 'animate__animated animate__fadeInUp animate__faster' // เปลี่ยน animation ให้ลอยขึ้นมาจากด้านล่าง
    },
    hideClass: {
        popup: 'animate__animated animate__fadeOutDown animate__faster'
    },
    customClass: {
        // ลบ !bg-white ออกหากต้องการใช้ค่าจากระบบ หรือปรับแก้ให้แน่นอน
        popup: 'rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center p-4 mb-5 mr-5', 
        title: 'text-sm font-medium text-gray-800 dark:text-white m-0',
        timerProgressBar: 'bg-blue-500'
    },
    didOpen: (toastEl) => {
        // จัดการเรื่อง container ไม่ให้ทับเนื้อหาอื่น
        const container = toastEl.parentElement;
        if (container) {
            container.style.pointerEvents = 'none';
            container.style.padding = '0'; // ป้องกัน padding ส่วนเกินที่ทำให้ดูใหญ่
        }
        toastEl.style.pointerEvents = 'auto';
    }
});