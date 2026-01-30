"use client";

import * as React from "react";
import type { Permission } from "@/interfaces/Permission";
import type { PermissionsTree } from "@/app/lib/features/rolesApi";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight } from "lucide-react";

type ActionKey = "view" | "create" | "edit" | "delete" | "approve";

const ACTION_COLUMNS: { key: ActionKey; label: string }[] = [
  { key: "view", label: "View" },
  { key: "create", label: "Create" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
  { key: "approve", label: "Approve" },
];

function toTitleCase(value: string): string {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

interface ResourceRow {
  moduleKey: string;
  resourceKey: string;
  screenLabel: string;
  actions: Partial<Record<ActionKey, Permission>>;
}

interface ModuleGroup {
  moduleKey: string;
  moduleLabel: string;
  resources: ResourceRow[];
}

function buildModuleGroups(tree: PermissionsTree | undefined): ModuleGroup[] {
  if (!tree) return [];
  const groups: ModuleGroup[] = [];

  Object.entries(tree).forEach(([moduleKey, resources]) => {
    const moduleLabel = toTitleCase(moduleKey);
    const resourceRows: ResourceRow[] = [];

    Object.entries(resources).forEach(([resourceKey, permissions]) => {
      const actions: Partial<Record<ActionKey, Permission>> = {};
      permissions.forEach((permission) => {
        const nameParts = permission.name.split(".");
        const actionPart = nameParts[nameParts.length - 1] as ActionKey;
        if (ACTION_COLUMNS.some((col) => col.key === actionPart)) {
          actions[actionPart] = permission;
        }
      });

      resourceRows.push({
        moduleKey,
        resourceKey,
        screenLabel: toTitleCase(resourceKey),
        actions,
      });
    });
    groups.push({
      moduleKey,
      moduleLabel,
      resources: resourceRows,
    });
  });

  return groups;
}

export interface RolePermissionsMatrixProps {
  permissionsTree?: PermissionsTree;
  selectedPermissionIds: number[];
  onChange: (nextIds: number[]) => void;
}

export const RolePermissionsMatrix: React.FC<RolePermissionsMatrixProps> = ({
  permissionsTree,
  selectedPermissionIds,
  onChange,
}) => {
  const moduleGroups = React.useMemo(
    () => buildModuleGroups(permissionsTree),
    [permissionsTree]
  );

  const [collapsedModules, setCollapsedModules] = React.useState<
    Set<string>
  >(() => new Set());

  const toggleModule = (moduleKey: string) => {
    setCollapsedModules((previous) => {
      const next = new Set(previous);
      if (next.has(moduleKey)) {
        next.delete(moduleKey);
      } else {
        next.add(moduleKey);
      }
      return next;
    });
  };

  const togglePermission = (permission: Permission) => {
    const exists = selectedPermissionIds.includes(permission.id);
    const nextIds = exists
      ? selectedPermissionIds.filter((id) => id !== permission.id)
      : [...selectedPermissionIds, permission.id];
    onChange(nextIds);
  };

  const clearRowPermissions = (row: ResourceRow) => {
    const idsToClear = ACTION_COLUMNS.map(
      (col) => row.actions[col.key]?.id
    ).filter((id): id is number => typeof id === "number");
    if (!idsToClear.length) return;
    const nextIds = selectedPermissionIds.filter(
      (id) => !idsToClear.includes(id)
    );
    onChange(nextIds);
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-[#E4E7EC]">
      <table className="min-w-full divide-y divide-[#E4E7EC]">
        <thead className="bg-[#F9FAFB]">
          <tr>
            <th className="px-4 py-3 text-left text-[12px] font-medium font-sans leading-4 tracking-normal text-[#667085]">
              Module / Screen
            </th>
            <th className="px-4 py-3 text-center text-[12px] font-medium font-sans leading-4 tracking-normal text-[#667085]">
              None
            </th>
            <th className="px-4 py-3 text-center text-[12px] font-medium font-sans leading-4 tracking-normal text-[#667085]">
              All
            </th>
            {ACTION_COLUMNS.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-center text-[12px] font-medium font-sans leading-4 tracking-normal text-[#667085]"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E4E7EC] bg-white">
          {moduleGroups.map((group) => (
            <React.Fragment key={group.moduleKey}>
              <tr className="bg-[#F9FAFB]">
                <td
                  colSpan={3 + ACTION_COLUMNS.length}
                  className="px-4 py-3 text-sm font-sans font-semibold text-[#1D2939] cursor-pointer select-none"
                  onClick={() => toggleModule(group.moduleKey)}
                >
                  <span className="inline-flex items-center gap-2">
                    {collapsedModules.has(group.moduleKey) ? (
                      <ChevronRight className="h-4 w-4 text-[#98A2B3]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-[#98A2B3]" />
                    )}
                    <span>{group.moduleLabel}</span>
                  </span>
                </td>
              </tr>
              {!collapsedModules.has(group.moduleKey) &&
                group.resources.map((row) => {
                const rowPermissionIds = ACTION_COLUMNS.map(
                  (col) => row.actions[col.key]?.id
                ).filter((id): id is number => typeof id === "number");
                const hasAnySelected = rowPermissionIds.some((id) =>
                  selectedPermissionIds.includes(id)
                );

                return (
                  <tr key={`${row.moduleKey}-${row.resourceKey}`}>
                    <td className="px-4 py-3 text-sm font-sans text-[#1D2939] whitespace-nowrap pl-6">
                      {row.screenLabel}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Checkbox
                        checked={!hasAnySelected}
                        onCheckedChange={() => clearRowPermissions(row)}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Checkbox
                        checked={
                          rowPermissionIds.length > 0 &&
                          rowPermissionIds.every((id) =>
                            selectedPermissionIds.includes(id)
                          )
                        }
                        onCheckedChange={(value) => {
                          const shouldSelectAll = Boolean(value);
                          if (!shouldSelectAll) {
                            clearRowPermissions(row);
                            return;
                          }
                          const nextIds = Array.from(
                            new Set([
                              ...selectedPermissionIds,
                              ...rowPermissionIds,
                            ])
                          );
                          onChange(nextIds);
                        }}
                      />
                    </td>
                    {ACTION_COLUMNS.map((column) => {
                      const permission = row.actions[column.key];
                      if (!permission) {
                        return (
                          <td
                            key={column.key}
                            className="px-4 py-3 text-center text-xs text-[#98A2B3]"
                          >
                            —
                          </td>
                        );
                      }

                      const checked = selectedPermissionIds.includes(
                        permission.id
                      );

                      return (
                        <td key={column.key} className="px-4 py-3 text-center">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => togglePermission(permission)}
                          />
                        </td>
                      );
                    })}
                  </tr>
                  );
                })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};


