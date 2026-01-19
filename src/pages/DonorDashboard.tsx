import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Donation } from '@/types';
import { subscribeToDonorDonations, deleteDonation } from '@/services/donationService';
import Navbar from '@/components/Navbar';
import DonationCard from '@/components/DonationCard';
import { Button } from '@/components/ui/button';
import { Plus, Package, Loader2, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import SocialShare from '@/components/SocialShare';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DigitalCertificate from '@/components/DigitalCertificate';
import { Award, Star, Trophy, ShieldCheck, FileText } from 'lucide-react';
import CSRReportModal from '@/components/CSRReportModal';

const DonorDashboard: React.FC = () => {
  const { currentUser, userData } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToDonorDonations(
      currentUser.uid,
      (fetchedDonations) => {
        setDonations(fetchedDonations);
        setLoading(false);
      },
      (err) => {
        console.error("Subscription error:", err);
        setError("Failed to load donations. " + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleDelete = async (donationId: string) => {
    if (!confirm('Are you sure you want to delete this donation?')) return;

    try {
      await deleteDonation(donationId);
      toast({
        title: 'Donation deleted',
        description: 'Your donation has been removed.',
      });
    } catch (err) {
      console.error('Delete error:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete donation.',
        variant: 'destructive',
      });
    }
  };

  const stats = {
    total: donations.length,
    pending: donations.filter(d => d.status === 'pending').length,
    accepted: donations.filter(d => d.status === 'accepted').length,
    completed: donations.filter(d => d.status === 'completed').length,
  };

  const milestones = [
    { threshold: 1, title: 'First Contribution', type: 'bronze' as const, milestone: 'First Shared Meal' },
    { threshold: 5, title: 'Community Supporter', type: 'silver' as const, milestone: '5+ Shared Meals' },
    { threshold: 10, title: 'Hunger Warrior', type: 'gold' as const, milestone: '10+ Shared Meals' },
    { threshold: 25, title: 'Elite Philanthropist', type: 'platinum' as const, milestone: '25+ Shared Meals' },
  ];

  const earnedMilestones = milestones.filter(m => stats.completed >= m.threshold);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-1">
              {greeting}, {userData?.displayName}!
            </h1>
            <p className="text-muted-foreground">Manage your food donations</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CSRReportModal
              donations={donations}
              userData={userData}
              trigger={
                <Button variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Impact Report
                </Button>
              }
            />
            <SocialShare
              title="My Impact on FeedReach"
              text={`I'm proud to have shared ${stats.total} meals on FeedReach! Join me in reducing food waste.`}
              url={window.location.origin}
              variant="outline"
            />
            <Link to="/donor/add-donation">
              <Button variant="hero">
                <Plus className="h-4 w-4" />
                Add Donation
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Donations', value: stats.total, color: 'bg-primary/10 text-primary' },
            { label: 'Pending', value: stats.pending, color: 'status-pending' },
            { label: 'Accepted', value: stats.accepted, color: 'status-accepted' },
            { label: 'Completed', value: stats.completed, color: 'status-completed' },
          ].map((stat, index) => (
            <div key={index} className="glass-card rounded-xl p-5 hover:scale-105 transition-transform duration-300">
              <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
              <div className={`text-3xl font-bold ${stat.color.split(' ')[1] || 'text-foreground'}`}>
                {loading ? <Skeleton className="h-8 w-12" /> : stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-xl p-6 space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-40 w-full rounded-lg" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : donations.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No donations yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start sharing your surplus food with NGOs in your area. Every donation makes a difference!
            </p>
            <Link to="/donor/add-donation">
              <Button variant="hero">
                <Plus className="h-4 w-4" />
                Create Your First Donation
              </Button>
            </Link>
          </div>
        ) : (
          <Tabs defaultValue="donations" className="space-y-8">
            <TabsList className="bg-muted/40 p-1 rounded-xl">
              <TabsTrigger value="donations" className="rounded-lg px-6">My Donations</TabsTrigger>
              <TabsTrigger value="achievements" className="rounded-lg px-6 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Achievements
                {earnedMilestones.length > 0 && (
                  <span className="ml-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full">
                    {earnedMilestones.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="donations" className="animate-fade-in outline-none">
              {/* Donations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donations.map((donation) => (
                  <DonationCard
                    key={donation.id}
                    donation={donation}
                    userRole="donor"
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="animate-fade-in outline-none">
              <div className="space-y-12">
                <div className="text-center max-w-2xl mx-auto">
                  <h2 className="text-2xl font-bold mb-2">Your Impact Recognition</h2>
                  <p className="text-muted-foreground italic">
                    "The best way to find yourself is to lose yourself in the service of others." — Mahatma Gandhi
                  </p>
                </div>

                {earnedMilestones.length === 0 ? (
                  <div className="text-center py-20 bg-muted/20 border border-dashed rounded-3xl">
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                      <Trophy className="h-10 w-10 text-muted-foreground opacity-30" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Certificates Yet</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      Complete your first food donation to earn your first Digital Certificate of Appreciation.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-12">
                    {earnedMilestones.reverse().map((m, idx) => (
                      <div key={idx} className="animate-fade-up" style={{ animationDelay: `${idx * 0.2}s` }}>
                        <DigitalCertificate
                          userName={userData?.displayName || 'Supporter'}
                          milestone={m.milestone}
                          date={new Date().toLocaleDateString()}
                          type={m.type}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default DonorDashboard;
