import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Lock, Unlock, Monitor, Globe } from 'lucide-react';
import { toast } from 'sonner';

const Gate: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to current state
    const unsub = onSnapshot(doc(db, 'system_config', 'gate'), (doc) => {
      if (doc.exists()) {
        setEnabled(doc.data().enabled || false);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleToggle = async (checked: boolean) => {
    try {
      const gateRef = doc(db, 'system_config', 'gate');
      const gateDoc = await getDoc(gateRef);

      if (!gateDoc.exists()) {
        await setDoc(gateRef, { enabled: checked, updatedAt: new Date() });
      } else {
        await updateDoc(gateRef, { enabled: checked, updatedAt: new Date() });
      }
      
      toast.success(`Gate ${checked ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error updating gate status:', error);
      toast.error('Failed to update gate status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Gate Control
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage global application access state.
          </p>
        </div>

        <Card className="border-2 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className={`h-2 w-full transition-colors duration-500 ${enabled ? 'bg-destructive' : 'bg-green-500'}`} />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <div className="space-y-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                {enabled ? <Lock className="text-destructive h-6 w-6" /> : <Unlock className="text-green-500 h-6 w-6" />}
                Global Gate Status
              </CardTitle>
              <CardDescription className="text-base">
                Manage the global lock state for all users across the platform.
              </CardDescription>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={handleToggle}
              className="scale-125"
            />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/50 border flex flex-col items-center text-center space-y-2">
                <Monitor className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">All Devices</h3>
                <p className="text-xs text-muted-foreground">Applies to desktops, tablets, and phones simultaneously.</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border flex flex-col items-center text-center space-y-2">
                <Globe className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">Real-time Sync</h3>
                <p className="text-xs text-muted-foreground">Changes reflect instantly for all active users worldwide.</p>
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 transition-all duration-300 ${enabled ? 'bg-destructive/10 border-destructive/20 text-destructive' : 'bg-green-50 border-green-200 text-green-700'}`}>
              <p className="text-sm font-medium flex items-center gap-2 justify-center">
                {enabled ? (
                  <>The application is currently LOCKED globally.</>
                ) : (
                  <>The application is currently ACCESSIBLE globally.</>
                )}
              </p>
            </div>
            
            <p className="text-xs text-center text-muted-foreground">
              When it turned off, don't show the Gate anywhere, any time.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Gate;
