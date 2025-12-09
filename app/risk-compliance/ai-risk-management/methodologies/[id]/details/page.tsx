import RiskMethodologyDetails from "@/components/app/riskMethodologies/details/RiskMethodologyDetails";

export default async function RiskMethodologyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RiskMethodologyDetails methodologyId={id} />;
}

