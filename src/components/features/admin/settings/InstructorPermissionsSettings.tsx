import { useState, useEffect } from 'react';
import { FiLoader, FiUsers, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { userService } from '../../../../services/user.service';
import { User, Permission } from '../../../../types/user';
import { PermissionsTable } from './PermissionsTable';
import { SettingsCard } from './SettingsCard';

export const InstructorPermissionsSettings = () => {
    const [instructors, setInstructors] = useState<User[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);

    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [savingId, setSavingId] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (isInitial = false) => {
        if (isInitial) setIsInitialLoading(true);
        else setIsRefreshing(true);

        try {
            const [instructorsRes, permsData] = await Promise.all([
                userService.getInstructors(1, 100),
                userService.getAllPermissions()
            ]);
            const activeInstructors = instructorsRes.data.filter((user: User) => user.isActive === true);
            setInstructors(activeInstructors);
            setPermissions(permsData);

        } catch (error) {
            console.error("Failed to fetch data", error);
            toast.error('ไม่สามารถโหลดข้อมูลสิทธิ์ได้');
        } finally {
            setIsInitialLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleTogglePermission = async (user: User, permissionId: number) => {
        setSavingId(user.user_uuid);
        try {
            const currentPerms = user.permissions || [];
            const hasPerm = currentPerms.some(p => p.permissions_id === permissionId);

            // คำนวณ Array สิทธิ์ใหม่ที่จะส่งไป Backend
            const newPermissionIds = hasPerm
                ? currentPerms.filter(p => p.permissions_id !== permissionId).map(p => p.permissions_id)
                : [...currentPerms.map(p => p.permissions_id), permissionId];

            // 1. ยิง API ไปอัปเดตที่ Backend
            await userService.updatePermissions(user.user_uuid, newPermissionIds);

            // 2. อัปเดต State หน้าบ้านให้ UI เปลี่ยนตามทันที (Optimistic Update)
            setInstructors(prev => prev.map(inst => {
                if (inst.user_uuid === user.user_uuid) {
                    const updatedPerms = hasPerm
                        ? currentPerms.filter(p => p.permissions_id !== permissionId)
                        : [...currentPerms, permissions.find(p => p.permissions_id === permissionId)!];
                    return { ...inst, permissions: updatedPerms };
                }
                return inst;
            }));

            // 3. แจ้งเตือนความสำเร็จ
            toast.success(`อัปเดตสิทธิ์ ${hasPerm ? 'ลบออก' : 'เพิ่ม'} สำเร็จ`);

        } catch (error) {
            console.error("Failed to update", error);
            toast.error('เกิดข้อผิดพลาดในการอัปเดตสิทธิ์');
        } finally {
            setSavingId(null);
        }
    };

    if (isInitialLoading) {
        return (
            <div className="flex justify-center p-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <FiLoader className="animate-spin text-blue-600" size={28} />
            </div>
        );
    }

    return (
        <SettingsCard
            title="จัดการสิทธิ์อาจารย์"
            description="กำหนดสิทธิ์การเข้าถึงเมนูต่างๆ ให้กับอาจารย์แต่ละท่าน"
            icon={<FiUsers />}
            action={
                <button
                    onClick={() => fetchData(false)}
                    disabled={isRefreshing}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 dark:hover:text-blue-400 rounded-lg transition-all disabled:opacity-50"
                    title="รีเฟรชข้อมูล"
                >
                    <FiRefreshCw size={20} className={isRefreshing ? "animate-spin text-blue-600" : ""} />
                </button>
            }
        >
            <PermissionsTable
                instructors={instructors}
                permissions={permissions}
                savingId={savingId}
                onToggle={handleTogglePermission}
            />
        </SettingsCard>
    );
};