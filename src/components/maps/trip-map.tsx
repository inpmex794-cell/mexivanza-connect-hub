import React, { useState, useEffect } from 'react';
import { GoogleMapsComponent } from './google-maps-component';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Route } from 'lucide-react';

interface ItineraryDay {
  day: number;
  title: string;
  location: string;
  description?: string;
  time?: string;
  image?: string;
  lat?: number;
  lng?: number;
}

interface TripMapProps {
  destination?: {
    lat: number;
    lng: number;
    name: string;
  };
  itinerary?: ItineraryDay[];
  className?: string;
  height?: string;
  showRoutes?: boolean;
  interactive?: boolean;
}

export const TripMap: React.FC<TripMapProps> = ({
  destination,
  itinerary = [],
  className = '',
  height = '400px',
  showRoutes = true,
  interactive = true,
}) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showAllDays, setShowAllDays] = useState(true);

  // Calculate map center
  const mapCenter = destination 
    ? { lat: destination.lat, lng: destination.lng }
    : { lat: 19.4326, lng: -99.1332 }; // Default to Mexico City

  // Filter itinerary items with coordinates
  const mappableItinerary = itinerary.filter(day => day.lat && day.lng);

  // Create markers for itinerary days
  const markers = mappableItinerary
    .filter(day => showAllDays || selectedDay === null || day.day === selectedDay)
    .map(day => ({
      lat: day.lat!,
      lng: day.lng!,
      title: `Day ${day.day}: ${day.title}`,
      label: day.day.toString(),
    }));

  // Add destination marker if available
  if (destination && (selectedDay === null || showAllDays)) {
    markers.unshift({
      lat: destination.lat,
      lng: destination.lng,
      title: destination.name,
      label: '📍',
    });
  }

  // Create routes between days
  const routes = showRoutes && showAllDays && mappableItinerary.length > 1
    ? [{
        path: mappableItinerary.map(day => ({ lat: day.lat!, lng: day.lng! })),
        strokeColor: '#004aad',
        strokeWeight: 3,
      }]
    : [];

  const handleMarkerClick = (marker: any, index: number) => {
    if (interactive) {
      // Find the corresponding day
      const clickedDay = mappableItinerary.find(day => 
        day.lat === marker.lat && day.lng === marker.lng
      );
      if (clickedDay) {
        setSelectedDay(selectedDay === clickedDay.day ? null : clickedDay.day);
      }
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Map Controls */}
      {interactive && mappableItinerary.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={showAllDays ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setShowAllDays(true);
              setSelectedDay(null);
            }}
          >
            <MapPin className="w-4 h-4 mr-1" />
            All Days
          </Button>
          
          {showRoutes && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllDays(!showAllDays)}
            >
              <Route className="w-4 h-4 mr-1" />
              {showAllDays ? 'Hide' : 'Show'} Routes
            </Button>
          )}
          
          {mappableItinerary.map(day => (
            <Badge
              key={day.day}
              variant={selectedDay === day.day ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary/80"
              onClick={() => setSelectedDay(selectedDay === day.day ? null : day.day)}
            >
              Day {day.day}
            </Badge>
          ))}
        </div>
      )}

      {/* Map Component */}
      <GoogleMapsComponent
        center={mapCenter}
        zoom={destination ? 12 : 10}
        markers={markers}
        routes={routes}
        height={height}
        onMarkerClick={handleMarkerClick}
        className="border border-border"
      />

      {/* Selected Day Info */}
      {selectedDay && (
        <div className="p-4 bg-muted rounded-lg">
          {(() => {
            const day = itinerary.find(d => d.day === selectedDay);
            if (!day) return null;
            
            return (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge>Day {day.day}</Badge>
                  <h4 className="font-semibold">{day.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  📍 {day.location}
                </p>
                {day.time && (
                  <p className="text-sm text-muted-foreground mb-2">
                    🕒 {day.time}
                  </p>
                )}
                {day.description && (
                  <p className="text-sm">{day.description}</p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* No Coordinates Message */}
      {mappableItinerary.length === 0 && itinerary.length > 0 && (
        <div className="text-center p-4 text-muted-foreground">
          <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Add coordinates to itinerary days to display them on the map</p>
        </div>
      )}
    </div>
  );
};