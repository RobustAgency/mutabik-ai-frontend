import React from "react";
import {
  Select,
  SelectTrigger,
  SelectGroup,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface SelectFieldProps {
  selectData: string[];
  className?: string; 
}

const SelectField: React.FC<SelectFieldProps> = ({ selectData, className }) => {
  return (
    <Select>
      <SelectTrigger className={`w-full gap-2  rotate-0 opacity-100 pt-[10px] pr-4 pb-[10px] pl-4 py-5 rounded-lg border border-[#D0D5DD] `}>
        <SelectValue className="font-sans font-normal text-sm leading-5 tracking-normal bg-[#1D2939]" placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {selectData.map((value) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectField;
