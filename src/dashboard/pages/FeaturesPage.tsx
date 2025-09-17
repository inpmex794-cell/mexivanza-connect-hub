import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '../components/ui/DataTable';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { api } from '../services/api';
import { Plus, Edit, Trash2, Star } from 'lucide-react';

export function FeaturesPage() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await api.getFeatures();
        if (response.success) {
          setFeatures(response.data);
        }
      } catch (error) {
        console.error('Error fetching features:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  const columns = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
            <Star size={14} className="text-primary-foreground" />
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
          <h1 className="text-3xl font-display font-bold text-foreground">Features</h1>
          <p className="text-muted-foreground mt-2">Manage amenities and features available for trips</p>
        </div>
        <Button>
          <Plus size={16} />
          <span className="ml-2">Add Feature</span>
        </Button>
      </div>

      <DataTable
        data={features}
        columns={columns}
        searchable
      />
    </div>
  );
}