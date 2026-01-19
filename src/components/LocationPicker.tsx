import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Crosshair, Loader2 } from 'lucide-react';
import { Location } from '@/types';

// Fix for default marker icons in Leaflet with Vite/Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface LocationPickerProps {
  value?: Location;
  onChange: (location: Location) => void;
}

const defaultCenter: [number, number] = [28.6139, 77.209]; // New Delhi

// Component to handle map clicks and updating position
const MapEvents = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Component to update map center programmatically
const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange }) => {
  const [position, setPosition] = useState<[number, number] | null>(
    value && value.lat !== 0 ? [value.lat, value.lng] : null
  );
  const [address, setAddress] = useState(value?.address || '');
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    value && value.lat !== 0 ? [value.lat, value.lng] : defaultCenter
  );

  const getAddressFromCoords = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'FeedReach-App'
          }
        }
      );
      const data = await response.json();
      if (data.display_name) {
        return data.display_name;
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }, []);

  const handleLocationSelect = useCallback(async (lat: number, lng: number) => {
    setPosition([lat, lng]);
    setLoading(true);
    const addr = await getAddressFromCoords(lat, lng);
    setAddress(addr);
    setLoading(false);
    onChange({ lat, lng, address: addr });
  }, [getAddressFromCoords, onChange]);

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("Location detected:", latitude, longitude);
        setMapCenter([latitude, longitude]);
        setPosition([latitude, longitude]);

        setLoading(true);
        const addr = await getAddressFromCoords(latitude, longitude);
        setAddress(addr);
        setLoading(false);

        onChange({
          lat: latitude,
          lng: longitude,
          address: addr
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLoading(false);
        let msg = 'Unable to retrieve your location.';
        if (error.code === 1) msg = 'Location access denied. Please enable it in your browser settings.';
        alert(msg);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={detectCurrentLocation}
          disabled={loading}
          className="flex-1 h-10 gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <Crosshair className="h-4 w-4 text-primary" />
          )}
          Detect My Location
        </Button>
      </div>

      <div className="h-[300px] w-full rounded-xl overflow-hidden border-2 border-border relative z-0">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView center={mapCenter} />
          <MapEvents onLocationSelect={handleLocationSelect} />
          {position && <Marker position={position} />}
        </MapContainer>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Pickup Address
          </label>
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Manual Entry Supported</span>
        </div>
        <Input
          placeholder="Enter address manually or select on map"
          value={address}
          onChange={(e) => {
            const val = e.target.value;
            setAddress(val);
            onChange({
              lat: position ? position[0] : 0,
              lng: position ? position[1] : 0,
              address: val
            });
          }}
          className="focus-visible:ring-primary"
        />
        <p className="text-[10px] text-muted-foreground italic">
          * Powered by OpenStreetMap (No API Key Required)
        </p>
      </div>
    </div>
  );
};

export default LocationPicker;
