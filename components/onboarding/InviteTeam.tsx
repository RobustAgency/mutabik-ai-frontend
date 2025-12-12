
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Role } from "@/interfaces/Roles";
import { inviteService, type TeamMember } from "@/service/app/invite";

const ROLES = [
  { label: "Project Lead", value: Role.PROJECT_LEAD },
  { label: "Reviewer", value: Role.REVIEWER },
  { label: "Contributor", value: Role.CONTRIBUTOR },
  { label: "Auditor", value: Role.AUDITOR },
];

type Member = {
  email: string;
  role: string;
};

const InviteTeam = () => {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([
    { email: "", role: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const handleMemberChange = (idx: number, field: keyof Member, value: string) => {
    setMembers((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const addMember = () => {
    setMembers((prev) => [...prev, { email: "", role: "" }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Filter out empty members and validate
      const validMembers = members.filter(member =>
        member.email.trim() !== '' && member.role !== ''
      );

      if (validMembers.length === 0) {
        toast.error('Please add at least one team member with email and role');
        return;
      }

      // Prepare payload
      const teamMembers: TeamMember[] = validMembers.map(member => ({
        email: member.email.trim(),
        role: member.role as Role
      }));

      const response = await inviteService.inviteTeamMembers({ members: teamMembers });

      if (response.success) {
        toast.success(response.message || 'Team invitations sent successfully!');
        router.push('/onboarding?mode=plans');
      } else {
        toast.error(response.message || 'Failed to send invitations');
      }
    } catch (error) {
      console.error("Failed to send invitations:", error);
      toast.error('An error occurred while sending invitations');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkipAndContinue = () => {
    router.push('/onboarding?mode=plans');
  };

  return (
    <div className="flex flex-col min-h-[60vh]  px-2 md:px-0">
      <form
        className="w-full max-w-2xl bg-white"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h1 className="text-xl md:text-4xl font-bold text-[#1D2939] mb-2">Invite your team</h1>
        <p className="text-[#667085] mb-8 text-xs md:text-sm">
          For the purpose of industry regulation, your organization details are required
        </p>
        <div className="flex flex-col gap-6">
          {members.map((member, idx) => (
            <div
              key={idx}
              className="grid grid-cols-3 gap-4"
            >
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#344054] mb-1">Email</label>
                <Input
                  type="email"
                  placeholder="member@team.com"
                  value={member.email}
                  onChange={e => handleMemberChange(idx, "email", e.target.value)}
                  required={false}
                  className="w-full text-sm placeholder:text-[#98A2B3] h-12"
                />
              </div>
              <div className="col-span-1 min-h-11">
                <label className="block text-sm font-medium text-[#344054] mb-1">Role</label>
                <Select
                  key={`member-role-${idx}-${member.role || "none"}`}
                  value={member.role}
                  onValueChange={val => handleMemberChange(idx, "role", val)}
                >
                  <SelectTrigger className="text-base w-full !h-[48px]">
                    <SelectValue placeholder="Select Option" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Button
            type="button"
            variant="outline"
            className="gap-2 px-4 py-2 h-11 w-full md:w-[171px] rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] text-gray-700 hover:bg-gray-100"
            onClick={addMember}
          >
            <span className="text-sm font-medium border-2 pb-1 border-[#344054] flex justify-center items-center rounded-full w-[15px] h-[15px] text-[#344054]">+</span> Add new member
          </Button>
        </div>
        <Button
          type="submit"
          className="w-full h-11 mt-8"
          disabled={submitting}
        >
          {submitting ? 'Sending Invitations...' : 'Invite team members'}
        </Button>
        <Button
          type="button"
          className="w-full h-11 mt-4"
          disabled={submitting}
          variant={"outline"}
          onClick={handleSkipAndContinue}
        >
          Skip and continue
        </Button>
      </form>
    </div>
  );
};

export default InviteTeam;
