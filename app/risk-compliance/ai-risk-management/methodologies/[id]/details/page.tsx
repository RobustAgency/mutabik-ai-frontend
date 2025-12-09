import RiskMethodologyDetails from "@/components/app/riskMethodologies/details/RiskMethodologyDetails";

interface PageProps {
  params: { id: string };
}

export default function RiskMethodologyDetailsPage({ params }: PageProps) {
  return <RiskMethodologyDetails methodologyId={params.id} />;
}

