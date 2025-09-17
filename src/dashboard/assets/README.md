# Mexivanza Dashboard Assets

This folder contains optimized assets for the Mexivanza admin dashboard, including placeholder images, icons, and branded elements.

## Folder Structure

```
/dashboard/assets/
├── destinations/     # Destination placeholder images
├── trips/           # Trip package placeholder images  
├── avatars/         # User profile avatars
├── icons/           # SVG icons for categories, features, services
├── pages/           # Page hero images and content images
├── uploads/         # User uploaded media (mock folder)
└── badges/          # Status badge graphics
```

## Image Specifications

- **Destinations**: 1200x800px, optimized JPEG, <150KB
- **Trips**: 1000x600px, optimized JPEG, <120KB
- **Avatars**: 200x200px, optimized JPEG/PNG, <50KB
- **Icons**: SVG format, scalable, <10KB
- **Page Images**: Variable sizes, optimized for web

## Usage

All assets are referenced in the dashboard mock data and components. Update paths in `src/dashboard/services/api.js` when replacing with real assets.

## Brand Compliance

All assets follow Mexivanza brand guidelines:
- Primary color: #004aad
- Accent color: #ffb400  
- Typography: Inter (body), Playfair Display (headings)
- Mexico-focused imagery and cultural elements