'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, X, Menu, Lock, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { MenuPermissionDialog } from './_components/menu-permission-dialog';

interface MenuPermission {
  id: number;
  menu_key: string;
  menu_display: string;
  permission_id: number;
  permission_key: string;
  resource: string;
  action: string;
  category: string;
  is_required: boolean;
  is_system_permission: boolean;
  created_at: string;
}

const mockMenuPermissions: MenuPermission[] = [
  { id: 1, menu_key: 'dashboard', menu_display: 'Dashboard', permission_id: 1, permission_key: 'dashboard:view', resource: 'dashboard', action: 'view', category: 'Navigation', is_required: true, is_system_permission: true, created_at: '2025-01-01' },
  { id: 2, menu_key: 'dashboard', menu_display: 'Dashboard', permission_id: 2, permission_key: 'dashboard:read', resource: 'dashboard', action: 'read', category: 'Navigation', is_required: false, is_system_permission: true, created_at: '2025-01-01' },
  { id: 3, menu_key: 'access-control', menu_display: 'Access Control', permission_id: 3, permission_key: 'access-control:view', resource: 'access-control', action: 'view', category: 'Access Control', is_required: true, is_system_permission: true, created_at: '2025-01-01' },
  { id: 4, menu_key: 'access-control.roles', menu_display: 'Access Control > Roles', permission_id: 4, permission_key: 'roles:view', resource: 'roles', action: 'view', category: 'Access Control', is_required: true, is_system_permission: true, created_at: '2025-01-01' },
  { id: 5, menu_key: 'access-control.roles', menu_display: 'Access Control > Roles', permission_id: 5, permission_key: 'roles:list', resource: 'roles', action: 'list', category: 'Access Control', is_required: false, is_system_permission: true, created_at: '2025-01-01' },
];

export default function MenuPermissionsPage() {
  const [menuPermissions, setMenuPermissions] = useState(mockMenuPermissions);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMenuPermission, setSelectedMenuPermission] = useState<MenuPermission | null>(null);
  const [menuPermissionToDelete, setMenuPermissionToDelete] = useState<MenuPermission | null>(null);

  const filteredMenuPermissions = useMemo(() => {
    let filtered = menuPermissions;

    if (searchQuery) {
      filtered = filtered.filter(mp =>
        mp.menu_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mp.menu_display.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mp.permission_key.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [menuPermissions, searchQuery]);

  const handleSearch = () => setSearchQuery(searchInput);
  const handleClearSearch = () => { setSearchInput(''); setSearchQuery(''); };

  const handleCreate = () => {
    setSelectedMenuPermission(null);
    setDialogOpen(true);
  };

  const handleEdit = (mp: MenuPermission, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMenuPermission({
      id: mp.id,
      menu_key: mp.menu_key,
      permission_id: mp.permission_id,
      is_required: mp.is_required,
    } as any);
    setDialogOpen(true);
  };

  const handleDeleteClick = (mp: MenuPermission, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuPermissionToDelete(mp);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (menuPermissionToDelete) {
      setMenuPermissions(menuPermissions.filter(mp => mp.id !== menuPermissionToDelete.id));
      toast.success('Menu permission unlinked successfully');
      setDeleteDialogOpen(false);
      setMenuPermissionToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Menu Permissions</h1>
        <p className="text-muted-foreground">Configure required permissions for menu access</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                <Input placeholder="Search menu permissions" value={searchInput} onChange={e => setSearchInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} className="ps-9" />
                {searchQuery && (
                  <Button variant="ghost" size="sm" className="absolute end-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={handleClearSearch}><X className="h-4 w-4" /></Button>
                )}
              </div>
              <Button onClick={handleCreate} className="w-full sm:w-auto"><Plus className="h-4 w-4 mr-2" />Link Permission</Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {filteredMenuPermissions.map(mp => (
              <div key={mp.id} className="flex flex-col lg:flex-row lg:items-center gap-3 p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex items-start lg:items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 shrink-0">
                    <Menu className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{mp.menu_key}</div>
                    <div className="text-xs text-muted-foreground truncate">{mp.menu_display}</div>
                  </div>
                  <div className="hidden lg:flex items-center gap-2 min-w-0">
                    <span className="font-medium text-sm truncate">{mp.permission_key}</span>
                    {mp.is_system_permission && <Lock className="h-3 w-3 text-muted-foreground shrink-0" />}
                  </div>
                  <div className="hidden lg:block text-xs text-muted-foreground whitespace-nowrap">{mp.resource} → {mp.action}</div>
                  <div className="hidden lg:flex items-center gap-2 shrink-0">
                    <Badge variant="secondary">{mp.category}</Badge>
                    <Badge variant={mp.is_required ? 'default' : 'outline'}>{mp.is_required ? 'Required' : 'Optional'}</Badge>
                  </div>
                </div>

                {/* Mobile view details */}
                <div className="flex lg:hidden flex-col gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium text-sm truncate">{mp.permission_key}</span>
                    {mp.is_system_permission && <Lock className="h-3 w-3 text-muted-foreground shrink-0" />}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{mp.resource} → {mp.action}</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{mp.category}</Badge>
                    <Badge variant={mp.is_required ? 'default' : 'outline'}>{mp.is_required ? 'Required' : 'Optional'}</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
                  <Button variant="ghost" size="sm" onClick={(e) => handleEdit(mp, e)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={(e) => handleDeleteClick(mp, e)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <MenuPermissionDialog open={dialogOpen} onOpenChange={setDialogOpen} menuPermission={selectedMenuPermission} onSuccess={() => toast.success(selectedMenuPermission ? 'Menu permission updated' : 'Menu permission linked')} />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlink Menu Permission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unlink "{menuPermissionToDelete?.permission_key}" from "{menuPermissionToDelete?.menu_key}"? This will remove the permission requirement for accessing this menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Unlink</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}