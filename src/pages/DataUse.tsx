import React from 'react';
import Navbar from '@/components/Navbar';
import { Database, TrendingUp, Search, History, Cloud } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const DataUse = () => {
    const lastUpdated = "January 20, 2026";

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="bg-muted/30 border-b relative overflow-hidden">
                {/* Abstract Background Element */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="container mx-auto px-4 py-16 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold uppercase tracking-widest">
                        <Database className="h-3.5 w-3.5" />
                        Data Transparency
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">Data Usage Policy</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                        Transparent insights into how we optimize food distribution and track the collective impact of our community.
                    </p>
                    <p className="text-xs text-muted-foreground mt-8">Policy Effective Date: {lastUpdated}</p>
                </div>
            </div>

            <main className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto space-y-16">
                    {/* Transparency Section */}
                    <div className="relative">
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                            <Search className="h-5 w-5 text-primary" />
                            Operational Transparency
                        </h2>
                        <Card className="border-none shadow-none bg-accent/30 overflow-hidden">
                            <CardContent className="p-8">
                                <p className="text-muted-foreground leading-relaxed">
                                    At FeedReach, we believe that data should be a tool for good. We leverage anonymized information to streamline operations and prove the effectiveness of food donation programs. Your data is primarily used to ensure that surplus food reaches the right NGOs in the shortest possible time.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Grid Layout for Usage Types */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold">Impact Analytics</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                We aggregate donation weights, food types, and frequency to generate public reports. This helps us advocate for better food waste policies and shows the collective difference we're making.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                                <Cloud className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold">Logistics & Verification</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Timestamped records and approximate location data are used to confirm hand-offs. This ensures accountability for all participants and helps NGOs track their inventory more accurately.
                            </p>
                        </div>
                    </div>

                    {/* Retention Section */}
                    <section className="bg-muted/50 rounded-3xl p-8 border border-border/50">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="shrink-0 p-4 rounded-2xl bg-background border shadow-sm">
                                <History className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-3">Retention & Minimization</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Historical donation data is retained indefinitely for long-term impact analysis. However, we proactively minimize or remove personal contact information from these archives once a donation cycle is fully completed and verified.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-4">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <div className="h-1 w-1 rounded-full bg-primary" />
                                        Encrypted Storage
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <div className="h-1 w-1 rounded-full bg-primary" />
                                        GDPR Compliant Principles
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <footer className="text-center pt-8">
                        <p className="text-muted-foreground text-sm">
                            Your data control options are available in your <a href="/profile" className="text-primary font-medium hover:underline">Profile Settings</a>.
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default DataUse;
