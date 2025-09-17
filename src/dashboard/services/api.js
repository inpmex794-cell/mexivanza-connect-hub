// Mexivanza Travel Dashboard API Service
// Replace with real API endpoints when integrating with backend

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
      images: ['/dashboard/assets/destinations/playa-del-carmen-1.jpg', '/dashboard/assets/destinations/playa-del-carmen-2.jpg'],
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
      images: ['/dashboard/assets/destinations/cancun-1.jpg', '/dashboard/assets/destinations/cancun-2.jpg'],
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
      images: ['/dashboard/assets/destinations/tulum-1.jpg', '/dashboard/assets/destinations/tulum-2.jpg'],
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
      images: ['/dashboard/assets/destinations/playa-del-carmen-1.jpg', '/dashboard/assets/destinations/playa-del-carmen-2.jpg'],
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
      images: ['/dashboard/assets/destinations/cancun-1.jpg', '/dashboard/assets/destinations/cancun-2.jpg'],
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
      images: ['/dashboard/assets/destinations/tulum-1.jpg', '/dashboard/assets/destinations/tulum-2.jpg'],
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
    },
    {
      id: '7',
      name: 'Oaxaca',
      slug: 'oaxaca',
      description: 'UNESCO World Heritage city renowned for indigenous culture, artisan crafts, culinary traditions, and nearby Monte Albán ruins.',
      region: 'Southern Mexico',
      images: ['/dashboard/assets/destinations/oaxaca-1.jpg'],
      featured: false,
      status: 'published',
      created_at: '2024-01-07',
      updated_at: '2024-09-07'
    },
    {
      id: '8',
      name: 'Cabo San Lucas',
      slug: 'cabo-san-lucas',
      description: 'Dramatic desert meeting the sea at the tip of Baja California, famous for deep-sea fishing, luxury resorts, and iconic rock formations.',
      region: 'Baja California',
      images: ['/dashboard/assets/destinations/cabo-1.jpg'],
      featured: false,
      status: 'published',
      created_at: '2024-01-08',
      updated_at: '2024-09-08'
    }
  ],
  categories: [
    { id: '1', name: 'Beach', slug: 'beach', description: 'Coastal destinations with pristine beaches and water activities' },
    { id: '2', name: 'Adventure', slug: 'adventure', description: 'Action-packed experiences including diving, zip-lining, and exploration' },
    { id: '3', name: 'Cultural', slug: 'cultural', description: 'Historical sites, archaeological ruins, and authentic cultural immersion' },
    { id: '4', name: 'Luxury', slug: 'luxury', description: 'Premium travel experiences with world-class accommodations and services' },
    { id: '5', name: 'Wellness', slug: 'wellness', description: 'Spa retreats, yoga experiences, and holistic healing journeys' },
    { id: '6', name: 'Diving', slug: 'diving', description: 'Underwater exploration of reefs, cenotes, and marine ecosystems' },
    { id: '7', name: 'Eco-Tourism', slug: 'eco-tourism', description: 'Sustainable travel focused on natural environments and conservation' },
    { id: '8', name: 'Gastronomy', slug: 'gastronomy', description: 'Culinary tours featuring traditional Mexican cuisine and cooking experiences' }
  ],
  tags: [
    { id: '1', name: 'Luxury', slug: 'luxury' },
    { id: '2', name: 'Family-Friendly', slug: 'family' },
    { id: '3', name: 'Couples', slug: 'couples' },
    { id: '4', name: 'Adventure', slug: 'adventure' },
    { id: '5', name: 'Beachfront', slug: 'beachfront' },
    { id: '6', name: 'Water Sports', slug: 'water-sports' },
    { id: '7', name: 'All-Inclusive', slug: 'all-inclusive' },
    { id: '8', name: 'Eco-Friendly', slug: 'eco-friendly' },
    { id: '9', name: 'Wellness', slug: 'wellness' },
    { id: '10', name: 'Cultural Heritage', slug: 'cultural-heritage' },
    { id: '11', name: 'Archaeological', slug: 'archaeological' },
    { id: '12', name: 'Marine Life', slug: 'marine-life' },
    { id: '13', name: 'Cenotes', slug: 'cenotes' },
    { id: '14', name: 'Mayan Culture', slug: 'mayan-culture' },
    { id: '15', name: 'Fine Dining', slug: 'fine-dining' },
    { id: '16', name: 'Photography', slug: 'photography' },
    { id: '17', name: 'Spiritual', slug: 'spiritual' },
    { id: '18', name: 'Group Travel', slug: 'group-travel' }
  ],
  features: [
    { id: '1', name: 'WiFi', icon: 'wifi', description: 'High-speed wireless internet access throughout property' },
    { id: '2', name: 'Swimming Pool', icon: 'waves', description: 'Infinity pool with ocean views and poolside service' },
    { id: '3', name: 'Restaurant', icon: 'utensils', description: 'Fine dining featuring authentic Mexican and international cuisine' },
    { id: '4', name: 'Spa & Wellness', icon: 'flower', description: 'Full-service spa with traditional Mexican healing treatments' },
    { id: '5', name: 'Beach Access', icon: 'umbrella-beach', description: 'Private beach access with complimentary chairs and umbrellas' },
    { id: '6', name: 'Diving Center', icon: 'fish', description: 'PADI certified diving center with equipment rental' },
    { id: '7', name: 'Fitness Center', icon: 'dumbbell', description: '24/7 fitness facility with modern equipment and ocean views' },
    { id: '8', name: 'Concierge', icon: 'bell', description: 'Personal concierge service for tours and restaurant reservations' },
     { id: '9', name: 'Kids Club', icon: 'baby', description: 'Supervised children\'s activities and entertainment programs' },
    { id: '10', name: 'Business Center', icon: 'briefcase', description: 'Fully equipped business center with meeting rooms' }
  ],
  services: [
    { id: '1', name: 'Airport Transfer', icon: 'plane', description: 'Luxury vehicle round-trip airport transportation with meet & greet' },
    { id: '2', name: 'Private Tour Guide', icon: 'user-check', description: 'Certified bilingual guide with extensive local knowledge' },
    { id: '3', name: 'Equipment Rental', icon: 'gear', description: 'Professional diving, snorkeling, and water sports equipment' },
    { id: '4', name: 'Photography Service', icon: 'camera', description: 'Professional photographer for special occasions and excursions' },
    { id: '5', name: 'Culinary Classes', icon: 'chef-hat', description: 'Hands-on cooking classes featuring traditional Yucatecan cuisine' },
    { id: '6', name: 'Wellness Treatments', icon: 'lotus', description: 'Traditional Mayan healing ceremonies and modern spa treatments' },
    { id: '7', name: 'Cultural Immersion', icon: 'globe', description: 'Authentic experiences with local communities and artisans' },
    { id: '8', name: 'Marine Excursions', icon: 'ship', description: 'Boat tours, fishing trips, and swimming with whale sharks' }
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
    },
    {
      id: '3',
      trip: 'Tulum Mystical Retreat',
      traveler_name: 'Sarah Johnson',
      contact: 'sarah.johnson@email.com',
      phone: '+1 555 987 6543',
      dates: { start: '2025-02-20', end: '2025-02-25' },
      status: 'confirmed',
      payment_info: { method: 'stripe', amount: 1650, currency: 'USD', transaction_id: 'pi_0987654321' },
      guests: 1,
      special_requests: 'Yoga mat and meditation cushions in room',
      created_at: '2024-09-10'
    },
    {
      id: '4',
      trip: 'Cozumel Diving Expedition',
      traveler_name: 'Michael Thompson',
      contact: 'mike.thompson@email.com',
      phone: '+1 555 246 8135',
      dates: { start: '2025-03-10', end: '2025-03-15' },
      status: 'confirmed',
      payment_info: { method: 'bank_transfer', amount: 2100, currency: 'USD', transaction_id: 'BT_2024091501' },
      guests: 2,
      special_requests: 'Advanced diving certification required',
      created_at: '2024-09-15'
    },
    {
      id: '5',
      trip: 'Puerto Vallarta Luxury Escape',
      traveler_name: 'Isabella García',
      contact: 'isabella.garcia@email.com',
      phone: '+52 322 555 9876',
      dates: { start: '2025-03-05', end: '2025-03-10' },
      status: 'pending',
      payment_info: { method: 'stripe', amount: 2850, currency: 'USD' },
      guests: 2,
      special_requests: 'Ocean view suite preferred',
      created_at: '2024-09-18'
    }
  ],
  pages: [
    {
      id: '1',
      title: 'About Mexivanza',
      slug: 'about',
       content: '<h1>About Mexivanza</h1><p>Mexivanza is Mexico\'s premier travel platform, connecting adventurous travelers with authentic Mexican experiences. Founded by local experts, we specialize in creating meaningful journeys that celebrate Mexico\'s rich cultural heritage, stunning natural beauty, and warm hospitality.</p><p>Our curated selection of destinations spans from the pristine beaches of the Riviera Maya to the colonial charm of Mérida, ensuring every traveler discovers the Mexico that speaks to their soul.</p>',
      status: 'published',
       meta_description: 'Discover authentic Mexican travel experiences with Mexivanza, your premier guide to Mexico\'s hidden gems and cultural treasures.',
      featured_image: '/dashboard/assets/pages/about-hero.jpg',
      created_at: '2024-01-01',
      updated_at: '2024-09-01'
    },
    {
      id: '2',
      title: 'Contact Us',
      slug: 'contact',
      content: '<h1>Contact Us</h1><p>Ready to embark on your Mexican adventure? Our travel experts are here to help you plan the perfect journey.</p><h2>Get in Touch</h2><p><strong>Email:</strong> info@mexivanza.com</p><p><strong>Phone:</strong> +52 984 803 4000</p><p><strong>WhatsApp:</strong> +52 984 803 4000</p><h2>Office Hours</h2><p>Monday - Friday: 8:00 AM - 8:00 PM (CST)<br>Saturday: 9:00 AM - 5:00 PM (CST)<br>Sunday: 10:00 AM - 4:00 PM (CST)</p>',
      status: 'published',
      meta_description: 'Contact Mexivanza travel experts to plan your perfect Mexican vacation. Available via phone, email, and WhatsApp.',
      created_at: '2024-01-02',
      updated_at: '2024-09-02'
    },
    {
      id: '3',
      title: 'Privacy Policy',
      slug: 'privacy',
      content: '<h1>Privacy Policy</h1><p>At Mexivanza, we are committed to protecting your privacy and ensuring the security of your personal information...</p>',
      status: 'published',
      meta_description: 'Read Mexivanza\'s privacy policy to understand how we protect and use your personal information.',
      created_at: '2024-01-03',
      updated_at: '2024-09-03'
    },
    {
      id: '4',
      title: 'Terms of Service',
      slug: 'terms',
      content: '<h1>Terms of Service</h1><p>By using Mexivanza services, you agree to these terms and conditions...</p>',
      status: 'draft',
      meta_description: 'Review Mexivanza\'s terms of service for booking travel experiences in Mexico.',
      created_at: '2024-01-04',
      updated_at: '2024-09-04'
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
    },
    {
      id: '2',
      username: 'content_manager',
      email: 'content@mexivanza.com',
      role: 'editor',
      status: 'active',
      last_login: '2024-09-16',
      avatar: '/dashboard/assets/avatars/editor.jpg',
      created_at: '2024-02-01',
      updated_at: '2024-09-16'
    },
    {
      id: '3',
      username: 'booking_agent',
      email: 'bookings@mexivanza.com',
      role: 'viewer',
      status: 'active',
      last_login: '2024-09-15',
      avatar: '/dashboard/assets/avatars/agent.jpg',
      created_at: '2024-03-01',
      updated_at: '2024-09-15'
    },
    {
      id: '4',
      username: 'guest_reviewer',
      email: 'reviews@mexivanza.com',
      role: 'viewer',
      status: 'inactive',
      last_login: '2024-08-20',
      created_at: '2024-04-01',
      updated_at: '2024-08-20'
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
              { name: 'Cancún', bookings: 12 },
              { name: 'Puerto Vallarta', bookings: 8 }
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
  import { supabase } from '../lib/supabase-client';

export const statsService = {
  // ✅ Fetch dashboard stats
  getStats: async () => {
    // Count total trips
    const { count: tripsCount, error: tripsError } = await supabase
      .from('travel_packages')
      .select('*', { count: 'exact', head: true });
    if (tripsError) throw tripsError;

    // Count total destinations
    const { count: destinationsCount, error: destError } = await supabase
      .from('destinations')
      .select('*', { count: 'exact', head: true });
    if (destError) throw destError;

    // Count total bookings
    const { count: bookingsCount, error: bookingsError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });
    if (bookingsError) throw bookingsError;

    // Sum total revenue
    const { data: revenueData, error: revenueError } = await supabase
      .from('bookings')
      .select('total');
    if (revenueError) throw revenueError;

    const totalRevenue = revenueData?.reduce((sum, row) => sum + (row.total || 0), 0) || 0;

    return {
      trips: tripsCount || 0,
      destinations: destinationsCount || 0,
      bookings: bookingsCount || 0,
      revenue: totalRevenue,
    };
  },
};

  
  // Trips
  import { supabase } from '../lib/supabase-client';

export const tripService = {
  // ✅ Fetch all trips
  getTrips: async () => {
    const { data, error } = await supabase
      .from('travel_packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // ✅ Create a new trip
  createTrip: async (data) => {
    const { data: result, error } = await supabase
      .from('travel_packages')
      .insert([data]);

    if (error) throw error;
    return result;
  },

  // ✅ Update an existing trip
  updateTrip: async (data) => {
    const { id, ...fields } = data;

    const { data: result, error } = await supabase
      .from('travel_packages')
      .update(fields)
      .eq('id', id);

    if (error) throw error;
    return result;
  },

  // ✅ Delete a trip by ID
  deleteTrip: async (id) => {
    const { error } = await supabase
      .from('travel_packages')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

  
  // Destinations
 getDestinations: async () => {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
},

 createDestination: async (data) => {
  const { data: result, error } = await supabase
    .from('destinations')
    .insert([data]);

  if (error) throw error;
  return result;
},

  updateDestination: async (data) => {
  const { id, ...fields } = data;

  const { data: result, error } = await supabase
    .from('destinations')
    .update(fields)
    .eq('id', id);

  if (error) throw error;
  return result;
},

 deleteDestination: async (id) => {
  const { error } = await supabase
    .from('destinations')
    .delete()
    .eq('id', id);

  if (error) throw error;
},

  
  // Categories
import { supabase } from '../lib/supabase-client';

export const categoryService = {
  // ✅ Fetch all categories
  getCategories: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // ✅ Create a new category
  createCategory: async (data) => {
    const { data: result, error } = await supabase
      .from('categories')
      .insert([data]);

    if (error) throw error;
    return result;
  },

  // ✅ Update an existing category
  updateCategory: async (data) => {
    const { id, ...fields } = data;

    const { data: result, error } = await supabase
      .from('categories')
      .update(fields)
      .eq('id', id);

    if (error) throw error;
    return result;
  },

  // ✅ Delete a category by ID
  deleteCategory: async (id) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

  
  // Tags
  import { supabase } from '../lib/supabase-client';

export const tagService = {
  // ✅ Fetch all tags
  getTags: async () => {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // ✅ Create a new tag
  createTag: async (data) => {
    const { data: result, error } = await supabase
      .from('tags')
      .insert([data]);

    if (error) throw error;
    return result;
  },

  // ✅ Update an existing tag
  updateTag: async (data) => {
    const { id, ...fields } = data;

    const { data: result, error } = await supabase
      .from('tags')
      .update(fields)
      .eq('id', id);

    if (error) throw error;
    return result;
  },

  // ✅ Delete a tag by ID
  deleteTag: async (id) => {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

  
  // Features
  import { supabase } from '../lib/supabase-client';

export const featureService = {
  // ✅ Fetch all features
  getFeatures: async () => {
    const { data, error } = await supabase
      .from('features')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // ✅ Create a new feature
  createFeature: async (data) => {
    const { data: result, error } = await supabase
      .from('features')
      .insert([data]);

    if (error) throw error;
    return result;
  },

  // ✅ Update an existing feature
  updateFeature: async (data) => {
    const { id, ...fields } = data;

    const { data: result, error } = await supabase
      .from('features')
      .update(fields)
      .eq('id', id);

    if (error) throw error;
    return result;
  },

  // ✅ Delete a feature by ID
  deleteFeature: async (id) => {
    const { error } = await supabase
      .from('features')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

  
  // Services
  import { supabase } from '../lib/supabase-client';

export const serviceService = {
  // ✅ Fetch all services
  getServices: async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // ✅ Create a new service
  createService: async (data) => {
    const { data: result, error } = await supabase
      .from('services')
      .insert([data]);

    if (error) throw error;
    return result;
  },

  // ✅ Update an existing service
  updateService: async (data) => {
    const { id, ...fields } = data;

    const { data: result, error } = await supabase
      .from('services')
      .update(fields)
      .eq('id', id);

    if (error) throw error;
    return result;
  },

  // ✅ Delete a service by ID
  deleteService: async (id) => {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

  
  // Bookings
  import { supabase } from '../lib/supabase-client';

export const bookingService = {
  // ✅ Fetch all bookings (admin view)
  getBookings: async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // ✅ Update an existing booking
  updateBooking: async (data) => {
    const { id, ...fields } = data;

    const { data: result, error } = await supabase
      .from('bookings')
      .update(fields)
      .eq('id', id);

    if (error) throw error;
    return result;
  },
};

  
  // Pages
  import { supabase } from '../lib/supabase-client';

export const pageService = {
  // ✅ Fetch all pages
  getPages: async () => {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // ✅ Create a new page
  createPage: async (data) => {
    const { data: result, error } = await supabase
      .from('pages')
      .insert([data]);

    if (error) throw error;
    return result;
  },

  // ✅ Update an existing page
  updatePage: async (data) => {
    const { id, ...fields } = data;

    const { data: result, error } = await supabase
      .from('pages')
      .update(fields)
      .eq('id', id);

    if (error) throw error;
    return result;
  },

  // ✅ Delete a page by ID
  deletePage: async (id) => {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

  
  // Users
 import { supabase } from '../lib/supabase-client';

export const userService = {
  // ✅ Fetch all users (from profiles table)
  getUsers: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, name, is_admin, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // ✅ Create a new user (via Supabase Auth)
  createUser: async ({ email, password, name, is_admin = false }) => {
    // Create in auth.users
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError) throw authError;

    // Insert into profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email,
          name,
          is_admin,
        },
      ]);

    if (profileError) throw profileError;
    return profileData;
  },

  // ✅ Update an existing user profile
  updateUser: async (data) => {
    const { id, ...fields } = data;

    const { data: result, error } = await supabase
      .from('profiles')
      .update(fields)
      .eq('id', id);

    if (error) throw error;
    return result;
  },

  // ✅ Delete a user (from Auth + Profiles)
  deleteUser: async (id) => {
    // ⚠️ Requires a server-side function or admin service role key
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (profileError) throw profileError;

    // Deleting from auth.users must be done server-side with service role key
    // Example: call an Edge Function to handle the deletion securely
  },
};

  
  // Media
 import { supabase } from '../lib/supabase-client';

export const uploadFile = async (file: File) => {
  try {
    // Create a unique path for the file
    const filePath = `uploads/${Date.now()}-${file.name}`;

    // Upload to Supabase Storage bucket named "media"
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    return {
      success: true,
      data: {
        url: publicUrlData.publicUrl,
        filename: file.name,
        size: file.size,
      },
    };
  } catch (err) {
    console.error('File upload failed:', err.message);
    return { success: false, error: err.message };
  }
};
