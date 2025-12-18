"use client";

import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { DPIAFormData } from "@/lib/schemas/dpia.schema";
import { useGetOrganizationUsersQuery } from "@/app/lib/features/usersApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const DPOConsultationStep: React.FC = () => {
  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<DPIAFormData>();

  const { data: users = [], isLoading: isLoadingUsers } =
    useGetOrganizationUsersQuery({
      per_page: 100,
    });

  const dpoConsulted = watch("dpo_consulted") ?? false;
  const dpoUserId = watch("dpo_user_id");

  const userOptions = useMemo(() => {
    const base =
      users?.map((user: any) => ({
        value: user.id.toString(),
        label: `${user.name} (${user.email})`,
      })) || [];

    // Ensure currently selected user is present in options
    if (dpoUserId) {
      const exists = base.some(
        (opt) => opt.value === dpoUserId.toString()
      );
      if (!exists) {
        base.unshift({
          value: dpoUserId.toString(),
          label: `User #${dpoUserId}`,
        });
      }
    }

    return base;
  }, [users, dpoUserId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Checkbox
          id="dpo_consulted"
          checked={dpoConsulted}
          onCheckedChange={(checked) => {
            const isChecked = checked === true;
            setValue("dpo_consulted", isChecked);
            if (!isChecked) {
              // Clear DPO fields when unchecked
              setValue("dpo_user_id", null);
              setValue("dpo_consultation_date", null);
              setValue("consultation_method", "");
              setValue("dpo_advice", "");
              // Clear validation errors when unchecked
              trigger([
                "dpo_user_id",
                "dpo_consultation_date",
                "consultation_method",
                "dpo_advice",
              ]);
            }
          }}
        />
        <Label
          htmlFor="dpo_consulted"
          onClick={() => {
            const newValue = !dpoConsulted;
            setValue("dpo_consulted", newValue);
            if (!newValue) {
              // Clear DPO fields when unchecked
              setValue("dpo_user_id", null);
              setValue("dpo_consultation_date", null);
              setValue("consultation_method", "");
              setValue("dpo_advice", "");
              // Clear validation errors when unchecked
              trigger([
                "dpo_user_id",
                "dpo_consultation_date",
                "consultation_method",
                "dpo_advice",
              ]);
            }
          }}
          className="cursor-pointer"
        >
          DPO consulted for this DPIA
        </Label>
      </div>

      {dpoConsulted && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dpo_user_id">
                DPO User <span className="text-red-500">*</span>
              </Label>
              <Select
                key={`dpo-user-${dpoUserId || "none"}-${userOptions.length}`}
                value={dpoUserId ? dpoUserId.toString() : ""}
                onValueChange={(value) => {
                  setValue("dpo_user_id", Number(value) as any);
                  // Only validate on blur or when field loses focus
                }}
                onBlur={() => trigger("dpo_user_id")}
                disabled={isLoadingUsers}
              >
                <SelectTrigger
                  className={`w-full ${
                    errors.dpo_user_id ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select DPO user" />
                </SelectTrigger>
                <SelectContent>
                  {userOptions.length > 0 ? (
                    userOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-users" disabled>
                      {isLoadingUsers ? "Loading users..." : "No users found"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.dpo_user_id && (
                <p className="text-sm text-red-500">
                  {errors.dpo_user_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dpo_consultation_date">
                Consultation Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dpo_consultation_date"
                type="date"
                {...register("dpo_consultation_date", {
                  onBlur: () => trigger("dpo_consultation_date"),
                })}
                className={`w-full ${
                  errors.dpo_consultation_date ? "border-red-500" : ""
                }`}
              />
              {errors.dpo_consultation_date && (
                <p className="text-sm text-red-500">
                  {errors.dpo_consultation_date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="consultation_method">
                Consultation Method <span className="text-red-500">*</span>
              </Label>
              <Input
                id="consultation_method"
                {...register("consultation_method", {
                  onBlur: () => trigger("consultation_method"),
                })}
                className={`w-full ${
                  errors.consultation_method ? "border-red-500" : ""
                }`}
                placeholder="e.g., meeting, email, workshop"
              />
              {errors.consultation_method && (
                <p className="text-sm text-red-500">
                  {errors.consultation_method.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dpo_advice">
              DPO Advice <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="dpo_advice"
              {...register("dpo_advice", {
                onBlur: () => trigger("dpo_advice"),
              })}
              className={`w-full min-h-[120px] resize-none ${
                errors.dpo_advice ? "border-red-500" : ""
              }`}
              placeholder="Summarize DPO advice"
            />
            {errors.dpo_advice && (
              <p className="text-sm text-red-500">
                {errors.dpo_advice.message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


