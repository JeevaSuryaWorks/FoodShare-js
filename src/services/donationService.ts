import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Donation, DonationFormData, DonationStatus } from '@/types';

const DONATIONS_COLLECTION = 'donations';

export const createDonation = async (
  donorId: string,
  donorName: string,
  donorPhone: string | undefined,
  data: DonationFormData
): Promise<string> => {
  const donationData = {
    ...data,
    donorId,
    donorName,
    donorPhone,
    status: 'pending' as DonationStatus,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  const docRef = await addDoc(collection(db, DONATIONS_COLLECTION), donationData);
  return docRef.id;
};

export const updateDonation = async (
  donationId: string,
  data: Partial<DonationFormData>
): Promise<void> => {
  const donationRef = doc(db, DONATIONS_COLLECTION, donationId);
  await updateDoc(donationRef, {
    ...data,
    updatedAt: Timestamp.now()
  });
};

export const deleteDonation = async (donationId: string): Promise<void> => {
  const donationRef = doc(db, DONATIONS_COLLECTION, donationId);
  await deleteDoc(donationRef);
};

export const acceptDonation = async (
  donationId: string,
  ngoId: string,
  ngoName: string
): Promise<void> => {
  const donationRef = doc(db, DONATIONS_COLLECTION, donationId);
  await updateDoc(donationRef, {
    status: 'accepted',
    acceptedBy: ngoId,
    acceptedByName: ngoName,
    updatedAt: Timestamp.now()
  });
};

export const updateDonationStatus = async (
  donationId: string,
  status: DonationStatus
): Promise<void> => {
  const donationRef = doc(db, DONATIONS_COLLECTION, donationId);
  await updateDoc(donationRef, {
    status,
    updatedAt: Timestamp.now()
  });
};

export const subscribeToDonorDonations = (
  donorId: string,
  callback: (donations: Donation[]) => void
) => {
  const q = query(
    collection(db, DONATIONS_COLLECTION),
    where('donorId', '==', donorId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const donations: Donation[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Donation[];
    callback(donations);
  });
};

export const subscribeToAvailableDonations = (
  callback: (donations: Donation[]) => void
) => {
  const q = query(
    collection(db, DONATIONS_COLLECTION),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const donations: Donation[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Donation[];
    callback(donations);
  });
};

export const subscribeToNGOAcceptedDonations = (
  ngoId: string,
  callback: (donations: Donation[]) => void
) => {
  const q = query(
    collection(db, DONATIONS_COLLECTION),
    where('acceptedBy', '==', ngoId),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const donations: Donation[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Donation[];
    callback(donations);
  });
};

export const getAvailableDonations = async (): Promise<Donation[]> => {
  const q = query(
    collection(db, DONATIONS_COLLECTION),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date()
  })) as Donation[];
};
