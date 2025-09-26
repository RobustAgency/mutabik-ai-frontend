import { Role } from '@/interfaces/Roles';

export const formatRole = (role: string | undefined | null): string => {
    if (!role) return 'Member';
    
    return role
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

export const getRoleDisplayName = (role: Role): string => {
    const roleMap: Record<Role, string> = {
        [Role.SUPER_ADMIN]: 'Super Admin',
        [Role.ADMIN]: 'Admin',
        [Role.OWNER]: 'Owner',
        [Role.PROJECT_LEAD]: 'Project Lead',
        [Role.REVIEWER]: 'Reviewer',
        [Role.CONTRIBUTOR]: 'Contributor',
        [Role.AUDITOR]: 'Auditor',
    };
    
    return roleMap[role] || formatRole(role);
};