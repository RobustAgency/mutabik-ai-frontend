import AiRiskRegisterDetails from "@/components/app/aiRiskRegister/details/AiRiskRegisterDetails";

interface PageProps {
  params: { id: string };
}

export default function AiRiskRegisterDetailsPage({ params }: PageProps) {
  return <AiRiskRegisterDetails riskId={params.id} />;
}

