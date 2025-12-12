import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Crosshair, Loader2 } from 'lucide-react';
import { Location } from '@/types';

interface LocationPickerProps {
  value?: Location;
  onChange: (location: Location) => void;
  apiKey: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.75rem'
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.209
};

const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange, apiKey }) => {
  const [center, setCenter] = useState(value ? { lat: value.lat, lng: value.lng } : defaultCenter);
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    value ? { lat: value.lat, lng: value.lng } : null
  );
  const [address, setAddress] = useState(value?.address || '');
  const [loading, setLoading] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ['places']
  });

  const getAddressFromCoords = useCallback(async (lat: number, lng: number) => {
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') return;
    
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await response.json();
      if (data.results && data.results[0]) {
        return data.results[0].formatted_address;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }, [apiKey]);

  const handleMapClick = useCallback(async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    
    setMarker({ lat, lng });
    setLoading(true);
    
    const addr = await getAddressFromCoords(lat, lng);
    setAddress(addr || '');
    setLoading(false);
    
    onChange({
      lat,
      lng,
      address: addr || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    });
  }, [onChange, getAddressFromCoords]);

  const detectCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setCenter({ lat, lng });
        setMarker({ lat, lng });
        
        const addr = await getAddressFromCoords(lat, lng);
        setAddress(addr || '');
        setLoading(false);
        
        onChange({
          lat,
          lng,
          address: addr || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLoading(false);
        alert('Unable to retrieve your location');
      },
      { enableHighAccuracy: true }
    );
  };

  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
    return (
      <div className="space-y-4">
        <div className="p-6 bg-muted/50 rounded-xl border-2 border-dashed border-border text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-2">Google Maps API key not configured</p>
          <p className="text-sm text-muted-foreground">
            Please add your Google Maps API key to enable location picking
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Manual Address Entry</label>
          <Input
            placeholder="Enter location address manually"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              onChange({
                lat: 0,
                lng: 0,
                address: e.target.value
              });
            }}
          />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-6 bg-destructive/10 rounded-xl border border-destructive/30 text-center">
        <p className="text-destructive">Error loading Google Maps</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-xl">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={detectCurrentLocation}
          disabled={loading}
          className="flex-1"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Crosshair className="h-4 w-4" />
          )}
          Detect My Location
        </Button>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        onClick={handleMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false
        }}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>

      <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
        <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
        <span className="text-sm text-muted-foreground">
          {address || 'Click on the map to select a location'}
        </span>
      </div>
    </div>
  );
};

export default LocationPicker;
