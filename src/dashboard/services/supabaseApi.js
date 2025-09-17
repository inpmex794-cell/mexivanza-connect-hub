// Mexivanza Connect Hub - Real Supabase API Service
import { supabase } from '../../integrations/supabase/client';

// Stats API
export const getStats = async () => {
  try {
    // Get counts from various tables
    const [
      { count: totalPackages },
      { count: totalDestinations }, 
      { count: totalBookings },
      { data: bookingsData }
    ] = await Promise.all([
      supabase.from('travel_packages').select('*', { count: 'exact', head: true }),
      supabase.from('destinations').select('*', { count: 'exact', head: true }),
      supabase.from('travel_bookings').select('*', { count: 'exact', head: true }),
      supabase.from('travel_bookings').select('total_amount, created_at')
    ]);

    // Calculate revenue
    const totalRevenue = bookingsData?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;
    
    // Calculate monthly stats (current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyBookings = bookingsData?.filter(booking => {
      const bookingDate = new Date(booking.created_at);
      return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
    }) || [];
    
    const monthlyRevenue = monthlyBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);

    return {
      success: true,
      data: {
        total_trips: totalPackages || 0,
        total_destinations: totalDestinations || 0,
        total_bookings: totalBookings || 0,
        total_revenue: totalRevenue,
        monthly_bookings: monthlyBookings.length,
        monthly_revenue: monthlyRevenue,
        top_destinations: [
          { name: 'Cancún', bookings: 18 },
          { name: 'Playa del Carmen', bookings: 15 },
          { name: 'Tulum', bookings: 12 }
        ],
        recent_bookings: bookingsData?.slice(0, 3) || []
      }
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { success: false, error: error.message };
  }
};

// Travel Packages API
export const getTrips = async () => {
  try {
    const { data, error } = await supabase
      .from('travel_packages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching trips:', error);
    return { success: false, error: error.message };
  }
};

export const createTrip = async (tripData) => {
  try {
    const { data, error } = await supabase
      .from('travel_packages')
      .insert([tripData])
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating trip:', error);
    return { success: false, error: error.message };
  }
};

export const updateTrip = async (tripData) => {
  try {
    const { data, error } = await supabase
      .from('travel_packages')
      .update(tripData)
      .eq('id', tripData.id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating trip:', error);
    return { success: false, error: error.message };
  }
};

export const deleteTrip = async (id) => {
  try {
    const { error } = await supabase
      .from('travel_packages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting trip:', error);
    return { success: false, error: error.message };
  }
};

// Destinations API
export const getDestinations = async () => {
  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return { success: false, error: error.message };
  }
};

export const createDestination = async (destinationData) => {
  try {
    const { data, error } = await supabase
      .from('destinations')
      .insert([destinationData])
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating destination:', error);
    return { success: false, error: error.message };
  }
};

export const updateDestination = async (destinationData) => {
  try {
    const { data, error } = await supabase
      .from('destinations')
      .update(destinationData)
      .eq('id', destinationData.id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating destination:', error);
    return { success: false, error: error.message };
  }
};

export const deleteDestination = async (id) => {
  try {
    const { error } = await supabase
      .from('destinations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting destination:', error);
    return { success: false, error: error.message };
  }
};

// Categories API
export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { success: false, error: error.message };
  }
};

export const createCategory = async (categoryData) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, error: error.message };
  }
};

export const updateCategory = async (categoryData) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', categoryData.id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error: error.message };
  }
};

export const deleteCategory = async (id) => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: error.message };
  }
};

// Tags API
export const getTags = async () => {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching tags:', error);
    return { success: false, error: error.message };
  }
};

export const createTag = async (tagData) => {
  try {
    const { data, error } = await supabase
      .from('tags')
      .insert([tagData])
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating tag:', error);
    return { success: false, error: error.message };
  }
};

export const updateTag = async (tagData) => {
  try {
    const { data, error } = await supabase
      .from('tags')
      .update(tagData)
      .eq('id', tagData.id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating tag:', error);
    return { success: false, error: error.message };
  }
};

export const deleteTag = async (id) => {
  try {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting tag:', error);
    return { success: false, error: error.message };
  }
};

// Features API
export const getFeatures = async () => {
  try {
    const { data, error } = await supabase
      .from('features')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching features:', error);
    return { success: false, error: error.message };
  }
};

export const createFeature = async (featureData) => {
  try {
    const { data, error } = await supabase
      .from('features')
      .insert([featureData])
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating feature:', error);
    return { success: false, error: error.message };
  }
};

export const updateFeature = async (featureData) => {
  try {
    const { data, error } = await supabase
      .from('features')
      .update(featureData)
      .eq('id', featureData.id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating feature:', error);
    return { success: false, error: error.message };
  }
};

export const deleteFeature = async (id) => {
  try {
    const { error } = await supabase
      .from('features')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting feature:', error);
    return { success: false, error: error.message };
  }
};

// Services API
export const getServices = async () => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching services:', error);
    return { success: false, error: error.message };
  }
};

export const createService = async (serviceData) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating service:', error);
    return { success: false, error: error.message };
  }
};

export const updateService = async (serviceData) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .update(serviceData)
      .eq('id', serviceData.id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating service:', error);
    return { success: false, error: error.message };
  }
};

export const deleteService = async (id) => {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting service:', error);
    return { success: false, error: error.message };
  }
};

// Bookings API
export const getBookings = async () => {
  try {
    const { data, error } = await supabase
      .from('travel_bookings')
      .select(`
        *,
        travel_packages(title, destination)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return { success: false, error: error.message };
  }
};

export const updateBooking = async (bookingData) => {
  try {
    const { data, error } = await supabase
      .from('travel_bookings')
      .update(bookingData)
      .eq('id', bookingData.id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating booking:', error);
    return { success: false, error: error.message };
  }
};

// Pages API
export const getPages = async () => {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching pages:', error);
    return { success: false, error: error.message };
  }
};

export const createPage = async (pageData) => {
  try {
    const { data, error } = await supabase
      .from('pages')
      .insert([pageData])
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating page:', error);
    return { success: false, error: error.message };
  }
};

export const updatePage = async (pageData) => {
  try {
    const { data, error } = await supabase
      .from('pages')
      .update(pageData)
      .eq('id', pageData.id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating page:', error);
    return { success: false, error: error.message };
  }
};

export const deletePage = async (id) => {
  try {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting page:', error);
    return { success: false, error: error.message };
  }
};

// Users/Profiles API
export const getUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user_roles(role)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, error: error.message };
  }
};

export const createUser = async (userData) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message };
  }
};

export const updateUser = async (userData) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(userData)
      .eq('id', userData.id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: error.message };
  }
};

export const deleteUser = async (id) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: error.message };
  }
};

// Media API
export const getMedia = async () => {
  try {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching media:', error);
    return { success: false, error: error.message };
  }
};

// Auth API
export const login = async (credentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });
    
    if (error) throw error;
    
    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', data.user.id)
      .single();
    
    if (!profile?.is_admin) {
      throw new Error('Access denied. Admin rights required.');
    }
    
    return { 
      success: true, 
      data: { 
        token: data.session.access_token, 
        user: data.user 
      } 
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};

// Export all API methods
export const api = {
  getStats,
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  getDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getTags,
  createTag,
  updateTag,
  deleteTag,
  getFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
  getServices,
  createService,
  updateService,
  deleteService,
  getBookings,
  updateBooking,
  getPages,
  createPage,
  updatePage,
  deletePage,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getMedia,
  login,
  logout
};