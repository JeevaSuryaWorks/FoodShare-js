export type UserRole = 'donor' | 'ngo';

export type DonationStatus = 'pending' | 'accepted' | 'completed' | 'cancelled';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  address?: string;
  organizationName?: string;
  photoURL?: string;
  bio?: string;
  stats?: {
    totalDonations: number;
    peopleFed: number;
    karmaPoints: number;
    ratingSum?: number;
    reviewCount?: number;
  };
  createdAt: Date;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  donorPhone?: string; // Kept for backward compatibility or direct user profile phone
  title: string;
  description: string;
  foodType: string;
  quantity: string;
  expiryTime: string;
  imageUrls: string[]; // Array of image URLs
  contactPhone: string; // Specific contact for this donation
  countryCode: string;
  location: Location;
  status: DonationStatus;
  acceptedBy?: string;
  acceptedByName?: string;
  acceptedByPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  targetUserId: string;
  donationId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

export interface DonationFormData {
  title: string;
  description: string;
  foodType: string;
  quantity: string;
  expiryTime: string;
  location: Location;
  imageUrls: string[];
  contactPhone: string;
  countryCode: string;
}
