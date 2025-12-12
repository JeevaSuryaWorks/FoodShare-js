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
  XCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
  const getGoogleMapsLink = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${donation.location.lat},${donation.location.lng}`;
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

      {/* Image */}
      {donation.imageUrl && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={donation.imageUrl}
            alt={donation.title}
            className="w-full h-40 object-cover"
          />
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
    </div>
  );
};

export default DonationCard;
