// components/guards/permission-guard.tsx
'use client';

import { useRBAC } from '@/hooks/use-rbac';
import { PermissionKey } from '@/lib/types/rbac';
import { ReactNode } from 'react';

interface PermissionGuardProps {
  permission: PermissionKey;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { hasPermission } = useRBAC();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
