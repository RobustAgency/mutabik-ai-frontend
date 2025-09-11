export enum Role {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    OWNER = 'owner',
    PROJECT_LEAD = 'project_lead',
    REVIEWER = 'reviewer',
    CONTRIBUTOR = 'contributor',
    AUDITOR = 'auditor',
}

export const ROLES = [
    Role.SUPER_ADMIN,
    Role.ADMIN,
    Role.OWNER,
    Role.PROJECT_LEAD,
    Role.REVIEWER,
    Role.CONTRIBUTOR,
    Role.AUDITOR,
] as const;

export type RoleValue = `${Role}`;