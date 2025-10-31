"use client";

export const runtime = 'edge';

import { use } from "react";
import ConsentScopeDetails from "@/components/app/consentScopes/details/ConsentScopeDetails";

interface ConsentScopeDetailsPageProps {
  params: Promise<{ id: string }>;
}

const ConsentScopeDetailsPage = ({ params }: ConsentScopeDetailsPageProps) => {
  const { id } = use(params);
  return <ConsentScopeDetails scopeId={id} />;
};

export default ConsentScopeDetailsPage;

