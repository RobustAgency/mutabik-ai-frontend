import EditAiRiskTreatment from "@/components/app/aiRiskTreatments/edit/EditAiRiskTreatment";

export default async function EditAiRiskTreatmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditAiRiskTreatment treatmentId={id} />;
}

