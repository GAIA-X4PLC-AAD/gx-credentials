import { Permission, Role } from "@/types/rbac";

export const PERMISSIONS: Record<string, Permission> = {
  CREATE_APPLICATION: { action: "create", resource: "application" },
  REVIEW_APPLICATION: { action: "review", resource: "application" },
  APPROVE_APPLICATION: { action: "approve", resource: "application" },
  CREATE_CREDENTIAL: { action: "create", resource: "credential" },
  REVIEW_CREDENTIAL: { action: "review", resource: "credential" },
};

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.BASIC]: [PERMISSIONS.CREATE_APPLICATION],
  [Role.COMPANY]: [
    PERMISSIONS.CREATE_APPLICATION,
    PERMISSIONS.REVIEW_CREDENTIAL,
  ],
  [Role.TRUST_ANCHOR]: [
    PERMISSIONS.CREATE_APPLICATION,
    PERMISSIONS.REVIEW_CREDENTIAL,
    PERMISSIONS.REVIEW_APPLICATION,
    PERMISSIONS.APPROVE_APPLICATION,
  ],
};

export function hasPermission(userRole: Role, permission: Permission): boolean {
  if (userRole === undefined) return false;

  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  return userPermissions.some(
    (p) => p.action === permission.action && p.resource === permission.resource
  );
}

export function canCreateApplication(userRole: Role): boolean {
  return hasPermission(userRole, PERMISSIONS.CREATE_APPLICATION);
}

export function canReviewApplications(userRole: Role): boolean {
  return hasPermission(userRole, PERMISSIONS.REVIEW_APPLICATION);
}

export function canApproveApplications(userRole: Role): boolean {
  return hasPermission(userRole, PERMISSIONS.APPROVE_APPLICATION);
}

export function canReviewCredentials(
  userRole: Role,
  userCompanyId?: string,
  targetCompanyId?: string
): boolean {
  // COMPANY role can only review credentials for their own employees
  if (userRole === Role.COMPANY && userCompanyId !== targetCompanyId) {
    return false;
  }

  return hasPermission(userRole, PERMISSIONS.REVIEW_CREDENTIAL);
}

export function canCreateCredentials(userRole: Role): boolean {
  if (userRole === Role.TRUST_ANCHOR) {
    return false;
  }

  return hasPermission(userRole, PERMISSIONS.CREATE_CREDENTIAL);
}
