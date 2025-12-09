import EditKriIndicator from "@/components/app/kriIndicators/edit/EditKriIndicator";

interface PageProps {
  params: { id: string };
}

export default function EditKriIndicatorPage({ params }: PageProps) {
  return <EditKriIndicator indicatorId={params.id} />;
}

