import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '../components/ui/DataTable';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { api } from '../services/api';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';

export function TagsPage() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.getTags();
        if (response.success) {
          setTags(response.data);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const columns = [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium text-foreground">{value}</div>
          <div className="text-xs text-muted-foreground">{row.slug}</div>
        </div>
      )
    },
    {
      key: 'slug',
      title: 'Slug',
      render: (value: string) => (
        <code className="text-xs bg-muted px-2 py-1 rounded">
          {value}
        </code>
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
          <h1 className="text-3xl font-display font-bold text-foreground">Tags</h1>
          <p className="text-muted-foreground mt-2">Label and categorize your content with tags</p>
        </div>
        <Button>
          <Plus size={16} />
          <span className="ml-2">Add Tag</span>
        </Button>
      </div>

      <DataTable
        data={tags}
        columns={columns}
        searchable
      />
    </div>
  );
}