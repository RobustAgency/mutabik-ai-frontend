"use client";

import React from "react";
import { Button } from "@/components/ui/button";
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

import { ROLES } from "@/components/onboarding/InviteTeam";

/* -------------------- Types -------------------- */

interface GroupForm {
  userId: string;
  role: string;
}

/* -------------------- Props -------------------- */

interface InviteUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: GroupForm) => void;
}

/* -------------------- Component -------------------- */

const InviteUsersDialog: React.FC<InviteUsersDialogProps> = ({
  open,
  onOpenChange,
  onSave,
}) => {
  const [form, setForm] = React.useState<GroupForm>({
    userId: "",
    role: "",
  });

  const handleClose = () => {
    setForm({ userId: "", role: "" });
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.userId || !form.role) {
      toast.error("Please select both user and role");
      return;
    }

    onSave?.(form);
    toast.success("Saved successfully");
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      {/* ⬇️ Reduced width & padding */}
      <DialogContent className="max-w-sm p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-3 border-b border-gray-200">
          <DialogTitle className="text-base font-semibold text-[#1D2939]">
            Add Group
          </DialogTitle>
          <DialogDescription className="text-xs text-[#667085]">
            Select a user and assign a role.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {/* ⬇️ Compact body spacing */}
          <div className="px-4 py-4 space-y-4">
            {/* Select User */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#344054]">
                Select User
              </label>
              <Select
                value={form.userId}
                onValueChange={(val) =>
                  setForm((prev) => ({ ...prev, userId: val }))
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Choose user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Ahmad Khokhar</SelectItem>
                  <SelectItem value="2">Ali Raza</SelectItem>
                  <SelectItem value="3">Fatima Noor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Select Role */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#344054]">
                Select Role
              </label>
              <Select
                value={form.role}
                onValueChange={(val) =>
                  setForm((prev) => ({ ...prev, role: val }))
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Choose role" />
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

          {/* ⬇️ Compact footer */}
          <DialogFooter className="px-4 py-3 border-t border-gray-200 bg-gray-50 gap-2 rounded-b-lg">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-9 px-4 text-sm"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!form.userId || !form.role}
              className="h-9 px-4 text-sm bg-[#4FD58F] hover:bg-[#45C77D] text-white"
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUsersDialog;
