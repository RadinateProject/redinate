// components/rbac/permission-dialog.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface Permission {
  id?: number;
  resource: string;
  action: string;
  description: string;
  category: string;
}

interface PermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permission?: Permission | null;
  onSuccess: () => void;
}

const CATEGORIES = [
  'Access Control',
  'User Management',
  'Content',
  'Settings',
  'Reports',
  'Navigation',
];

export function PermissionDialog({ open, onOpenChange, permission, onSuccess }: PermissionDialogProps) {
  const isEdit = !!permission?.id;
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      resource: '',
      action: '',
      description: '',
      category: '',
    }
  });

  const resource = watch('resource');
  const action = watch('action');

  useEffect(() => {
    if (permission) {
      reset({
        resource: permission.resource,
        action: permission.action,
        description: permission.description,
        category: permission.category,
      });
    } else {
      reset({
        resource: '',
        action: '',
        description: '',
        category: '',
      });
    }
  }, [permission, reset]);

  const onSubmit = async (data: any) => {
    try {
      // API call would go here
      if (isEdit) {
        console.log('Updating permission:', { id: permission.id, ...data });
        toast.success('Permission updated successfully');
      } else {
        console.log('Creating permission:', data);
        toast.success('Permission created successfully');
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || `Failed to ${isEdit ? 'update' : 'create'} permission`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Permission' : 'Create New Permission'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update permission details' : 'Create a new permission for access control'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resource">Resource *</Label>
              <Input
                id="resource"
                placeholder="e.g., users, roles, posts"
                disabled={isEdit}
                {...register('resource', { required: 'Resource is required' })}
              />
              {errors.resource && (
                <p className="text-sm text-destructive">{errors.resource.message as string}</p>
              )}
              {isEdit && (
                <p className="text-xs text-muted-foreground">Resource cannot be changed after creation</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="action">Action *</Label>
              <Input
                id="action"
                placeholder="e.g., create, read, update, delete"
                disabled={isEdit}
                {...register('action', { required: 'Action is required' })}
              />
              {errors.action && (
                <p className="text-sm text-destructive">{errors.action.message as string}</p>
              )}
              {isEdit && (
                <p className="text-xs text-muted-foreground">Action cannot be changed after creation</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Permission Key (Auto-generated)</Label>
              <Input
                value={resource && action ? `${resource}:${action}` : ''}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this permission allows"
                rows={3}
                {...register('description')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={watch('category')} 
                onValueChange={(value) => setValue('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message as string}</p>
              )}
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
              {isEdit ? 'Update Permission' : 'Create Permission'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}