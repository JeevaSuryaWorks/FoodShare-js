import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, Timestamp, orderBy } from 'firebase/firestore';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Check, X, ExternalLink, Clock, Shield, Search } from 'lucide-react';
import { sendNotification } from '@/services/notificationService';

const AdminVerificationPanel: React.FC = () => {
    const [pendingUsers, setPendingUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingVerifications = async () => {
        setLoading(true);
        try {
            const q = query(
                collection(db, 'users'),
                where('verificationStatus', '==', 'pending')
            );
            const snapshot = await getDocs(q);
            const users = snapshot.docs.map(doc => doc.data() as User);
            setPendingUsers(users);
        } catch (error) {
            console.error("Error fetching pending verifications:", error);
            toast.error("Failed to load verification requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingVerifications();
    }, []);

    const handleApprove = async (userId: string, userName: string) => {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                verificationStatus: 'verified',
                isVerified: true,
                verificationSubmittedAt: Timestamp.now() // Update timestamp to approval time? Or keep submission? Let's keep submission usually, but maybe approvedAt is better. Use merge if needed.
            });

            // Send notification
            await sendNotification(
                userId,
                "Verification Approved! 🎉",
                "Your organization has been verified. You now have a blue tick on your profile.",
                "success"
            );

            toast.success(`Approved ${userName}`);
            fetchPendingVerifications(); // Refresh list
        } catch (error) {
            console.error("Error approving user:", error);
            toast.error("Failed to approve user.");
        }
    };

    const handleReject = async (userId: string, userName: string) => {
        const reason = prompt("Enter reason for rejection:");
        if (reason === null) return; // Cancelled

        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                verificationStatus: 'rejected',
                isVerified: false
            });

            // Send notification
            await sendNotification(
                userId,
                "Verification Rejected",
                `Your verification request was rejected. Reason: ${reason || "Documents invalid."}`,
                "error"
            );

            toast.success(`Rejected ${userName}`);
            fetchPendingVerifications(); // Refresh list
        } catch (error) {
            console.error("Error rejecting user:", error);
            toast.error("Failed to reject user.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Verification Requests</h2>
                    <p className="text-muted-foreground">Review and manage organization verification status.</p>
                </div>
                <Button variant="outline" onClick={fetchPendingVerifications} disabled={loading}>
                    {loading ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    Refresh
                </Button>
            </div>

            {pendingUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-muted/20">
                    <Shield className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">No Pending requests</h3>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {pendingUsers.map(user => (
                        <Card key={user.uid} className="overflow-hidden animate-fade-up">
                            <CardHeader className="pb-3 bg-muted/30">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt={user.displayName} className="h-full w-full object-cover" />
                                            ) : (
                                                user.displayName.charAt(0)
                                            )}
                                        </div>
                                        <div>
                                            <CardTitle className="text-base">{user.organizationName || user.displayName}</CardTitle>
                                            <CardDescription className="text-xs">
                                                {user.verificationSubmittedAt ? new Date(user.verificationSubmittedAt.seconds * 1000).toLocaleDateString() : 'Unknown Date'}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        {user.role}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-3 mb-4">
                                    <div className="text-sm">
                                        <span className="text-muted-foreground">Contact:</span> <span className="font-medium">{user.email}</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-muted-foreground">Phone:</span> <span className="font-medium">{user.phone || 'N/A'}</span>
                                    </div>
                                    {/* Link to view document - assuming we stored it somewhere or it's just a manual check in this MVP */}
                                    <div className="pt-2">
                                        {user.verificationDocumentUrl ? (
                                            <Button variant="link" className="h-auto p-0 text-blue-600" onClick={() => window.open(user.verificationDocumentUrl, '_blank')}>
                                                <ExternalLink className="mr-1 h-3 w-3" /> View Submitted Document
                                            </Button>
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">No document attached</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleApprove(user.uid, user.displayName)}>
                                        <Check className="mr-2 h-4 w-4" /> Approve
                                    </Button>
                                    <Button variant="destructive" className="flex-1" onClick={() => handleReject(user.uid, user.displayName)}>
                                        <X className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminVerificationPanel;
