"use client";

import * as React from "react";
import type { User } from "@/app/lib/features/usersApi";
import {
  useAssignRoleMutation,
  useRevokeRoleMutation,
} from "@/app/lib/features/usersApi";
import { useGetRolesQuery } from "@/app/lib/features/rolesApi";
import type { UserRole } from "@/interfaces/UserRole";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

interface ManageUserRoleDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ManageUserRoleDialog: React.FC<ManageUserRoleDialogProps> = ({
  user,
  open,
  onOpenChange,
}) => {
  const { data: rolesData } = useGetRolesQuery({ page: 1, per_page: 100 });
  const roles: UserRole[] = rolesData?.data ?? [];

  const [selectedRoleId, setSelectedRoleId] = React.useState<string>("");

  const [assignRole, { isLoading: assigningRole }] = useAssignRoleMutation();
  const [revokeRole, { isLoading: revokingRole }] = useRevokeRoleMutation();

  const resetState = () => {
    setSelectedRoleId("");
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetState();
    }
    onOpenChange(nextOpen);
  };

  const handleAssignRole = async () => {
    if (!user || !selectedRoleId) return;
    try {
      await assignRole({
        userId: user.id,
        roleId: Number(selectedRoleId),
      }).unwrap();
      toast.success("Role assigned successfully");
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.error?.data?.message ||
        "Failed to assign role";
      toast.error(message);
    }
  };

  const handleRevokeRole = async () => {
    if (!user || !selectedRoleId) return;
    try {
      await revokeRole({
        userId: user.id,
        roleId: Number(selectedRoleId),
      }).unwrap();
      toast.success("Role revoked successfully");
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.error?.data?.message ||
        "Failed to revoke role";
      toast.error(message);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Manage permission set for {user.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-1">
            <Label className="text-sm font-medium text-gray-700">
              Permission set (role)
            </Label>
            <Select
              value={selectedRoleId}
              onValueChange={(value) => setSelectedRoleId(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={String(role.id)}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={handleAssignRole}
              disabled={assigningRole || !selectedRoleId}
            >
              {assigningRole ? "Assigning..." : "Assign role"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleRevokeRole}
              disabled={revokingRole || !selectedRoleId}
            >
              {revokingRole ? "Revoking..." : "Revoke role"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


