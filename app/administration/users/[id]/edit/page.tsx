"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetRoleQuery,
  useUpdateRoleMutation,
  useGetPermissionsQuery,
} from "@/app/lib/features/rolesApi";
import type { PermissionsTree } from "@/app/lib/features/rolesApi";
import { RolePermissionsMatrix } from "@/components/app/users/RolePermissionsMatrix";
import { toast } from "react-toastify";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const EditRolePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id;
  const roleId = typeof idParam === "string" ? Number(idParam) : NaN;

  const { data: role, isLoading: loadingRole } = useGetRoleQuery(roleId, {
    skip: Number.isNaN(roleId),
  });
  const { data: permissionsTree, isLoading: loadingPermissions } =
    useGetPermissionsQuery();
  const [updateRole, { isLoading: updating }] = useUpdateRoleMutation();

  const [name, setName] = React.useState("");
  const [nameError, setNameError] = React.useState<string | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = React.useState<
    number[]
  >([]);

  React.useEffect(() => {
    if (role) {
      setName(role.name);
      setSelectedPermissionIds(
        (role.permissions ?? []).map((permission) => permission.id)
      );
    }
  }, [role]);

  const validate = (): boolean => {
    if (!name.trim()) {
      setNameError("Role name is required");
      return false;
    }
    setNameError(null);
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate() || Number.isNaN(roleId)) return;

    try {
      await updateRole({
        id: roleId,
        data: {
          name: name.trim(),
          permissions: selectedPermissionIds,
        },
      }).unwrap();
      toast.success("Role updated successfully");
      router.push("/administration/users");
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.error?.data?.message ||
        "Failed to update role";
      toast.error(message);
    }
  };

  const content = (() => {
    if (loadingRole || Number.isNaN(roleId)) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Card className="p-6 border-[#E4E7EC] shadow-none">
            <p className="text-sm text-[#667085]">Loading role...</p>
          </Card>
        </div>
      );
    }

    if (!role) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Card className="p-6 border-[#E4E7EC] shadow-none">
            <p className="text-sm text-red-500">Role not found.</p>
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => router.push("/administration/users")}
              >
                Back to roles
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="p-6 border-[#E4E7EC] shadow-none space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                Edit role
              </h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                Update the role name and adjust permissions using the matrix
                below.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 max-w-md">
              <Label htmlFor="role-name">Role name</Label>
              <Input
                id="role-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              {nameError && (
                <p className="text-sm text-red-500 mt-1">{nameError}</p>
              )}
            </div>

            <div className="space-y-3">
              <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">
                Permissions
              </h2>
              <p className="font-sans font-normal text-sm leading-5 tracking-normal text-[#667085]">
                Use the matrix below to configure which actions this role can
                perform for each module and screen.
              </p>
              <RolePermissionsMatrix
                permissionsTree={(permissionsTree as PermissionsTree) ?? {}}
                selectedPermissionIds={selectedPermissionIds}
                onChange={setSelectedPermissionIds}
              />
              {loadingPermissions && (
                <p className="text-sm text-[#98A2B3] mt-2">
                  Loading permissions...
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/administration/users")}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updating}>
                {updating ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  })();

  return (
    <PermissionPage permission={PERMISSIONS.ADMIN_ROLES_EDIT}>
      {content}
    </PermissionPage>
  );
};

export default EditRolePage;


