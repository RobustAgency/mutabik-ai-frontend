"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { Role } from "@/interfaces/Roles";
import {
  useInviteTeamMutation,
  type TeamMember,
} from "@/app/lib/features/inviteApi";
import { extractErrorMessage } from "@/lib/api/rtkQueryBase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Plus } from "lucide-react";
import { ROLES,Member } from "@/components/onboarding/InviteTeam";
/* -------------------- Constants -------------------- */

// const ROLES = [
//   { label: "Project Lead", value: Role.PROJECT_LEAD },
//   { label: "Reviewer", value: Role.REVIEWER },
//   { label: "Contributor", value: Role.CONTRIBUTOR },
//   { label: "Auditor", value: Role.AUDITOR },
// ];

/* -------------------- Types -------------------- */

// type Member = {
//   email: string;
//   role: Role | "";
// };

interface InviteUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/* -------------------- Helpers -------------------- */

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/* -------------------- Component -------------------- */

const InviteUsersDialog: React.FC<InviteUsersDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [members, setMembers] = React.useState<Member[]>([
    { email: "", role: "" },
  ]);

  const [inviteTeam, { isLoading: isInviting }] = useInviteTeamMutation();

  /* -------------------- Handlers -------------------- */

  const handleMemberChange = (
    idx: number,
    field: keyof Member,
    value: string
  ) => {
    setMembers((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const addMember = () => {
    setMembers((prev) => [...prev, { email: "", role: "" }]);
  };

  const removeMember = (idx: number) => {
    setMembers((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validMembers = members.filter((m) => m.email.trim() && m.role);

    if (!validMembers.length) {
      toast.error("Please add at least one team member");
      return;
    }

    const invalidEmail = validMembers.find((m) => !isValidEmail(m.email));

    if (invalidEmail) {
      toast.error(`Invalid email: ${invalidEmail.email}`);
      return;
    }

    const emails = validMembers.map((m) => m.email.trim());
    const duplicates = emails.filter((email, i) => emails.indexOf(email) !== i);

    if (duplicates.length) {
      toast.error(`Duplicate emails: ${duplicates.join(", ")}`);
      return;
    }

    try {
      const response = await inviteTeam({
        members: validMembers.map(
          (m): TeamMember => ({
            email: m.email.trim(),
            role: m.role!,
          })
        ),
      }).unwrap();

      if (response.error === false) {
        const failed = response.data?.failed ?? [];

        if (Array.isArray(failed) && failed.length > 0) {
          const failedEmails = failed.map((f: any) => f.email || f).join(", ");
          toast.warn(`Invitations sent, but some failed: ${failedEmails}`);
        } else {
          toast.success(response.message);
        }

        onOpenChange(false);
        setMembers([{ email: "", role: "" }]);
      } else {
        toast.error(response.message || "Failed to send invitations");
      }
    } catch (error) {
      toast.error(
        extractErrorMessage(
          error,
          "An error occurred while sending invitations"
        )
      );
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center mt-2">
            <div>
              <DialogTitle>Invite team members</DialogTitle>
              <DialogDescription>
                Add one or more users and assign roles
              </DialogDescription>
            </div>

            {/* Add Member Button - Top Right */}

            <Button
              type="button"
              variant="outline"
              onClick={addMember}
              disabled={isInviting}
              className="flex items-center gap-2 ml-auto mr-3"
            >
              <Plus size={16} />
              Add member
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {members.map((member, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  placeholder="member@team.com"
                  value={member.email}
                  onChange={(e) =>
                    handleMemberChange(idx, "email", e.target.value)
                  }
                  className="h-12"
                />
              </div>

              {/* Role */}
              <div className="flex items-center justify-center gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <div className="flex items-center justify-center gap-5">
                    <Select
                    value={member.role}
                    onValueChange={(val) =>
                      handleMemberChange(idx, "role", val)
                    }
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                    <div className="">
                  <Trash2
                    className={`
      text-red-500
      cursor-pointer
      transition
      hover:text-red-600
      disabled:opacity-50
      disabled:cursor-not-allowed
    `}
                    role="button"
                    aria-label="Remove member"
                    size={18}
                    tabIndex={members.length === 1 || isInviting ? -1 : 0}
                    onClick={() => {
                      if (members.length === 1 || isInviting) return;
                      removeMember(idx);
                    }}
                    onKeyDown={(e) => {
                      if (
                        (e.key === "Enter" || e.key === " ") &&
                        !(members.length === 1 || isInviting)
                      ) {
                        e.preventDefault();
                        removeMember(idx);
                      }
                    }}
                    style={{
                      opacity: members.length === 1 || isInviting ? 0.5 : 1,
                      pointerEvents:
                        members.length === 1 || isInviting ? "none" : "auto",
                    }}
                  />
                </div>
                  </div>
                  

                </div>

                
              </div>

              {/* Delete Icon Button */}
            </div>
          ))}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isInviting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isInviting}>
              {isInviting ? "Sending invitations..." : "Invite team members"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUsersDialog;
