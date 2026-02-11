"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";

interface UserRoleBadgeProps {
  role?: string;
}

export const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ role }) => {
  if (!role) {
    return (
      <Badge variant="light" className="bg-gray-100 text-gray-700">
        —
      </Badge>
    );
  }

  const normalizedRole = role.toUpperCase().replace(/-/g, "_");

  const config: Record<string, { label: string; className: string }> = {
    PROJECT_LEAD: {
      label: "Project Lead",
      className: "bg-blue-100 text-blue-800",
    },
    REVIEWER: {
      label: "Reviewer",
      className: "bg-purple-100 text-purple-800",
    },
    CONTRIBUTOR: {
      label: "Contributor",
      className: "bg-green-100 text-green-800",
    },
    AUDITOR: {
      label: "Auditor",
      className: "bg-yellow-100 text-yellow-800",
    },
    OWNER: {
      label: "Owner",
      className: "bg-indigo-100 text-indigo-800",
    },
    ADMIN: {
      label: "Admin",
      className: "bg-red-100 text-red-800",
    },
    SUPER_ADMIN: {
      label: "Super Admin",
      className: "bg-gray-800 text-white",
    },
  };

  const roleConfig = config[normalizedRole];

  if (!roleConfig) {
    return (
      <Badge variant="light" className="bg-gray-100 text-gray-700">
        {role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, " ")}
      </Badge>
    );
  }

  return (
    <Badge variant="light" className={roleConfig.className}>
      {roleConfig.label}
    </Badge>
  );
};


