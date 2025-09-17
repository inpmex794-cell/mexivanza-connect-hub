import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '../components/ui/DataTable';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { api } from '../services/api';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';

export function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.getServices();
        if (response.success) {
          setServices(response.data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const columns = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-accent rounded-md flex items-center justify-center">
            <Settings size={14} className="text-accent-foreground" />
          </div>
          <div className="font-medium text-foreground">{value}</div>
        </div>
      )
    },
    {
      key: 'description',
      title: 'Description',
      render: (value: string) => (
        <div className="max-w-md text-muted-foreground">
          {value}
        </div>
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
          <h1 className="text-3xl font-display font-bold text-foreground">Services</h1>
          <p className="text-muted-foreground mt-2">Manage services and add-ons for travel packages</p>
        </div>
        <Button>
          <Plus size={16} />
          <span className="ml-2">Add Service</span>
        </Button>
      </div>

      <DataTable
        data={services}
        columns={columns}
        searchable
      />
    </div>
  );
}