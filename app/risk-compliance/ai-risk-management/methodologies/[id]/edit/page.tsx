import EditRiskMethodology from "@/components/app/riskMethodologies/edit/EditRiskMethodology";

export default async function EditRiskMethodologyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditRiskMethodology methodologyId={id} />;
}

