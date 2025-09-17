import React, { useState, useEffect } from 'react';
import { StatsCard } from '../components/ui/StatsCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { api } from '../services/api';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Users,
  Star,
  Activity
} from 'lucide-react';

interface Stats {
  total_trips: number;
  total_destinations: number;
  total_bookings: number;
  total_revenue: number;
  monthly_bookings: number;
  monthly_revenue: number;
}

export function DashboardHome() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.getStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load dashboard stats</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your Mexivanza travel platform admin panel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Trips"
          value={stats.total_trips}
          icon={Plane}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Destinations"
          value={stats.total_destinations}
          icon={MapPin}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Total Bookings"
          value={stats.total_bookings}
          icon={Calendar}
          trend={{ value: 24, isPositive: true }}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats.total_revenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 18, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Monthly Performance</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Monthly Bookings</span>
              <span className="font-semibold text-foreground">{stats.monthly_bookings}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Monthly Revenue</span>
              <span className="font-semibold text-foreground">${stats.monthly_revenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Average Booking Value</span>
              <span className="font-semibold text-foreground">
                ${Math.round(stats.monthly_revenue / stats.monthly_bookings).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Activity size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors">
              <div className="flex items-center space-x-3">
                <Plane size={16} className="text-primary" />
                <span className="text-foreground">Add New Trip</span>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors">
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-primary" />
                <span className="text-foreground">Add Destination</span>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-md border border-border hover:bg-muted transition-colors">
              <div className="flex items-center space-x-3">
                <Calendar size={16} className="text-primary" />
                <span className="text-foreground">View Bookings</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}