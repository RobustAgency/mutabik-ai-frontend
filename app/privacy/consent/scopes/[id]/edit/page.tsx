"use client";



import { use } from "react";
import EditConsentScope from "@/components/app/consentScopes/edit/EditConsentScope";

interface EditConsentScopePageProps {
  params: Promise<{ id: string }>;
}

const EditConsentScopePage = ({ params }: EditConsentScopePageProps) => {
  const { id } = use(params);
  return <EditConsentScope scopeId={id} />;
};

export default EditConsentScopePage;

