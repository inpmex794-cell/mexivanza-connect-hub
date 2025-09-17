import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { api } from '../services/api';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';

export function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.getTrips();
        if (response.success) {
          setTrips(response.data);
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const columns = [
    {
      key: 'title',
      title: 'Title',
      sortable: true,
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium text-foreground">{value}</div>
          <div className="text-xs text-muted-foreground">{row.destination}</div>
        </div>
      )
    },
    {
      key: 'category',
      title: 'Category',
      sortable: true,
      render: (value: string) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
          {value}
        </span>
      )
    },
    {
      key: 'price',
      title: 'Price',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center text-foreground font-medium">
          <DollarSign size={14} />
          {value ? value.toLocaleString() : 'N/A'}
        </div>
      )
    },
    {
      key: 'duration',
      title: 'Duration',
      render: (value: number) => `${value} days`
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value: string) => <StatusBadge status={value as any} />
    },
    {
      key: 'featured',
      title: 'Featured',
      render: (value: boolean) => (
        <span className={`text-xs font-medium ${value ? 'text-accent' : 'text-muted-foreground'}`}>
          {value ? 'Yes' : 'No'}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Edit size={14} />
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 size={14} />
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Trips</h1>
          <p className="text-muted-foreground mt-2">Manage your travel packages and experiences</p>
        </div>
        <Button>
          <Plus size={16} />
          <span className="ml-2">Add Trip</span>
        </Button>
      </div>

      <DataTable
        data={trips}
        columns={columns}
        searchable
        exportable
        onExport={() => console.log('Export trips')}
      />
    </div>
  );
}