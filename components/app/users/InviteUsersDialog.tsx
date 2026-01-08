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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Plus } from "lucide-react";

import {
  useInviteTeamMutation,
  type TeamMember,
} from "@/app/lib/features/inviteApi";
import { extractErrorMessage } from "@/lib/api/rtkQueryBase";
import { ROLES, Member } from "@/components/onboarding/InviteTeam";
import { inviteUsersSchema } from "@/lib/schemas/inviteUsers.schema";

/* -------------------- Props -------------------- */

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

    const parsed = inviteUsersSchema.safeParse({
      members: members.filter((m) => m.email || m.role),
    });

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });
      return;
    }

    try {
      const response = await inviteTeam({
        members: parsed.data.members.map(
          (m): TeamMember => ({
            email: m.email.trim(),
            role: m.role,
          })
        ),
      }).unwrap();

      if (!response.error) {
        const failed = response.data?.failed ?? [];

        if (Array.isArray(failed) && failed.length > 0) {
          const failedEmails = failed
            .map((f: any) => f.email || f)
            .join(", ");
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
            <div key={idx} className="flex gap-3 items-end">
              {/* Email */}
              <div className="flex-1">
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
              <div className="flex gap-2 items-end">
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <Select
                    value={member.role}
                    onValueChange={(val) =>
                      handleMemberChange(idx, "role", val)
                    }
                  >
                    <SelectTrigger className="h-12 w-[180px]">
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
                </div>

                {/* Delete Icon */}
                <Trash2
                  size={18}
                  className="mb-3 text-red-500 cursor-pointer hover:text-red-600 transition"
                  onClick={() =>
                    !(members.length === 1 || isInviting) &&
                    removeMember(idx)
                  }
                  style={{
                    opacity: members.length === 1 || isInviting ? 0.5 : 1,
                    pointerEvents:
                      members.length === 1 || isInviting ? "none" : "auto",
                  }}
                />
              </div>
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
