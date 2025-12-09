import EditAiRiskRegister from "@/components/app/aiRiskRegister/edit/EditAiRiskRegister";

interface PageProps {
  params: { id: string };
}

export default function EditAiRiskRegisterPage({ params }: PageProps) {
  return <EditAiRiskRegister riskId={params.id} />;
}

