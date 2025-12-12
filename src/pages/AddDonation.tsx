import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { createDonation } from '@/services/donationService';
import { DonationFormData, Location } from '@/types';
import Navbar from '@/components/Navbar';
import LocationPicker from '@/components/LocationPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2, AlertCircle, Utensils, Package, Clock, MapPin, Image } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

const foodTypes = [
  'Cooked Food',
  'Raw Vegetables',
  'Fruits',
  'Bakery Items',
  'Dairy Products',
  'Packaged Food',
  'Beverages',
  'Mixed/Other'
];

const AddDonation: React.FC = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<DonationFormData>({
    title: '',
    description: '',
    foodType: '',
    quantity: '',
    expiryTime: '',
    location: { lat: 0, lng: 0, address: '' },
    imageUrl: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: keyof DonationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (location: Location) => {
    setFormData(prev => ({ ...prev, location }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.foodType || !formData.quantity || !formData.expiryTime) {
      setError('Please fill in all required fields');
      return;
    }

    if (!formData.location.address) {
      setError('Please select a pickup location');
      return;
    }

    if (!currentUser || !userData) {
      setError('You must be logged in to create a donation');
      return;
    }

    setLoading(true);

    try {
      await createDonation(
        currentUser.uid,
        userData.displayName,
        userData.phone,
        formData
      );
      
      toast({
        title: 'Donation created!',
        description: 'Your donation is now visible to nearby NGOs.',
      });
      
      navigate('/donor/dashboard');
    } catch (err) {
      console.error('Create donation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create donation';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/donor/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Add New Donation
          </h1>
          <p className="text-muted-foreground">
            Share your surplus food with NGOs in your area
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Utensils className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Food Details</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Fresh lunch from restaurant"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the food items, any special handling instructions, etc."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={loading}
                  rows={3}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="foodType">Food Type *</Label>
                  <Select
                    value={formData.foodType}
                    onValueChange={(value) => handleInputChange('foodType', value)}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select food type" />
                    </SelectTrigger>
                    <SelectContent>
                      {foodTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    placeholder="e.g., 20 servings, 5 kg"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Expiry & Image */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Timing & Image</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="expiryTime">Best Before / Pickup By *</Label>
                <Input
                  id="expiryTime"
                  type="datetime-local"
                  value={formData.expiryTime}
                  onChange={(e) => handleInputChange('expiryTime', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Add a photo of the food to help NGOs identify it
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-accent" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Pickup Location *</h2>
            </div>

            <LocationPicker
              value={formData.location}
              onChange={handleLocationChange}
              apiKey={GOOGLE_MAPS_API_KEY}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/donor/dashboard')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Donation'
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddDonation;
