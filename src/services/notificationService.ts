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
    // 1. Direct messages listener
    const qDirect = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where('userId', '==', userId)
    );

    // 2. Broadcast messages listener
    const qBroadcast = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where('userId', '==', 'all')
    );

    let directNotifs: Notification[] = [];
    let broadcastNotifs: Notification[] = [];

    const mergeAndNotify = () => {
        const all = [...directNotifs, ...broadcastNotifs].sort((a, b) =>
            b.createdAt.getTime() - a.createdAt.getTime()
        );
        onSuccess(all);
    };

    const unsubDirect = onSnapshot(qDirect, (snapshot) => {
        directNotifs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Notification[];
        mergeAndNotify();
    }, (error) => {
        console.warn("Direct notification listener error (might need index):", error);
        // Fallback for index error: try without orderBy if needed, but 'desc' usually works if single field
    });

    const unsubBroadcast = onSnapshot(qBroadcast, (snapshot) => {
        broadcastNotifs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Notification[];
        mergeAndNotify();
    }, (error) => {
        console.warn("Broadcast notification listener error:", error);
    });

    return () => {
        unsubDirect();
        unsubBroadcast();
    };
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
