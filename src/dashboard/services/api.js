// Mexivanza Travel Dashboard API Service
// Replace with real API endpoints when integrating with backend

const BASE_URL = '/api';

// Mock data for development
const mockData = {
  trips: [
    {
      id: '1',
      title: 'Playa del Carmen Paradise',
      slug: 'playa-del-carmen-paradise',
      destination: 'playa-del-carmen',
      category: 'beach',
      tags: ['luxury', 'couples', 'beachfront'],
      description: 'Experience the pristine beaches and vibrant culture of Playa del Carmen',
      itinerary: 'Day 1: Arrival and beach time\nDay 2: Cenote exploration\nDay 3: Mayan ruins tour',
      price: 1299,
      duration: 3,
      images: ['/dashboard/assets/destinations/playa-del-carmen-1.jpg'],
      featured: true,
      status: 'published',
      availability: ['2025-01-15', '2025-02-15', '2025-03-15'],
      created_at: '2024-01-15',
      updated_at: '2024-09-15'
    },
    {
      id: '2',
      title: 'Cancun Adventure Week',
      slug: 'cancun-adventure-week',
      destination: 'cancun',
      category: 'adventure',
      tags: ['family', 'adventure', 'water-sports'],
      description: 'Action-packed week exploring Cancun\'s best adventure activities',
      itinerary: 'Day 1-2: Reef diving\nDay 3-4: Jungle tours\nDay 5-7: Water parks and cultural sites',
      price: 1899,
      duration: 7,
      images: ['/dashboard/assets/destinations/cancun-1.jpg'],
      featured: false,
      status: 'published',
      availability: ['2025-02-01', '2025-03-01', '2025-04-01'],
      created_at: '2024-02-01',
      updated_at: '2024-09-10'
    }
  ],
  destinations: [
    {
      id: '1',
      name: 'Playa del Carmen',
      slug: 'playa-del-carmen',
      description: 'A coastal resort town in Mexico along the Riviera Maya',
      region: 'Riviera Maya',
      images: ['/dashboard/assets/destinations/playa-del-carmen-1.jpg'],
      featured: true,
      status: 'published',
      created_at: '2024-01-01',
      updated_at: '2024-09-01'
    },
    {
      id: '2',
      name: 'Cancun',
      slug: 'cancun',
      description: 'Famous beach destination on the Yucatan Peninsula',
      region: 'Yucatan',
      images: ['/dashboard/assets/destinations/cancun-1.jpg'],
      featured: true,
      status: 'published',
      created_at: '2024-01-02',
      updated_at: '2024-09-02'
    },
    {
      id: '3',
      name: 'Tulum',
      slug: 'tulum',
      description: 'Ancient Mayan port city with stunning beaches',
      region: 'Riviera Maya',
      images: ['/dashboard/assets/destinations/tulum-1.jpg'],
      featured: false,
      status: 'published',
      created_at: '2024-01-03',
      updated_at: '2024-09-03'
    }
  ],
  categories: [
    { id: '1', name: 'Beach', slug: 'beach', description: 'Coastal and beach destinations' },
    { id: '2', name: 'Adventure', slug: 'adventure', description: 'Action-packed experiences' },
    { id: '3', name: 'Cultural', slug: 'cultural', description: 'Historical and cultural tours' },
    { id: '4', name: 'Luxury', slug: 'luxury', description: 'Premium travel experiences' }
  ],
  tags: [
    { id: '1', name: 'Luxury', slug: 'luxury' },
    { id: '2', name: 'Family', slug: 'family' },
    { id: '3', name: 'Couples', slug: 'couples' },
    { id: '4', name: 'Adventure', slug: 'adventure' },
    { id: '5', name: 'Beachfront', slug: 'beachfront' },
    { id: '6', name: 'Water Sports', slug: 'water-sports' }
  ],
  features: [
    { id: '1', name: 'WiFi', icon: 'wifi', description: 'High-speed internet access' },
    { id: '2', name: 'Pool', icon: 'pool', description: 'Swimming pool facilities' },
    { id: '3', name: 'Restaurant', icon: 'restaurant', description: 'On-site dining options' },
    { id: '4', name: 'Spa', icon: 'spa', description: 'Wellness and spa services' }
  ],
  services: [
    { id: '1', name: 'Airport Transfer', icon: 'plane', description: 'Round-trip airport transportation' },
    { id: '2', name: 'Tour Guide', icon: 'user', description: 'Professional local guide' },
    { id: '3', name: 'Equipment Rental', icon: 'gear', description: 'Sports and activity equipment' }
  ],
  bookings: [
    {
      id: '1',
      trip: 'Playa del Carmen Paradise',
      traveler_name: 'Juan Rodriguez',
      contact: 'juan@email.com',
      phone: '+52 999 123 4567',
      dates: { start: '2025-02-15', end: '2025-02-18' },
      status: 'confirmed',
      payment_info: { method: 'stripe', amount: 1299, currency: 'USD' },
      created_at: '2024-09-01'
    },
    {
      id: '2',
      trip: 'Cancun Adventure Week',
      traveler_name: 'Maria Lopez',
      contact: 'maria@email.com',
      phone: '+52 999 765 4321',
      dates: { start: '2025-03-01', end: '2025-03-08' },
      status: 'pending',
      payment_info: { method: 'paypal', amount: 1899, currency: 'USD' },
      created_at: '2024-09-05'
    }
  ],
  pages: [
    {
      id: '1',
      title: 'About Mexivanza',
      slug: 'about',
      content: '<h1>About Mexivanza</h1><p>We are Mexico\'s premier travel platform...</p>',
      status: 'published'
    },
    {
      id: '2',
      title: 'Contact Us',
      slug: 'contact',
      content: '<h1>Contact Us</h1><p>Get in touch with our travel experts...</p>',
      status: 'published'
    }
  ],
  users: [
    {
      id: '1',
      username: 'admin',
      email: 'admin@mexivanza.com',
      role: 'admin',
      status: 'active',
      created_at: '2024-01-01'
    },
    {
      id: '2',
      username: 'editor',
      email: 'editor@mexivanza.com',
      role: 'editor',
      status: 'active',
      created_at: '2024-02-01'
    }
  ]
};

// Generic API helper
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('admin_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
    
    // Mock API responses
    return mockApiResponse(endpoint, { ...options, headers });
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Mock API response handler
function mockApiResponse(endpoint, options) {
  const { method = 'GET', body } = options;
  const [resource] = endpoint.split('/').filter(Boolean);

  switch (method) {
    case 'GET':
      if (endpoint.includes('/stats')) {
        return {
          success: true,
          data: {
            total_trips: mockData.trips.length,
            total_destinations: mockData.destinations.length,
            total_bookings: mockData.bookings.length,
            total_revenue: mockData.bookings.reduce((sum, b) => sum + b.payment_info.amount, 0),
            monthly_bookings: Math.floor(Math.random() * 50) + 20,
            monthly_revenue: Math.floor(Math.random() * 50000) + 20000
          }
        };
      }
      return {
        success: true,
        data: mockData[resource] || []
      };
    
    case 'POST':
      const newItem = {
        id: Date.now().toString(),
        ...JSON.parse(body),
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0]
      };
      mockData[resource].push(newItem);
      return { success: true, data: newItem };
    
    case 'PUT':
      const updateData = JSON.parse(body);
      const index = mockData[resource].findIndex(item => item.id === updateData.id);
      if (index !== -1) {
        mockData[resource][index] = { ...mockData[resource][index], ...updateData, updated_at: new Date().toISOString().split('T')[0] };
        return { success: true, data: mockData[resource][index] };
      }
      return { success: false, error: 'Item not found' };
    
    case 'DELETE':
      const deleteId = endpoint.split('/').pop();
      const deleteIndex = mockData[resource].findIndex(item => item.id === deleteId);
      if (deleteIndex !== -1) {
        mockData[resource].splice(deleteIndex, 1);
        return { success: true };
      }
      return { success: false, error: 'Item not found' };
    
    default:
      return { success: false, error: 'Method not supported' };
  }
}

// API methods
export const api = {
  // Dashboard stats
  getStats: () => apiCall('/stats'),
  
  // Trips
  getTrips: () => apiCall('/trips'),
  createTrip: (data) => apiCall('/trips', { method: 'POST', body: JSON.stringify(data) }),
  updateTrip: (data) => apiCall('/trips', { method: 'PUT', body: JSON.stringify(data) }),
  deleteTrip: (id) => apiCall(`/trips/${id}`, { method: 'DELETE' }),
  
  // Destinations
  getDestinations: () => apiCall('/destinations'),
  createDestination: (data) => apiCall('/destinations', { method: 'POST', body: JSON.stringify(data) }),
  updateDestination: (data) => apiCall('/destinations', { method: 'PUT', body: JSON.stringify(data) }),
  deleteDestination: (id) => apiCall(`/destinations/${id}`, { method: 'DELETE' }),
  
  // Categories
  getCategories: () => apiCall('/categories'),
  createCategory: (data) => apiCall('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (data) => apiCall('/categories', { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id) => apiCall(`/categories/${id}`, { method: 'DELETE' }),
  
  // Tags
  getTags: () => apiCall('/tags'),
  createTag: (data) => apiCall('/tags', { method: 'POST', body: JSON.stringify(data) }),
  updateTag: (data) => apiCall('/tags', { method: 'PUT', body: JSON.stringify(data) }),
  deleteTag: (id) => apiCall(`/tags/${id}`, { method: 'DELETE' }),
  
  // Features
  getFeatures: () => apiCall('/features'),
  createFeature: (data) => apiCall('/features', { method: 'POST', body: JSON.stringify(data) }),
  updateFeature: (data) => apiCall('/features', { method: 'PUT', body: JSON.stringify(data) }),
  deleteFeature: (id) => apiCall(`/features/${id}`, { method: 'DELETE' }),
  
  // Services
  getServices: () => apiCall('/services'),
  createService: (data) => apiCall('/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (data) => apiCall('/services', { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: (id) => apiCall(`/services/${id}`, { method: 'DELETE' }),
  
  // Bookings
  getBookings: () => apiCall('/bookings'),
  updateBooking: (data) => apiCall('/bookings', { method: 'PUT', body: JSON.stringify(data) }),
  
  // Pages
  getPages: () => apiCall('/pages'),
  createPage: (data) => apiCall('/pages', { method: 'POST', body: JSON.stringify(data) }),
  updatePage: (data) => apiCall('/pages', { method: 'PUT', body: JSON.stringify(data) }),
  deletePage: (id) => apiCall(`/pages/${id}`, { method: 'DELETE' }),
  
  // Users
  getUsers: () => apiCall('/users'),
  createUser: (data) => apiCall('/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (data) => apiCall('/users', { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id) => apiCall(`/users/${id}`, { method: 'DELETE' }),
  
  // Media
  uploadFile: (file) => {
    // Simulate file upload
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            url: `/dashboard/assets/uploads/${file.name}`,
            filename: file.name,
            size: file.size
          }
        });
      }, 1000);
    });
  }
};