import KriIndicatorDetails from "@/components/app/kriIndicators/details/KriIndicatorDetails";

interface PageProps {
  params: { id: string };
}

export default function KriIndicatorDetailsPage({ params }: PageProps) {
  return <KriIndicatorDetails indicatorId={params.id} />;
}

