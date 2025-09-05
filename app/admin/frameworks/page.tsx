import React from 'react';
import FrameworkTable from '../../../components/admin/dashboard/FrameworkTable';
import Link from "next/link";

const Page = () => {
  return (
    <div className="py-8 pr-8 w-full max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24, gap: 20 }}>
        <span style={{ color: "#737373", fontSize: 16, fontWeight: 500 }}>Frameworks</span>
        <span style={{ color: "#A3A3A3", width: 10 }}>&gt;</span>
        <span style={{ color: "#737373", fontSize: 16, fontWeight: 500 }}>List</span>
        <Link href="/admin/createFramework" style={{ color: "#737373", fontSize: 16, fontWeight: 500 }}>Create Framework</Link>
      </div>
      {/* Heading */}
      <h1 style={{ fontWeight: 700, fontSize: 32, marginBottom: 32, color: "#171717" }}>Frameworks</h1>
      <FrameworkTable />
    </div>
  );
};

export default Page;
