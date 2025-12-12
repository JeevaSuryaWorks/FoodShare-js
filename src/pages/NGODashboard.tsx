import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Donation, DonationStatus } from '@/types';
import {
  subscribeToAvailableDonations,
  subscribeToNGOAcceptedDonations,
  acceptDonation,
  updateDonationStatus
} from '@/services/donationService';
import Navbar from '@/components/Navbar';
import DonationCard from '@/components/DonationCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Package, Clock, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const NGODashboard: React.FC = () => {
  const { currentUser, userData } = useAuth();
  const [availableDonations, setAvailableDonations] = useState<Donation[]>([]);
  const [myDonations, setMyDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    if (!currentUser) return;

    const unsubAvailable = subscribeToAvailableDonations((donations) => {
      setAvailableDonations(donations);
      setLoading(false);
    });

    const unsubMy = subscribeToNGOAcceptedDonations(currentUser.uid, (donations) => {
      setMyDonations(donations);
    });

    return () => {
      unsubAvailable();
      unsubMy();
    };
  }, [currentUser]);

  const handleAccept = async (donation: Donation) => {
    if (!currentUser || !userData) return;

    try {
      await acceptDonation(
        donation.id,
        currentUser.uid,
        userData.organizationName || userData.displayName
      );
      toast({
        title: 'Donation accepted!',
        description: 'Navigate to the pickup location to collect the food.',
      });
      setActiveTab('my-pickups');
    } catch (err) {
      console.error('Accept error:', err);
      toast({
        title: 'Error',
        description: 'Failed to accept donation.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStatus = async (donationId: string, status: DonationStatus) => {
    try {
      await updateDonationStatus(donationId, status);
      toast({
        title: 'Status updated',
        description: `Donation marked as ${status}.`,
      });
    } catch (err) {
      console.error('Update status error:', err);
      toast({
        title: 'Error',
        description: 'Failed to update status.',
        variant: 'destructive',
      });
    }
  };

  const stats = {
    available: availableDonations.length,
    myPending: myDonations.filter(d => d.status === 'accepted').length,
    completed: myDonations.filter(d => d.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-1">
            Welcome, {userData?.organizationName || userData?.displayName}!
          </h1>
          <p className="text-muted-foreground">Find and manage food donations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Available</p>
                <p className="text-2xl font-bold text-foreground">{stats.available}</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">To Pickup</p>
                <p className="text-2xl font-bold text-foreground">{stats.myPending}</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Completed</p>
                <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="available" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Available ({stats.available})
            </TabsTrigger>
            <TabsTrigger value="my-pickups" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              My Pickups ({myDonations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading available donations...</p>
              </div>
            ) : availableDonations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                  <Package className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">No donations available</h2>
                <p className="text-muted-foreground max-w-md">
                  Check back later for new food donations in your area.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableDonations.map((donation) => (
                  <DonationCard
                    key={donation.id}
                    donation={donation}
                    userRole="ngo"
                    onAccept={handleAccept}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-pickups">
            {myDonations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                  <Clock className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">No pickups yet</h2>
                <p className="text-muted-foreground max-w-md">
                  Accept available donations to see them here.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myDonations.map((donation) => (
                  <DonationCard
                    key={donation.id}
                    donation={donation}
                    userRole="ngo"
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default NGODashboard;
