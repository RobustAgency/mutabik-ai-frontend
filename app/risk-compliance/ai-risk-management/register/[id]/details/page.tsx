import AiRiskRegisterDetails from "@/components/app/aiRiskRegister/details/AiRiskRegisterDetails";

export default async function AiRiskRegisterDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AiRiskRegisterDetails riskId={id} />;
}

