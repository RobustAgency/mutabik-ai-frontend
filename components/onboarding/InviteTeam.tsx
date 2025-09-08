
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

const ROLES = [
  { label: "Admin", value: "admin" },
  { label: "Member", value: "member" },
  { label: "Viewer", value: "viewer" },
];

type Member = {
  email: string;
  role: string;
};

const InviteTeam = () => {
      const router = useRouter();
  const [members, setMembers] = useState<Member[]>([
    { email: "", role: "" },
    { email: "", role: "" },
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
    // Filter out empty members
    // Filter out empty members (for future API use)
    // const filtered = members.filter(m => m.email && m.role);
    try {
      // TODO: Replace with actual API call
      await new Promise((res) => setTimeout(res, 1200));
      router.push("/onboarding?mode=plans")
      // Show success toast or redirect
      alert("Invitations sent successfully!");
    } catch {
      // Show error toast
      alert("Failed to send invitations.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[60vh] justify-center">
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
              className="flex flex-col items-center  md:flex-row gap-4 md:gap-6"
            >
              <div className="flex-1">
                <label className="block text-sm font-medium text-[#344054] mb-1">Email</label>
                <Input
                  type="email"
                  placeholder="member@team.com"
                  value={member.email}
                  onChange={e => handleMemberChange(idx, "email", e.target.value)}
                  required={false}
                  className="h-[44px] w-[408px] text-sm placeholder:text-[#98A2B3]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-[#344054] mb-1">Role</label>
                <Select
                  value={member.role}
                  onValueChange={val => handleMemberChange(idx, "role", val)}
                >
                  <SelectTrigger className="h-12 text-base">
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
            className="gap-2 px-4 py-6 h-[44px w-[171px] rounded-lg border border-[#D0D5DD] bg-[#FFFFFF] text-gray-700 hover:bg-gray-100"
            onClick={addMember}
          >
            <span className="text-sm font-medium border-2 pb-1 border-[#344054] flex justify-center items-center rounded-full w-[15px] h-[15px]   text-[#344054]">+</span> Add new member
          </Button>
        </div>
        <Button
          type="submit"
          className="w-full max-w-[594px] h-[44px] mt-8  text-sm font-medium rounded-lg bg-primary hover:bg-[#32c986] text-white transition"
          disabled={submitting}
        >
          Skip and continue
        </Button>
      </form>
    </div>
  );
};

export default InviteTeam;
