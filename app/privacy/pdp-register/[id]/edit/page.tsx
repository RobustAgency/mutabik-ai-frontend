export const runtime = 'edge';

import EditPdpProcessingRegister from "@/components/app/pdpProcessingRegister/edit/EditPdpProcessingRegister";

interface PdpProcessingRegisterEditPageProps {
  params: Promise<{ id: string }>;
}

const PdpProcessingRegisterEditPage = async ({ params }: PdpProcessingRegisterEditPageProps) => {
  const { id } = await params;
  return (
    <div>
      <EditPdpProcessingRegister registerId={id} />
    </div>
  );
};

export default PdpProcessingRegisterEditPage;

