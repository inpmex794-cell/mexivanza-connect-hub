import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps } from './google-maps-loader';

interface MapMarker {
  lat: number;
  lng: number;
  title?: string;
  label?: string;
  icon?: string;
}

interface MapRoute {
  path: { lat: number; lng: number }[];
  strokeColor?: string;
  strokeWeight?: number;
}

interface GoogleMapsComponentProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: MapMarker[];
  routes?: MapRoute[];
  height?: string;
  width?: string;
  className?: string;
  onMapClick?: (lat: number, lng: number) => void;
  onMarkerClick?: (marker: MapMarker, index: number) => void;
}

export const GoogleMapsComponent: React.FC<GoogleMapsComponentProps> = ({
  center,
  zoom = 10,
  markers = [],
  routes = [],
  height = '400px',
  width = '100%',
  className = '',
  onMapClick,
  onMarkerClick,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const markersRef = useRef<any[]>([]);
  const polylinesRef = useRef<any[]>([]);

  // Initialize map
  useEffect(() => {
    loadGoogleMaps()
      .then(() => {
        if (mapRef.current && !map) {
          const newMap = new window.google.maps.Map(mapRef.current, {
            center,
            zoom,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ],
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
          });

          // Add click listener
          if (onMapClick) {
            newMap.addListener('click', (event: any) => {
              if (event.latLng) {
                onMapClick(event.latLng.lat(), event.latLng.lng());
              }
            });
          }

          setMap(newMap);
          setIsLoaded(true);
        }
      })
      .catch(console.error);
  }, [center, zoom, onMapClick, map]);

  // Update center and zoom
  useEffect(() => {
    if (map && isLoaded) {
      map.setCenter(center);
      map.setZoom(zoom);
    }
  }, [map, center, zoom, isLoaded]);

  // Update markers
  useEffect(() => {
    if (!map || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData, index) => {
      const marker = new window.google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map,
        title: markerData.title,
        label: markerData.label,
        icon: markerData.icon,
      });

      if (onMarkerClick) {
        marker.addListener('click', () => onMarkerClick(markerData, index));
      }

      markersRef.current.push(marker);
    });
  }, [map, markers, onMarkerClick, isLoaded]);

  // Update routes
  useEffect(() => {
    if (!map || !isLoaded) return;

    // Clear existing polylines
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current = [];

    // Add new routes
    routes.forEach(route => {
      const polyline = new window.google.maps.Polyline({
        path: route.path,
        geodesic: true,
        strokeColor: route.strokeColor || '#004aad',
        strokeOpacity: 1.0,
        strokeWeight: route.strokeWeight || 3,
        map,
      });

      polylinesRef.current.push(polyline);
    });
  }, [map, routes, isLoaded]);

  // Cleanup
  useEffect(() => {
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      polylinesRef.current.forEach(polyline => polyline.setMap(null));
    };
  }, []);

  if (!isLoaded) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted ${className}`}
        style={{ height, width }}
      >
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="ml-2 text-muted-foreground">Loading Map...</span>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className={`rounded-lg overflow-hidden ${className}`}
      style={{ height, width }}
    />
  );
};