'use client';

import { useState, useMemo } from 'react';
import { Search, X, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Role {
  id: number;
  name: string;
  display_name: string;
}

interface Permission {
  id: number;
  permission_key: string;
  resource: string;
  action: string;
  category: string;
}

interface RolePermission {
  role_id: number;
  permission_id: number;
}

const mockRoles: Role[] = [
  { id: 1, name: 'super_admin', display_name: 'Super Admin' },
  { id: 2, name: 'admin', display_name: 'Admin' },
  { id: 3, name: 'manager', display_name: 'Manager' },
  { id: 4, name: 'user', display_name: 'User' },
];

const mockPermissions: Permission[] = [
  { id: 1, permission_key: 'users:create', resource: 'users', action: 'create', category: 'User Management' },
  { id: 2, permission_key: 'users:read', resource: 'users', action: 'read', category: 'User Management' },
  { id: 3, permission_key: 'users:update', resource: 'users', action: 'update', category: 'User Management' },
  { id: 4, permission_key: 'users:delete', resource: 'users', action: 'delete', category: 'User Management' },
  { id: 5, permission_key: 'roles:create', resource: 'roles', action: 'create', category: 'Access Control' },
  { id: 6, permission_key: 'roles:read', resource: 'roles', action: 'read', category: 'Access Control' },
  { id: 7, permission_key: 'roles:update', resource: 'roles', action: 'update', category: 'Access Control' },
  { id: 8, permission_key: 'roles:delete', resource: 'roles', action: 'delete', category: 'Access Control' },
  { id: 9, permission_key: 'content:create', resource: 'content', action: 'create', category: 'Content' },
  { id: 10, permission_key: 'content:publish', resource: 'content', action: 'publish', category: 'Content' },
];

const mockRolePermissions: RolePermission[] = [
  ...mockPermissions.map(p => ({ role_id: 1, permission_id: p.id })),
  { role_id: 2, permission_id: 1 }, { role_id: 2, permission_id: 2 }, { role_id: 2, permission_id: 3 },
  { role_id: 2, permission_id: 5 }, { role_id: 2, permission_id: 6 }, { role_id: 2, permission_id: 7 },
  { role_id: 2, permission_id: 9 }, { role_id: 2, permission_id: 10 },
  { role_id: 3, permission_id: 2 }, { role_id: 3, permission_id: 3 }, { role_id: 3, permission_id: 6 },
  { role_id: 3, permission_id: 9 },
  { role_id: 4, permission_id: 2 }, { role_id: 4, permission_id: 6 },
];

export default function RolePermissionsPage() {
  const [selectedRoleId, setSelectedRoleId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const selectedRole = mockRoles.find(r => r.id === selectedRoleId);
  
  const rolePermissions = useMemo(() => {
    return mockRolePermissions.filter(rp => rp.role_id === selectedRoleId).map(rp => rp.permission_id);
  }, [selectedRoleId]);

  const filteredPermissions = useMemo(() => {
    let filtered = mockPermissions;
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.permission_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.resource.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [searchQuery]);

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    filteredPermissions.forEach(p => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, [filteredPermissions]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  const hasPermission = (permId: number) => rolePermissions.includes(permId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Role Permissions</h1>
          <p className="text-muted-foreground mt-1">Assign permissions to roles</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedRoleId.toString()} onValueChange={(v) => setSelectedRoleId(Number(v))}>
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockRoles.map(r => (
                  <SelectItem key={r.id} value={r.id.toString()}>{r.display_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative flex-1 max-w-md">
              <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search permissions"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="ps-9"
              />
              {searchQuery && (
                <Button variant="ghost" size="sm" className="absolute end-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={handleClearSearch}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {selectedRole && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedRole.display_name}</h3>
                  <p className="text-sm text-muted-foreground">{rolePermissions.length} permissions assigned</p>
                </div>
                <Badge>{rolePermissions.length} permissions</Badge>
              </div>

              <div className="space-y-4">
                {Object.entries(groupedByCategory).map(([category, perms]) => (
                  <div key={category} className="border rounded-lg">
                    <div className="p-4 border-b bg-muted/30">
                      <h3 className="font-semibold flex items-center justify-between">
                        {category}
                        <Badge variant="secondary">{perms.filter(p => hasPermission(p.id)).length}/{perms.length}</Badge>
                      </h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {perms.map(perm => {
                        const active = hasPermission(perm.id);
                        return (
                          <div key={perm.id} className={`flex items-center gap-3 p-3 border rounded-lg ${active ? 'border-primary bg-primary/5' : ''}`}>
                            <Checkbox checked={active} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{perm.permission_key}</span>
                                {active && <Check className="h-4 w-4 text-primary" />}
                              </div>
                              <span className="text-xs text-muted-foreground">{perm.resource}:{perm.action}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button>Save Changes</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}