// Mexivanza Connect Hub - Real Supabase API Service  
export { api } from './supabaseApi.js';

const BASE_URL = '/api';

// Enhanced Mock Data - Realistic Mexico Travel Content
const mockData = {
  trips: [
    {
      id: '1',
      title: 'Playa del Carmen Paradise',
      slug: 'playa-del-carmen-paradise',
      destination: 'playa-del-carmen',
      category: 'beach',
      tags: ['luxury', 'couples', 'beachfront'],
      description: 'Experience the pristine beaches and vibrant culture of Playa del Carmen with luxury beachfront accommodations and authentic Mexican experiences.',
      itinerary: 'Day 1: Arrival and check-in at beachfront resort, welcome dinner\nDay 2: Cenote Dos Ojos exploration and snorkeling\nDay 3: Mayan ruins tour of Tulum with local guide\nDay 4: Spa day and farewell beach dinner',
      price: 1299,
      duration: 4,
      images: ['/dashboard/assets/destinations/playa-del-carmen-1.jpg'],
      featured: true,
      status: 'published',
      availability: ['2025-01-15', '2025-02-15', '2025-03-15', '2025-04-15'],
      created_at: '2024-01-15',
      updated_at: '2024-09-15'
    },
    {
      id: '2',
      title: 'Cancún Adventure Week',
      slug: 'cancun-adventure-week',
      destination: 'cancun',
      category: 'adventure',
      tags: ['family', 'adventure', 'water-sports'],
      description: 'Action-packed week exploring Cancún\'s best adventure activities from jungle expeditions to underwater reef diving.',
      itinerary: 'Day 1-2: Mesoamerican Reef diving and snorkeling\nDay 3-4: Chichen Itzá and cenote tours\nDay 5-6: Jungle zip-lining and ATV adventures\nDay 7: Xel-Há eco park and cultural performances',
      price: 1899,
      duration: 7,
      images: ['/dashboard/assets/destinations/cancun-1.jpg'],
      featured: false,
      status: 'published',
      availability: ['2025-02-01', '2025-03-01', '2025-04-01'],
      created_at: '2024-02-01',
      updated_at: '2024-09-10'
    },
    {
      id: '3',
      title: 'Tulum Mystical Retreat',
      slug: 'tulum-mystical-retreat',
      destination: 'tulum',
      category: 'wellness',
      tags: ['wellness', 'spiritual', 'eco-friendly'],
      description: 'Connect with ancient Mayan wisdom in this transformative wellness retreat featuring yoga, meditation, and traditional temazcal ceremonies.',
      itinerary: 'Day 1: Arrival and sunrise yoga on the beach\nDay 2: Tulum ruins tour and cenote meditation\nDay 3: Traditional temazcal ceremony and Mayan healing\nDay 4: Eco-tour of Sian Ka\'an Biosphere\nDay 5: Departure with personalized wellness plan',
      price: 1650,
      duration: 5,
      images: ['/dashboard/assets/destinations/tulum-1.jpg'],
      featured: true,
      status: 'published',
      availability: ['2025-01-20', '2025-02-20', '2025-03-20'],
      created_at: '2024-01-20',
      updated_at: '2024-09-12'
    },
    {
      id: '4',
      title: 'Cozumel Diving Expedition',
      slug: 'cozumel-diving-expedition',
      destination: 'cozumel',
      category: 'diving',
      tags: ['diving', 'marine-life', 'certified-divers'],
      description: 'Explore the world-famous Cozumel reefs with professional dive masters on this underwater photography expedition.',
      itinerary: 'Day 1: Arrival and check dives at Paradise Reef\nDay 2: Palancar Reef and Santa Rosa Wall dives\nDay 3: Devil\'s Throat and Punta Sur exploration\nDay 4: Night diving and underwater photography workshop\nDay 5: Advanced wreck diving at C-53 Felipe Xicotencatl',
      price: 2100,
      duration: 5,
      images: ['/dashboard/assets/destinations/cozumel-1.jpg'],
      featured: false,
      status: 'published',
      availability: ['2025-02-10', '2025-03-10', '2025-04-10'],
      created_at: '2024-02-10',
      updated_at: '2024-09-08'
    },
    {
      id: '5',
      title: 'Mérida Cultural Immersion',
      slug: 'merida-cultural-immersion',
      destination: 'merida',
      category: 'cultural',
      tags: ['culture', 'history', 'gastronomy'],
      description: 'Discover the colonial charm and Mayan heritage of Mérida with expert local guides and authentic culinary experiences.',
      itinerary: 'Day 1: Historic center walking tour and Casa de Montejo\nDay 2: Uxmal archaeological site and traditional hacienda visit\nDay 3: Cooking class featuring Yucatecan specialties\nDay 4: Celestún flamingo reserve and mangrove tour\nDay 5: Artisan workshops and local market exploration',
      price: 1450,
      duration: 5,
      images: ['/dashboard/assets/destinations/merida-1.jpg'],
      featured: false,
      status: 'published',
      availability: ['2025-01-25', '2025-02-25', '2025-03-25'],
      created_at: '2024-01-25',
      updated_at: '2024-09-05'
    },
    {
      id: '6',
      title: 'Puerto Vallarta Luxury Escape',
      slug: 'puerto-vallarta-luxury-escape',
      destination: 'puerto-vallarta',
      category: 'luxury',
      tags: ['luxury', 'beach', 'fine-dining'],
      description: 'Indulge in world-class luxury at Puerto Vallarta\'s most exclusive resorts with private beach access and gourmet dining.',
      itinerary: 'Day 1: VIP arrival and luxury suite check-in\nDay 2: Private yacht excursion to Marietas Islands\nDay 3: Spa day with traditional Mexican healing treatments\nDay 4: Tequila tasting tour in nearby distilleries\nDay 5: Private chef dinner and sunset catamaran cruise',
      price: 2850,
      duration: 5,
      images: ['/dashboard/assets/destinations/puerto-vallarta-1.jpg'],
      featured: true,
      status: 'published',
      availability: ['2025-02-05', '2025-03-05', '2025-04-05'],
      created_at: '2024-02-05',
      updated_at: '2024-09-07'
    }
  ],
  destinations: [
    {
      id: '1',
      name: 'Playa del Carmen',
      slug: 'playa-del-carmen',
      description: 'A vibrant coastal resort town in Mexico\'s Riviera Maya, famous for its white sand beaches, cenotes, and proximity to ancient Mayan ruins.',
      region: 'Riviera Maya',
      images: ['/dashboard/assets/destinations/playa-del-carmen-1.jpg'],
      featured: true,
      status: 'published',
      created_at: '2024-01-01',
      updated_at: '2024-09-01'
    },
    {
      id: '2',
      name: 'Cancún',
      slug: 'cancun',
      description: 'World-renowned beach destination on the Yucatán Peninsula, offering stunning Caribbean coastline, vibrant nightlife, and rich Mayan heritage.',
      region: 'Yucatán',
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
      description: 'Ancient Mayan port city perched on dramatic clifftops overlooking the Caribbean Sea, combining archaeological wonders with pristine beaches.',
      region: 'Riviera Maya',
      images: ['/dashboard/assets/destinations/tulum-1.jpg'],
      featured: true,
      status: 'published',
      created_at: '2024-01-03',
      updated_at: '2024-09-03'
    },
    {
      id: '4',
      name: 'Cozumel',
      slug: 'cozumel',
      description: 'Premier diving destination in the Caribbean, home to the Mesoamerican Reef System and world-class underwater biodiversity.',
      region: 'Yucatán',
      images: ['/dashboard/assets/destinations/cozumel-1.jpg'],
      featured: false,
      status: 'published',
      created_at: '2024-01-04',
      updated_at: '2024-09-04'
    },
    {
      id: '5',
      name: 'Mérida',
      slug: 'merida',
      description: 'Colonial capital of Yucatán, rich in Mayan culture, beautiful architecture, and traditional Mexican gastronomy.',
      region: 'Yucatán',
      images: ['/dashboard/assets/destinations/merida-1.jpg'],
      featured: false,
      status: 'published',
      created_at: '2024-01-05',
      updated_at: '2024-09-05'
    },
    {
      id: '6',
      name: 'Puerto Vallarta',
      slug: 'puerto-vallarta',
      description: 'Sophisticated Pacific coast resort city combining traditional Mexican charm with luxury amenities and stunning Sierra Madre backdrop.',
      region: 'Pacific Coast',
      images: ['/dashboard/assets/destinations/puerto-vallarta-1.jpg'],
      featured: true,
      status: 'published',
      created_at: '2024-01-06',
      updated_at: '2024-09-06'
    }
  ],
  categories: [
    { id: '1', name: 'Beach', slug: 'beach', description: 'Coastal destinations with pristine beaches and water activities' },
    { id: '2', name: 'Adventure', slug: 'adventure', description: 'Action-packed experiences including diving, zip-lining, and exploration' },
    { id: '3', name: 'Cultural', slug: 'cultural', description: 'Historical sites, archaeological ruins, and authentic cultural immersion' },
    { id: '4', name: 'Luxury', slug: 'luxury', description: 'Premium travel experiences with world-class accommodations and services' },
    { id: '5', name: 'Wellness', slug: 'wellness', description: 'Spa retreats, yoga experiences, and holistic healing journeys' },
    { id: '6', name: 'Diving', slug: 'diving', description: 'Underwater exploration of reefs, cenotes, and marine ecosystems' }
  ],
  tags: [
    { id: '1', name: 'Luxury', slug: 'luxury' },
    { id: '2', name: 'Family-Friendly', slug: 'family' },
    { id: '3', name: 'Couples', slug: 'couples' },
    { id: '4', name: 'Adventure', slug: 'adventure' },
    { id: '5', name: 'Beachfront', slug: 'beachfront' },
    { id: '6', name: 'Water Sports', slug: 'water-sports' },
    { id: '7', name: 'Wellness', slug: 'wellness' },
    { id: '8', name: 'Cultural Heritage', slug: 'cultural-heritage' }
  ],
  features: [
    { id: '1', name: 'WiFi', icon: 'wifi', description: 'High-speed wireless internet access throughout property' },
    { id: '2', name: 'Swimming Pool', icon: 'waves', description: 'Infinity pool with ocean views and poolside service' },
    { id: '3', name: 'Restaurant', icon: 'utensils', description: 'Fine dining featuring authentic Mexican and international cuisine' },
    { id: '4', name: 'Spa & Wellness', icon: 'flower', description: 'Full-service spa with traditional Mexican healing treatments' },
    { id: '5', name: 'Beach Access', icon: 'umbrella-beach', description: 'Private beach access with complimentary chairs and umbrellas' }
  ],
  services: [
    { id: '1', name: 'Airport Transfer', icon: 'plane', description: 'Luxury vehicle round-trip airport transportation with meet & greet' },
    { id: '2', name: 'Private Tour Guide', icon: 'user-check', description: 'Certified bilingual guide with extensive local knowledge' },
    { id: '3', name: 'Equipment Rental', icon: 'gear', description: 'Professional diving, snorkeling, and water sports equipment' },
    { id: '4', name: 'Photography Service', icon: 'camera', description: 'Professional photographer for special occasions and excursions' }
  ],
  bookings: [
    {
      id: '1',
      trip: 'Playa del Carmen Paradise',
      traveler_name: 'Juan Carlos Rodriguez',
      contact: 'juan.rodriguez@email.com',
      phone: '+52 984 123 4567',
      dates: { start: '2025-02-15', end: '2025-02-19' },
      status: 'confirmed',
      payment_info: { method: 'stripe', amount: 1299, currency: 'USD', transaction_id: 'pi_1234567890' },
      guests: 2,
      special_requests: 'Anniversary dinner arrangement',
      created_at: '2024-09-01'
    },
    {
      id: '2',
      trip: 'Cancún Adventure Week',
      traveler_name: 'María Elena López',
      contact: 'maria.lopez@email.com',
      phone: '+52 998 765 4321',
      dates: { start: '2025-03-01', end: '2025-03-08' },
      status: 'pending',
      payment_info: { method: 'paypal', amount: 1899, currency: 'USD' },
      guests: 4,
      special_requests: 'Vegetarian meals for 2 guests',
      created_at: '2024-09-05'
    }
  ],
  pages: [
    {
      id: '1',
      title: 'About Mexivanza',
      slug: 'about',
      content: '<h1>About Mexivanza</h1><p>Mexivanza is Mexico\'s premier travel platform, connecting adventurous travelers with authentic Mexican experiences.</p>',
      status: 'published',
      meta_description: 'Discover authentic Mexican travel experiences with Mexivanza, your premier guide to Mexico\'s hidden gems and cultural treasures.',
      created_at: '2024-01-01',
      updated_at: '2024-09-01'
    }
  ],
  users: [
    {
      id: '1',
      username: 'admin',
      email: 'admin@mexivanza.com',
      role: 'admin',
      status: 'active',
      last_login: '2024-09-17',
      avatar: '/dashboard/assets/avatars/admin.jpg',
      created_at: '2024-01-01',
      updated_at: '2024-09-17'
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
            monthly_bookings: 47,
            monthly_revenue: 89350,
            top_destinations: [
              { name: 'Playa del Carmen', bookings: 18 },
              { name: 'Tulum', bookings: 15 },
              { name: 'Cancún', bookings: 12 }
            ],
            recent_bookings: mockData.bookings.slice(0, 3)
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
        mockData[resource][index] = { 
          ...mockData[resource][index], 
          ...updateData, 
          updated_at: new Date().toISOString().split('T')[0] 
        };
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
  
  // Auth
  login: async (credentials) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (credentials.email === 'admin@mexivanza.com' && credentials.password === 'admin123') {
      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('admin_token', token);
      return { success: true, data: { token, user: mockData.users[0] } };
    }
    return { success: false, error: 'Invalid credentials' };
  },
  
  logout: () => {
    localStorage.removeItem('admin_token');
    return { success: true };
  }
};