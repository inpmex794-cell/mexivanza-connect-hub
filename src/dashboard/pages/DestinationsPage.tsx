import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { api } from '../services/api';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';

export function DestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await api.getDestinations();
        if (response.success) {
          setDestinations(response.data);
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const columns = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium text-foreground">{value}</div>
          <div className="text-xs text-muted-foreground flex items-center">
            <MapPin size={12} className="mr-1" />
            {row.region}
          </div>
        </div>
      )
    },
    {
      key: 'description',
      title: 'Description',
      render: (value: string) => (
        <div className="max-w-xs truncate text-muted-foreground">
          {value}
        </div>
      )
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
          <h1 className="text-3xl font-display font-bold text-foreground">Destinations</h1>
          <p className="text-muted-foreground mt-2">Manage travel destinations and locations</p>
        </div>
        <Button>
          <Plus size={16} />
          <span className="ml-2">Add Destination</span>
        </Button>
      </div>

      <DataTable
        data={destinations}
        columns={columns}
        searchable
        exportable
        onExport={() => console.log('Export destinations')}
      />
    </div>
  );
}