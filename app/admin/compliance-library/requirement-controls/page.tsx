import RequirementControlsList from "@/components/admin/requirement-controls/RequirementControlsList";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const page = () => {
  return (
    <div>
      <div className="flex items-center justify-between mt-2 mb-10">
        <h1 className="font-bold text-4xl text-neutral-900">Requirement Controls</h1>
        <Link href="/admin/compliance-library/requirement-controls/create">
          <Button className="bg-primary text-white">Create Requirement Control</Button>
        </Link>
      </div>
      <RequirementControlsList />
    </div>
  );
};

export default page;

