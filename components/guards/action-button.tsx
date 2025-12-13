// components/guards/action-button.tsx
'use client';

import * as React from 'react';
import { useRBAC } from '@/hooks/use-rbac';
import { PermissionKey } from '@/lib/types/rbac';

interface ActionButtonProps {
  menuKey: string;
  permission: PermissionKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ActionButton({ 
  menuKey, 
  permission, 
  children, 
  fallback = null 
}: ActionButtonProps) {
  const { hasMenuPermission } = useRBAC();

  if (!hasMenuPermission(menuKey, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}