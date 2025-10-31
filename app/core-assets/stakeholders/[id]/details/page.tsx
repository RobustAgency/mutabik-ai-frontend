"use client";

export const runtime = 'edge';

import { use } from "react";
import StakeholderDetails from "@/components/app/stakeholders/details/StakeholderDetails";

interface StakeholderDetailsPageProps {
    params: Promise<{ id: string }>;
}

const StakeholderDetailsPage = ({ params }: StakeholderDetailsPageProps) => {
    const { id } = use(params);
    return <StakeholderDetails stakeholderId={id} />;
};

export default StakeholderDetailsPage;

