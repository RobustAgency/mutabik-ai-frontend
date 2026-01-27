"use client";

import * as React from "react";
import type { User } from "@/app/lib/features/usersApi";
import {
  useAssignPermissionMutation,
  useRevokePermissionMutation,
} from "@/app/lib/features/usersApi";
import { useGetPermissionsQuery } from "@/app/lib/features/rolesApi";
import type { Permission } from "@/interfaces/Permission";
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
import type { PermissionsTree } from "@/app/lib/features/rolesApi";

interface ManageUserAccessDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const toTitleCase = (value: string): string =>
  value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const ManageUserAccessDialog: React.FC<
  ManageUserAccessDialogProps
> = ({ user, open, onOpenChange }) => {
  const { data: permissionsTree } = useGetPermissionsQuery();

  const permissionsTreeTyped: PermissionsTree =
    (permissionsTree as PermissionsTree | undefined) ?? {};

  const modules = React.useMemo(
    () => Object.keys(permissionsTreeTyped),
    [permissionsTreeTyped]
  );

  const [selectedModule, setSelectedModule] = React.useState<string>("");
  const [selectedScreen, setSelectedScreen] = React.useState<string>("");
  const [selectedPermissionId, setSelectedPermissionId] =
    React.useState<string>("");

  const screensForModule = React.useMemo(() => {
    if (!selectedModule) return Object.keys(permissionsTreeTyped[selectedModule] ?? {});
    return Object.keys(permissionsTreeTyped[selectedModule] ?? {});
  }, [permissionsTreeTyped, selectedModule]);

  const permissionsForSelection: Permission[] = React.useMemo(() => {
    if (!selectedModule || !selectedScreen) return [];
    const tree = (permissionsTree as PermissionsTree | undefined) ?? {};
    const screens = tree[selectedModule];
    if (!screens) return [];
    const permissions = screens[selectedScreen];
    return permissions ?? [];
  }, [permissionsTree, selectedModule, selectedScreen]);

  const [assignPermission, { isLoading: assigningPermission }] =
    useAssignPermissionMutation();
  const [revokePermission, { isLoading: revokingPermission }] =
    useRevokePermissionMutation();

  const resetState = () => {
    setSelectedModule("");
    setSelectedScreen("");
    setSelectedPermissionId("");
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetState();
    }
    onOpenChange(nextOpen);
  };

  const handleAssignPermission = async () => {
    if (!user || !selectedPermissionId) return;
    try {
      await assignPermission({
        userId: user.id,
        permissionId: Number(selectedPermissionId),
      }).unwrap();
      toast.success("Permission assigned successfully");
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.error?.data?.message ||
        "Failed to assign permission";
      toast.error(message);
    }
  };

  const handleRevokePermission = async () => {
    if (!user || !selectedPermissionId) return;
    try {
      await revokePermission({
        userId: user.id,
        permissionId: Number(selectedPermissionId),
      }).unwrap();
      toast.success("Permission revoked successfully");
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.error?.data?.message ||
        "Failed to revoke permission";
      toast.error(message);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Manage granular permissions for {user.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <section className="space-y-3">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Module
              </Label>
              <Select
                value={selectedModule}
                onValueChange={(value) => {
                  setSelectedModule(value);
                  setSelectedScreen("");
                  setSelectedPermissionId("");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a module" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((moduleKey) => (
                    <SelectItem key={moduleKey} value={moduleKey}>
                      {toTitleCase(moduleKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Screen
              </Label>
              <Select
                value={selectedScreen}
                onValueChange={(value) => {
                  setSelectedScreen(value);
                  setSelectedPermissionId("");
                }}
                disabled={!selectedModule}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a screen" />
                </SelectTrigger>
                <SelectContent>
                  {screensForModule.map((screenKey) => (
                    <SelectItem key={screenKey} value={screenKey}>
                      {toTitleCase(screenKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700">
                Permission
              </Label>
              <Select
                value={selectedPermissionId}
                onValueChange={(value) => setSelectedPermissionId(value)}
                disabled={!selectedModule || !selectedScreen}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a permission" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {permissionsForSelection.map((permission) => (
                    <SelectItem
                      key={permission.id}
                      value={String(permission.id)}
                    >
                      {permission.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={handleAssignPermission}
                disabled={
                  assigningPermission ||
                  !selectedModule ||
                  !selectedScreen ||
                  !selectedPermissionId
                }
              >
                {assigningPermission ? "Assigning..." : "Assign permission"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleRevokePermission}
                disabled={
                  revokingPermission ||
                  !selectedModule ||
                  !selectedScreen ||
                  !selectedPermissionId
                }
              >
                {revokingPermission ? "Revoking..." : "Revoke permission"}
              </Button>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};


