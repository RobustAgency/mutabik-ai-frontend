import EditKriIndicator from "@/components/app/kriIndicators/edit/EditKriIndicator";

export default async function EditKriIndicatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditKriIndicator indicatorId={id} />;
}

