import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { api } from '../services/api';
import { Plus, Edit, Trash2, FileText, ExternalLink } from 'lucide-react';

export function PagesPage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await api.getPages();
        if (response.success) {
          setPages(response.data);
        }
      } catch (error) {
        console.error('Error fetching pages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  const columns = [
    {
      key: 'title',
      title: 'Title',
      sortable: true,
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium text-foreground">{value}</div>
          <div className="text-xs text-muted-foreground">/{row.slug}</div>
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
      key: 'updated_at',
      title: 'Last Updated',
      sortable: true,
      render: (value: string) => (
        <span className="text-muted-foreground">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <ExternalLink size={14} />
          </Button>
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
          <h1 className="text-3xl font-display font-bold text-foreground">Pages</h1>
          <p className="text-muted-foreground mt-2">Manage static pages and content</p>
        </div>
        <Button>
          <Plus size={16} />
          <span className="ml-2">Add Page</span>
        </Button>
      </div>

      <DataTable
        data={pages}
        columns={columns}
        searchable
      />
    </div>
  );
}