import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  MapPin,
  Plane,
  Tag,
  FileText,
  Star,
  Settings,
  Calendar,
  Image,
  Users,
  Grid3X3
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Trips', href: '/dashboard/trips', icon: Plane },
  { name: 'Destinations', href: '/dashboard/destinations', icon: MapPin },
  { name: 'Categories', href: '/dashboard/categories', icon: Grid3X3 },
  { name: 'Tags', href: '/dashboard/tags', icon: Tag },
  { name: 'Pages', href: '/dashboard/pages', icon: FileText },
  { name: 'Features', href: '/dashboard/features', icon: Star },
  { name: 'Services', href: '/dashboard/services', icon: Settings },
  { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
  { name: 'Media', href: '/dashboard/media', icon: Image },
  { name: 'Users', href: '/dashboard/users', icon: Users }
];

export function DashboardSidebar() {
  return (
    <aside className="w-64 bg-card border-r border-border p-6">
      <nav className="space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )
            }
          >
            <item.icon size={18} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}