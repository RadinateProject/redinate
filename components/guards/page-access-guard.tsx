
// components/guards/page-access-guard.tsx
import { redirect } from 'next/navigation';
import { PermissionKey } from '@/lib/types/rbac';
import { ReactNode } from 'react';
import { useRBAC } from '@/hooks/use-rbac';

interface PageAccessGuardProps {
  menuKey: string;
  children: ReactNode;
}

export function PageAccessGuard({ menuKey, children }: PageAccessGuardProps) {
  const { canAccessPage } = useRBAC();

  if (!canAccessPage(menuKey)) {
    redirect('/dashboard/unauthorized');
  }

  return <>{children}</>;
}
