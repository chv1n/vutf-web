// src/pages/admin/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { OverviewCards } from '../../components/features/admin/dashboard/OverviewCards';
import { VerificationStats } from '../../components/features/admin/dashboard/VerificationStats';
import { SystemAndUsers } from '../../components/features/admin/dashboard/SystemAndUsers';
import { RecentUploads } from '../../components/features/admin/dashboard/RecentUploads';
import { GroupRequests } from '../../components/features/admin/dashboard/GroupRequests';

// services
import { dashboardService } from '../../services/dashboard.service';

// types
import {
    IDashboardOverview,
    IVerificationStats,
    IRecentUpload,
    IGroupRequest
} from '../../types/dashboard.types';

const AdminDashboard = () => {
    const [overview, setOverview] = useState<IDashboardOverview | null>(null);
    const [verificationStats, setVerificationStats] = useState<IVerificationStats | null>(null);
    const [recentUploads, setRecentUploads] = useState<{ waitingForVerify: number; items: IRecentUpload[] } | null>(null);
    const [groupRequests, setGroupRequests] = useState<{ pendingCount: number; items: IGroupRequest[] } | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // ใช้ Promise.all เรียก API ผ่าน Service พร้อมกันเพื่อลดเวลาการโหลด
            const [resOverview, resVerStats, resUploads, resGroups] = await Promise.all([
                dashboardService.getOverviewStats(),
                dashboardService.getVerificationStats(), // สามารถใส่ { academicYear: 2568, term: 1 } ตรงนี้ได้ถ้าต้องการ Filter
                dashboardService.getRecentUploads(),
                dashboardService.getPendingGroupRequests()
            ]);

            // นำข้อมูลเข้า State
            if (resOverview.success) setOverview(resOverview.data);
            if (resVerStats.success) setVerificationStats(resVerStats.data);
            if (resUploads.success) setRecentUploads(resUploads.data);
            if (resGroups.success) setGroupRequests(resGroups.data);

        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            // TODO: เพิ่มการแสดงผลแจ้งเตือน (Toast) กรณีดึงข้อมูลไม่สำเร็จ
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleApproveGroup = async (groupId: string) => {
        try {
            await dashboardService.approveGroupRequest(groupId);
            const resGroups = await dashboardService.getPendingGroupRequests();
            if (resGroups.success) setGroupRequests(resGroups.data);

            alert('อนุมัติกลุ่มโครงงานสำเร็จ'); // (หรือใช้ Toast/SweetAlert แทน)
        } catch (error) {
            console.error('Approve failed:', error);
        }
    };

    const handleRejectGroup = async (groupId: string) => {
        try {
            const reason = window.prompt("กรุณาระบุเหตุผลที่ไม่อนุมัติกลุ่มนี้:");
            if (reason === null) return;

            await dashboardService.rejectGroupRequest(groupId, reason);
            const resGroups = await dashboardService.getPendingGroupRequests();
            if (resGroups.success) setGroupRequests(resGroups.data);

        } catch (error) {
            console.error('Reject failed:', error);
        }
    };

    const handleVerificationFilterChange = async (filter: { academicYear?: number; term?: number }) => {
        try {
            // โหลดข้อมูลเฉพาะส่วน Verification Stats ใหม่
            const resVerStats = await dashboardService.getVerificationStats(filter);
            if (resVerStats.success) {
                setVerificationStats(resVerStats.data);
            }
        } catch (error) {
            console.error('Failed to filter verification stats:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-slate-50 dark:bg-gray-900 min-h-screen transition-colors duration-200 font-sans">

            {/* Section 1: Project Group Status Overview */}
            <OverviewCards data={overview} />

            {/* Section 2: Thesis & System Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <VerificationStats
                    data={verificationStats}
                    onFilterChange={handleVerificationFilterChange}
                />
                <SystemAndUsers users={verificationStats?.users} />
            </div>

            {/* Section 3: Recent Activity & Requests */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                <RecentUploads data={recentUploads} />
                <GroupRequests
                    data={groupRequests}
                    onApprove={handleApproveGroup}
                    onReject={handleRejectGroup}
                />
            </div>

        </div>
    );
};

export default AdminDashboard;