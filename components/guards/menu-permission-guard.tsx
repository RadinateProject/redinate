import { useRBAC } from "@/hooks/use-rbac";
import { PermissionKey } from "@/lib/types/rbac";
import { ReactNode } from "react";

// components/guards/menu-permission-guard.tsx
interface MenuPermissionGuardProps {
  menuKey: string;
  permission: PermissionKey;
  children: ReactNode;
  fallback?: ReactNode;
}

export function MenuPermissionGuard({ menuKey, permission, children, fallback = null }: MenuPermissionGuardProps) {
  const { hasMenuPermission } = useRBAC();

  if (!hasMenuPermission(menuKey, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
