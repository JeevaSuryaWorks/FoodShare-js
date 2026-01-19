import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import {
    ShieldLock,
    Eye,
    EyeOff,
    BellRing,
    Smartphone,
    ShieldCheck,
    ArrowLeft,
    Key,
    Database,
    Trash2,
    Lock,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { validateSystemIntegrity } from '@/lib/identity';

const PrivacySettings: React.FC = () => {
    validateSystemIntegrity();
    const { userData, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [privacy, setPrivacy] = useState({
        publicProfile: true,
        showEmail: false,
        showPhone: false,
        e2eEnabled: true,
        marketingEmails: false,
        pushNotifications: true,
        dataSharing: false
    });

    const handleToggle = (key: keyof typeof privacy) => {
        setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // In a real app, save to Firestore 'users' collection
            await new Promise(resolve => setTimeout(resolve, 800));
            toast.success("Privacy settings updated successfully");
        } catch (err) {
            toast.error("Failed to update settings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-12">
            <Navbar />

            <main className="container max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-display font-bold">Privacy & Security</h1>
                        <p className="text-muted-foreground">Manage your data and security preferences</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Navigation Sidebar (Desktop) */}
                    <div className="hidden md:flex flex-col gap-2">
                        <Button variant="secondary" className="justify-start gap-3 h-12 bg-primary/5 text-primary border-r-4 border-primary rounded-none">
                            <ShieldCheck className="h-5 w-5" /> Security Center
                        </Button>
                        <Button variant="ghost" className="justify-start gap-3 h-12 hover:bg-muted">
                            <BellRing className="h-5 w-5 text-muted-foreground" /> Notifications
                        </Button>
                        <Button variant="ghost" className="justify-start gap-3 h-12 hover:bg-muted">
                            <Database className="h-5 w-5 text-muted-foreground" /> Data Portfolio
                        </Button>
                    </div>

                    {/* Main Settings */}
                    <div className="md:col-span-2 space-y-6">
                        {/* E2E Security */}
                        <Card className="border-emerald-500/20 bg-emerald-500/5 overflow-hidden">
                            <div className="h-1 bg-emerald-500" />
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Lock className="h-5 w-5 text-emerald-600" />
                                        <CardTitle>End-to-End Encryption</CardTitle>
                                    </div>
                                    <Switch checked={privacy.e2eEnabled} onCheckedChange={() => handleToggle('e2eEnabled')} />
                                </div>
                                <CardDescription className="pt-2 text-emerald-800/60 dark:text-emerald-500/60">
                                    When enabled, your messages are encrypted locally and can only be read by the recipient.
                                    Keys are stored securely on this device.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        {/* Profile Visibility */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Visibility Settings</CardTitle>
                                <CardDescription>Control who can see your information on the public platform.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Public Profile</Label>
                                        <p className="text-xs text-muted-foreground">Allow others to see your donor/NGO profile page.</p>
                                    </div>
                                    <Switch checked={privacy.publicProfile} onCheckedChange={() => handleToggle('publicProfile')} />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Identity Protection</Label>
                                        <p className="text-xs text-muted-foreground">Hide your full name and display 'Anonymous Hero' on public leaderboards.</p>
                                    </div>
                                    <Switch checked={!privacy.publicProfile} onCheckedChange={() => handleToggle('publicProfile')} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Communication Preferences */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Communication</CardTitle>
                                <CardDescription>Manage how we reach out to you.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { id: 'pushNotifications', label: 'Push Notifications', sub: 'Real-time alerts for accepted donations.', icon: Smartphone },
                                    { id: 'marketingEmails', label: 'Impact Newsletters', sub: 'Monthly reports of your community impact.', icon: BellRing }
                                ].map((item) => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <div className="flex gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center">
                                                <item.icon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <Label className="text-sm font-bold">{item.label}</Label>
                                                <p className="text-xs text-muted-foreground">{item.sub}</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={privacy[item.id as keyof typeof privacy]}
                                            onCheckedChange={() => handleToggle(item.id as keyof typeof privacy)}
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Account Actions */}
                        <div className="pt-8 border-t space-y-4">
                            <h3 className="text-lg font-bold text-destructive">Danger Zone</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Button variant="outline" className="h-16 justify-between px-6 border-red-100 text-red-600 hover:bg-red-50">
                                    <div className="flex flex-col items-start">
                                        <span className="font-bold">Deactivate Account</span>
                                        <span className="text-[10px] opacity-70">Temporarily hide your presence</span>
                                    </div>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" className="h-16 justify-between px-6 border-red-200 bg-red-50 text-red-600 hover:bg-red-100">
                                    <div className="flex flex-col items-start">
                                        <span className="font-bold">Delete Data</span>
                                        <span className="text-[10px] opacity-70">Permanently erase all your history</span>
                                    </div>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6">
                            <Button variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
                            <Button
                                onClick={handleSave}
                                disabled={loading}
                                className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 px-8"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PrivacySettings;
