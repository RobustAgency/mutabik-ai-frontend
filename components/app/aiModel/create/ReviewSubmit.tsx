"use client";

import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { FormDataType } from "../types/aiModelTypes";

interface ReviewSubmitProps {
    formData: FormDataType;
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
    errors?: Record<string, string[]>;
}

const ReviewSubmit: React.FC<ReviewSubmitProps> = ({ formData, setFormData, errors }) => {
    // Helper function to format values for display
    const formatValue = (value: string | null): string => {
        if (!value) return "Not provided";
        return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getStatusBadge = (status: string, type: 'business' | 'operational') => {
        const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";

        if (type === 'business') {
            switch (status) {
                case 'active':
                    return `${baseClasses} bg-green-100 text-green-800`;
                case 'planned':
                    return `${baseClasses} bg-blue-100 text-blue-800`;
                case 'deprecated':
                    return `${baseClasses} bg-gray-100 text-gray-800`;
                case 'retired':
                    return `${baseClasses} bg-red-100 text-red-800`;
                default:
                    return `${baseClasses} bg-gray-100 text-gray-800`;
            }
        } else {
            switch (status) {
                case 'production':
                    return `${baseClasses} bg-green-100 text-green-800`;
                case 'testing':
                    return `${baseClasses} bg-blue-100 text-blue-800`;
                case 'development':
                    return `${baseClasses} bg-yellow-100 text-yellow-800`;
                case 'not_deployed':
                    return `${baseClasses} bg-gray-100 text-gray-800`;
                default:
                    return `${baseClasses} bg-gray-100 text-gray-800`;
            }
        }
    };

    const getRiskBadge = (classification: string) => {
        const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";

        switch (classification) {
            case 'minimal_risk':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'limited_risk':
                return `${baseClasses} bg-blue-100 text-blue-800`;
            case 'high_risk':
                return `${baseClasses} bg-red-100 text-red-800`;
            case 'unacceptable_risk':
                return `${baseClasses} bg-red-100 text-red-800`;
            case 'sector_specific':
                return `${baseClasses} bg-purple-100 text-purple-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Review & Submit</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Review your AI model details before creating the record.
                </p>
            </div>

            <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                    <strong>Ready to Create:</strong> Review your AI model details below. Once created,
                    it will be assigned a unique ID and can be edited later.
                </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Model Name</p>
                        <p className="font-medium text-gray-900">{formData.name || "Not provided"}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Primary Category</p>
                        <p className="font-medium text-gray-900">{formatValue(formData.primary_category)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Model Type</p>
                        <p className="font-medium text-gray-900">{formatValue(formData.model_type)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Domain</p>
                        <p className="font-medium text-gray-900">{formatValue(formData.domain_specialization)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Ownership Type</p>
                        <p className="font-medium text-gray-900">{formatValue(formData.ownership_type)}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Business Status</p>
                        <span className={getStatusBadge(formData.business_status, 'business')}>
                            {formatValue(formData.business_status)}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Operational Status</p>
                        <span className={getStatusBadge(formData.operational_status, 'operational')}>
                            {formatValue(formData.operational_status)}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Regulatory Classification</p>
                        <span className={getRiskBadge(formData.regulatory_classification)}>
                            {formatValue(formData.regulatory_classification)}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Organizational Role</p>
                        <p className="font-medium text-gray-900">{formatValue(formData.organizational_role)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Development Source</p>
                        <p className="font-medium text-gray-900">{formatValue(formData.development_source)}</p>
                    </div>
                </div>
            </div>

            <div>
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-700">{formData.description || "Not provided"}</p>
            </div>

            {(formData.source_organization || formData.model_owner || formData.vendor_id) && (
                <div className="space-y-2">
                    <p className="text-xs text-gray-500 mb-1">Additional Information</p>
                    {formData.source_organization && (
                        <div>
                            <p className="text-xs text-gray-500">Source Organization:</p>
                            <p className="text-sm text-gray-700">{formData.source_organization}</p>
                        </div>
                    )}
                    {formData.model_owner && (
                        <div>
                            <p className="text-xs text-gray-500">Model Owner:</p>
                            <p className="text-sm text-gray-700">{formData.model_owner}</p>
                        </div>
                    )}
                    {formData.vendor_id && (
                        <div>
                            <p className="text-xs text-gray-500">Vendor:</p>
                            <p className="text-sm text-gray-700">{formatValue(formData.vendor_id)}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReviewSubmit;
