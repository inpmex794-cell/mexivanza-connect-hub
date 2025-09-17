import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '../components/ui/DataTable';
import { StatusBadge } from '../components/ui/StatusBadge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { api } from '../services/api';
import { Eye, DollarSign, Calendar, Phone, Mail } from 'lucide-react';

export function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.getBookings();
        if (response.success) {
          setBookings(response.data);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const exportCSV = () => {
    const headers = ['ID', 'Trip', 'Traveler', 'Email', 'Phone', 'Start Date', 'End Date', 'Status', 'Amount'];
    const rows = bookings.map(booking => [
      booking.id,
      booking.trip,
      booking.traveler_name,
      booking.contact,
      booking.phone,
      booking.dates.start,
      booking.dates.end,
      booking.status,
      booking.payment_info.amount
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const columns = [
    {
      key: 'trip',
      title: 'Trip',
      sortable: true,
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium text-foreground">{value}</div>
          <div className="text-xs text-muted-foreground flex items-center mt-1">
            <Calendar size={12} className="mr-1" />
            {row.dates.start} - {row.dates.end}
          </div>
        </div>
      )
    },
    {
      key: 'traveler_name',
      title: 'Traveler',
      sortable: true,
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium text-foreground">{value}</div>
          <div className="text-xs text-muted-foreground flex items-center mt-1">
            <Mail size={12} className="mr-1" />
            {row.contact}
          </div>
          {row.phone && (
            <div className="text-xs text-muted-foreground flex items-center">
              <Phone size={12} className="mr-1" />
              {row.phone}
            </div>
          )}
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
      key: 'payment_info',
      title: 'Payment',
      render: (value: any) => (
        <div>
          <div className="flex items-center text-foreground font-medium">
            <DollarSign size={14} />
            {value.amount.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground capitalize">
            {value.method}
          </div>
        </div>
      )
    },
    {
      key: 'created_at',
      title: 'Booked',
      sortable: true,
      render: (value: string) => (
        <span className="text-muted-foreground text-sm">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value: any, row: any) => (
        <Button variant="ghost" size="sm">
          <Eye size={14} />
          <span className="ml-1">View</span>
        </Button>
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
          <h1 className="text-3xl font-display font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground mt-2">Manage customer bookings and reservations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-foreground">{bookings.length}</div>
          <div className="text-sm text-muted-foreground">Total Bookings</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-success">
            {bookings.filter(b => b.status === 'confirmed').length}
          </div>
          <div className="text-sm text-muted-foreground">Confirmed</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-accent">
            {bookings.filter(b => b.status === 'pending').length}
          </div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-foreground">
            ${bookings.reduce((sum, b) => sum + b.payment_info.amount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">Total Revenue</div>
        </div>
      </div>

      <DataTable
        data={bookings}
        columns={columns}
        searchable
        exportable
        onExport={exportCSV}
      />
    </div>
  );
}