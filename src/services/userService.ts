import { db, storage } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { User } from '@/types';

export const updateUserProfile = async (uid: string, data: Partial<User>) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
        ...data,
        updatedAt: new Date()
    });
};

export const uploadUserAvatar = async (file: File, uid: string): Promise<string> => {
    const fileRef = ref(storage, `avatars/${uid}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    return getDownloadURL(snapshot.ref);
};

export const getUserStats = async (uid: string) => {
    // In a real app, this might be an aggregation query or a cloud function result
    // For now, we'll placeholder or just ensure the user doc has stats
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
        const data = snap.data();
        return data.stats || { totalDonations: 0, peopleFed: 0, karmaPoints: 0 };
    }
    return { totalDonations: 0, peopleFed: 0, karmaPoints: 0 };
};
