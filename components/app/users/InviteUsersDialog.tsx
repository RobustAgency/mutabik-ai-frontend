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

/* -------------------- Constants -------------------- */

const ROLES = [
  { label: "Project Lead", value: Role.PROJECT_LEAD },
  { label: "Reviewer", value: Role.REVIEWER },
  { label: "Contributor", value: Role.CONTRIBUTOR },
  { label: "Auditor", value: Role.AUDITOR },
];

/* -------------------- Types -------------------- */

type Member = {
  email: string;
  role: Role | "";
};

interface InviteUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/* -------------------- Component -------------------- */

const InviteUsersDialog: React.FC<InviteUsersDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [members, setMembers] = React.useState<Member[]>([
    { email: "", role: "" },
  ]);

  const [inviteTeam, { isLoading: isInviting }] =
    useInviteTeamMutation();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validMembers = members.filter(
      (m) => m.email.trim() && m.role
    );

    if (!validMembers.length) {
      toast.error("Please add at least one team member");
      return;
    }

    try {
      const response = await inviteTeam({
        members: validMembers.map(
          (m): TeamMember => ({
            email: m.email.trim(),
            role: m.role as Role,
          })
        ),
      }).unwrap();

      // SUCCESS (backend uses error=false)
      if (response.error === false) {
        const failed = response.data?.failed ?? [];

        if (Array.isArray(failed) && failed.length > 0) {
          const failedEmails = failed
            .map((f: any) => f.email || f)
            .join(", ");

          toast.warn(
            `Invitations sent, but some failed: ${failedEmails}`
          );
        } else {
          toast.success(response.message);
        }

        onOpenChange(false);
        setMembers([{ email: "", role: "" }]);
      } else {
        toast.error(response.message || "Failed to send invitations");
      }
    } catch (error) {
      const message = extractErrorMessage(
        error,
        "An error occurred while sending invitations"
      );
      toast.error(message);
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invite team members</DialogTitle>
          <DialogDescription>
            For the purpose of industry regulation, your organization
            details are required
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {members.map((member, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Email
                </label>
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

              <div className="col-span-1">
                <label className="block text-sm font-medium mb-1">
                  Role
                </label>
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
                      <SelectItem
                        key={role.value}
                        value={role.value}
                      >
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={addMember}
              disabled={isInviting}
            >
              + Add new member
            </Button>
          </div>

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
              {isInviting
                ? "Sending invitations..."
                : "Invite team members"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUsersDialog;
