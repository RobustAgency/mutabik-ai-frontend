"use client";
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

export default function Onboarding() {
  const mode = useSearchParams().get("mode") || "";
  return COMPONENTS[mode] || <EmptyState />;
}
