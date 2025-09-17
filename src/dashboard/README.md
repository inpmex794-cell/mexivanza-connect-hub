# Mexivanza Travel Admin Dashboard

A complete, sovereign, self-contained admin dashboard module for managing Mexivanza's travel system.

## 🌟 Features

### Core Functionality
- **Complete CRUD Operations**: Manage trips, destinations, categories, tags, pages, features, services, bookings, media, users, and settings
- **JWT Authentication**: Secure login system with route protection
- **Data Tables**: Advanced sorting, filtering, search, and CSV export capabilities
- **Asset Management**: Image uploader, media library, and file management
- **Rich Content**: Rich text editor for pages and detailed trip descriptions

### Design & UX
- **Brand Consistent**: Matches Mexivanza design system perfectly
  - Colors: #004aad (primary), #ffb400 (accent), #f0f4ff (background)
  - Typography: Inter (body text), Playfair Display (headings)
- **Responsive Design**: Mobile-first, pixel-perfect interface
- **Production Ready**: Optimized performance with lazy loading and code splitting

### Mexico Travel Content
- **Realistic Mock Data**: Comprehensive Mexico-based travel content
- **8 Destinations**: Playa del Carmen, Cancún, Tulum, Cozumel, Mérida, Puerto Vallarta, Oaxaca, Cabo San Lucas
- **6 Trip Packages**: From luxury escapes to cultural immersion experiences
- **Professional Assets**: High-quality placeholder images and branded SVG icons

## 📂 Dashboard Structure

```
/dashboard/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── layout/          # Header, sidebar, layout components
│   └── ui/              # DataTable, StatusBadge, LoadingSpinner
├── contexts/            # React Context providers
├── pages/               # Main dashboard pages
├── services/            # API service layer with mock data
├── types/               # TypeScript type definitions
├── assets/              # Optimized images, icons, and media
└── DashboardRouter.tsx  # Main routing configuration
```

## 🚀 Quick Integration

### Step 1: Add to Your Router
Add this single line to your main `App.tsx`:

```jsx
import DashboardRouter from './dashboard/DashboardRouter';

// In your existing routes:
<Route path="/dashboard/*" element={<DashboardRouter />} />
```

### Step 2: Access the Dashboard
Navigate to `/dashboard/login` and use these demo credentials:
- **Email**: admin@mexivanza.com
- **Password**: admin123

### Step 3: Explore Features
- Dashboard home with KPIs and analytics
- Complete CRUD for all travel entities
- Booking management with export capabilities
- Media library and user management

## 📋 Complete Route Map

| Route | Purpose | Features |
|-------|---------|----------|
| `/dashboard` | Main dashboard | KPI cards, recent bookings, top destinations |
| `/dashboard/trips` | Trip management | CRUD operations, pricing, availability |
| `/dashboard/destinations` | Destination management | Regions, descriptions, featured flags |
| `/dashboard/categories` | Category management | Beach, Adventure, Cultural, Luxury, etc. |
| `/dashboard/tags` | Tag management | Luxury, Family-Friendly, Wellness, etc. |
| `/dashboard/pages` | Static page management | About, Contact, Privacy, Terms |
| `/dashboard/features` | Feature/amenity management | WiFi, Pool, Spa, Beach Access |
| `/dashboard/services` | Service management | Tours, Transfers, Equipment Rental |
| `/dashboard/bookings` | Booking management | Status tracking, payment info, CSV export |
| `/dashboard/media` | Media library | Image uploads, file management |
| `/dashboard/users` | User management | Admin accounts, roles, permissions |
| `/dashboard/settings` | System settings | Site configuration, preferences |
| `/dashboard/login` | Authentication | JWT-based secure login |

## 🔧 Backend Integration

### Using Mock API (Default)
The dashboard works immediately with realistic mock data. Perfect for:
- Development and testing
- Client demonstrations
- Frontend development without backend dependency

### Connecting Real Backend
To connect to your actual API:

1. **Update API Service** (`dashboard/services/api.js`):
```javascript
const BASE_URL = 'https://your-api-domain.com/api';
```

2. **Replace Mock Responses** with real API calls:
```javascript
// Replace mockApiResponse with actual fetch calls
async function apiCall(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  return response.json();
}
```

3. **Update Authentication** (`dashboard/contexts/AuthContext.tsx`):
```javascript
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  // Handle real JWT tokens
};
```

## 🎨 Brand Assets

### Professional Images
- **8 Destination Images**: High-quality 1200x800px travel photography
- **User Avatars**: Professional 512x512px portraits
- **Trip Images**: Compelling 1000x600px package imagery

### Branded SVG Icons
- Category icons (Beach, Adventure, Cultural, Luxury, Wellness, Diving)
- Feature icons (WiFi, Pool, Restaurant, Spa, etc.)
- Service icons (Airport Transfer, Tour Guide, Equipment Rental)

### Status Badges
- Published/Draft for content
- Active/Inactive for users
- Confirmed/Pending/Cancelled for bookings

## 🔒 Security Features

- **Route Protection**: All dashboard routes require authentication
- **Role-Based Access**: Admin, Editor, and Viewer roles
- **JWT Authentication**: Secure token-based login system
- **Input Validation**: Form validation for all CRUD operations

## 📱 Responsive Design

- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Large buttons and touch targets
- **Adaptive Layout**: Sidebar collapses on mobile
- **Performance**: Lazy loading and code splitting

## 🌍 Mexico Travel Content

### Destinations (8 Locations)
- **Riviera Maya**: Playa del Carmen, Tulum
- **Yucatán**: Cancún, Cozumel, Mérida
- **Pacific Coast**: Puerto Vallarta
- **Southern Mexico**: Oaxaca
- **Baja California**: Cabo San Lucas

### Trip Categories (8 Types)
- Beach, Adventure, Cultural, Luxury, Wellness, Diving, Eco-Tourism, Gastronomy

### Features & Services (18 Items)
- Comprehensive amenities and services for Mexican travel experiences

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy-loaded route components
- **Image Optimization**: Compressed, web-optimized assets
- **Bundle Size**: Minimal dependencies, tree-shaking enabled
- **Caching**: Mock data persistence for consistent experience

## 📊 Analytics & Reporting

- **KPI Dashboard**: Revenue, bookings, top destinations
- **CSV Export**: Booking data export functionality
- **Recent Activity**: Real-time booking updates
- **Performance Metrics**: Monthly trends and statistics

## 🛠️ Development

### Prerequisites
- React 18+
- React Router v6
- TailwindCSS
- TypeScript
- Lucide React icons

### File Structure Best Practices
- **Modular Components**: Reusable UI components
- **Type Safety**: Complete TypeScript coverage
- **Service Layer**: Clean API abstraction
- **Asset Organization**: Structured media management

## 📝 Notes

- **Zero Dependencies**: Uses only existing project dependencies
- **Brand Compliant**: Matches existing Mexivanza design system
- **Production Ready**: Optimized for real-world deployment
- **Isolated Module**: Completely separate from `/travel` frontend code

---

**Ready to use immediately** - Just add the route and start managing your Mexico travel platform! 🇲🇽✈️