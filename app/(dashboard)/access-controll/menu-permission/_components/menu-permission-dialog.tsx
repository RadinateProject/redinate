// components/rbac/menu-permission-dialog.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface MenuPermission {
  id?: number;
  menu_key: string;
  permission_id: number;
  is_required: boolean;
}

interface MenuPermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuPermission?: MenuPermission | null;
  onSuccess: () => void;
}

const MENU_KEYS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'continuous-monitoring', label: 'Continuous Monitoring' },
  { key: 'access-control', label: 'Access Control' },
  { key: 'access-control.roles', label: 'Access Control > Roles' },
  { key: 'access-control.permissions', label: 'Access Control > Permissions' },
  { key: 'access-control.role-permissions', label: 'Access Control > Role Permissions' },
  { key: 'access-control.menu-permissions', label: 'Access Control > Menu Permissions' },
];

const MOCK_PERMISSIONS = [
  { id: 1, permission_key: 'dashboard:view', description: 'View dashboard' },
  { id: 2, permission_key: 'roles:view', description: 'View roles' },
  { id: 3, permission_key: 'roles:create', description: 'Create roles' },
  { id: 4, permission_key: 'roles:update', description: 'Update roles' },
  { id: 5, permission_key: 'permissions:view', description: 'View permissions' },
  { id: 6, permission_key: 'permissions:create', description: 'Create permissions' },
];

export function MenuPermissionDialog({ 
  open, 
  onOpenChange, 
  menuPermission, 
  onSuccess 
}: MenuPermissionDialogProps) {
  const isEdit = !!menuPermission?.id;
  const [menuKey, setMenuKey] = useState('');
  const [permissionId, setPermissionId] = useState('');
  const [isRequired, setIsRequired] = useState(true);

  useEffect(() => {
    if (menuPermission) {
      setMenuKey(menuPermission.menu_key);
      setPermissionId(menuPermission.permission_id.toString());
      setIsRequired(menuPermission.is_required);
    } else {
      setMenuKey('');
      setPermissionId('');
      setIsRequired(true);
    }
  }, [menuPermission, open]);

  const handleSubmit = async () => {
    if (!menuKey || !permissionId) {
      toast.error('Please select both menu and permission');
      return;
    }

    try {
      // API call would go here
      if (isEdit) {
        console.log('Updating menu permission:', { 
          id: menuPermission.id, 
          menuKey, 
          permissionId: Number(permissionId), 
          isRequired 
        });
        toast.success('Menu permission updated successfully');
      } else {
        console.log('Linking menu permission:', { 
          menuKey, 
          permissionId: Number(permissionId), 
          isRequired 
        });
        toast.success('Menu permission linked successfully');
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || `Failed to ${isEdit ? 'update' : 'link'} permission`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Menu Permission' : 'Link Menu Permission'}</DialogTitle>
          <DialogDescription>
            {isEdit 
              ? 'Update the menu permission settings' 
              : 'Associate a permission with a menu item to control access'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="menu">Menu Key *</Label>
            <Select 
              value={menuKey} 
              onValueChange={setMenuKey}
              disabled={isEdit}
            >
              <SelectTrigger id="menu">
                <SelectValue placeholder="Select menu" />
              </SelectTrigger>
              <SelectContent>
                {MENU_KEYS.map((menu) => (
                  <SelectItem key={menu.key} value={menu.key}>
                    {menu.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isEdit && (
              <p className="text-xs text-muted-foreground">Menu key cannot be changed after creation</p>
            )}
            {!isEdit && (
              <p className="text-xs text-muted-foreground">
                Choose the menu item to link the permission to
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="permission">Permission *</Label>
            <Select 
              value={permissionId} 
              onValueChange={setPermissionId}
              disabled={isEdit}
            >
              <SelectTrigger id="permission">
                <SelectValue placeholder="Select permission" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_PERMISSIONS.map((perm) => (
                  <SelectItem key={perm.id} value={perm.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{perm.permission_key}</span>
                      {perm.description && (
                        <span className="text-xs text-muted-foreground">{perm.description}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isEdit && (
              <p className="text-xs text-muted-foreground">Permission cannot be changed after creation</p>
            )}
            {!isEdit && (
              <p className="text-xs text-muted-foreground">
                Select the permission required to access this menu
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="space-y-0.5">
              <Label htmlFor="required">Required Permission</Label>
              <p className="text-xs text-muted-foreground">
                If enabled, users must have this permission to access the menu
              </p>
            </div>
            <Switch
              id="required"
              checked={isRequired}
              onCheckedChange={setIsRequired}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!menuKey || !permissionId}
          >
            {isEdit ? 'Update Permission' : 'Link Permission'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}