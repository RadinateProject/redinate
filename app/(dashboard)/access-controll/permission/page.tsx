'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, X, Key, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { PermissionDialog } from './_components/permission-dialog';

interface Permission {
  id: number;
  permission_key: string;
  resource: string;
  action: string;
  description: string;
  category: string;
  is_system_permission: boolean;
  created_at: string;
}

const mockPermissions: Permission[] = [
  { id: 1, permission_key: 'users:create', resource: 'users', action: 'create', description: 'Create new users', category: 'User Management', is_system_permission: true, created_at: '2025-01-01' },
  { id: 2, permission_key: 'users:read', resource: 'users', action: 'read', description: 'View user details', category: 'User Management', is_system_permission: true, created_at: '2025-01-01' },
  { id: 3, permission_key: 'users:update', resource: 'users', action: 'update', description: 'Update user information', category: 'User Management', is_system_permission: true, created_at: '2025-01-01' },
  { id: 4, permission_key: 'users:delete', resource: 'users', action: 'delete', description: 'Delete users', category: 'User Management', is_system_permission: true, created_at: '2025-01-01' },
  { id: 5, permission_key: 'roles:create', resource: 'roles', action: 'create', description: 'Create new roles', category: 'Access Control', is_system_permission: true, created_at: '2025-01-01' },
  { id: 6, permission_key: 'roles:read', resource: 'roles', action: 'read', description: 'View role details', category: 'Access Control', is_system_permission: true, created_at: '2025-01-01' },
  { id: 7, permission_key: 'roles:update', resource: 'roles', action: 'update', description: 'Update role settings', category: 'Access Control', is_system_permission: true, created_at: '2025-01-01' },
  { id: 8, permission_key: 'roles:delete', resource: 'roles', action: 'delete', description: 'Delete roles', category: 'Access Control', is_system_permission: true, created_at: '2025-01-01' },
  { id: 9, permission_key: 'content:create', resource: 'content', action: 'create', description: 'Create content', category: 'Content', is_system_permission: false, created_at: '2025-01-02' },
  { id: 10, permission_key: 'content:publish', resource: 'content', action: 'publish', description: 'Publish content', category: 'Content', is_system_permission: false, created_at: '2025-01-02' },
];

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState(mockPermissions);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);

  const filteredPermissions = useMemo(() => {
    let filtered = permissions;
    if (categoryFilter !== 'all') filtered = filtered.filter(p => p.category === categoryFilter);
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.permission_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [permissions, searchQuery, categoryFilter]);

  const categories = useMemo(() => Array.from(new Set(permissions.map(p => p.category))), [permissions]);

  const handleSearch = () => setSearchQuery(searchInput);
  const handleClearSearch = () => { setSearchInput(''); setSearchQuery(''); };

  const handleCreate = () => {
    setSelectedPermission(null);
    setDialogOpen(true);
  };

  const handleEdit = (perm: Permission, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPermission(perm);
    setDialogOpen(true);
  };

  const handleDeleteClick = (perm: Permission, e: React.MouseEvent) => {
    e.stopPropagation();
    setPermissionToDelete(perm);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (permissionToDelete) {
      setPermissions(permissions.filter(p => p.id !== permissionToDelete.id));
      toast.success('Permission deleted successfully');
      setDeleteDialogOpen(false);
      setPermissionToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Permissions</h1>
        <p className="text-muted-foreground">Manage system permissions</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                <Input placeholder="Search permissions" value={searchInput} onChange={e => setSearchInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} className="ps-9" />
                {searchQuery && (
                  <Button variant="ghost" size="sm" className="absolute end-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={handleClearSearch}><X className="h-4 w-4" /></Button>
                )}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full sm:w-auto">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button onClick={handleCreate} className="w-full sm:w-auto"><Plus className="h-4 w-4 mr-2" />Create Permission</Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {filteredPermissions.map(perm => (
              <div key={perm.id} className="flex flex-col lg:flex-row lg:items-center gap-3 p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex items-start lg:items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 shrink-0">
                    <Key className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{perm.permission_key}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2 lg:line-clamp-1">{perm.description}</div>
                  </div>
                  <div className="hidden lg:flex items-center gap-2 shrink-0">
                    <Badge variant="secondary">{perm.category}</Badge>
                    <Badge variant={perm.is_system_permission ? 'default' : 'outline'}>{perm.is_system_permission ? 'System' : 'Custom'}</Badge>
                  </div>
                </div>

                {/* Mobile view badges */}
                <div className="flex lg:hidden flex-wrap items-center gap-2">
                  <Badge variant="secondary">{perm.category}</Badge>
                  <Badge variant={perm.is_system_permission ? 'default' : 'outline'}>{perm.is_system_permission ? 'System' : 'Custom'}</Badge>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="sm" onClick={(e) => handleEdit(perm, e)}><Edit className="h-4 w-4" /></Button>
                    {!perm.is_system_permission && (
                      <Button variant="ghost" size="sm" onClick={(e) => handleDeleteClick(perm, e)}><Trash2 className="h-4 w-4" /></Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <PermissionDialog open={dialogOpen} onOpenChange={setDialogOpen} permission={selectedPermission} onSuccess={() => toast.success(selectedPermission ? 'Permission updated' : 'Permission created')} />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Permission</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete "{permissionToDelete?.permission_key}"? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}