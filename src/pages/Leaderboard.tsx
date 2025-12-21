import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award, Star } from 'lucide-react';

const Leaderboard: React.FC = () => {
    const [topDonors, setTopDonors] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                // In a real app we'd have a specific index for this query: 'stats.totalDonations' desc
                // For MVP without index, we might just load some users.
                // Assuming we can create index or query works.
                const q = query(
                    collection(db, 'users'),
                    // orderBy('stats.totalDonations', 'desc'), // Needs index
                    // limit(10)
                );

                // Fetch all and sort client side for MVP to avoid index creation delay
                const snapshot = await getDocs(q);
                const users = snapshot.docs.map(doc => doc.data() as User);

                // Filter users who have stats
                const rankedUsers = users
                    .filter(u => u.stats && u.stats.totalDonations > 0)
                    .sort((a, b) => (b.stats?.totalDonations || 0) - (a.stats?.totalDonations || 0))
                    .slice(0, 10);

                setTopDonors(rankedUsers);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <Trophy className="h-6 w-6 text-yellow-500" />;
            case 1: return <Medal className="h-6 w-6 text-gray-400" />;
            case 2: return <Medal className="h-6 w-6 text-amber-600" />;
            default: return <span className="text-lg font-bold w-6 text-center text-muted-foreground">{index + 1}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-background pb-12">
            <Navbar />

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-display font-bold text-foreground mb-4">Community Leaderboard</h1>
                    <p className="text-muted-foreground text-lg">Celebrate our top heroes making a difference.</p>
                </div>

                <div className="grid gap-4">
                    {loading ? (
                        <div className="text-center py-10">Loading champions...</div>
                    ) : topDonors.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No donations recorded yet. Be the first!
                        </div>
                    ) : (
                        topDonors.map((user, index) => (
                            <Card key={index} className="glass-card border-none hover:bg-muted/40 transition-colors">
                                <CardContent className="flex items-center gap-4 p-4">
                                    <div className="flex items-center justify-center w-12">
                                        {getRankIcon(index)}
                                    </div>

                                    <Avatar className="h-12 w-12 border-2 border-border">
                                        <AvatarImage src={user.photoURL} />
                                        <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg">{user.displayName}</h3>
                                        <p className="text-sm text-muted-foreground">{user.organizationName || 'Individual Donor'}</p>
                                    </div>

                                    <div className="flex gap-6 text-right">
                                        <div className="hidden sm:block">
                                            <p className="text-xs text-muted-foreground uppercase font-bold">People Fed</p>
                                            <p className="font-mono text-lg font-bold text-success">{user.stats?.peopleFed || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-bold">Donations</p>
                                            <p className="font-mono text-lg font-bold text-primary">{user.stats?.totalDonations || 0}</p>
                                        </div>
                                        <div className="hidden sm:flex flex-col items-end">
                                            <p className="text-xs text-muted-foreground uppercase font-bold">Rating</p>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                <span className="font-mono font-bold">
                                                    {(user.stats?.ratingSum && user.stats?.reviewCount)
                                                        ? (user.stats.ratingSum / user.stats.reviewCount).toFixed(1)
                                                        : 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
