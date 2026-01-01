"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DatasetSnapshotFormData } from "@/lib/schemas/datasetSnapshot.schema";
import {
  ResidencyZone,
  StorageTier,
  Compression,
  EncryptionStatus,
  MaskingMethod,
} from "@/app/lib/features/datasetSnapshotsApi";

const RESIDENCY_ZONE_OPTIONS = [
  { value: ResidencyZone.AE, label: "AE" },
  { value: ResidencyZone.EU, label: "EU" },
  { value: ResidencyZone.KSA, label: "KSA" },
  { value: ResidencyZone.US, label: "US" },
  { value: ResidencyZone.UK, label: "UK" },
  { value: ResidencyZone.QA, label: "QA" },
  { value: ResidencyZone.JO, label: "JO" },
  { value: ResidencyZone.MA, label: "MA" },
  { value: ResidencyZone.BH, label: "BH" },
  { value: ResidencyZone.OTHER, label: "Other" },
];

const STORAGE_TIER_OPTIONS = [
  { value: StorageTier.HOT, label: "Hot" },
  { value: StorageTier.COLD, label: "Cold" },
  { value: StorageTier.WARM, label: "Warm" },
  { value: StorageTier.ARCHIVE, label: "Archive" },
];

const COMPRESSION_OPTIONS = [
  { value: Compression.NONE, label: "None" },
  { value: Compression.GZIP, label: "Gzip" },
  { value: Compression.SNAPPY, label: "Snappy" },
  { value: Compression.LZ4, label: "LZ4" },
  { value: Compression.ZSTD, label: "Zstd" },
];

const ENCRYPTION_STATUS_OPTIONS = [
  { value: EncryptionStatus.NONE, label: "None" },
  { value: EncryptionStatus.UNENCRYPTED, label: "Unencrypted" },
  { value: EncryptionStatus.ENCRYPTED_AT_REST, label: "Encrypted at Rest" },
  { value: EncryptionStatus.ENCRYPTED_AT_TRANSIT, label: "Encrypted at Transit" },
  { value: EncryptionStatus.ENCRYPTED_AT_REST_AND_TRANSIT, label: "Encrypted at Rest and Transit" },
];

const MASKING_METHOD_OPTIONS = [
  { value: MaskingMethod.NONE, label: "None" },
  { value: MaskingMethod.TOKENIZATION, label: "Tokenization" },
  { value: MaskingMethod.HASHING, label: "Hashing" },
  { value: MaskingMethod.ENCRYPTION, label: "Encryption" },
  { value: MaskingMethod.BASE64_ENCODE, label: "Base64 Encode" },
  { value: MaskingMethod.REDACTION, label: "Redaction" },
  { value: MaskingMethod.GENERALIZATION, label: "Generalization" },
  { value: MaskingMethod.PSEUDONYMIZATION, label: "Pseudonymization" },
  { value: MaskingMethod.DIFFERENTIAL_PRIVACY, label: "Differential Privacy" },
  { value: MaskingMethod.K_ANONYMIZATION, label: "K-Anonymization" },
];

export const StorageSecurityStep: React.FC = () => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<DatasetSnapshotFormData>();

  const residencyZone = watch("residency_zone");
  const storageUri = watch("storage_uri");
  const storageTier = watch("storage_tier");
  const compression = watch("compression");
  const encryptionStatus = watch("encryption_status");
  const maskingMethodApplied = watch("masking_method_applied");
  const qualityChecksums = watch("quality_checksums");

  const hasError = (fieldName: keyof DatasetSnapshotFormData) =>
    errors[fieldName] && errors[fieldName]?.message;
  const getError = (fieldName: keyof DatasetSnapshotFormData) =>
    errors[fieldName]?.message as string;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">
          Storage & Security <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Residency Zone */}
          <div className="space-y-2">
            <Label htmlFor="residency_zone">
              Residency Zone <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`residency_zone-${residencyZone || "none"}`}
              value={residencyZone || ""}
              onValueChange={(value) =>
                setValue("residency_zone", value as ResidencyZone, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                className={`w-full ${hasError("residency_zone") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              >
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {RESIDENCY_ZONE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError("residency_zone") && (
              <p className="text-sm text-red-500">{getError("residency_zone")}</p>
            )}
          </div>

          {/* Storage URI */}
          <div className="space-y-2">
            <Label htmlFor="storage_uri">
              Storage URI <span className="text-red-500">*</span>
            </Label>
            <Input
              id="storage_uri"
              {...register("storage_uri")}
              placeholder="s3://bucket/path or abfss://container@account"
              className={`w-full ${hasError("storage_uri") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            />
            {hasError("storage_uri") && (
              <p className="text-sm text-red-500">{getError("storage_uri")}</p>
            )}
          </div>

          {/* Storage Tier */}
          <div className="space-y-2">
            <Label htmlFor="storage_tier">Storage Tier</Label>
            <Select
              key={`storage_tier-${storageTier || "none"}`}
              value={storageTier || "null"}
              onValueChange={(value) =>
                setValue("storage_tier", value === "null" ? null : (value as StorageTier), {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">None</SelectItem>
                {STORAGE_TIER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Compression */}
          <div className="space-y-2">
            <Label htmlFor="compression">Compression</Label>
            <Select
              key={`compression-${compression || "none"}`}
              value={compression || "null"}
              onValueChange={(value) =>
                setValue("compression", value === "null" ? null : (value as Compression), {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">None</SelectItem>
                {COMPRESSION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Encryption Status */}
          <div className="space-y-2">
            <Label htmlFor="encryption_status">
              Encryption Status <span className="text-red-500">*</span>
            </Label>
            <Select
              key={`encryption_status-${encryptionStatus || "none"}`}
              value={encryptionStatus || ""}
              onValueChange={(value) =>
                setValue("encryption_status", value as EncryptionStatus, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                className={`w-full ${hasError("encryption_status") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              >
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {ENCRYPTION_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError("encryption_status") && (
              <p className="text-sm text-red-500">{getError("encryption_status")}</p>
            )}
          </div>

          {/* Masking Method Applied */}
          <div className="space-y-2">
            <Label htmlFor="masking_method_applied">Masking Method Applied</Label>
            <Select
              key={`masking_method_applied-${maskingMethodApplied || "none"}`}
              value={maskingMethodApplied || "null"}
              onValueChange={(value) =>
                setValue("masking_method_applied", value === "null" ? null : (value as MaskingMethod), {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">None</SelectItem>
                {MASKING_METHOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Integrity Hash */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="quality_checksums">Integrity Hash</Label>
            <Input
              id="quality_checksums"
              {...register("quality_checksums")}
              placeholder="SHA256 checksum"
              className="w-full"
            />
            <p className="text-xs text-[#667085]">For data integrity verification</p>
          </div>
        </div>
      </div>
    </div>
  );
};
