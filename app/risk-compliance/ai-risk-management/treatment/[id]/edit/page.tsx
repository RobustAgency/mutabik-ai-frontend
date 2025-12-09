import EditAiRiskTreatment from "@/components/app/aiRiskTreatments/edit/EditAiRiskTreatment";

interface PageProps {
  params: { id: string };
}

export default function EditAiRiskTreatmentPage({ params }: PageProps) {
  return <EditAiRiskTreatment treatmentId={params.id} />;
}

