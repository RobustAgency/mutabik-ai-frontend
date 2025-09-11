"use client";

import TagsTable from "@/components/admin/tags/TagsTable";
import React, { useState } from "react";
import Breadcrumbs from "@/components/custom/Breadcrumbs";
import { Button } from "@/components/ui/button";
import TagsModal from "@/components/admin/tags/TagsModal/TagsModal";

const Page = () => {
  const [openModal, setOpenModal] = useState(false);

  const breadcrumbItems = [{ label: "Tags" }, { label: "List" }];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex items-center justify-between mt-2 mb-10">
        <h1 className="font-bold text-lg sm:text-2xl md:text-3xl text-neutral-900">Tags</h1>
        <Button
          className="px-3 md:px-6 py-2 rounded-lg"
          onClick={() => setOpenModal(true)}
        >
          Create Tags
        </Button>
      </div>
      <TagsTable />
      <TagsModal open={openModal} onOpenChange={setOpenModal} />
    </>
  );
};

export default Page;
