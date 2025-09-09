import {
    SectorApplicability,
    RiskClassCoverage,
    CertificationAttestation,
    AssessmentMode
} from "@/interfaces/Framework";

/**
 * Converts an array to a comma-separated string
 */
export function arrayToCommaSeparated<T>(array: T[]): string {
    return array.join(',');
}

/**
 * Converts a comma-separated string to an array, filtering out empty values
 */
export function commaSeparatedToArray<T>(str: string): T[] {
    return str ? str.split(',').filter(Boolean) as T[] : [];
}

/**
 * Converts framework additional info arrays to comma-separated strings for backend
 */
export function convertFrameworkArraysToStrings(data: {
    sector_applicability: SectorApplicability[];
    risk_class_coverage: RiskClassCoverage[];
    certification_attestation: CertificationAttestation[];
    assessment_mode: AssessmentMode[];
}) {
    return {
        sector_applicability: arrayToCommaSeparated(data.sector_applicability),
        risk_class_coverage: arrayToCommaSeparated(data.risk_class_coverage),
        certification_attestation: arrayToCommaSeparated(data.certification_attestation),
        assessment_mode: arrayToCommaSeparated(data.assessment_mode),
    };
}

/**
 * Converts framework additional info strings to arrays for frontend
 */
export function convertFrameworkStringsToArrays(data: {
    sector_applicability?: string;
    risk_class_coverage?: string;
    certification_attestation?: string;
    assessment_mode?: string;
}) {
    return {
        sector_applicability: commaSeparatedToArray<SectorApplicability>(data.sector_applicability || ''),
        risk_class_coverage: commaSeparatedToArray<RiskClassCoverage>(data.risk_class_coverage || ''),
        certification_attestation: commaSeparatedToArray<CertificationAttestation>(data.certification_attestation || ''),
        assessment_mode: commaSeparatedToArray<AssessmentMode>(data.assessment_mode || ''),
    };
}
