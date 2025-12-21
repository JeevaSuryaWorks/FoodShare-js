import React, { useEffect, useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToNotifications, markAsRead } from '@/services/notificationService';
import { Notification } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const NotificationBell: React.FC = () => {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!currentUser) return;
        const unsubscribe = subscribeToNotifications(currentUser.uid, (data) => {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        });
        return () => unsubscribe();
    }, [currentUser]);

    const handleMarkRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await markAsRead(id);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="p-3 border-b border-border bg-muted/40">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4 relative overflow-hidden group">
                                <Bell className="h-8 w-8 text-muted-foreground/50 group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-primary/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
                            </div>
                            <h3 className="text-sm font-semibold text-foreground mb-1">All Caught Up!</h3>
                            <p className="text-xs text-muted-foreground">You have no new notifications.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`p-4 border-b border-border/50 text-sm hover:bg-muted/50 transition-colors relative group ${!notif.read ? 'bg-primary/5' : ''
                                        }`}
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-1">
                                            <p className="font-medium mb-1">{notif.title}</p>
                                            <p className="text-muted-foreground text-xs mb-2 line-clamp-2">{notif.message}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-muted-foreground/80">
                                                    {formatDistanceToNow(notif.createdAt, { addSuffix: true })}
                                                </span>
                                                {notif.link && (
                                                    <Link to={notif.link} className="text-[10px] text-primary hover:underline">
                                                        View details
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                        {!notif.read && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={(e) => handleMarkRead(notif.id, e)}
                                                title="Mark as read"
                                            >
                                                <Check className="h-3 w-3" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationBell;
