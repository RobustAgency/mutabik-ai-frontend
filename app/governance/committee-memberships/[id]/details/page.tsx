import CommitteeMembershipDetails from "@/components/app/committeeMemberships/details/CommitteeMembershipDetails";
import React from "react";

interface CommitteeMembershipDetailsPageProps {
  params: Promise<{ id: string }>;
}

const CommitteeMembershipDetailsPage = async ({ params }: CommitteeMembershipDetailsPageProps) => {
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
      <CommitteeMembershipDetails membershipId={membershipId} />
    </div>
  );
};

export default CommitteeMembershipDetailsPage;

