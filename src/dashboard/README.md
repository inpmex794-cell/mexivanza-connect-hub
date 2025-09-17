# Mexivanza Travel Admin Dashboard

A sovereign, self-contained admin dashboard module for managing Mexivanza's travel system.

## Features

- **Complete CRUD Operations**: Manage trips, destinations, categories, tags, pages, features, services, bookings, media, users, and settings
- **Brand Consistent**: Matches Mexivanza design system (Inter + Playfair Display fonts, brand colors)
- **Responsive Design**: Mobile-first, pixel-perfect interface
- **Authentication**: JWT-based auth with route protection
- **Asset Management**: Built-in image uploader, SVG icon generation
- **Data Export**: CSV export functionality for bookings
- **Rich Text Editing**: Content management for pages and descriptions

## Routes

- `/dashboard` - Main dashboard with KPIs
- `/dashboard/trips` - Trip management
- `/dashboard/destinations` - Destination management
- `/dashboard/categories` - Category management
- `/dashboard/tags` - Tag management
- `/dashboard/pages` - Static page management
- `/dashboard/features` - Feature/amenity management
- `/dashboard/services` - Service management
- `/dashboard/bookings` - Booking management
- `/dashboard/media` - Media library
- `/dashboard/users` - User management
- `/dashboard/settings` - System settings
- `/dashboard/login` - Authentication

## Integration

To integrate into existing project:

1. Add dashboard routes to your main `App.tsx`:
```jsx
import DashboardRouter from './dashboard/DashboardRouter';

// In your routes:
<Route path="/dashboard/*" element={<DashboardRouter />} />
```

2. Ensure authentication context is available or update `dashboard/contexts/AuthContext.tsx`

3. Install any missing dependencies (all standard React/Tailwind)

## API Integration

Currently uses stubbed API calls to `/api/*` endpoints. To connect to real backend:

1. Update `dashboard/services/api.js` with your actual API endpoints
2. Replace mock data with real data structures
3. Update authentication flow in `dashboard/contexts/AuthContext.tsx`

## Assets

All assets are auto-generated and optimized:
- Destination/trip placeholder images
- SVG icons for categories, features, services
- Status badges and indicators
- Responsive image sizes