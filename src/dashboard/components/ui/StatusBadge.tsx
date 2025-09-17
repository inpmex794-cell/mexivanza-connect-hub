import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'published' | 'draft' | 'active' | 'inactive' | 'confirmed' | 'pending' | 'cancelled';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    published: { label: 'Published', className: 'bg-success text-success-foreground' },
    draft: { label: 'Draft', className: 'bg-muted text-muted-foreground' },
    active: { label: 'Active', className: 'bg-success text-success-foreground' },
    inactive: { label: 'Inactive', className: 'bg-muted text-muted-foreground' },
    confirmed: { label: 'Confirmed', className: 'bg-success text-success-foreground' },
    pending: { label: 'Pending', className: 'bg-accent text-accent-foreground' },
    cancelled: { label: 'Cancelled', className: 'bg-destructive text-destructive-foreground' }
  };

  const config = statusConfig[status] || { label: status, className: 'bg-muted text-muted-foreground' };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}