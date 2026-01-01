"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { VendorFormData } from "@/lib/schemas/vendor.schema";

export const AdvancedOptionsStep: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<VendorFormData>();

  const hasError = (fieldName: keyof VendorFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof VendorFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans font-bold text-md leading-6 tracking-normal text-[#039855]">
          Step 4: Advanced Options
        </h2>
        <hr className="border-gray-200" />
        <p className="text-sm text-muted-foreground">
          Optional identification numbers and codes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  );
};

