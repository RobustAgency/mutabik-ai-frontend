import EditAiRiskRegister from "@/components/app/aiRiskRegister/edit/EditAiRiskRegister";

export default async function EditAiRiskRegisterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditAiRiskRegister riskId={id} />;
}

