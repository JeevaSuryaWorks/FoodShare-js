import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Lock, Eye, Share2, ClipboardList } from 'lucide-react';

const Privacy = () => {
    const lastUpdated = "January 20, 2026";

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="bg-muted/30 border-b">
                <div className="container mx-auto px-4 py-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">Privacy Policy</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Your trust is our priority. This policy explains how we collect, use, and protect your personal information within the FeedReach ecosystem.
                    </p>
                    <div className="inline-flex items-center gap-2 mt-6 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                        <ShieldCheck className="h-4 w-4" />
                        Last Updated: {lastUpdated}
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Section 1: Introduction */}
                    <section className="scroll-mt-20" id="introduction">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <ClipboardList className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-4">1. Data Collection Overview</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        We collect information you provide directly to us when you create an account, participate in a donation, or communicate with us. This includes:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li><strong>Account Information:</strong> Name, email address, and profile details.</li>
                                        <li><strong>NGO Details:</strong> Organization name, registration proof, and verification data.</li>
                                        <li><strong>Location Data:</strong> Pick-up and drop-off addresses provided for donation coordination.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Technical Logs */}
                    <section className="scroll-mt-20" id="technical-data">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Lock className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-4">2. Technical & Security Logs</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        To ensure the safety of our community and prevent fraudulent activity, we automatically collect certain technical data when you use our services:
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                                        <Card className="bg-muted/20 border-border/50">
                                            <CardContent className="p-4">
                                                <p className="font-semibold text-foreground mb-1">IP Address</p>
                                                <p className="text-sm">Used for security auditing and to detect suspicious network patterns.</p>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-muted/20 border-border/50">
                                            <CardContent className="p-4">
                                                <p className="font-semibold text-foreground mb-1">Device Content</p>
                                                <p className="text-sm">Information about your browser type and operating system to improve platform compatibility.</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Usage */}
                    <section className="scroll-mt-20" id="data-usage">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Eye className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-4">3. How We Use Your Data</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        The data we collect is used to facilitate the core functions of FeedReach:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2 text-sm italic">
                                        <li>Connecting Donors with NGOs in real-time.</li>
                                        <li>Verifying the authenticity of participating organizations.</li>
                                        <li>Providing relevant notifications about donation statuses.</li>
                                        <li>Improving our matching algorithms to reduce food waste.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Data Sharing */}
                    <section className="scroll-mt-20" id="data-sharing">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Share2 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-4">4. Data Sharing & Disclosure</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        We do not sell your personal data. We share information only in the following contexts:
                                    </p>
                                    <div className="p-5 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 rounded-xl">
                                        <p className="text-sm text-orange-800 dark:text-orange-300">
                                            <strong>Donation Coordination:</strong> Contact information is shared between the Donor and the NGO that has accepted a donation to facilitate hand-off. No other third parties receive this data.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="pt-8 border-t text-center">
                        <p className="text-muted-foreground text-sm">
                            Questions about our privacy practices? Contact us at <a href="mailto:privacy@feedreach.com" className="text-primary hover:underline">privacy@feedreach.com</a>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Privacy;
