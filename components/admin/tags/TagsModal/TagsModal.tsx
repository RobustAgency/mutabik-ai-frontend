"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { tagsService } from "@/service/admin/tags";
import { toast } from "react-toastify";

interface TagsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TagsModal: React.FC<TagsModalProps> = ({ open, onOpenChange }) => {
  const [group, setGroup] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const validateForm = (): boolean => {
    if (!group.trim()) {
      toast.error("Group name is required.");
      return false;
    }
    if (!name.trim()) {
      toast.error("At least one tag name is required.");
      return false;
    }
    return true;
  };

  const handleSave = async (): Promise<void> => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const tags = {
        group: group.trim(),
        names: name.split(",").map((n) => n.trim()), // comma-separated string -> array
      };
      console.log("tags", tags);

      const response = await tagsService.createTag(tags);

      // Agar API se message aaye to use karo warna fallback message dikhado
      toast.success(response?.message || "Tag created successfully!");

      console.log("✅ Tag Created:", response);

      // Reset + Close
      setGroup("");
      setName("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating tag:", error);
      toast.error("Failed to create tag. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-neutral-900">
            Create New Tags
          </DialogTitle>
          <DialogDescription>
            Add a group and tag names in the required format.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Groups Input */}
          <div className="grid grid-cols-3 items-center gap-4">
            <Label
              htmlFor="groups"
              className="text-right font-medium text-neutral-700"
            >
              Groups
            </Label>
            <Input
              id="groups"
              value={group}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setGroup(e.target.value)
              }
              placeholder="Enter group name"
              className="col-span-3"
              disabled={loading}
            />
          </div>

          {/* Name Input */}
          <div className="grid grid-cols-3 items-center gap-4">
            <Label
              htmlFor="name"
              className="text-right font-medium text-neutral-700"
            >
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              placeholder="please enter in this format (name1, name2, name3)"
              className="col-span-3"
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 rounded-lg"
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TagsModal;
