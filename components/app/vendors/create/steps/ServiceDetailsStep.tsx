"use client";

import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus, ChevronDown, ChevronUp } from "lucide-react";
import type { VendorFormData } from "@/lib/schemas/vendor.schema";

export const ServiceDetailsStep: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<VendorFormData>();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const dunsNumber = watch("duns_number");
  const leiNumber = watch("lei_number");
  const taxId = watch("tax_id");
  const stockTicker = watch("stock_ticker");
  const notes = watch("notes");

  const hasError = (fieldName: keyof VendorFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof VendorFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Additional Information
        </h2>
        <hr className="border-gray-200" />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          className={hasError("notes") ? "border-red-500" : ""}
          placeholder="Enter any additional notes about this vendor..."
          rows={4}
        />
        {hasError("notes") && (
          <p className="text-sm text-red-500">{getError("notes")}</p>
        )}
      </div>

      {/* Advanced Options Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1"
      >
        {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        {showAdvanced ? "Hide" : "Show"} Advanced Options
      </button>

      {showAdvanced && (
        <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="light">Optional</Badge>
            <Label className="text-base font-semibold">Advanced Options</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* DUNS Number */}
            <div className="space-y-2">
              <Label htmlFor="duns_number">DUNS Number</Label>
              <Input
                id="duns_number"
                {...register("duns_number")}
                className={hasError("duns_number") ? "border-red-500" : ""}
                placeholder="e.g., 123456789"
                maxLength={50}
              />
              {hasError("duns_number") && (
                <p className="text-sm text-red-500">{getError("duns_number")}</p>
              )}
            </div>

            {/* LEI Number */}
            <div className="space-y-2">
              <Label htmlFor="lei_number">LEI Number</Label>
              <Input
                id="lei_number"
                {...register("lei_number")}
                className={hasError("lei_number") ? "border-red-500" : ""}
                placeholder="Legal Entity Identifier"
                maxLength={50}
              />
              {hasError("lei_number") && (
                <p className="text-sm text-red-500">{getError("lei_number")}</p>
              )}
            </div>

            {/* Tax ID */}
            <div className="space-y-2">
              <Label htmlFor="tax_id">Tax ID / VAT Number</Label>
              <Input
                id="tax_id"
                {...register("tax_id")}
                className={hasError("tax_id") ? "border-red-500" : ""}
                placeholder="e.g., US12-3456789"
                maxLength={50}
              />
              {hasError("tax_id") && (
                <p className="text-sm text-red-500">{getError("tax_id")}</p>
              )}
            </div>

            {/* Stock Ticker */}
            <div className="space-y-2">
              <Label htmlFor="stock_ticker">Stock Ticker</Label>
              <Input
                id="stock_ticker"
                {...register("stock_ticker")}
                className={hasError("stock_ticker") ? "border-red-500" : ""}
                placeholder="e.g., MSFT, GOOGL"
                maxLength={20}
              />
              {hasError("stock_ticker") && (
                <p className="text-sm text-red-500">{getError("stock_ticker")}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

