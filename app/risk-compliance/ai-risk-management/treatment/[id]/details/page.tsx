import AiRiskTreatmentDetails from "@/components/app/aiRiskTreatments/details/AiRiskTreatmentDetails";

interface PageProps {
  params: { id: string };
}

export default function AiRiskTreatmentDetailsPage({ params }: PageProps) {
  return <AiRiskTreatmentDetails treatmentId={params.id} />;
}

