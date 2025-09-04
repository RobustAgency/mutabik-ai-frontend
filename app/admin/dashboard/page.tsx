import React from "react";

import DashboardInfoCards from "@/components/admin/dashboard/DashboardInfoCards";
import ProjectsTable from "@/components/admin/dashboard/ProjectsTable";
import ProjectsPerMonthChart from "@/components/admin/dashboard/ProjectsPerMonthChart";
import TotalCustomersChart from "@/components/admin/dashboard/TotalCustomersChart";
import { Separator } from "@/components/ui/separator"


const AdminDashboardPage = () => {
  return (
    <React.Fragment>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#171717]">Dashboard</h1>
      </div>
      <div>
        <DashboardInfoCards />
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
          <div className="bg-white rounded-xl shadow p-4 flex flex-col min-h-[340px]">
            <h1 className="text-lg font-bold ml-4 text-[#171717]">Projects Per Month</h1>
            <Separator />
            <ProjectsPerMonthChart />
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex flex-col min-h-[340px]">
            <h1 className="text-lg font-bold ml-4 text-[#171717]">Total Customers</h1>
             <Separator />
            <TotalCustomersChart />
          </div>
        </div>
        <ProjectsTable />
      </div>
    </React.Fragment>
  );
};

export default AdminDashboardPage;
