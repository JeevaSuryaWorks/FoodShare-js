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
  donorPhone?: string;
  title: string;
  description: string;
  foodType: string;
  quantity: string;
  expiryTime: string;
  imageUrl?: string;
  location: Location;
  status: DonationStatus;
  acceptedBy?: string;
  acceptedByName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DonationFormData {
  title: string;
  description: string;
  foodType: string;
  quantity: string;
  expiryTime: string;
  location: Location;
  imageUrl?: string;
}
