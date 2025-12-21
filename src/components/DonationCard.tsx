import React from 'react';
import { Donation, DonationStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Clock,
  User,
  Phone,
  Utensils,
  Package,
  Edit,
  Trash2,
  CheckCircle,
  Navigation,
  XCircle,
  Star,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import ReviewModal from './ReviewModal';

interface DonationCardProps {
  donation: Donation;
  userRole: 'donor' | 'ngo';
  onEdit?: (donation: Donation) => void;
  onDelete?: (donationId: string) => void;
  onAccept?: (donation: Donation) => void;
  onUpdateStatus?: (donationId: string, status: DonationStatus) => void;
}

const statusConfig: Record<DonationStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'status-pending' },
  accepted: { label: 'Accepted', className: 'status-accepted' },
  completed: { label: 'Completed', className: 'status-completed' },
  cancelled: { label: 'Cancelled', className: 'status-cancelled' }
};

const DonationCard: React.FC<DonationCardProps> = ({
  donation,
  userRole,
  onEdit,
  onDelete,
  onAccept,
  onUpdateStatus
}) => {
  const { currentUser } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const getGoogleMapsLink = () => {
    // If lat/lng are valid (not 0,0), use them
    if (donation.location.lat !== 0 || donation.location.lng !== 0) {
      return `https://www.google.com/maps/dir/?api=1&destination=${donation.location.lat},${donation.location.lng}`;
    }
    // Fallback to address search
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(donation.location.address)}`;
  };

  const { label, className } = statusConfig[donation.status];

  return (
    <div className="glass-card rounded-xl p-6 hover:shadow-lg transition-all duration-300 animate-scale-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">{donation.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{donation.description}</p>
        </div>
        <Badge variant="outline" className={`ml-3 ${className}`}>
          {label}
        </Badge>
      </div>

      {/* Image Carousel */}
      {donation.imageUrls && donation.imageUrls.length > 0 && (
        <div className="mb-4 rounded-lg overflow-hidden relative group h-48 bg-muted">
          <img
            src={donation.imageUrls[currentImageIndex]}
            alt={`${donation.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Navigation Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

          {/* Carousel Controls */}
          {donation.imageUrls.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(prev => prev === 0 ? donation.imageUrls.length - 1 : prev - 1);
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(prev => prev === donation.imageUrls.length - 1 ? 0 : prev + 1);
                }}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>

              {/* Indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {donation.imageUrls.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Utensils className="h-4 w-4 text-primary" />
          <span>{donation.foodType}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4 text-primary" />
          <span>{donation.quantity}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 text-warning" />
          <span>Expires: {donation.expiryTime}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4 text-primary" />
          <span>{donation.donorName}</span>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4 p-3 bg-muted/50 rounded-lg">
        <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
        <span className="line-clamp-2">{donation.location.address}</span>
      </div>

      {/* Phone (if available) */}
      {donation.donorPhone && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Phone className="h-4 w-4 text-primary" />
          <a href={`tel:${donation.donorPhone}`} className="hover:text-primary transition-colors">
            {donation.donorPhone}
          </a>
        </div>
      )}

      {/* Timestamp */}
      <p className="text-xs text-muted-foreground mb-4">
        Posted {formatDistanceToNow(donation.createdAt, { addSuffix: true })}
      </p>

      {/* Accepted By (for donor view) */}
      {donation.status !== 'pending' && donation.acceptedByName && userRole === 'donor' && (
        <div className="mb-4 p-3 bg-info/10 rounded-lg border border-info/30">
          <p className="text-sm text-info font-medium">
            Accepted by: {donation.acceptedByName}
          </p>
          {donation.acceptedByPhone && (
            <div className="flex items-center gap-2 text-sm text-info/80 mt-1">
              <Phone className="h-3 w-3" />
              <a href={`tel:${donation.acceptedByPhone}`} className="hover:underline">
                {donation.acceptedByPhone}
              </a>
            </div>
          )}

          {/* Review Button */}
          {donation.status === 'accepted' && currentUser && (
            <div className="mt-4">
              <ReviewModal
                reviewerId={currentUser.uid}
                reviewerName={currentUser.displayName || 'User'}
                targetUserId={donation.acceptedBy || ''}
                donationId={donation.id}
                trigger={
                  <Button variant="outline" size="sm" className="w-full text-xs h-8 bg-background/50 hover:bg-background">
                    <Star className="h-3 w-3 mr-2 text-yellow-500" />
                    Rate NGO
                  </Button>
                }
              />
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
        {userRole === 'donor' && donation.status === 'pending' && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(donation)}
              className="flex-1"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete?.(donation.id)}
              className="flex-1"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </>
        )}

        {userRole === 'ngo' && donation.status === 'pending' && (
          <Button
            variant="success"
            size="sm"
            onClick={() => onAccept?.(donation)}
            className="w-full"
          >
            <CheckCircle className="h-4 w-4" />
            Accept Donation
          </Button>
        )}

        {userRole === 'ngo' && donation.status === 'accepted' && (
          <>
            <a
              href={getGoogleMapsLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="outline" size="sm" className="w-full">
                <Navigation className="h-4 w-4" />
                Navigate
              </Button>
            </a>
            <Button
              variant="success"
              size="sm"
              onClick={() => onUpdateStatus?.(donation.id, 'completed')}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4" />
              Mark Completed
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onUpdateStatus?.(donation.id, 'cancelled')}
              className="flex-1"
            >
              <XCircle className="h-4 w-4" />
              Cancel
            </Button>
          </>
        )}
      </div>
    </div >
  );
};

export default DonationCard;
