"use client";

import { use } from "react";
import UserConsentDetails from "@/components/app/userConsents/details/UserConsentDetails";

interface UserConsentDetailsPageProps {
  params: Promise<{ id: string }>;
}

const UserConsentDetailsPage = ({ params }: UserConsentDetailsPageProps) => {
  const { id } = use(params);
  return <UserConsentDetails consentId={id} />;
};

export default UserConsentDetailsPage;

