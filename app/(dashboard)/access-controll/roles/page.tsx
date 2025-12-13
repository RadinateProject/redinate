'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, X, Shield, Users, Key, Lock, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { RoleDialog } from './_components/role-dialog';

interface Role {
  id: number;
  name: string;
  display_name: string;
  description: string;
  hierarchy_level: number;
  is_system_role: boolean;
  is_default: boolean;
  users_count: number;
  permissions_count: number;
  created_at: string;
}

const mockRoles: Role[] = [
  { id: 1, name: 'super_admin', display_name: 'Super Admin', description: 'Full system access', hierarchy_level: 100, is_system_role: true, is_default: false, users_count: 2, permissions_count: 150, created_at: '2025-01-01' },
  { id: 2, name: 'admin', display_name: 'Admin', description: 'Administrative access', hierarchy_level: 90, is_system_role: true, is_default: false, users_count: 5, permissions_count: 120, created_at: '2025-01-01' },
  { id: 3, name: 'manager', display_name: 'Manager', description: 'Management level access', hierarchy_level: 70, is_system_role: false, is_default: false, users_count: 12, permissions_count: 80, created_at: '2025-01-02' },
  { id: 4, name: 'user', display_name: 'User', description: 'Standard user access', hierarchy_level: 50, is_system_role: false, is_default: true, users_count: 45, permissions_count: 30, created_at: '2025-01-03' },
  { id: 5, name: 'viewer', display_name: 'Viewer', description: 'Read-only access', hierarchy_level: 30, is_system_role: false, is_default: false, users_count: 23, permissions_count: 15, created_at: '2025-01-04' },
];

export default function RolesPage() {
  const [roles, setRoles] = useState(mockRoles);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'system' | 'tenant'>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const filteredRoles = useMemo(() => {
    let filtered = roles;
    
    if (scopeFilter === 'system') filtered = filtered.filter(r => r.is_system_role);
    if (scopeFilter === 'tenant') filtered = filtered.filter(r => !r.is_system_role);
    
    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [roles, searchQuery, scopeFilter]);

  const handleSearch = () => setSearchQuery(searchInput);
  const handleClearSearch = () => { setSearchInput(''); setSearchQuery(''); };

  const handleCreate = () => {
    setSelectedRole(null);
    setDialogOpen(true);
  };

  const handleEdit = (role: Role, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRole(role);
    setDialogOpen(true);
  };

  const handleDeleteClick = (role: Role, e: React.MouseEvent) => {
    e.stopPropagation();
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (roleToDelete) {
      setRoles(roles.filter(r => r.id !== roleToDelete.id));
      toast.success('Role deleted successfully');
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  const handleSuccess = () => {
    // Refresh roles list
    toast.success(selectedRole ? 'Role updated' : 'Role created');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Roles</h1>
          <p className="text-muted-foreground mt-1">Manage system roles and access levels</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                <Input placeholder="Search roles" value={searchInput} onChange={e => setSearchInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} className="ps-9" />
                {searchQuery && (
                  <Button variant="ghost" size="sm" className="absolute end-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={handleClearSearch}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Select value={scopeFilter} onValueChange={(v: any) => setScopeFilter(v)}>
                  <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="tenant">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleCreate}><Plus className="h-4 w-4" />Create Role</Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map(role => (
                  <TableRow key={role.id} className="cursor-pointer">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                          <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{role.display_name}</span>
                            {role.is_system_role && <Lock className="h-3 w-3 text-muted-foreground" />}
                          </div>
                          <div className="text-xs text-muted-foreground">{role.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><div className="text-sm text-muted-foreground max-w-md truncate">{role.description}</div></TableCell>
                    <TableCell><Badge variant="secondary">Level {role.hierarchy_level}</Badge></TableCell>
                    <TableCell><Badge variant={role.is_system_role ? 'default' : 'outline'}>{role.is_system_role ? 'System' : 'Custom'}</Badge></TableCell>
                    <TableCell><div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{role.users_count}</span></div></TableCell>
                    <TableCell><div className="flex items-center gap-2"><Key className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{role.permissions_count}</span></div></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={(e) => handleEdit(role, e)}><Edit className="h-4 w-4" /></Button>
                        {!role.is_system_role && (
                          <Button variant="ghost" size="sm" onClick={(e) => handleDeleteClick(role, e)}><Trash2 className="h-4 w-4" /></Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <RoleDialog open={dialogOpen} onOpenChange={setDialogOpen} role={selectedRole} onSuccess={handleSuccess} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{roleToDelete?.display_name}"? This action cannot be undone.
            </AlertDialogDescription>
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