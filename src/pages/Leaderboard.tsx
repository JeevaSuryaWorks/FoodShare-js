import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award, Star, Crown, Heart } from 'lucide-react';

const Leaderboard: React.FC = () => {
    const [topDonors, setTopDonors] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {

                const q = query(
                    collection(db, 'users'),
                );

                const snapshot = await getDocs(q);
                const users = snapshot.docs.map(doc => doc.data() as User);

                const rankedUsers = users
                    .filter(u => u.stats && u.stats.totalDonations > 0)
                    .sort((a, b) => (b.stats?.totalDonations || 0) - (a.stats?.totalDonations || 0))
                    .slice(0, 50); // Fetch more to show a good list

                setTopDonors(rankedUsers);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const podiumUsers = topDonors.slice(0, 3);
    const listUsers = topDonors.slice(3);

    return (
        <div className="min-h-screen bg-background pb-12">
            <Navbar />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-primary/5 py-12 mb-8">
                <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,black,rgba(0,0,0,0.6))]" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 tracking-tight">
                        Hall of <span className="text-primary">Fame</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Celebrating the heroes who are making the biggest impact in the fight against food waste.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-5xl">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        <p className="text-muted-foreground">Loading champions...</p>
                    </div>
                ) : topDonors.length === 0 ? (
                    <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
                        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Star className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Be the First Champion!</h3>
                        <p className="text-muted-foreground mb-6">No donations recorded yet. Start donating to see your name here.</p>
                    </div>
                ) : (
                    <>
                        {/* Podium Section */}
                        <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 mb-16 min-h-[400px]">
                            {/* 2nd Place */}
                            {podiumUsers[1] && (
                                <div className="order-2 md:order-1 flex-1 max-w-[280px] animate-fade-up" style={{ animationDelay: '0.1s' }}>
                                    <div className="flex flex-col items-center">
                                        <Avatar className="h-24 w-24 border-4 border-slate-300 shadow-xl mb-[-2rem] z-10">
                                            <AvatarImage src={podiumUsers[1].photoURL} />
                                            <AvatarFallback className="bg-slate-100 text-slate-500 text-2xl font-bold">
                                                {podiumUsers[1].displayName?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="w-full bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-t-2xl pt-12 pb-6 px-4 text-center shadow-lg border-t-4 border-slate-300 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                                <Medal className="h-24 w-24" />
                                            </div>
                                            <div className="inline-flex items-center justify-center bg-slate-300 text-slate-800 text-sm font-bold px-3 py-1 rounded-full mb-2 shadow-sm">
                                                #2 Silver
                                            </div>
                                            <h3 className="font-display font-bold text-lg truncate w-full mb-1">
                                                {podiumUsers[1].displayName}
                                            </h3>
                                            <p className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-2">
                                                {podiumUsers[1].stats?.totalDonations} <span className="text-xs font-normal opacity-70">Donations</span>
                                            </p>
                                            <p className="text-sm font-medium text-success flex items-center justify-center gap-1">
                                                <Heart className="h-3 w-3 fill-current" />
                                                {podiumUsers[1].stats?.peopleFed} People Fed
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 1st Place (Champion) */}
                            {podiumUsers[0] && (
                                <div className="order-1 md:order-2 flex-1 max-w-[320px] z-10 -mt-8 md:-mt-0 animate-fade-up">
                                    <div className="flex flex-col items-center">
                                        <div className="relative">
                                            <Crown className="absolute -top-12 left-1/2 -translate-x-1/2 h-14 w-14 text-yellow-500 fill-yellow-500 animate-bounce" />
                                            <Avatar className="h-32 w-32 border-4 border-yellow-500 shadow-2xl shadow-yellow-500/20 mb-[-2.5rem] z-10 ring-4 ring-yellow-500/30">
                                                <AvatarImage src={podiumUsers[0].photoURL} />
                                                <AvatarFallback className="bg-yellow-50 text-yellow-600 text-4xl font-bold">
                                                    {podiumUsers[0].displayName?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="w-full bg-gradient-to-b from-yellow-50 via-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:via-yellow-800/30 dark:to-yellow-700/30 rounded-t-2xl pt-14 pb-8 px-4 text-center shadow-2xl border-t-4 border-yellow-500 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

                                            <div className="relative">
                                                <div className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-base font-bold px-6 py-1.5 rounded-full mb-3 shadow-lg shadow-orange-500/20">
                                                    <Trophy className="h-4 w-4 mr-1.5 fill-current" />
                                                    Champion
                                                </div>
                                                <h3 className="font-display font-bold text-2xl truncate w-full mb-2 text-foreground">
                                                    {podiumUsers[0].displayName}
                                                </h3>
                                                <p className="text-4xl font-bold text-primary mb-3">
                                                    {podiumUsers[0].stats?.totalDonations} <span className="text-sm font-normal text-muted-foreground">Donations</span>
                                                </p>
                                                <div className="flex items-center justify-center gap-3">
                                                    <p className="text-base font-bold text-success flex items-center gap-1.5 bg-success/10 px-3 py-1 rounded-lg">
                                                        <Heart className="h-4 w-4 fill-current" />
                                                        {podiumUsers[0].stats?.peopleFed} Fed
                                                    </p>
                                                    <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400 flex items-center gap-1 bg-yellow-400/10 px-3 py-1 rounded-lg">
                                                        <Star className="h-3.5 w-3.5 fill-current" />
                                                        {((podiumUsers[0].stats?.ratingSum || 0) / (podiumUsers[0].stats?.reviewCount || 1)).toFixed(1)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 3rd Place */}
                            {podiumUsers[2] && (
                                <div className="order-3 flex-1 max-w-[280px] animate-fade-up" style={{ animationDelay: '0.2s' }}>
                                    <div className="flex flex-col items-center">
                                        <Avatar className="h-24 w-24 border-4 border-orange-300 shadow-xl mb-[-2rem] z-10">
                                            <AvatarImage src={podiumUsers[2].photoURL} />
                                            <AvatarFallback className="bg-orange-50 text-orange-500 text-2xl font-bold">
                                                {podiumUsers[2].displayName?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="w-full bg-gradient-to-b from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-t-2xl pt-12 pb-6 px-4 text-center shadow-lg border-t-4 border-orange-300 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                                <Medal className="h-24 w-24" />
                                            </div>
                                            <div className="inline-flex items-center justify-center bg-orange-300 text-orange-900 text-sm font-bold px-3 py-1 rounded-full mb-2 shadow-sm">
                                                #3 Bronze
                                            </div>
                                            <h3 className="font-display font-bold text-lg truncate w-full mb-1">
                                                {podiumUsers[2].displayName}
                                            </h3>
                                            <p className="text-2xl font-bold text-orange-800 dark:text-orange-300 mb-2">
                                                {podiumUsers[2].stats?.totalDonations} <span className="text-xs font-normal opacity-70">Donations</span>
                                            </p>
                                            <p className="text-sm font-medium text-success flex items-center justify-center gap-1">
                                                <Heart className="h-3 w-3 fill-current" />
                                                {podiumUsers[2].stats?.peopleFed} People Fed
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Runners Up List */}
                        {listUsers.length > 0 && (
                            <div className="space-y-3 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.3s' }}>
                                <h3 className="font-display font-semibold text-muted-foreground mb-4 pl-2">Honorable Mentions</h3>
                                {listUsers.map((user, index) => (
                                    <div key={user.uid} className="group relative bg-card hover:bg-muted/50 border border-border/50 rounded-xl p-4 transition-all hover:shadow-md hover:border-primary/20 flex items-center gap-4">
                                        <div className="flex-shrink-0 w-8 text-center font-bold text-muted-foreground">
                                            #{index + 4}
                                        </div>

                                        <Avatar className="h-10 w-10 border border-border">
                                            <AvatarImage src={user.photoURL} />
                                            <AvatarFallback className="text-xs">{user.displayName?.charAt(0)}</AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold truncate">{user.displayName}</h4>
                                                {user.organizationName && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground hidden sm:inline-block truncate max-w-[150px]">
                                                        {user.organizationName}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                                                <span>{user.stats?.peopleFed || 0} People Fed</span>
                                                <span>•</span>
                                                <span>{user.role}</span>
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-bold text-lg text-primary">{user.stats?.totalDonations}</p>
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Donations</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="container mx-auto px-4 mt-16 text-center">
                <p className="text-sm text-muted-foreground">
                    Participation in the leaderboard is subject to our{' '}
                    <a href="/terms" className="underline hover:text-primary">Terms of Service</a>,{' '}
                    <a href="/privacy" className="underline hover:text-primary">Privacy Policy</a>, and{' '}
                    <a href="/data-use" className="underline hover:text-primary">Data Usage Policy</a>.
                    <br />
                    Publicly visible data includes your Display Name, Profile Photo, and Impact Stats.
                </p>
            </div>
        </div>
    );
};

export default Leaderboard;
