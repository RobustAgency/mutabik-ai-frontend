import React from 'react'
import UsersTable from '@/components/admin/dashboard/UsersTable'
import DashboardInfoCards from '@/components/admin/dashboard/DashboardInfoCards'
import AdminDashboardCharts from '@/components/admin/dashboard/AdminDashboardCharts'
import DashboardTable from '@/components/admin/dashboard/DashboardTable'


const AdminDashboardPage = () => {
    return (
        <React.Fragment>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-[#171717]">Dashboard</h1>
            </div>
            <div>
                <DashboardInfoCards />
                <AdminDashboardCharts />
                 <DashboardTable />
            </div>

            {/* <div className="bg-white rounded-lg shadow">
               
            </div> */}
        </React.Fragment>
    )
}

export default AdminDashboardPage