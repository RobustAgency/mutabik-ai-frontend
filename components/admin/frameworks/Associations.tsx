import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, XIcon } from "lucide-react";

const REQUIREMENT_OPTIONS = ["MRF-3", "MRF-7"];
const CONTROL_OPTIONS = ["MCF-182", "MCF-122", "MCF-104"];

interface MultiSelectProps {
  label: string;
  value: string[];
  options: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
}

function MultiSelect({ label, value, options, onChange, placeholder }: MultiSelectProps) {
  const handleRemove = (item: string) => {
    onChange(value.filter((v: string) => v !== item));
  };

  const handleSelect = (item: string) => {
    if (!value.includes(item)) {
      onChange([...value, item]);
    }
  };

  return (
    <div className="mb-6">
      <Label className="font-semibold text-base mb-3">
        {label} <span className="text-red-500">*</span>
      </Label>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="w-full min-h-[56px] border rounded-xl flex flex-wrap items-center gap- px-4 py-3 bg-white cursor-pointer focus-within:ring-2 focus-within:ring-blue-200">
            {value.length === 0 && (
              <span className="text-gray-400 text-base select-none">
                {placeholder}
              </span>
            )}
            {value.map((item: string) => (
              <Badge
                key={item}
                variant="light"
                className="flex items-center mr-3 mb-3 gap-1 text-base px-3 py-1 rounded-lg bg-green-50 text-green-700 border-green-200"
              >
                {item}
                <button
                  type="button"
                  className="ml-1 text-green-400 hover:text-green-700 focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item);
                  }}
                  tabIndex={-1}
                  aria-label={`Remove ${item}`}
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </Badge>
            ))}
            <span className="ml-auto">
              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            </span>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-full min-w-[220px]">
          {options.map((item: string) => (
            <DropdownMenuItem
              key={item}
              onSelect={() => handleSelect(item)}
              disabled={value.includes(item)}
              className={
                value.includes(item)
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }
            >
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Example usage:
export default function Example() {
  const [requirements, setRequirements] = React.useState<string[]>([]);
  const [controls, setControls] = React.useState<string[]>([]);

  return (
    <Card className="p-6">
      <div className="pl-6 text-[#171717] text-lg font-semibold">Associations</div>
      <CardContent className="flex flex-col gap-2">
        <MultiSelect
          label="Linked Requirements"
          value={requirements}
          options={REQUIREMENT_OPTIONS}
          onChange={setRequirements}
          placeholder="Select option"

        />

        <MultiSelect
          label="Linked Controls"
          value={controls}
          options={CONTROL_OPTIONS}
          onChange={setControls}
          placeholder="Select option"
        />
      </CardContent>
    </Card>
  );
}
