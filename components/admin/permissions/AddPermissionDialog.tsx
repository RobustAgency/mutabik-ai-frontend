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

import { ROLES } from "@/components/onboarding/InviteTeam";

/* -------------------- Types -------------------- */

interface GroupForm {
  groupName: string;
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
    groupName: "",
    userId: "",
    role: "",
  });

  const resetForm = () => {
    setForm({ groupName: "", userId: "", role: "" });
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.groupName || !form.userId || !form.role) {
      toast.error("Please fill all fields");
      return;
    }

    onSave?.(form);
    toast.success("Saved successfully");
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-xs p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-4 pt-4 pb-3 border-b border-gray-200">
          <DialogTitle className="text-base font-semibold text-[#1D2939]">
            Add Group
          </DialogTitle>
          <DialogDescription className="text-xs text-[#667085]">
            Create a group and assign a user role.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="px-4 py-4 space-y-4">
            {/* Group Name */}
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-medium text-[#344054]">
                Group Name
              </label>
              <Input
                value={form.groupName}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    groupName: e.target.value,
                  }))
                }
                placeholder="Enter group name"
                className="h-9 text-sm w-full "
              />
            </div>

            {/* Select User */}
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-medium text-[#344054]">
                Select User
              </label>
              <Select
                value={form.userId}
                onValueChange={(val) =>
                  setForm((prev) => ({ ...prev, userId: val }))
                }
              >
                <SelectTrigger className="h-9 text-sm w-full">
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
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-medium text-[#344054]">
                Select Role
              </label>
              <Select
                value={form.role}
                onValueChange={(val) =>
                  setForm((prev) => ({ ...prev, role: val }))
                }
              >
                <SelectTrigger className="h-9 text-sm w-full">
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
              disabled={!form.groupName || !form.userId || !form.role}
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
