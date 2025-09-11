-- Add demo content for immediate platform activity
-- Insert demo posts
INSERT INTO user_posts (
  title, content, category, language, is_demo, user_id
) VALUES
  ('¡Bienvenidos a Mexivanza!', 'La plataforma integral para servicios profesionales en México. Descubre viajes, legal, desarrollo web y bienes raíces.', 'News', 'es', true, null),
  ('Welcome to Mexivanza!', 'Your comprehensive platform for professional services in Mexico. Discover travel, legal, web development, and real estate.', 'News', 'en', true, null),
  ('Paquetes de Viaje Premium', 'Explora las mejores experiencias de viaje en México con nuestros paquetes curados especialmente para ti.', 'Travel', 'es', true, null),
  ('Premium Travel Packages', 'Explore the best travel experiences in Mexico with our specially curated packages for you.', 'Travel', 'en', true, null),
  ('Consulta Legal Gratuita', 'Obtén asesoría legal profesional para tus necesidades de inmigración y trámites en México.', 'Legal', 'es', true, null),
  ('Free Legal Consultation', 'Get professional legal advice for your immigration needs and procedures in Mexico.', 'Legal', 'en', true, null)
ON CONFLICT DO NOTHING;

-- Insert demo financial data for stock market module
INSERT INTO financial_data (
  symbol, name, current_price, change_amount, change_percent, volume, market_cap
) VALUES
  ('AMZN', 'Amazon Inc', 3180.50, 45.25, 1.44, 3500000, 1630000000000),
  ('AAPL', 'Apple Inc', 175.25, -2.10, -1.18, 7200000, 2750000000000),
  ('GOOGL', 'Alphabet Inc', 2520.75, 28.90, 1.16, 1800000, 1680000000000),
  ('TSLA', 'Tesla Inc', 245.80, -8.45, -3.32, 12500000, 780000000000),
  ('MSFT', 'Microsoft Corp', 415.60, 6.75, 1.65, 4300000, 3100000000000),
  ('META', 'Meta Platforms', 485.30, 12.40, 2.62, 2900000, 1240000000000),
  ('NVDA', 'NVIDIA Corp', 875.20, 35.60, 4.24, 8700000, 2160000000000),
  ('NFLX', 'Netflix Inc', 445.90, -5.80, -1.28, 2100000, 198000000000)
ON CONFLICT DO NOTHING;

-- Insert demo gaming content
INSERT INTO gaming_content (
  title, description, platform, rating, likes, image_url, trailer_url, game_type, is_demo
) VALUES
  ('Aztec Adventures', 'Embark on an epic journey through ancient Mexico in this action-adventure game.', 'PC, Console', 4.8, 1250, 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800', 'https://example.com/trailer1', 'Adventure', true),
  ('Mariachi Masters', 'Rhythm game featuring traditional Mexican music and vibrant visuals.', 'Mobile', 4.6, 890, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', 'https://example.com/trailer2', 'Rhythm', true),
  ('Luchador Legends', 'Fighting game with legendary Mexican wrestlers and special moves.', 'PC, Console', 4.7, 2340, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 'https://example.com/trailer3', 'Fighting', true),
  ('Taco Truck Tycoon', 'Build and manage your food truck empire across Mexican cities.', 'PC, Mobile', 4.4, 567, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800', 'https://example.com/trailer4', 'Simulation', true),
  ('Día de los Muertos', 'Puzzle adventure celebrating Mexican traditions and folklore.', 'All Platforms', 4.9, 3450, 'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?w=800', 'https://example.com/trailer5', 'Puzzle', true)
ON CONFLICT DO NOTHING;

-- Insert demo video content
INSERT INTO video_content (
  title, description, video_url, thumbnail_url, category, view_count, is_demo
) VALUES
  ('Explore Mexico City', 'A stunning 4K tour of Mexico City''s most beautiful locations and hidden gems.', 'https://example.com/video1', 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800', 'Travel', 45600, true),
  ('Legal Immigration Guide', 'Complete guide to immigration processes and requirements for Mexico.', 'https://example.com/video2', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800', 'Legal', 23400, true),
  ('Cancun Beach Paradise', 'Relax with beautiful beach views and crystal clear waters of Cancun.', 'https://example.com/video3', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', 'Travel', 78900, true),
  ('Web Development Tips', 'Learn modern web development techniques used by Mexican tech companies.', 'https://example.com/video4', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800', 'Technology', 12300, true),
  ('Real Estate Investment', 'Opportunities and tips for real estate investment in Mexico.', 'https://example.com/video5', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', 'Business', 34500, true)
ON CONFLICT DO NOTHING;

-- Insert demo verified agents
INSERT INTO verified_agents (
  name, phone, email, region, bio, license_number, verification_status, is_active, is_demo,
  avatar_url
) VALUES
  ('María González', '+52-555-0123', 'maria@mexivanza.com', 'Mexico City', 'Especialista en bienes raíces comerciales con 15 años de experiencia en el mercado mexicano.', 'RE-2024-001', 'verified', true, true, 'https://images.unsplash.com/photo-1494790108755-2616b612b302?w=200'),
  ('Carlos Rodríguez', '+52-555-0124', 'carlos@mexivanza.com', 'Guadalajara', 'Experto en propiedades residenciales y desarrollo inmobiliario en Jalisco.', 'RE-2024-002', 'verified', true, true, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'),
  ('Ana Martínez', '+52-555-0125', 'ana@mexivanza.com', 'Cancun', 'Especializada en propiedades turísticas y inversión en Riviera Maya.', 'RE-2024-003', 'verified', true, true, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200'),
  ('Luis Hernández', '+52-555-0126', 'luis@mexivanza.com', 'Monterrey', 'Consultor inmobiliario con enfoque en propiedades industriales y comerciales.', 'RE-2024-004', 'verified', true, true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'),
  ('Sofia López', '+52-555-0127', 'sofia@mexivanza.com', 'Tijuana', 'Agente certificada en transacciones internacionales y propiedades fronterizas.', 'RE-2024-005', 'verified', true, true, 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200')
ON CONFLICT DO NOTHING;

-- Insert demo weather data
INSERT INTO weather_data (
  location, current_weather, forecast, language
) VALUES
  ('Mexico City', 
   '{"temperature": 22, "condition": "Partly Cloudy", "humidity": 65, "wind": "8 km/h", "icon": "partly-cloudy"}',
   '[{"day": "Hoy", "high": 25, "low": 15, "condition": "Soleado"}, {"day": "Mañana", "high": 27, "low": 16, "condition": "Parcialmente nublado"}]',
   'es'),
  ('Cancun',
   '{"temperature": 28, "condition": "Sunny", "humidity": 75, "wind": "12 km/h", "icon": "sunny"}',
   '[{"day": "Today", "high": 30, "low": 22, "condition": "Sunny"}, {"day": "Tomorrow", "high": 29, "low": 23, "condition": "Partly Cloudy"}]',
   'en'),
  ('Guadalajara',
   '{"temperature": 24, "condition": "Clear", "humidity": 55, "wind": "6 km/h", "icon": "clear"}',
   '[{"day": "Hoy", "high": 26, "low": 18, "condition": "Despejado"}, {"day": "Mañana", "high": 28, "low": 19, "condition": "Soleado"}]',
   'es')
ON CONFLICT DO NOTHING;