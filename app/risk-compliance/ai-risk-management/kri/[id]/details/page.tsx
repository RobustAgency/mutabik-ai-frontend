import KriIndicatorDetails from "@/components/app/kriIndicators/details/KriIndicatorDetails";

export default async function KriIndicatorDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <KriIndicatorDetails indicatorId={id} />;
}

