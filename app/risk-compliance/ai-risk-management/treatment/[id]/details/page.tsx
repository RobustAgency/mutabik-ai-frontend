import AiRiskTreatmentDetails from "@/components/app/aiRiskTreatments/details/AiRiskTreatmentDetails";

export default async function AiRiskTreatmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AiRiskTreatmentDetails treatmentId={id} />;
}

