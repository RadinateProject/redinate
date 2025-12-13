// hooks/use-rbac.ts
'use client';

import { useMemo } from 'react';
import { mockRoles, mockPermissions, mockRolePermissions, mockMenuPermissions } from '@/lib/data'; 
import { PermissionKey } from '@/lib/types/rbac';

// Mock current user - change role_id to test different roles
const CURRENT_USER = {
  id: '1',
  email: 'admin@example.com',
  name: 'Admin User',
  role_id: '1', // 1=Super Admin, 2=Admin, 3=Manager, 4=User
  is_active: true,
};

export function useRBAC() {
  const userRole = useMemo(() => {
    return mockRoles.find(r => r.id === CURRENT_USER.role_id);
  }, []);

  const userPermissions = useMemo(() => {
    if (!userRole) return [];
    const rolePerms = mockRolePermissions.filter(rp => rp.role_id === userRole.id);
    return rolePerms.map(rp => {
      const perm = mockPermissions.find(p => p.id === rp.permission_id);
      return perm?.permission_key;
    }).filter(Boolean) as string[];
  }, [userRole]);

  const hasPermission = (permissionKey: PermissionKey): boolean => {
    return userPermissions.includes(permissionKey);
  };

  const hasMenuPermission = (menuKey: string, permissionKey: PermissionKey): boolean => {
    // Check if user has the permission first
    if (!hasPermission(permissionKey)) return false;
    
    // Check if menu requires this permission
    const menuPerm = mockMenuPermissions.find(
      mp => mp.menu_permission_key === menuKey && mp.permission_key === permissionKey
    );
    
    return !!menuPerm;
  };

  const hasMenuAccess = (menuKey: string): boolean => {
    // Menu requires 'view' permission to be accessible
    return hasMenuPermission(menuKey, 'view');
  };

  const canAccessPage = (menuKey: string): boolean => {
    // If view permission is not there, deny all access
    return hasMenuAccess(menuKey);
  };

  return {
    user: CURRENT_USER,
    role: userRole,
    permissions: userPermissions,
    hasPermission,
    hasMenuPermission,
    hasMenuAccess,
    canAccessPage,
  };
}

// hooks/use-page-permissions.ts
export function usePagePermissions(pageKey: string) {
  const { hasMenuPermission, canAccessPage } = useRBAC();

  return {
    canAccess: canAccessPage(pageKey),
    canView: hasMenuPermission(pageKey, 'view'),
    canList: hasMenuPermission(pageKey, 'list'),
    canRead: hasMenuPermission(pageKey, 'read'),
    canCreate: hasMenuPermission(pageKey, 'create'),
    canUpdate: hasMenuPermission(pageKey, 'update'),
    canDelete: hasMenuPermission(pageKey, 'delete'),
    canPrint: hasMenuPermission(pageKey, 'print'),
    canExport: hasMenuPermission(pageKey, 'export'),
    canImport: hasMenuPermission(pageKey, 'import'),
  };
}