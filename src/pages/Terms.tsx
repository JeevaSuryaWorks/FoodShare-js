import React from 'react';
import Navbar from '@/components/Navbar';
import { Gavel, UserCheck, ShieldAlert, Scale, FileText } from 'lucide-react';

const Terms = () => {
    const lastUpdated = "January 20, 2026";

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="bg-muted/30 border-b font-display">
                <div className="container mx-auto px-4 py-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms and Conditions</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Rules and guidelines for participating in the FeedReach movement.
                    </p>
                    <div className="inline-flex items-center gap-2 mt-6 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium">
                        <Gavel className="h-4 w-4" />
                        Agreement Version: {lastUpdated}
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-16">
                    {/* Section 1: Introduction */}
                    <section className="group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <FileText className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">1. Agreement to Terms</h2>
                        </div>
                        <div className="text-muted-foreground leading-relaxed space-y-4 ml-12">
                            <p>
                                Welcome to FeedReach. By accessing or using our platform, you agree to be bound by these Terms and Conditions. Our mission is to reduce food waste and help those in need, and these rules ensure we can do so safely and effectively.
                            </p>
                            <p>
                                If you do not agree with any part of these terms, you must not use the service.
                            </p>
                        </div>
                    </section>

                    {/* Section 2: Registration */}
                    <section className="group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <UserCheck className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">2. User Accounts & Verification</h2>
                        </div>
                        <div className="text-muted-foreground leading-relaxed space-y-4 ml-12">
                            <p>
                                To participate as a Donor or NGO, you must register for an account. You are responsible for:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Maintaining the confidentiality of your credentials.</li>
                                <li>Providing accurate and truthful information about your organization or identity.</li>
                                <li>Ensuring that your account is not used for any unauthorized purposes.</li>
                            </ul>
                            <p className="bg-muted p-4 rounded-lg text-sm italic">
                                NGOs are subject to a verification process. We reserve the right to request documentation to confirm your non-profit status.
                            </p>
                        </div>
                    </section>

                    {/* Section 3: Safety */}
                    <section className="group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <ShieldAlert className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">3. Acceptable Conduct</h2>
                        </div>
                        <div className="text-muted-foreground leading-relaxed space-y-4 ml-12">
                            <p>
                                Transparency and respect are the pillars of our community. Harassment, spamming, and fraudulent donation entries are strictly prohibited.
                            </p>
                            <p>
                                The platform must not be used to distribute expired or contaminated food knowingly. Donors are expected to follow local food safety guidelines.
                            </p>
                        </div>
                    </section>

                    {/* Section 4: Limitation of Liability */}
                    <section className="group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Scale className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold">4. Limitation of Liability</h2>
                        </div>
                        <div className="text-muted-foreground leading-relaxed space-y-4 ml-12">
                            <p>
                                FeedReach acts as a facilitator and matching platform. While we strive to verify all participants, we are not liable for:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>The quality or safety of food items donated.</li>
                                <li>Any disputes that arise during the physical exchange of donations.</li>
                                <li>Indirect, incidental, or consequential damages resulting from platform use.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Final Clause */}
                    <div className="p-8 bg-muted/40 rounded-3xl text-center border">
                        <h3 className="text-xl font-bold mb-3">Termination of Use</h3>
                        <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-6">
                            We reserve the right to suspend or terminate access to our platform for any user who violates these terms or engages in behavior that threatens the safety of our community.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Terms;
