"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface FormErrorAlertProps {
  errors: Record<string, string[]>;
}

export default function FormErrorAlert({ errors }: FormErrorAlertProps) {
  if (Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <p className="font-semibold mb-2">Please fix the following errors:</p>
        <ul className="list-disc list-inside space-y-1">
          {Object.entries(errors).map(([field, fieldErrors]) => (
            <li key={field}>
              <span className="font-medium capitalize">
                {field.replace(/_/g, " ")}:
              </span>{" "}
              {fieldErrors[0]}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

