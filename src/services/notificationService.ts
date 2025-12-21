import { db } from '@/lib/firebase';
import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    orderBy,
    updateDoc,
    doc,
    Timestamp
} from 'firebase/firestore';
import { Notification } from '@/types';

const NOTIFICATIONS_COLLECTION = 'notifications';

export const subscribeToNotifications = (
    userId: string,
    onSuccess: (notifications: Notification[]) => void
) => {
    const q = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where('userId', '==', userId)
        // Removed orderBy to avoid index issues initially, sort client-side
    );

    return onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Notification[];

        // Client-side sort
        notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        onSuccess(notifications);
    });
};

export const markAsRead = async (notificationId: string) => {
    const notifRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
    await updateDoc(notifRef, { read: true });
};

export const sendNotification = async (
    userId: string,
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    link?: string
) => {
    await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
        userId,
        title,
        message,
        read: false,
        createdAt: Timestamp.now(),
        type,
        link: link || null
    });
};
