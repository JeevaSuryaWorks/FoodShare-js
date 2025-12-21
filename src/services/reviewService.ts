import { db } from '@/lib/firebase';
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    Timestamp,
    updateDoc,
    doc,
    increment,
    getDoc
} from 'firebase/firestore';
import { Review } from '@/types';

const REVIEWS_COLLECTION = 'reviews';

export const submitReview = async (
    reviewerId: string,
    reviewerName: string,
    targetUserId: string,
    donationId: string,
    rating: number,
    comment: string
) => {
    // 1. Create Review
    await addDoc(collection(db, REVIEWS_COLLECTION), {
        reviewerId,
        reviewerName,
        targetUserId,
        donationId,
        rating,
        comment,
        createdAt: Timestamp.now()
    });

    // 2. Update Target User Stats (Aggregation)
    const userRef = doc(db, 'users', targetUserId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        const userData = userSnap.data();
        // Initialize stats if they don't exist
        const currentStats = userData.stats || {
            totalDonations: 0,
            peopleFed: 0,
            karmaPoints: 0,
            ratingSum: 0,
            reviewCount: 0
        };

        const newReviewCount = (currentStats.reviewCount || 0) + 1;
        const newRatingSum = (currentStats.ratingSum || 0) + rating;

        // Karma calculation: +10 per review, +rating * 2
        const karmaBoost = 10 + (rating * 2);

        await updateDoc(userRef, {
            stats: {
                ...currentStats,
                ratingSum: newRatingSum,
                reviewCount: newReviewCount,
                karmaPoints: (currentStats.karmaPoints || 0) + karmaBoost
            }
        });
    }
};

export const getUserReviews = async (userId: string) => {
    const q = query(
        collection(db, REVIEWS_COLLECTION),
        where('targetUserId', '==', userId)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Review[];
};
