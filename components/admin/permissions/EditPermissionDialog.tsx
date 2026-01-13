"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export type PermissionKey =
  | "none"
  | "list"
  | "details"
  | "create"
  | "edit"
  | "delete";

export interface PermissionRow {
  resource: string;
  permissions: Record<PermissionKey, boolean>;
}

const PERMISSIONS: PermissionKey[] = [
  "none",
  "list",
  "details",
  "create",
  "edit",
  "delete",
];

interface EditPermissionDialogProps {
  open: boolean;
  canEdit: boolean;
  activeRow: PermissionRow | null;
  onClose: () => void;
  onSave: (updated: PermissionRow) => void;
}

export function EditPermissionDialog({
  open,
  canEdit,
  activeRow,
  onClose,
  onSave,
}: EditPermissionDialogProps) {
  const [draft, setDraft] = React.useState<PermissionRow | null>(activeRow);

  React.useEffect(() => {
    setDraft(activeRow);
  }, [activeRow]);

  const updatePermission = (permission: PermissionKey, checked: boolean) => {
    if (!draft || !canEdit) return;

    const updated = structuredClone(draft);

    if (permission === "none") {
      PERMISSIONS.forEach((per) => (updated.permissions[per] = false));
      updated.permissions.none = checked;
      setDraft(updated);
      return;
    }

    updated.permissions[permission] = checked;
    updated.permissions.none = false;

    const hasAny = PERMISSIONS
      .filter((per) => per !== "none")
      .some((per) => updated.permissions[per]);

    if (!hasAny) {
      updated.permissions.none = true;
    }

    setDraft(updated);
  };

  if (!draft) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit permissions – {draft.resource}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-4">
          {PERMISSIONS.map((permission) => (
            <label key={permission} className="flex items-center gap-2">
              <Checkbox
                checked={draft.permissions[permission]}
                disabled={!canEdit}
                onCheckedChange={(checked) =>
                  updatePermission(permission, !!checked)
                }
              />
              {permission}
            </label>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!canEdit} onClick={() => onSave(draft)}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
