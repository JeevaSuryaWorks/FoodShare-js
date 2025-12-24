import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { submitVerificationRequest } from '@/services/verificationService';
import { uploadImage } from '@/services/donationService'; // Reusing image upload
import { toast } from 'sonner';
import { ShieldCheck, Upload, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VerificationRequest: React.FC = () => {
    const { currentUser, userData } = useAuth();
    const navigate = useNavigate();
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [alreadyPending, setAlreadyPending] = useState(false);

    useEffect(() => {
        if (userData?.verificationStatus === 'pending') {
            setAlreadyPending(true);
        } else if (userData?.verificationStatus === 'verified') {
            toast.success("You are already verified!");
            navigate('/profile');
        }
    }, [userData, navigate]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setDocumentFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        if (!documentFile) {
            toast.error("Please upload a supporting document.");
            return;
        }

        setLoading(true);
        try {
            // Upload document (treating it like an image for now, purely for demo/mvp)
            // In a real app, this should go to a "private" bucket or folder
            const docUrl = await uploadImage(documentFile, currentUser.uid);
            console.log("Document uploaded to:", docUrl);

            await submitVerificationRequest(currentUser.uid, docUrl);

            toast.success("Verification request submitted successfully!");
            setAlreadyPending(true);
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit verification request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-12">
            <Navbar />

            <main className="container mx-auto px-4 py-12 max-w-2xl">
                <div className="text-center mb-10 animate-fade-up">
                    <div className="inline-flex items-center justify-center p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4 ring-4 ring-blue-50 dark:ring-blue-900/20">
                        <ShieldCheck className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                        Get Verified
                    </h1>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        Build trust with donors and the community by verifying your organization or identity.
                    </p>
                </div>

                {alreadyPending ? (
                    <div className="glass-card rounded-2xl p-8 text-center animate-fade-up border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20">
                        <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
                        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">Verification Pending</h2>
                        <p className="text-blue-600 dark:text-blue-400 max-w-md mx-auto">
                            Your request is under review. Our team will notify you once the process is complete. This usually takes 24-48 hours.
                        </p>
                        <Button variant="outline" className="mt-6" onClick={() => navigate('/profile')}>
                            Back to Profile
                        </Button>
                    </div>
                ) : (
                    <Card className="border-border/50 shadow-lg animate-fade-up" style={{ animationDelay: '0.1s' }}>
                        <CardHeader>
                            <CardTitle>Verification Request</CardTitle>
                            <CardDescription>
                                Please upload a valid government ID or organization registration document.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="rounded-lg border border-dashed border-muted-foreground/30 p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                                            {documentFile ? <FileText className="h-6 w-6 text-primary" /> : <Upload className="h-6 w-6 text-muted-foreground" />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-foreground">
                                                {documentFile ? documentFile.name : "Click to upload document"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                PDF, JPG or PNG (Max 5MB)
                                            </p>
                                        </div>
                                        <Input
                                            id="file-upload"
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                        />
                                    </div>

                                    <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-4 flex gap-3 text-sm text-yellow-800 dark:text-yellow-400">
                                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                        <p>
                                            By submitting this request, you agree that the information provided is accurate and authentic. False claims may result in account suspension.
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Request"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
};

export default VerificationRequest;
