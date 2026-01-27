"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useGetOrganizationQuery } from "@/app/lib/features/organizationsApi";
import Spinner from "@/components/ui/spinner";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatDate";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useOrganizationMutations } from "@/hooks/admin/useOrganizations";
import ConfirmationDialog from "@/components/custom/ConfirmationDialog";
import { organizationsService } from "@/service/admin/organizations";
import { OrganizationMember } from "@/interfaces/Organization";
import { CreateAdminUserRequest } from "@/service/admin/adminUsers";
import { Label } from "@/components/ui/label";
import { OrganizationAdminSection } from "@/components/admin/organizations/OrganizationAdminSection";

export default function OrganizationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const organizationId = Number(params.id);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const { data: organization, isLoading: loadingOrganization, refetch: refetchOrganization } = useGetOrganizationQuery(organizationId);
  const { deleteOrganization } = useOrganizationMutations();
  const admin: OrganizationMember | null =
    (organization?.members && organization.members.length > 0
      ? organization.members[0]
      : null);

  const handleDelete = async () => {
    const success = await deleteOrganization(organizationId);
    if (success) {
      router.push('/admin/organizations');
    }
    setShowDeleteDialog(false);
  };

  const handleCreateAdmin = async (
    payload: CreateAdminUserRequest
  ): Promise<boolean> => {
    try {
      await organizationsService.createOrganizationAdmin(
        organizationId,
        payload
      );
      await refetchOrganization();
      toast.success("Organization admin assigned successfully");
      return true;
    } catch (err: any) {
      console.error("Failed to create organization admin:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to assign organization admin";
      toast.error(errorMessage);
      return false;
    }
  };

  if (loadingOrganization) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-2 py-4 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] px-2 py-4">
        <Card className="bg-white rounded-xl">
          <CardContent className="p-6">
            <p className="text-gray-600">Organization not found</p>
            <Button onClick={() => router.push('/admin/organizations')} className="mt-4">
              Back to Organizations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-2 py-4">
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/organizations')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Organizations
        </Button>
      </div>

      <Card className="bg-white rounded-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Organization Details
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={() => router.push(`/admin/organizations/${organizationId}/edit`)}
                className="bg-primary text-white"
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">Name</Label>
              <p className="text-gray-900 font-medium">{organization.name}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">Status</Label>
              <div>
                <Badge
                  variant="light"
                  color={organization.is_active ? 'success' : 'error'}
                >
                  {organization.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">Country</Label>
              <p className="text-gray-900">{organization.country || "-"}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">Phone</Label>
              <p className="text-gray-900">{organization.phone || "-"}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">Website</Label>
              {organization.website ? (
                <a
                  href={organization.website.startsWith('http') ? organization.website : `https://${organization.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {organization.website}
                </a>
              ) : (
                <p className="text-gray-400">-</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">Created At</Label>
              <p className="text-gray-900">{formatDate(organization.created_at)}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">Updated At</Label>
              <p className="text-gray-900">{formatDate(organization.updated_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <OrganizationAdminSection
        admin={admin}
        onCreateAdmin={handleCreateAdmin}
      />

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Organization"
        description={`Are you sure you want to delete "${organization.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={false}
      />
    </div>
  );
}

