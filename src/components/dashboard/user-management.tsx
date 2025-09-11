import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/hooks/use-language';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  Shield, 
  Mail,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  verification_status: string;
  profile_type: string;
  location?: string;
  business_type?: string;
  posts_count?: number;
  bookings_count?: number;
}

export const UserManagement: React.FC = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch profiles with post and booking counts
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_posts!inner(count),
          travel_bookings!inner(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const usersWithCounts = profiles?.map(profile => ({
        ...profile,
        posts_count: profile.user_posts?.length || 0,
        bookings_count: profile.travel_bookings?.length || 0,
      })) || [];

      setUsers(usersWithCounts);
      setFilteredUsers(usersWithCounts);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(t('admin.error_loading_users', 'Error loading users'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.business_type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.verification_status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(user => user.profile_type === typeFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter, typeFilter]);

  const updateUserVerification = async (userId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ verification_status: status })
        .eq('id', userId);

      if (error) throw error;

      toast.success(t('admin.user_updated', 'User status updated successfully'));
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(t('admin.error_updating_user', 'Error updating user'));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <UserCheck className="h-3 w-3 mr-1" />
          {t('status.verified', 'Verified')}
        </Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-200 text-yellow-800 dark:border-yellow-800 dark:text-yellow-200">
          <Calendar className="h-3 w-3 mr-1" />
          {t('status.pending', 'Pending')}
        </Badge>;
      case 'rejected':
        return <Badge variant="destructive">
          <UserX className="h-3 w-3 mr-1" />
          {t('status.rejected', 'Rejected')}
        </Badge>;
      default:
        return <Badge variant="secondary">
          {t('status.unverified', 'Unverified')}
        </Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'business':
        return <Badge variant="outline" className="border-purple-200 text-purple-800 dark:border-purple-800 dark:text-purple-200">
          {t('profile.business', 'Business')}
        </Badge>;
      case 'agent':
        return <Badge variant="outline" className="border-blue-200 text-blue-800 dark:border-blue-800 dark:text-blue-200">
          <Shield className="h-3 w-3 mr-1" />
          {t('profile.agent', 'Agent')}
        </Badge>;
      default:
        return <Badge variant="secondary">
          {t('profile.personal', 'Personal')}
        </Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('admin.user_management', 'User Management')}
          </h2>
          <p className="text-muted-foreground">
            {t('admin.manage_users_desc', 'Manage user accounts, verification status, and platform access')}
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          {t('button.export', 'Export Data')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Filter className="h-5 w-5 mr-2" />
            {t('admin.filters', 'Filters & Search')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('admin.search_users', 'Search users...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('admin.filter_status', 'Filter by status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filter.all_status', 'All Status')}</SelectItem>
                <SelectItem value="verified">{t('status.verified', 'Verified')}</SelectItem>
                <SelectItem value="pending">{t('status.pending', 'Pending')}</SelectItem>
                <SelectItem value="unverified">{t('status.unverified', 'Unverified')}</SelectItem>
                <SelectItem value="rejected">{t('status.rejected', 'Rejected')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('admin.filter_type', 'Filter by type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filter.all_types', 'All Types')}</SelectItem>
                <SelectItem value="personal">{t('profile.personal', 'Personal')}</SelectItem>
                <SelectItem value="business">{t('profile.business', 'Business')}</SelectItem>
                <SelectItem value="agent">{t('profile.agent', 'Agent')}</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground flex items-center">
              {t('admin.total_results', 'Total')}: {filteredUsers.length} {t('admin.users', 'users')}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.users_list', 'Users List')}</CardTitle>
          <CardDescription>
            {t('admin.users_list_desc', 'Manage and monitor user accounts')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                  <div className="h-12 w-12 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t('admin.no_users_found', 'No users found')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{user.name}</h3>
                        {getStatusBadge(user.verification_status)}
                        {getTypeBadge(user.profile_type)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span>{user.location || t('admin.no_location', 'No location')}</span>
                        <span>•</span>
                        <span>{user.posts_count} {t('admin.posts', 'posts')}</span>
                        <span>•</span>
                        <span>{user.bookings_count} {t('admin.bookings', 'bookings')}</span>
                        <span>•</span>
                        <span>{new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {user.verification_status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateUserVerification(user.id, 'verified')}
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          {t('button.approve', 'Approve')}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateUserVerification(user.id, 'rejected')}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          {t('button.reject', 'Reject')}
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};