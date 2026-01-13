"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface AddRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableRoles: string[];
  onAdd: (role: string) => void;
}

export function AddRoleDialog({
  open,
  onOpenChange,
  availableRoles,
  onAdd,
}: AddRoleDialogProps) {
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);

  const handleAdd = () => {
    if (!selectedRole) return;
    onAdd(selectedRole);
    setSelectedRole(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add role</DialogTitle>
        </DialogHeader>

        <Select onValueChange={setSelectedRole}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {availableRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!selectedRole} onClick={handleAdd}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
