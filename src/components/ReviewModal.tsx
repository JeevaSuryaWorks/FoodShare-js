import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { submitReview } from '@/services/reviewService';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ReviewModalProps {
    reviewerId: string;
    reviewerName: string;
    targetUserId: string;
    donationId: string;
    trigger?: React.ReactNode;
    onReviewSubmitted?: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
    reviewerId,
    reviewerName,
    targetUserId,
    donationId,
    trigger,
    onReviewSubmitted
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast({ title: "Please select a rating", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            await submitReview(reviewerId, reviewerName, targetUserId, donationId, rating, comment);
            toast({ title: "Review submitted!", description: "Thank you for your feedback." });
            setIsOpen(false);
            if (onReviewSubmitted) onReviewSubmitted();
        } catch (error) {
            console.error("Review failed", error);
            toast({ title: "Failed to submit review", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || <Button variant="outline" size="sm">Rate User</Button>}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rate your experience</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star
                                    className={`h-8 w-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                                />
                            </button>
                        ))}
                    </div>

                    <Textarea
                        placeholder="Share your experience (optional)..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    <Button onClick={handleSubmit} disabled={loading} className="w-full">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Review'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewModal;
