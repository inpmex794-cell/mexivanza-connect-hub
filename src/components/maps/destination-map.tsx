import React, { useState } from 'react';
import { GoogleMapsComponent } from './google-maps-component';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Save } from 'lucide-react';

interface DestinationMapProps {
  lat?: number;
  lng?: number;
  name?: string;
  onLocationChange?: (lat: number, lng: number) => void;
  onSave?: (lat: number, lng: number) => void;
  editable?: boolean;
  height?: string;
  className?: string;
}

export const DestinationMap: React.FC<DestinationMapProps> = ({
  lat = 19.4326,
  lng = -99.1332,
  name = "Location",
  onLocationChange,
  onSave,
  editable = false,
  height = "400px",
  className = "",
}) => {
  const [currentLat, setCurrentLat] = useState(lat);
  const [currentLng, setCurrentLng] = useState(lng);
  const [inputLat, setInputLat] = useState(lat.toString());
  const [inputLng, setInputLng] = useState(lng.toString());

  const handleMapClick = (clickLat: number, clickLng: number) => {
    if (editable) {
      setCurrentLat(clickLat);
      setCurrentLng(clickLng);
      setInputLat(clickLat.toFixed(6));
      setInputLng(clickLng.toFixed(6));
      onLocationChange?.(clickLat, clickLng);
    }
  };

  const handleInputChange = () => {
    const newLat = parseFloat(inputLat);
    const newLng = parseFloat(inputLng);
    
    if (!isNaN(newLat) && !isNaN(newLng)) {
      setCurrentLat(newLat);
      setCurrentLng(newLng);
      onLocationChange?.(newLat, newLng);
    }
  };

  const handleSave = () => {
    onSave?.(currentLat, currentLng);
  };

  const markers = [{
    lat: currentLat,
    lng: currentLng,
    title: name,
    label: "📍",
  }];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Coordinate Inputs */}
      {editable && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={inputLat}
              onChange={(e) => setInputLat(e.target.value)}
              onBlur={handleInputChange}
              placeholder="19.4326"
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={inputLng}
              onChange={(e) => setInputLng(e.target.value)}
              onBlur={handleInputChange}
              placeholder="-99.1332"
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={handleSave} 
              className="w-full"
              disabled={!onSave}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Location
            </Button>
          </div>
        </div>
      )}

      {/* Instructions */}
      {editable && (
        <div className="text-sm text-muted-foreground p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <MapPin className="w-4 h-4 inline mr-1" />
          Click on the map to set the destination coordinates, or enter them manually above.
        </div>
      )}

      {/* Map */}
      <GoogleMapsComponent
        center={{ lat: currentLat, lng: currentLng }}
        zoom={12}
        markers={markers}
        height={height}
        onMapClick={editable ? handleMapClick : undefined}
        className="border border-border"
      />

      {/* Location Info */}
      <div className="text-sm text-muted-foreground">
        📍 {name} • {currentLat.toFixed(6)}, {currentLng.toFixed(6)}
      </div>
    </div>
  );
};