import ControlsTable from "@/components/admin/controls/ControlsTable";
import React from "react";

import Breadcrumbs from "@/components/custom/Breadcrumbs";

const page = () => {
  const breadcrumbItems = [{ label: "Frameworks" }, { label: "List" }];
  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex items-center justify-between mt-2 mb-10">
        <h1 className="font-bold text-lg sm:text-2xl md:text-3xl text-neutral-900">Frameworks</h1>
      </div>
      <ControlsTable />
    </div>
  );
};

export default page;
