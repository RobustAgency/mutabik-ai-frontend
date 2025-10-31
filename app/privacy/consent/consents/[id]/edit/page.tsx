"use client";

export const runtime = 'edge';

import { use } from "react";
import EditUserConsent from "@/components/app/userConsents/edit/EditUserConsent";

interface EditUserConsentPageProps {
  params: Promise<{ id: string }>;
}

const EditUserConsentPage = ({ params }: EditUserConsentPageProps) => {
  const { id } = use(params);
  return <EditUserConsent consentId={id} />;
};

export default EditUserConsentPage;

