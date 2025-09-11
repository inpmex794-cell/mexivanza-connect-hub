import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Edit3, Settings, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminButtonProps extends Omit<ButtonProps, 'variant'> {
  action?: 'edit' | 'delete' | 'add' | 'settings';
  hideFromPublic?: boolean;
}

export const AdminButton: React.FC<AdminButtonProps> = ({
  action = 'edit',
  hideFromPublic = true,
  children,
  className,
  ...props
}) => {
  const { isAdmin } = useAuth();

  // Hide from non-admin users if specified
  if (hideFromPublic && !isAdmin) {
    return null;
  }

  const getIcon = () => {
    switch (action) {
      case 'edit':
        return <Edit3 className="h-4 w-4" />;
      case 'delete':
        return <Trash2 className="h-4 w-4" />;
      case 'add':
        return <Plus className="h-4 w-4" />;
      case 'settings':
        return <Settings className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Button
      variant="admin"
      size="sm"
      className={cn("gap-2", className)}
      {...props}
    >
      {getIcon()}
      {children}
    </Button>
  );
};

// Specific admin button variants
export const EditButton: React.FC<Omit<AdminButtonProps, 'action'>> = (props) => (
  <AdminButton action="edit" {...props}>
    Edit
  </AdminButton>
);

export const DeleteButton: React.FC<Omit<AdminButtonProps, 'action'>> = (props) => (
  <AdminButton action="delete" {...props}>
    Delete
  </AdminButton>
);

export const AddButton: React.FC<Omit<AdminButtonProps, 'action'>> = (props) => (
  <AdminButton action="add" {...props}>
    Add
  </AdminButton>
);

export const SettingsButton: React.FC<Omit<AdminButtonProps, 'action'>> = (props) => (
  <AdminButton action="settings" {...props}>
    Settings
  </AdminButton>
);