"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import type { User } from "@/app/lib/features/usersApi";

interface UserActionsCellProps {
  user: User;
  onManageRole: (event: React.MouseEvent, user: User) => void;
  onManagePermissions: (event: React.MouseEvent, user: User) => void;
  onDelete: (event: React.MouseEvent, user: User) => void;
  isDeleting: boolean;
}

export const UserActionsCell: React.FC<UserActionsCellProps> = ({
  user,
  onManageRole,
  onManagePermissions,
  onDelete,
  isDeleting,
}) => {
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={(e) => onManageRole(e, user)}
        className="text-gray-500 hover:text-gray-700 border border-gray-200 hover:bg-gray-200"
      >
        <span>Permission set</span>
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={(e) => onManagePermissions(e, user)}
        className="text-gray-500 hover:text-gray-700 border border-gray-200 hover:bg-gray-200"
      >
        <span>Direct permissions</span>
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={(e) => onDelete(e, user)}
        disabled={isDeleting}
        className="text-gray-500 hover:text-gray-700 border border-gray-200 hover:bg-gray-200"
      >
        <span>Remove</span>
      </Button>
    </div>
  );
};


