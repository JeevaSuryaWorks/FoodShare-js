import { db } from '@/lib/firebase';
import {
    doc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    serverTimestamp,
    orderBy
} from 'firebase/firestore';
import { User } from '@/types';
import { sendNotification } from './notificationService';

export const submitVerificationRequest = async (userId: string, documentUrl: string) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            verificationStatus: 'pending',
            verificationDocumentUrl: documentUrl,
            verificationSubmittedAt: serverTimestamp()
        });

        // Notify Admins (In a real app, you'd trigger a cloud function or notify all admin users)
        // For now, we assume there is a broadcast or specific admin listener
        return true;
    } catch (error) {
        console.error("Error submitting verification:", error);
        throw error;
    }
};

export const approveVerification = async (userId: string) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            verificationStatus: 'verified',
            isVerified: true
        });

        await sendNotification(
            userId,
            "Verification Approved! 🎉",
            "Your organization has been verified. You now have a blue tick on your profile.",
            "success"
        );
        return true;
    } catch (error) {
        console.error("Error approving verification:", error);
        throw error;
    }
};

export const rejectVerification = async (userId: string, reason: string) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            verificationStatus: 'rejected',
            isVerified: false
        });

        await sendNotification(
            userId,
            "Verification Update",
            `Your verification request was not approved. Reason: ${reason}`,
            "warning"
        );
        return true;
    } catch (error) {
        console.error("Error rejecting verification:", error);
        throw error;
    }
};

export const getPendingVerifications = async (): Promise<User[]> => {
    try {
        const q = query(
            collection(db, 'users'),
            where('verificationStatus', '==', 'pending'),
            orderBy('verificationSubmittedAt', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
    } catch (error) {
        // Fallback if index missing
        console.warn("Index might be missing for verification query:", error);
        const qSimple = query(collection(db, 'users'), where('verificationStatus', '==', 'pending'));
        const snapshot = await getDocs(qSimple);
        return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
    }
};
