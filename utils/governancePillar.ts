export enum GovernancePillar {
  AI_GOVERNANCE = 'ai_governance',
  DATA_GOVERNANCE = 'data_governance',
  PRIVACY_PDPL = 'privacy_pdpl',
}

export const governancePillarLabels: Record<GovernancePillar, string> = {
  [GovernancePillar.AI_GOVERNANCE]: 'AI Governance',
  [GovernancePillar.DATA_GOVERNANCE]: 'Data Governance',
  [GovernancePillar.PRIVACY_PDPL]: 'Privacy/PDPL',
};

export const getGovernancePillarLabel = (value: string): string => {
  return governancePillarLabels[value as GovernancePillar] || value;
};

export const getGovernancePillarValue = (label: string): string => {
  const entry = Object.entries(governancePillarLabels).find(([, displayLabel]) => displayLabel === label);
  return entry ? entry[0] : label;
};