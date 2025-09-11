-- Insert demo data for all 8 travel categories
INSERT INTO public.travel_bookings_categories (
  category, title, description, provider_name, location, 
  price_amount, scenario_tags, featured, is_published, is_demo,
  category_data, availability, booking_window, gallery, created_by
) VALUES 
-- FLIGHTS
(
  'flights',
  '{"es": "Vuelo México - Cancún", "en": "Mexico City - Cancun Flight"}',
  '{"es": "Vuelo directo con aerolínea nacional, incluye equipaje", "en": "Direct flight with national airline, baggage included"}',
  'Aeromexico',
  'México - Cancún',
  2500.00,
  ARRAY['direct', 'domestic', 'baggage_included'],
  true,
  true,
  true,
  '{
    "airline": "Aeromexico",
    "departure": {"city": "Mexico City", "airport": "MEX", "time": "08:00"},
    "arrival": {"city": "Cancun", "airport": "CUN", "time": "10:30"},
    "duration": "2h 30m",
    "aircraft": "Boeing 737",
    "class_options": ["economy", "premium", "business"],
    "baggage": {"carry_on": true, "checked": "23kg included"}
  }',
  50,
  '{"start_date": "2024-12-01", "end_date": "2025-03-31"}',
  '{"images": [
    {"url": "/placeholder.svg", "caption": {"es": "Aeromexico Boeing 737", "en": "Aeromexico Boeing 737"}},
    {"url": "/placeholder.svg", "caption": {"es": "Vista aérea de Cancún", "en": "Aerial view of Cancun"}}
  ]}',
  (SELECT id FROM auth.users WHERE email = 'mexivanza@mexivanza.com' LIMIT 1)
),

-- HOTELS
(
  'hotels',
  '{"es": "Hotel Grand Oasis Cancún", "en": "Grand Oasis Cancun Hotel"}',
  '{"es": "Resort todo incluido frente al mar con múltiples amenidades", "en": "All-inclusive beachfront resort with multiple amenities"}',
  'Grand Oasis',
  'Cancún, Quintana Roo',
  4500.00,
  ARRAY['all_inclusive', 'beachfront', 'family_friendly', 'pool'],
  true,
  true,
  true,
  '{
    "room_types": [
      {"type": "standard", "price": 4500, "capacity": 2, "features": ["ocean_view", "balcony"]},
      {"type": "suite", "price": 7500, "capacity": 4, "features": ["ocean_view", "balcony", "jacuzzi", "living_room"]}
    ],
    "amenities": ["pool", "spa", "gym", "restaurants", "bars", "beach_access", "wifi"],
    "policies": {"check_in": "15:00", "check_out": "12:00", "cancellation": "24h_free"},
    "rating": 4.2,
    "review_count": 856
  }',
  25,
  '{"start_date": "2024-12-01", "end_date": "2025-04-30"}',
  '{"images": [
    {"url": "/placeholder.svg", "caption": {"es": "Vista del hotel desde la playa", "en": "Hotel view from the beach"}},
    {"url": "/placeholder.svg", "caption": {"es": "Piscina principal", "en": "Main pool"}}
  ]}',
  (SELECT id FROM auth.users WHERE email = 'mexivanza@mexivanza.com' LIMIT 1)
),

-- INSURANCE
(
  'insurance',
  '{"es": "Seguro de Viaje Internacional", "en": "International Travel Insurance"}',
  '{"es": "Cobertura completa para viajes internacionales, incluye gastos médicos", "en": "Complete coverage for international travel, includes medical expenses"}',
  'Seguros Atlas',
  'Mundial',
  850.00,
  ARRAY['medical_coverage', 'trip_cancellation', 'baggage_protection'],
  false,
  true,
  true,
  '{
    "coverage_types": [
      {"type": "basic", "price": 850, "medical_limit": 50000, "baggage_limit": 1000},
      {"type": "premium", "price": 1500, "medical_limit": 100000, "baggage_limit": 2500},
      {"type": "platinum", "price": 2200, "medical_limit": 250000, "baggage_limit": 5000}
    ],
    "benefits": ["emergency_medical", "trip_cancellation", "baggage_loss", "flight_delay", "24h_assistance"],
    "exclusions": ["pre_existing_conditions", "extreme_sports", "war_zones"],
    "duration_options": ["single_trip", "annual", "multi_trip"]
  }',
  999,
  '{"start_date": "2024-12-01", "end_date": "2025-12-31"}',
  '{"images": [
    {"url": "/placeholder.svg", "caption": {"es": "Protección durante tu viaje", "en": "Protection during your trip"}}
  ]}',
  (SELECT id FROM auth.users WHERE email = 'mexivanza@mexivanza.com' LIMIT 1)
),

-- CRUISES
(
  'cruises',
  '{"es": "Crucero Caribe Occidental 7 Días", "en": "Western Caribbean 7-Day Cruise"}',
  '{"es": "Crucero de lujo por el Caribe con paradas en Cozumel, Jamaica y Belice", "en": "Luxury Caribbean cruise with stops in Cozumel, Jamaica and Belize"}',
  'Royal Caribbean',
  'Caribe Occidental',
  18500.00,
  ARRAY['luxury', 'caribbean', 'all_inclusive', 'entertainment'],
  true,
  true,
  true,
  '{
    "ship_name": "Symphony of the Seas",
    "duration": "7 days",
    "ports": ["Cozumel", "Jamaica", "Belize", "Costa Maya"],
    "cabin_types": [
      {"type": "interior", "price": 18500, "features": ["virtual_balcony"]},
      {"type": "ocean_view", "price": 23500, "features": ["window"]},
      {"type": "balcony", "price": 28500, "features": ["private_balcony"]},
      {"type": "suite", "price": 45000, "features": ["private_balcony", "concierge", "priority_dining"]}
    ],
    "amenities": ["pools", "spa", "casino", "theater", "rock_climbing", "surf_simulator"],
    "dining": ["main_dining", "specialty_restaurants", "room_service", "buffet"],
    "entertainment": ["shows", "live_music", "dancing", "fitness_classes"]
  }',
  15,
  '{"start_date": "2024-12-15", "end_date": "2025-05-30"}',
  '{"images": [
    {"url": "/placeholder.svg", "caption": {"es": "Symphony of the Seas", "en": "Symphony of the Seas"}},
    {"url": "/placeholder.svg", "caption": {"es": "Piscina del crucero", "en": "Cruise ship pool"}}
  ]}',
  (SELECT id FROM auth.users WHERE email = 'mexivanza@mexivanza.com' LIMIT 1)
),

-- AIRBNB
(
  'airbnb',
  '{"es": "Casa Frente al Mar - Tulum", "en": "Beachfront House - Tulum"}',
  '{"es": "Hermosa casa con vista al mar, perfecta para familias o grupos", "en": "Beautiful oceanfront house, perfect for families or groups"}',
  'Casa del Mar Tulum',
  'Tulum, Quintana Roo',
  3200.00,
  ARRAY['beachfront', 'family_friendly', 'kitchen', 'wifi', 'parking'],
  true,
  true,
  true,
  '{
    "property_type": "house",
    "bedrooms": 3,
    "bathrooms": 2,
    "max_guests": 8,
    "amenities": ["wifi", "kitchen", "parking", "pool", "beach_access", "air_conditioning"],
    "house_rules": ["no_smoking", "no_pets", "check_in_after_15", "check_out_before_11"],
    "host": {
      "name": "Maria Rodriguez",
      "verified": true,
      "response_rate": "98%",
      "response_time": "within_hour",
      "languages": ["spanish", "english"]
    },
    "cancellation_policy": "moderate",
    "minimum_stay": 2
  }',
  1,
  '{"start_date": "2024-12-01", "end_date": "2025-06-30"}',
  '{"images": [
    {"url": "/placeholder.svg", "caption": {"es": "Vista desde la terraza", "en": "View from the terrace"}},
    {"url": "/placeholder.svg", "caption": {"es": "Sala principal", "en": "Main living room"}},
    {"url": "/placeholder.svg", "caption": {"es": "Cocina completa", "en": "Full kitchen"}}
  ]}',
  (SELECT id FROM auth.users WHERE email = 'mexivanza@mexivanza.com' LIMIT 1)
),

-- TOUR GUIDES
(
  'tour_guides',
  '{"es": "Guía Certificado - Ruinas Mayas", "en": "Certified Guide - Mayan Ruins"}',
  '{"es": "Guía experto en cultura maya con 10 años de experiencia", "en": "Expert Mayan culture guide with 10 years of experience"}',
  'Carlos Menendez',
  'Yucatán Peninsula',
  1200.00,
  ARRAY['certified', 'mayan_culture', 'bilingual', 'archaeology'],
  true,
  true,
  true,
  '{
    "guide_name": "Carlos Menendez",
    "experience_years": 10,
    "languages": ["spanish", "english", "maya"],
    "specialties": ["mayan_archaeology", "cultural_history", "flora_fauna"],
    "certifications": ["SECTUR", "INAH", "First_Aid"],
    "tour_types": ["walking", "vehicle", "combination"],
    "group_sizes": {"min": 1, "max": 15, "optimal": 8},
    "equipment_provided": ["radio_system", "umbrellas", "water", "snacks"],
    "rating": 4.9,
    "tours_completed": 245,
    "price_structure": {"hourly": 1200, "half_day": 4500, "full_day": 8000}
  }',
  30,
  '{"start_date": "2024-12-01", "end_date": "2025-12-31"}',
  '{"images": [
    {"url": "/placeholder.svg", "caption": {"es": "Carlos en Chichen Itza", "en": "Carlos at Chichen Itza"}},
    {"url": "/placeholder.svg", "caption": {"es": "Grupo en tour", "en": "Group on tour"}}
  ]}',
  (SELECT id FROM auth.users WHERE email = 'mexivanza@mexivanza.com' LIMIT 1)
),

-- CHARTERS
(
  'charters',
  '{"es": "Charter Privado - Riviera Maya", "en": "Private Charter - Riviera Maya"}',
  '{"es": "Transporte privado de lujo para grupos, chofer profesional incluido", "en": "Luxury private transportation for groups, professional driver included"}',
  'Executive Transport MX',
  'Riviera Maya',
  2800.00,
  ARRAY['luxury', 'private', 'professional_driver', 'air_conditioning'],
  false,
  true,
  true,
  '{
    "vehicle_type": "luxury_van",
    "capacity": 12,
    "driver": {
      "professional": true,
      "licensed": true,
      "english_speaking": true,
      "local_knowledge": true
    },
    "amenities": ["air_conditioning", "wifi", "water", "usb_charging", "sound_system"],
    "routes": ["airport_transfers", "hotel_tours", "cenote_visits", "ruins_tours", "custom"],
    "pricing": {
      "hourly": 2800,
      "half_day": 8500,
      "full_day": 15000,
      "airport_transfer": 3500
    },
    "policies": {
      "minimum_booking": "3_hours",
      "cancellation": "24h_free",
      "fuel_included": true,
      "tolls_included": true
    }
  }',
  5,
  '{"start_date": "2024-12-01", "end_date": "2025-12-31"}',
  '{"images": [
    {"url": "/placeholder.svg", "caption": {"es": "Van de lujo", "en": "Luxury van"}},
    {"url": "/placeholder.svg", "caption": {"es": "Interior cómodo", "en": "Comfortable interior"}}
  ]}',
  (SELECT id FROM auth.users WHERE email = 'mexivanza@mexivanza.com' LIMIT 1)
),

-- CAR RENTALS
(
  'car_rentals',
  '{"es": "Nissan Versa - Renta Económica", "en": "Nissan Versa - Economy Rental"}',
  '{"es": "Auto económico perfecto para la ciudad, transmisión automática", "en": "Perfect economy car for the city, automatic transmission"}',
  'Budget Rent a Car',
  'Cancún, Aeropuerto',
  850.00,
  ARRAY['economy', 'automatic', 'air_conditioning', 'unlimited_km'],
  false,
  true,
  true,
  '{
    "vehicle": {
      "make": "Nissan",
      "model": "Versa",
      "year": 2023,
      "class": "economy",
      "transmission": "automatic",
      "fuel_type": "gasoline",
      "doors": 4,
      "passengers": 5,
      "bags": 2
    },
    "features": ["air_conditioning", "power_steering", "radio", "usb_ports"],
    "insurance_options": [
      {"type": "basic", "price": 0, "coverage": "third_party"},
      {"type": "comprehensive", "price": 450, "coverage": "full_damage"},
      {"type": "premium", "price": 650, "coverage": "full_damage_zero_deductible"}
    ],
    "pickup_locations": ["cancun_airport", "hotel_zone", "downtown"],
    "policies": {
      "minimum_age": 21,
      "license_required": true,
      "credit_card_required": true,
      "fuel_policy": "full_to_full",
      "mileage": "unlimited"
    },
    "daily_rate": 850,
    "weekly_rate": 5500,
    "monthly_rate": 18000
  }',
  20,
  '{"start_date": "2024-12-01", "end_date": "2025-12-31"}',
  '{"images": [
    {"url": "/placeholder.svg", "caption": {"es": "Nissan Versa 2023", "en": "Nissan Versa 2023"}},
    {"url": "/placeholder.svg", "caption": {"es": "Interior del vehículo", "en": "Vehicle interior"}}
  ]}',
  (SELECT id FROM auth.users WHERE email = 'mexivanza@mexivanza.com' LIMIT 1)
) ON CONFLICT DO NOTHING;