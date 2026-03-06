"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateRoleMutation,
  useGetPermissionsQuery,
} from "@/app/lib/features/rolesApi";
import { RolePermissionsMatrix } from "@/components/app/users/RolePermissionsMatrix";
import type { PermissionsTree } from "@/app/lib/features/rolesApi";
import { toast } from "react-toastify";
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const CreateRolePage: React.FC = () => {
  const router = useRouter();
  const { data: permissionsTree, isLoading: loadingPermissions } =
    useGetPermissionsQuery();
  const [createRole, { isLoading: creating }] = useCreateRoleMutation();

  const [name, setName] = React.useState("");
  const [nameError, setNameError] = React.useState<string | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = React.useState<
    number[]
  >([]);

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
    if (!validate()) return;

    try {
      await createRole({
        name: name.trim(),
        permissions: selectedPermissionIds,
      }).unwrap();
      toast.success("Role created successfully");
      router.push("/administration/users");
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.error?.data?.message ||
        "Failed to create role";
      toast.error(message);
    }
  };

  return (
    <PermissionPage permission={PERMISSIONS.ADMIN_ROLES_CREATE}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="p-6 border-[#E4E7EC] shadow-none space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-sans font-semibold text-lg tracking-normal text-[#1D2939]">
                Create role
              </h1>
              <p className="font-sans font-normal text-sm tracking-normal text-[#667085]">
                Define a new role and assign permissions across modules.
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
                placeholder="e.g. Compliance Manager"
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
                disabled={creating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create role"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PermissionPage>
  );
};

export default CreateRolePage;


