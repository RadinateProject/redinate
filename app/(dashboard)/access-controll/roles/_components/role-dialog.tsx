// components/rbac/role-dialog.tsx
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface Role {
  id?: number;
  name: string;
  display_name: string;
  description: string;
  hierarchy_level: number;
  is_default: boolean;
}

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
  onSuccess: () => void;
}

export function RoleDialog({ open, onOpenChange, role, onSuccess }: RoleDialogProps) {
  const isEdit = !!role?.id;
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      display_name: '',
      description: '',
      hierarchy_level: 50,
      is_default: false,
    }
  });

  const isDefault = watch('is_default');

  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        display_name: role.display_name,
        description: role.description,
        hierarchy_level: role.hierarchy_level,
        is_default: role.is_default,
      });
    } else {
      reset({
        name: '',
        display_name: '',
        description: '',
        hierarchy_level: 50,
        is_default: false,
      });
    }
  }, [role, reset]);

  const onSubmit = async (data: any) => {
    try {
      // API call would go here
      if (isEdit) {
        console.log('Updating role:', { id: role.id, ...data });
        toast.success('Role updated successfully');
      } else {
        console.log('Creating role:', data);
        toast.success('Role created successfully');
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || `Failed to ${isEdit ? 'update' : 'create'} role`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Role' : 'Create New Role'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update role details and settings' : 'Create a new role for access control'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name *</Label>
              <Input
                id="name"
                placeholder="e.g., content_manager"
                disabled={isEdit}
                {...register('name', { required: 'Role name is required' })}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message as string}</p>
              )}
              {isEdit && (
                <p className="text-xs text-muted-foreground">Role names cannot be changed after creation</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name *</Label>
              <Input
                id="display_name"
                placeholder="e.g., Content Manager"
                {...register('display_name', { required: 'Display name is required' })}
              />
              {errors.display_name && (
                <p className="text-sm text-destructive">{errors.display_name.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the role's purpose and responsibilities"
                rows={3}
                {...register('description')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hierarchy_level">Hierarchy Level</Label>
              <Input
                id="hierarchy_level"
                type="number"
                min="0"
                max="100"
                {...register('hierarchy_level', {
                  min: { value: 0, message: 'Minimum value is 0' },
                  max: { value: 100, message: 'Maximum value is 100' },
                  valueAsNumber: true,
                })}
              />
              {errors.hierarchy_level && (
                <p className="text-sm text-destructive">{errors.hierarchy_level.message as string}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Higher values indicate higher priority (0-100)
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="space-y-0.5">
                <Label htmlFor="is_default">Default Role</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically assign this role to new users
                </p>
              </div>
              <Switch
                id="is_default"
                checked={isDefault}
                onCheckedChange={(checked) => setValue('is_default', checked)}
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
            <Button type="submit">
              {isEdit ? 'Update Role' : 'Create Role'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}