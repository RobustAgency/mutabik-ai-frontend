import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import React from "react";

// ✅ Field type define
type Field = {
  label: string;
  options: string[];
};

const fields: Field[] = [
  { label: "Authority / Publisher", options: ["ISO/IEC JTC 1/SC 42"] },
  { label: "Binding Level", options: ["Legally Binding"] },
  { label: "Sector Applicability", options: ["Cross-sector"] },
  { label: "Risk Class Coverage", options: ["Prohibited use cases"] },
  { label: "Certification / Attestation", options: ["Notified Body Conformity Assessment"] },
  { label: "Assessment Mode", options: ["Self-Assessment"] },
];

// ✅ Props type define
type AdditionalInformationProps = {
  values: Record<string, string>; // Har field ke liye ek string value store hogi
  onChange: (field: string, value: string) => void;
};

export default function AdditionalInformation({
  values,
  onChange,
}: AdditionalInformationProps) {
  return (
    <Card className="w-full mb-6">
      <h1 className="pl-6 text-[#171717] text-lg font-bold">
        Additional Information
      </h1>
      <Separator />
      <CardContent className="px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.label} className="flex flex-col gap-2">
            <Label className="font-medium text-sm text-[#171717]">
              {field.label}
            </Label>
            <Select
              value={values[field.label] || ""}
              onValueChange={(val) => onChange(field.label, val)}
            >
              <SelectTrigger className="w-full text-[#171717]">
                <SelectValue
                  placeholder={`Select ${field.label}`}
                  className="text-[#171717]"
                />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
