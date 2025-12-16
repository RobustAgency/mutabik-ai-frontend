

import ControlsTable from "@/components/admin/controls/ControlsTable";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/custom/Breadcrumbs";

const page = () => {
  const breadcrumbItems = [{ label: "Controls" }, { label: "List" }];
  return (
    <div>
      <div className="flex items-center justify-between mt-2 mb-10">
        <h1 className="font-bold text-4xl text-neutral-900">Controls</h1>
        <Link href="/admin/compliance-library/controls/create">
          <Button className="bg-primary text-white">
            Create Control
          </Button>
        </Link>
      </div>
      <ControlsTable />
    </div>
  );
};

export default page;
