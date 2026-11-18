import { CompanyRole } from "../../generated/prisma/enums.js";

const roleHierarchy: Record<CompanyRole, number> = {
    [CompanyRole.OWNER]: 3,
    [CompanyRole.MANAGER]: 2,
    [CompanyRole.EMPLOYEE]: 1
};

export function isHigherRole(
    requesterRole: CompanyRole,
    targetRole: CompanyRole
): boolean {
    return roleHierarchy[requesterRole] > roleHierarchy[targetRole];
}