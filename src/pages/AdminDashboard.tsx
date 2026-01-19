import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, doc, updateDoc, Timestamp, limit } from 'firebase/firestore';
import { User, Donation, Notification } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldAlert, Users, Activity, Lock, Ban, CheckCircle, Bell, Send, Shield } from 'lucide-react';
import { sendNotification } from '@/services/notificationService';
import AdminVerificationPanel from '@/components/AdminVerificationPanel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';


const AdminDashboard: React.FC = () => {
    const { currentUser, loading: authLoading } = useAuth(); // Destructure loading
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [notificationHistory, setNotificationHistory] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    // Notification State
    const [notifTarget, setNotifTarget] = useState<'broadcast' | 'specific'>('broadcast');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [notifTitle, setNotifTitle] = useState('');
    const [notifMessage, setNotifMessage] = useState('');
    const [notifType, setNotifType] = useState<'info' | 'success' | 'warning' | 'error'>('info');

    // Strict Admin Access Check
    useEffect(() => {
        if (authLoading) return; // Wait for auth to initialize

        // In production, use Custom Claims or a specific role in DB.
        // For this demo as requested: admin@feedreach / JS12345678
        // We check the email.
        const isAdmin = currentUser?.email === 'admin@foodshare.com' || currentUser?.email === 'admin@feedreach.com' || currentUser?.email === 'admin@timechain.com'; // Allowing fallback

        if (!currentUser || !isAdmin) {
            toast.error("Unauthorized Access. Admins only.");
            navigate('/');
        }
    }, [currentUser, authLoading, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) return;
            try {
                // Fetch All Users (for target selection)
                const usersRef = collection(db, 'users');
                // Remove specific role filter to allow messaging ANY user
                const qUsers = query(usersRef, limit(100)); // Limit for safety in demo
                const userSnap = await getDocs(qUsers);
                const userData = userSnap.docs.map(doc => ({ ...doc.data(), uid: doc.id } as User));
                setUsers(userData);

                // Fetch Notification History
                const notifRef = collection(db, 'notifications');
                const qNotifHistory = query(notifRef, orderBy('createdAt', 'desc'), limit(50));
                const notifSnap = await getDocs(qNotifHistory);
                const notifData = notifSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate() } as Notification));
                setNotificationHistory(notifData);

                setLoading(false);
            } catch (error) {
                console.error("Admin fetch error:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [currentUser]);


    const handleUpdateStatus = async (uid: string, status: 'active' | 'suspended' | 'banned') => {
        try {
            let updateData: any = { accountStatus: status };

            if (status === 'suspended') {
                const daysStr = prompt("Enter suspension duration in days:", "1");
                if (daysStr === null) return; // Cancelled
                const days = parseInt(daysStr);
                if (isNaN(days) || days <= 0) {
                    alert("Invalid duration");
                    return;
                }
                const suspendUntil = new Date();
                suspendUntil.setDate(suspendUntil.getDate() + days);
                updateData.suspendedUntil = Timestamp.fromDate(suspendUntil);
            } else if (status === 'active') {
                updateData.suspendedUntil = null; // Clear suspension
                updateData.warningCount = 0; // Optional: Reset warnings on lifting sanction?
            }

            await updateDoc(doc(db, 'users', uid), updateData);
            setUsers(prev => prev.map(u => u.uid === uid ? { ...u, ...updateData } : u));
            toast.success(`User marked as ${status}`);
        } catch (error) {
            console.error("Update status failed", error);
            toast.error("Failed to update user status");
        }
    };

    const handleSendWarning = async (uid: string, count: number) => {
        try {
            await updateDoc(doc(db, 'users', uid), { warningCount: count });
            setUsers(prev => prev.map(u => u.uid === uid ? { ...u, warningCount: count } : u));
            toast.warning(`Warning sent! (Total: ${count})`);
        } catch (error) {
            toast.error("Failed to send warning");
        }
    };

    const handleSendNotification = async () => {
        try {
            const targetId = notifTarget === 'broadcast' ? 'all' : selectedUserId;
            if (!targetId) {
                toast.error("Please select a target user");
                return;
            }

            await sendNotification(targetId, notifTitle, notifMessage, notifType);

            toast.success("Notification Sent!");

            // Optimistic Update
            setNotificationHistory(prev => [{
                id: 'temp-' + Date.now(),
                userId: targetId,
                title: notifTitle,
                message: notifMessage,
                type: notifType,
                read: false,
                createdAt: new Date()
            } as Notification, ...prev]);

            // Reset form
            setNotifTitle('');
            setNotifMessage('');
            setSelectedUserId('');
        } catch (error) {
            console.error("Send notification error:", error);
            toast.error("Failed to send notification");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Admin Panel...</div>;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-display flex items-center gap-2 text-red-600">
                            <ShieldAlert className="h-8 w-8" /> Admin Panel
                        </h1>
                        <p className="text-muted-foreground">Confidential Area. Authorized Personnel Only.</p>
                    </div>
                </div>

                <Tabs defaultValue="complaints" className="w-full">
                    <TabsList className="flex flex-col h-auto w-full sm:grid sm:grid-cols-4 max-w-[800px] mb-8 gap-2 bg-muted/50 p-1">
                        <TabsTrigger value="users" className="w-full">Users</TabsTrigger>
                        <TabsTrigger value="notifications" className="w-full">Notifications</TabsTrigger>
                        <TabsTrigger value="verifications" className="w-full">Verifications</TabsTrigger>
                    </TabsList>

                    <TabsContent value="verifications">
                        <AdminVerificationPanel />
                    </TabsContent>


                    <TabsContent value="users">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-500" />
                                    Community Network Data
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-muted/50 text-muted-foreground font-medium">
                                            <tr>
                                                <th className="p-4">Name / ID</th>
                                                <th className="p-4">Role</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4">IP / Risk</th>
                                                <th className="p-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {users.map(u => (
                                                <tr key={u.uid} className={`hover:bg-muted/10 transition-colors ${u.accountStatus === 'banned' ? 'bg-red-50 dark:bg-red-900/10' : ''}`}>
                                                    <td className="p-4">
                                                        <div className="font-semibold flex items-center gap-2">
                                                            {u.displayName || 'Unknown'}
                                                            {u.warningCount && u.warningCount > 0 && (
                                                                <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">
                                                                    {u.warningCount} Warnings
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-400 font-mono">{u.uid}</div>
                                                    </td>
                                                    <td className="p-4 uppercase text-xs font-bold">
                                                        {u.role}
                                                    </td>
                                                    <td className="p-4">
                                                        <Badge variant={
                                                            u.accountStatus === 'banned' ? 'destructive' :
                                                                u.accountStatus === 'suspended' ? 'secondary' : 'default'
                                                        } className={
                                                            u.accountStatus === 'active' || !u.accountStatus ? 'bg-green-500 hover:bg-green-600' : ''
                                                        }>
                                                            {u.accountStatus || 'active'}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-4 text-xs">
                                                        <div className="font-mono">{u.ipAddress || 'Unknown IP'}</div>
                                                        <div className="text-gray-400 truncate max-w-[150px]" title={u.userAgent}>
                                                            {u.userAgent || '-'}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right space-x-2">
                                                        {u.accountStatus === 'banned' ? (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-green-600 border-green-200 hover:bg-green-50"
                                                                onClick={() => handleUpdateStatus(u.uid, 'active')}
                                                            >
                                                                <CheckCircle className="h-3 w-3 mr-1" /> Unban
                                                            </Button>
                                                        ) : (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                                                    onClick={() => handleSendWarning(u.uid, (u.warningCount || 0) + 1)}
                                                                >
                                                                    <ShieldAlert className="h-3 w-3 mr-1" /> Warn
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                                                    onClick={() => handleUpdateStatus(u.uid, u.accountStatus === 'suspended' ? 'active' : 'suspended')}
                                                                >
                                                                    <Lock className="h-3 w-3 mr-1" /> {u.accountStatus === 'suspended' ? 'Unsuspend' : 'Suspend'}
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                    onClick={() => handleUpdateStatus(u.uid, 'banned')}
                                                                >
                                                                    <Ban className="h-3 w-3 mr-1" /> Ban
                                                                </Button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5 text-purple-500" />
                                    Notification Center
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">Send broadcasts or direct messages.</p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Target Audience</Label>
                                            <RadioGroup defaultValue="broadcast" value={notifTarget} onValueChange={(v) => setNotifTarget(v as any)} className="flex gap-4">
                                                <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 hover:bg-muted/50 transition-colors">
                                                    <RadioGroupItem value="broadcast" id="broadcast" />
                                                    <Label htmlFor="broadcast" className="cursor-pointer">Broadcast (All Users)</Label>
                                                </div>
                                                <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 hover:bg-muted/50 transition-colors">
                                                    <RadioGroupItem value="specific" id="specific" />
                                                    <Label htmlFor="specific" className="cursor-pointer">Specific User</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>

                                        {notifTarget === 'specific' && (
                                            <div className="space-y-2 animate-fade-in-up">
                                                <Label>Select User</Label>
                                                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a user..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {users.map(user => (
                                                            <SelectItem key={user.uid} value={user.uid}>
                                                                {user.displayName || 'Unknown User'} ({user.role || 'user'})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label>Notification Type</Label>
                                            <Select value={notifType} onValueChange={(v: any) => setNotifType(v)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="info">Information (Blue)</SelectItem>
                                                    <SelectItem value="success">Success (Green)</SelectItem>
                                                    <SelectItem value="warning">Warning (Yellow)</SelectItem>
                                                    <SelectItem value="error">Error (Red)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Title</Label>
                                            <Input
                                                placeholder="Notification Title"
                                                value={notifTitle}
                                                onChange={(e) => setNotifTitle(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Message</Label>
                                            <Textarea
                                                placeholder="Type your message here..."
                                                className="min-h-[120px]"
                                                value={notifMessage}
                                                onChange={(e) => setNotifMessage(e.target.value)}
                                            />
                                        </div>
                                        <Button
                                            className="w-full"
                                            onClick={handleSendNotification}
                                            disabled={!notifTitle || !notifMessage || (notifTarget === 'specific' && !selectedUserId)}
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            Send Notification
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-4">Sent History (Last 50)</h3>
                            <Card>
                                <CardContent className="p-0">
                                    <div className="rounded-md border overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-muted/50 text-muted-foreground font-medium">
                                                <tr>
                                                    <th className="p-4">Time</th>
                                                    <th className="p-4">Target</th>
                                                    <th className="p-4">Type</th>
                                                    <th className="p-4">Content</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {notificationHistory.map(notif => (
                                                    <tr key={notif.id} className="hover:bg-muted/10">
                                                        <td className="p-4 whitespace-nowrap text-gray-500">
                                                            {notif.createdAt?.toLocaleString()}
                                                        </td>
                                                        <td className="p-4">
                                                            <Badge variant="outline">
                                                                {notif.userId === 'all' ? 'Broadcast' : 'User: ' + notif.userId.slice(0, 6) + '...'}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-4">
                                                            <Badge className={
                                                                notif.type === 'error' ? 'bg-red-500' :
                                                                    notif.type === 'warning' ? 'bg-yellow-500' :
                                                                        notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                                                            }>
                                                                {notif.type}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="font-medium">{notif.title}</div>
                                                            <div className="text-gray-500 truncate max-w-[300px]">{notif.message}</div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

export default AdminDashboard;
