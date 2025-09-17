import React, { useEffect, useState } from 'react';

// Global flag to track if Google Maps is loaded
let isGoogleMapsLoaded = false;
let isLoadingGoogleMaps = false;
const loadCallbacks: (() => void)[] = [];

export const loadGoogleMaps = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (isGoogleMapsLoaded) {
      resolve(window.google);
      return;
    }

    loadCallbacks.push(() => resolve(window.google));

    if (isLoadingGoogleMaps) {
      return;
    }

    isLoadingGoogleMaps = true;

    // Create script element
    const script = document.createElement('script');
    // Get API key from environment variable 
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'demo-key';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isGoogleMapsLoaded = true;
      isLoadingGoogleMaps = false;
      loadCallbacks.forEach(callback => callback());
      loadCallbacks.length = 0;
    };

    script.onerror = () => {
      isLoadingGoogleMaps = false;
      reject(new Error('Failed to load Google Maps'));
    };

    document.head.appendChild(script);
  });
};

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

export const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(isGoogleMapsLoaded);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isGoogleMapsLoaded) {
      setIsLoaded(true);
      return;
    }

    loadGoogleMaps()
      .then(() => setIsLoaded(true))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
        <p className="text-destructive">Failed to load Google Maps: {error}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="ml-2 text-muted-foreground">Loading Maps...</span>
      </div>
    );
  }

  return <>{children}</>;
};

// Declare global google maps types
declare global {
  interface Window {
    google: any;
  }
}