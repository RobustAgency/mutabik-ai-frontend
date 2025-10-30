"use client";

import { use } from "react";
import EditStakeholder from "@/components/app/stakeholders/edit/EditStakeholder";

interface StakeholderEditPageProps {
  params: Promise<{ id: string }>;
}

const StakeholderEditPage = ({ params }: StakeholderEditPageProps) => {
  const { id } = use(params);
  return <EditStakeholder stakeholderId={id} />;
};

export default StakeholderEditPage;

