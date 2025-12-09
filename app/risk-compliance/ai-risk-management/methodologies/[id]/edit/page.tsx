import EditRiskMethodology from "@/components/app/riskMethodologies/edit/EditRiskMethodology";

interface PageProps {
  params: { id: string };
}

export default function EditRiskMethodologyPage({ params }: PageProps) {
  return <EditRiskMethodology methodologyId={params.id} />;
}

