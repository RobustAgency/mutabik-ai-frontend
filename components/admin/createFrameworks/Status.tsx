import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import React from "react";

// ✅ Props types define kar diye
type StatusProps = {
  releaseDate: string;
  published: boolean;
  onChange: (field: "releaseDate" | "published", value: string | boolean) => void;
};

export default function Status({ releaseDate, published, onChange }: StatusProps) {
  return (
    <Card className="bg-white w-full mb-6">
      <div>
        <h1 className="pl-6 text-[#171717] text-lg font-semibold">Status</h1>
      </div>
      <Separator />
      <CardContent className="pl-6 flex flex-col gap-4">
        <div>
          <Label
            htmlFor="release-date"
            className="font-medium text-sm text-[#171717]"
          >
            Release date
          </Label>
          <Input
            id="release-date"
            type="date"
            value={releaseDate}
            onChange={(e) => onChange("releaseDate", e.target.value)}
            className="mt-2 text-[#171717]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={published}
            onCheckedChange={(val: boolean) => onChange("published", val)}
            id="published"
            className="data-[state=checked]:bg-[#4FD58F] data-[state=unchecked]:bg-gray-300"
          />
          <Label
            htmlFor="published"
            className="font-semibold text-base text-[#0A0A0A]" // ✅ fixed missing bracket in text-[#0A0A0A]
          >
            Published
          </Label>
        </div>

        <span className="text-sm text-[#737373]">
          This framework will be shown to all users.
        </span>
      </CardContent>
    </Card>
  );
}
