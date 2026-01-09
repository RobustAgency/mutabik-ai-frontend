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
} from "@/app/lib/features/usersApi";
import { extractErrorMessage } from "@/lib/api/rtkQueryBase";
import { ROLES, Member } from "@/components/onboarding/InviteTeam";
import { inviteUsersSchema } from "@/lib/schemas/inviteUsers.schema";

/* -------------------- Props -------------------- */

interface InviteUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInviteSuccess?: () => void;
}

/* -------------------- Component -------------------- */

const InviteUsersDialog: React.FC<InviteUsersDialogProps> = ({
  open,
  onOpenChange,
  onInviteSuccess,
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

  const handleClose = () => {
    if (!isInviting) {
      setMembers([{ email: "", role: "" }]);
      onOpenChange(false);
    }
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
          toast.success(response.message || "Invitations sent successfully");
        }

        handleClose();
        onInviteSuccess?.();
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <DialogTitle className="text-xl font-semibold text-[#1D2939]">
                Invite Team Members
              </DialogTitle>
              <DialogDescription className="text-sm text-[#667085]">
                Add team members by entering their email addresses and assigning roles. They will receive an invitation to join your organization.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {members.map((member, idx) => (
              <div
                key={idx}
                className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#344054]">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="colleague@company.com"
                      value={member.email}
                      onChange={(e) =>
                        handleMemberChange(idx, "email", e.target.value)
                      }
                      disabled={isInviting}
                      className="h-11 bg-white border-gray-300 focus:border-[#4FD58F] focus:ring-[#4FD58F]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#344054]">
                      Role
                    </label>
                    <Select
                      value={member.role}
                      onValueChange={(val) =>
                        handleMemberChange(idx, "role", val)
                      }
                      disabled={isInviting}
                    >
                      <SelectTrigger className="h-11 w-full bg-white border-gray-300 focus:border-[#4FD58F] focus:ring-[#4FD58F]">
                        <SelectValue placeholder="Select a role" />
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
                </div>

                {members.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMember(idx)}
                    disabled={isInviting}
                    className="mt-8 h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                    <span className="sr-only">Remove member</span>
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addMember}
              disabled={isInviting}
              className="w-full h-11 border-dashed border-2 border-gray-300 hover:border-[#4FD58F] hover:bg-[#4FD58F]/5 hover:text-[#4FD58F] transition-colors"
            >
              <Plus size={18} className="mr-2" />
              Add Another Member
            </Button>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-200 bg-gray-50 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isInviting}
              className="h-11 px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isInviting || members.every((m) => !m.email || !m.role)}
              className="h-11 px-6 bg-[#4FD58F] hover:bg-[#45C77D] text-white"
            >
              {isInviting ? "Sending Invitations..." : `Send ${members.filter(m => m.email && m.role).length} Invitation${members.filter(m => m.email && m.role).length !== 1 ? 's' : ''}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUsersDialog;
