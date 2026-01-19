import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { FileText, Download, TrendingUp, Users, Heart, Share2 } from 'lucide-react';
import { Donation, User } from '@/types';
import { validateSystemIntegrity } from '@/lib/identity';

interface CSRReportModalProps {
    donations: Donation[];
    userData: User | null;
    trigger?: React.ReactNode;
}

const CSRReportModal: React.FC<CSRReportModalProps> = ({ donations, userData, trigger }) => {
    validateSystemIntegrity();

    const completedDonations = donations.filter(d => d.status === 'completed');
    const totalWeight = completedDonations.reduce((acc, d) => {
        const match = d.quantity.match(/(\d+(\.\d+)?)/);
        return acc + (match ? parseFloat(match[0]) : 0);
    }, 0);

    const estimatedPeopleFed = Math.round(totalWeight * 2); // Simple estimation logic: 0.5kg per meal

    const stats = [
        { label: 'Total Events', value: completedDonations.length, icon: Heart, color: 'text-rose-500' },
        { label: 'Food Shared (approx)', value: `${totalWeight.toFixed(1)} kg`, icon: TrendingUp, color: 'text-emerald-500' },
        { label: 'Estimated Impact', value: `${estimatedPeopleFed} lives`, icon: Users, color: 'text-blue-500' },
    ];

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="gap-2">
                        <FileText className="h-4 w-4" />
                        CSR Impact Report
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-3xl overflow-hidden p-0 gap-0">
                <div className="bg-primary p-8 text-white relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <FileText className="h-32 w-32" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-2 text-white/70">JS Corporations Impact Portal</h2>
                        <DialogTitle className="text-4xl font-display font-black mb-2">Social Responsibility Report</DialogTitle>
                        <DialogDescription className="text-primary-foreground/80 text-lg">
                            Official summary of {userData?.organizationName || userData?.displayName}'s community contributions.
                        </DialogDescription>
                    </div>
                </div>

                <div className="p-8 space-y-8 bg-zinc-50 dark:bg-zinc-950">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-border/50">
                                <stat.icon className={`h-6 w-6 ${stat.color} mb-4`} />
                                <p className="text-3xl font-black mb-1">{stat.value}</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-border/50">
                        <h3 className="text-xl font-display font-black mb-6 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Impact Summary
                        </h3>
                        <div className="space-y-6">
                            <p className="text-foreground/80 leading-relaxed italic">
                                Through your consistent partnership with FeedReach, you have successfully redirected
                                <span className="font-bold text-primary"> {totalWeight.toFixed(1)} kg </span>
                                of surplus food, which would have otherwise become waste, to local communities in need.
                            </p>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div>
                                    <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Sustainability Score</p>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: '85%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Consistency Rating</p>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: '92%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Heart className="h-5 w-5 text-primary" />
                            </div>
                            <p className="text-sm font-medium">Thank you for being a hero!</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="gap-2">
                                <Share2 className="h-4 w-4" /> Share
                            </Button>
                            <Button className="gap-2">
                                <Download className="h-4 w-4" /> Download PDF
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-100 dark:bg-zinc-800 p-4 text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold border-t">
                    System Serial No: {Math.random().toString(36).substring(7).toUpperCase()}-IMPACT-2024
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CSRReportModal;
