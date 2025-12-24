import EditCommitteeMembership from "@/components/app/committeeMemberships/edit/EditCommitteeMembership";
import React from "react";

interface CommitteeMembershipEditPageProps {
  params: Promise<{ id: string }>;
}

const CommitteeMembershipEditPage = async ({ params }: CommitteeMembershipEditPageProps) => {
  const { id } = await params;
  const membershipId = parseInt(id, 10);

  if (isNaN(membershipId)) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="p-6 border-[#E4E7EC] shadow-none rounded-lg">
          <p className="text-[#667085]">Invalid membership ID</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <EditCommitteeMembership membershipId={membershipId} />
    </div>
  );
};

export default CommitteeMembershipEditPage;

