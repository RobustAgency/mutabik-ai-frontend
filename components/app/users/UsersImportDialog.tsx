"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useImportUsersMutation } from "@/app/lib/features/usersApi";
import { toast } from "react-toastify";
import { extractErrorMessage } from "@/lib/api/rtkQueryBase";

interface UsersImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess?: () => void;
}

export const UsersImportDialog: React.FC<UsersImportDialogProps> = ({
  open,
  onOpenChange,
  onImportSuccess,
}) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const [importUsers, { isLoading: isImporting }] = useImportUsersMutation();

  const closeDialog = () => {
    if (isImporting) return;
    setSelectedFile(null);
    onOpenChange(false);
  };

  const validateAndSetFile = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      return;
    }

    const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
    const isCsv =
      file.name.toLowerCase().endsWith(".csv") ||
      file.type === "text/csv" ||
      file.type === "application/vnd.ms-excel";

    if (!isCsv) {
      toast.error("Please upload a CSV file (.csv).");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      toast.error("File size must not exceed 10MB.");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    validateAndSetFile(file);
  };

  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    if (!selectedFile) {
      toast.error("Please select a file to import.");
      return;
    }

    try {
      const response = await importUsers({ file: selectedFile }).unwrap();

      if (!response.error) {
        toast.success(
          response.message || "User import completed successfully."
        );
        setSelectedFile(null);
        onImportSuccess?.();
        onOpenChange(false);
      } else {
        toast.error(response.message || "Error during user import.");
      }
    } catch (error) {
      toast.error(
        extractErrorMessage(error, "Error during user import.")
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Import Users</DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk import users into your organization.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-[#667085]">
              Accepted format: <span className="font-medium">.csv</span> only. Maximum size 10MB.
            </p>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragOver(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                const file = e.dataTransfer.files?.[0] ?? null;
                validateAndSetFile(file);
              }}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg px-4 py-6 cursor-pointer text-center transition-colors ${
                isDragOver
                  ? "border-[#4FD58F] bg-[#ECFDF3]"
                  : "border-[#D0D5DD] bg-[#F9FAFB]"
              }`}
            >
              <p className="text-sm font-medium text-[#344054]">
                Click to upload or drag and drop
              </p>
              <p className="mt-1 text-xs text-[#667085]">
                CSV file (.csv), up to 10MB.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            {selectedFile && (
              <p className="text-xs text-[#667085]">
                Selected file: <span className="font-medium">{selectedFile.name}</span>
              </p>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              disabled={isImporting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isImporting || !selectedFile}
              className="bg-[#4FD58F] hover:bg-[#45C77D] text-white"
            >
              {isImporting ? "Importing..." : "Import"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


