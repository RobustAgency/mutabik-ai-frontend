"use client"

export const runtime = 'edge';
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import EmptyState from "@/components/onboarding/EmptyState";
import UnApprovedAccount from "@/components/onboarding/UnApprovedAccount";
import AddPaymentMethod from "@/components/onboarding/AddPaymentMethod";
import OrganizationSetup from "@/components/onboarding/OrganizationSetup";
import InviteTeam from "@/components/onboarding/InviteTeam";
import Plans from "@/components/onboarding/Plans";

const COMPONENTS: Record<string, React.ReactNode> = {
  "unapproved-account": <UnApprovedAccount />,
  "add-payment-method": <AddPaymentMethod />,
  "organization-setup": <OrganizationSetup />,
  "invite-team": <InviteTeam />,
  "plans": <Plans />
};

function OnboardingContent() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const modeParam = searchParams.get("mode") || "";
    setMode(modeParam);
  }, [searchParams]);

  if (!isMounted) {
    return <EmptyState />;
  }

  return COMPONENTS[mode] || <EmptyState />;
}

export default function Onboarding() {
  return (
    <Suspense fallback={<EmptyState />}>
      <OnboardingContent />
    </Suspense>
  );
}
