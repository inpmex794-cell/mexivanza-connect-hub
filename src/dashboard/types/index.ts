// Mexivanza Dashboard TypeScript Types

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface Trip extends BaseEntity {
  title: string;
  slug: string;
  destination: string;
  category: string;
  tags: string[];
  description: string;
  itinerary: string;
  price: number;
  duration: number;
  images: string[];
  featured: boolean;
  status: 'draft' | 'published';
  availability: string[];
}

export interface Destination extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  region: string;
  images: string[];
  featured: boolean;
  status: 'draft' | 'published';
}

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description: string;
}

export interface Tag extends BaseEntity {
  name: string;
  slug: string;
}

export interface Feature extends BaseEntity {
  name: string;
  icon: string;
  description: string;
}

export interface Service extends BaseEntity {
  name: string;
  icon: string;
  description: string;
  linked_trips?: string[];
}

export interface Booking extends BaseEntity {
  trip: string;
  traveler_name: string;
  contact: string;
  phone: string;
  dates: {
    start: string;
    end: string;
  };
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_info: {
    method: 'stripe' | 'paypal' | 'bank_transfer';
    amount: number;
    currency: string;
    transaction_id?: string;
  };
  guests: number;
  special_requests?: string;
}

export interface Page extends BaseEntity {
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published';
  meta_description?: string;
  featured_image?: string;
}

export interface User extends BaseEntity {
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  last_login?: string;
  avatar?: string;
}

export interface DashboardStats {
  total_trips: number;
  total_destinations: number;
  total_bookings: number;
  total_revenue: number;
  monthly_bookings: number;
  monthly_revenue: number;
  top_destinations: Array<{
    name: string;
    bookings: number;
  }>;
  recent_bookings: Booking[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface TableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'multiselect' | 'file' | 'date' | 'number' | 'checkbox';
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export type StatusType = 'published' | 'draft' | 'active' | 'inactive' | 'confirmed' | 'pending' | 'cancelled';