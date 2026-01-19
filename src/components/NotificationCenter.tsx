import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
    Bell,
    MessageSquare,
    Trash2,
    CheckCircle2,
    Megaphone,
    ShieldCheck,
    ArrowLeft,
    X,
    MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { decryptMessage } from '@/lib/encryption';
import { formatDistanceToNow } from 'date-fns';
import { validateSystemIntegrity } from '@/lib/identity';
import { useNavigate } from 'react-router-dom';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'system' | 'message' | 'broadcast';
    timestamp: string;
    read: boolean;
    isEncrypted?: boolean;
}

const NotificationCenter: React.FC = () => {
    validateSystemIntegrity();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            title: 'Welcome to FeedReach',
            message: 'Thank you for joining our mission to eliminate food waste!',
            type: 'system',
            timestamp: new Date().toISOString(),
            read: false
        },
        {
            id: '2',
            title: 'Global Update',
            message: 'Admin Broadcast: We reached 10,000 shared meals today!',
            type: 'broadcast',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: false
        }
    ]);

    const [decryptedMessages, setDecryptedMessages] = useState<Record<string, string>>({});

    useEffect(() => {
        const handleDecryption = async () => {
            if (!currentUser) return;

            const newDecrypted: Record<string, string> = { ...decryptedMessages };
            let changed = false;

            for (const n of notifications) {
                if (n.isEncrypted && !newDecrypted[n.id]) {
                    const decrypted = await decryptMessage(n.message, currentUser.uid);
                    newDecrypted[n.id] = decrypted;
                    changed = true;
                }
            }

            if (changed) setDecryptedMessages(newDecrypted);
        };

        handleDecryption();
    }, [notifications, currentUser]);

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'system': return <Bell className="h-5 w-5 text-blue-500" />;
            case 'message': return <MessageSquare className="h-5 w-5 text-green-500" />;
            case 'broadcast': return <Megaphone className="h-5 w-5 text-purple-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20 md:pb-8">
            {/* Mobile Header */}
            <div className="md:hidden sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b px-4 h-16 flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <h1 className="text-lg font-bold">Notifications</h1>
                <div className="w-10" /> {/* Spacer */}
            </div>

            <div className="container max-w-2xl mx-auto px-4 py-8">
                {/* Desktop Header */}
                <div className="hidden md:flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Bell className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-display font-bold">Inbox</h1>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={markAllAsRead}>
                            Mark all read
                        </Button>
                        <Button variant="ghost" size="sm" onClick={clearNotifications}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* E2E Banner */}
                <div className="bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl p-4 flex items-center gap-4 mb-6 border border-border/50">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">End-to-End Encrypted</p>
                        <p className="text-xs text-muted-foreground">Your messages are private and secured on this device.</p>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {notifications.length === 0 ? (
                        <div className="text-center py-20 bg-muted/20 border border-dashed rounded-3xl">
                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                                <Bell className="h-8 w-8 text-muted-foreground opacity-20" />
                            </div>
                            <p className="text-muted-foreground">All caught up!</p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`relative group glass-card rounded-2xl p-5 border-l-4 transition-all hover:bg-muted/50 ${n.read ? 'border-l-transparent' : 'border-l-primary bg-primary/5'
                                    }`}
                            >
                                <div className="flex gap-4">
                                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${n.type === 'broadcast' ? 'bg-purple-100 dark:bg-purple-900/30' :
                                            n.type === 'message' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                                                'bg-blue-100 dark:bg-blue-900/30'
                                        }`}>
                                        {getIcon(n.type)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className={`font-bold truncate ${n.read ? 'text-foreground/70' : 'text-foreground'}`}>
                                                {n.title}
                                            </h3>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                                                {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className={`text-sm leading-relaxed mb-3 ${n.read ? 'text-muted-foreground' : 'text-foreground/80'}`}>
                                            {n.isEncrypted ? (decryptedMessages[n.id] || 'Decrypting...') : n.message}
                                        </p>

                                        <div className="flex items-center gap-2">
                                            {!n.read && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-3 text-xs gap-1.5"
                                                    onClick={() => markAsRead(n.id)}
                                                >
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    Mark Read
                                                </Button>
                                            )}
                                            {n.isEncrypted && (
                                                <Badge variant="outline" className="h-5 px-2 text-[10px] gap-1 font-mono uppercase bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-200">
                                                    <ShieldCheck className="h-3 w-3" /> E2E
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="text-destructive gap-2" onClick={() => setNotifications(prev => prev.filter(item => item.id !== n.id))}>
                                                <Trash2 className="h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Mobile Clear All (Floating at bottom for convenience) */}
                {notifications.length > 0 && (
                    <div className="md:hidden fixed bottom-6 right-6 z-40">
                        <Button
                            size="lg"
                            className="rounded-full shadow-xl shadow-primary/20 gap-2"
                            onClick={markAllAsRead}
                        >
                            <CheckCircle2 className="h-5 w-5" />
                            Mark all read
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationCenter;
