"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateDataElementData, DataType, Sensitivity, PiiFlag, PersonalDataCategory, SpecialCategoryFlag, CdeFlag, CdeCategory } from "@/app/lib/features/dataElementsApi";

interface DataElementFormProps {
  formData: CreateDataElementData;
  setFormData: React.Dispatch<React.SetStateAction<CreateDataElementData>>;
  errors: Record<string, string[]>;
}

const DataElementForm: React.FC<DataElementFormProps> = ({ formData, setFormData, errors }) => {
  const handleChange = (field: keyof CreateDataElementData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 pt-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Element Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g., customer_email"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_type">Data Type <span className="text-red-500">*</span></Label>
            <Select key={`data_type-${formData.data_type || 'empty'}`} value={formData.data_type || ""} onValueChange={(value) => handleChange("data_type", value as DataType)}>
              <SelectTrigger className={`w-full ${errors.data_type ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DataType.STRING}>string</SelectItem>
                <SelectItem value={DataType.INTEGER}>integer</SelectItem>
                <SelectItem value={DataType.DECIMAL}>decimal</SelectItem>
                <SelectItem value={DataType.BOOLEAN}>boolean</SelectItem>
                <SelectItem value={DataType.DATE}>date</SelectItem>
                <SelectItem value={DataType.DATETIME}>datetime</SelectItem>
                <SelectItem value={DataType.TIMESTAMP}>timestamp</SelectItem>
                <SelectItem value={DataType.JSON}>json</SelectItem>
                <SelectItem value={DataType.BINARY}>binary</SelectItem>
                <SelectItem value={DataType.ARRAY}>array</SelectItem>
                <SelectItem value={DataType.OTHER}>other</SelectItem>
              </SelectContent>
            </Select>
            {errors.data_type && <p className="text-sm text-red-500">{errors.data_type[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="format">Format (optional)</Label>
            <Input
              id="format"
              value={formData.format || ""}
              onChange={(e) => handleChange("format", e.target.value)}
              placeholder="e.g., YYYY-MM-DD, email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner_team">Owner Team</Label>
            <Input
              id="owner_team"
              value={formData.owner_team || ""}
              onChange={(e) => handleChange("owner_team", e.target.value || null)}
              placeholder="e.g., Data Engineering"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_definition">Business Definition</Label>
          <Textarea
            id="business_definition"
            value={formData.business_definition || ""}
            onChange={(e) => handleChange("business_definition", e.target.value || null)}
            placeholder="Provide a clear business definition for this element"
            className="min-h-32 resize-none"
          />
        </div>
      </div>

      {/* Classification */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Classification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sensitivity">Sensitivity <span className="text-red-500">*</span></Label>
            <Select key={`sensitivity-${formData.sensitivity || 'empty'}`} value={formData.sensitivity || ""} onValueChange={(value) => handleChange("sensitivity", value as Sensitivity)}>
              <SelectTrigger className={`w-full ${errors.sensitivity ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select sensitivity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Sensitivity.PUBLIC}>Public</SelectItem>
                <SelectItem value={Sensitivity.INTERNAL}>Internal</SelectItem>
                <SelectItem value={Sensitivity.CONFIDENTIAL}>Confidential</SelectItem>
                <SelectItem value={Sensitivity.RESTRICTED}>Restricted</SelectItem>
              </SelectContent>
            </Select>
            {errors.sensitivity && <p className="text-sm text-red-500">{errors.sensitivity[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pii_flag">PII Flag <span className="text-red-500">*</span></Label>
            <Select key={`pii_flag-${formData.pii_flag || 'empty'}`} value={formData.pii_flag || ""} onValueChange={(value) => handleChange("pii_flag", value as PiiFlag)}>
              <SelectTrigger className={`w-full ${errors.pii_flag ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select PII flag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PiiFlag.YES}>Yes</SelectItem>
                <SelectItem value={PiiFlag.NO}>No</SelectItem>
                <SelectItem value={PiiFlag.MAY_CONTAIN}>May Contain</SelectItem>
              </SelectContent>
            </Select>
            {errors.pii_flag && <p className="text-sm text-red-500">{errors.pii_flag[0]}</p>}
          </div>

          {formData.pii_flag === PiiFlag.YES && (
            <div className="space-y-2">
              <Label htmlFor="personal_data_category">Personal Data Category</Label>
              <Select key={`personal_data_category-${formData.personal_data_category || 'empty'}`} value={formData.personal_data_category || ""} onValueChange={(value) => handleChange("personal_data_category", (value ? value as PersonalDataCategory : null))}>
                <SelectTrigger className={`w-full ${errors.personal_data_category ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PersonalDataCategory.IDENTIFIER}>Identifier</SelectItem>
                  <SelectItem value={PersonalDataCategory.CONTACT}>Contact</SelectItem>
                  <SelectItem value={PersonalDataCategory.FINANCIAL}>Financial</SelectItem>
                  <SelectItem value={PersonalDataCategory.BEHAVIORAL}>Behavioral</SelectItem>
                  <SelectItem value={PersonalDataCategory.LOCATION}>Location</SelectItem>
                  <SelectItem value={PersonalDataCategory.BIOMETRIC}>Biometric</SelectItem>
                  <SelectItem value={PersonalDataCategory.HEALTH}>Health</SelectItem>
                  <SelectItem value={PersonalDataCategory.SENSITIVE_OTHER}>Sensitive-Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.personal_data_category && <p className="text-sm text-red-500">{errors.personal_data_category[0]}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="special_category_flag">Special Category Flag <span className="text-red-500">*</span></Label>
            <Select key={`special_category_flag-${formData.special_category_flag || 'empty'}`} value={formData.special_category_flag || ""} onValueChange={(value) => handleChange("special_category_flag", value as SpecialCategoryFlag)}>
              <SelectTrigger className={`w-full ${errors.special_category_flag ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select flag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SpecialCategoryFlag.YES}>Yes</SelectItem>
                <SelectItem value={SpecialCategoryFlag.NO}>No</SelectItem>
              </SelectContent>
            </Select>
            {errors.special_category_flag && <p className="text-sm text-red-500">{errors.special_category_flag[0]}</p>}
          </div>
        </div>
      </div>

      {/* CDE (Critical Data Element) */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Critical Data Element (CDE)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cde_flag">CDE Flag <span className="text-red-500">*</span></Label>
            <Select key={`cde_flag-${formData.cde_flag || 'empty'}`} value={formData.cde_flag || ""} onValueChange={(value) => handleChange("cde_flag", value as CdeFlag)}>
              <SelectTrigger className={`w-full ${errors.cde_flag ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Select CDE flag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CdeFlag.YES}>Yes</SelectItem>
                <SelectItem value={CdeFlag.NO}>No</SelectItem>
              </SelectContent>
            </Select>
            {errors.cde_flag && <p className="text-sm text-red-500">{errors.cde_flag[0]}</p>}
          </div>

          {formData.cde_flag === CdeFlag.YES && (
            <div className="space-y-2">
              <Label htmlFor="cde_category">CDE Category <span className="text-red-500">*</span></Label>
              <Select key={`cde_category-${formData.cde_category || 'empty'}`} value={formData.cde_category || ""} onValueChange={(value) => handleChange("cde_category", (value ? value as CdeCategory : null))}>
                <SelectTrigger className={`w-full ${errors.cde_category ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select CDE category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CdeCategory.STRATEGIC}>Strategic</SelectItem>
                  <SelectItem value={CdeCategory.COMPLIANCE}>Compliance</SelectItem>
                  <SelectItem value={CdeCategory.EXTERNAL_REPORTING}>External Reporting</SelectItem>
                  <SelectItem value={CdeCategory.OPERATIONAL}>Operational</SelectItem>
                  <SelectItem value={CdeCategory.FINANCIAL}>Financial</SelectItem>
                  <SelectItem value={CdeCategory.RISK}>Risk</SelectItem>
                  <SelectItem value={CdeCategory.CUSTOMER_EXPERIENCE}>Customer Experience</SelectItem>
                </SelectContent>
              </Select>
              {errors.cde_category && <p className="text-sm text-red-500">{errors.cde_category[0]}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Optional References */}
      <div className="space-y-4">
        <h3 className="font-bold text-base leading-6 tracking-normal text-[#039855]">Optional References</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quality_rules_ref">Quality Rules Reference</Label>
            <Input
              id="quality_rules_ref"
              value={formData.quality_rules_ref || ""}
              onChange={(e) => handleChange("quality_rules_ref", e.target.value)}
              placeholder="Link to quality rules"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="catalog_column_id">Catalog Column ID</Label>
            <Input
              id="catalog_column_id"
              value={formData.catalog_column_id || ""}
              onChange={(e) => handleChange("catalog_column_id", e.target.value)}
              placeholder="External catalog reference"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataElementForm;

