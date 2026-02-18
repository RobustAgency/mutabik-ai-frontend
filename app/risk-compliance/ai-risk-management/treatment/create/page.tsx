import CreateAiRiskTreatment from "@/components/app/aiRiskTreatments/create/CreateAiRiskTreatment";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

export default function CreateAiRiskTreatmentPage() {
  return (
    <PermissionPage permission={PERMISSIONS.AI_RISK_TREATMENTS_CREATE}>
      <CreateAiRiskTreatment />
    </PermissionPage>
  );
}

