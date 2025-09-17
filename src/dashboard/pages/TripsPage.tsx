import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { api } from '../services/api';
import { Plus, Edit, Trash2, DollarSign, Eye, Copy, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleDuplicate = async (tripId: string) => {
    try {
      // TODO: Implement duplicate functionality
      toast({
        title: "Feature Coming Soon",
        description: "Trip duplication will be available soon",
      });
    } catch (error) {
      console.error('Error duplicating trip:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate trip",
        variant: "destructive"
      });
    }
  };

  const handleToggleFeatured = async (tripId: string, currentFeatured: boolean) => {
    try {
      // TODO: Implement toggle featured functionality
      toast({
        title: "Feature Coming Soon",
        description: "Toggle featured will be available soon",
      });
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (tripId: string) => {
    if (!confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await api.deleteTrip(tripId);
      if (response.success) {
        setTrips(trips.filter((trip: any) => trip.id !== tripId));
        toast({
          title: "Success",
          description: "Trip deleted successfully"
        });
      } else {
        throw new Error(response.message || 'Failed to delete trip');
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast({
        title: "Error",
        description: "Failed to delete trip",
        variant: "destructive"
      });
    }
  };

  const columns = [
    {
      key: 'title',
      title: 'Title',
      sortable: true,
      render: (value: string | object, row: any) => {
        const title = typeof value === 'object' && value ? (value as any).en || (value as any).es || 'Untitled' : value || 'Untitled';
        const destination = typeof row.destination === 'object' && row.destination ? (row.destination as any).en || (row.destination as any).es || row.destination : row.destination || '';
        return (
          <div>
            <div className="font-medium text-foreground">{title}</div>
            <div className="text-xs text-muted-foreground">{destination}</div>
          </div>
        );
      }
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
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(`/travel/package/${row.id}`)}
            title="View"
          >
            <Eye size={14} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(`/dashboard/trips/edit/${row.id}`)}
            title="Edit"
          >
            <Edit size={14} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleDuplicate(row.id)}
            title="Duplicate"
          >
            <Copy size={14} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleToggleFeatured(row.id, row.featured)}
            title={row.featured ? "Remove from featured" : "Make featured"}
          >
            <Star size={14} className={row.featured ? "fill-current text-accent" : ""} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleDelete(row.id)}
            title="Delete"
            className="text-destructive hover:text-destructive"
          >
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
        <Button onClick={() => navigate('/dashboard/trips/new')}>
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