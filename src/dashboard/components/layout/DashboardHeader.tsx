import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export function DashboardHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-display font-bold text-primary">
            Mexivanza
          </h1>
          <span className="text-muted-foreground">Admin Dashboard</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <User size={16} className="text-muted-foreground" />
            <span className="text-foreground">{user?.username}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut size={16} />
            <span className="ml-2">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}