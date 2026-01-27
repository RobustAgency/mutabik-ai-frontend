import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import AddAdminUserDialog from "@/components/admin/adminUsers/AddAdminUserDialog";
import { OrganizationMember } from "@/interfaces/Organization";
import { CreateAdminUserRequest } from "@/service/admin/adminUsers";

interface OrganizationAdminSectionProps {
  admin: OrganizationMember | null;
  onCreateAdmin: (payload: CreateAdminUserRequest) => Promise<boolean>;
}

export const OrganizationAdminSection: React.FC<OrganizationAdminSectionProps> = ({
  admin,
  onCreateAdmin,
}) => {
  return (
    <Card className="bg-white rounded-xl mt-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <CardTitle className="text-xl font-bold text-gray-900">
            Organization Admin
          </CardTitle>
          {!admin && (
            <AddAdminUserDialog
              onSubmit={onCreateAdmin}
            />
          )}
        </div>

        {admin ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">
                Admin Name
              </Label>
              <p className="text-gray-900 font-medium">{admin.name}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">
                Admin Email
              </Label>
              <p className="text-gray-900">{admin.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">
            No admin has been assigned to this organization yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};


