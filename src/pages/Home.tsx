import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, Heart, Users, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

const Home: React.FC = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (currentUser && userData) {
      navigate(userData.role === 'donor' ? '/donor/dashboard' : '/ngo/dashboard');
    }
  }, [currentUser, userData, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-up">
              <Sparkles className="h-4 w-4" />
              Reducing Food Waste Together
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Share Food,{' '}
              <span className="gradient-text">Share Hope</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Connect surplus food from restaurants, events, and homes with NGOs 
              serving those in need. Together, we can eliminate hunger and reduce waste.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/signup">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Meals Shared', icon: Heart },
              { value: '500+', label: 'Active Donors', icon: Users },
              { value: '100+', label: 'NGO Partners', icon: Leaf },
              { value: '50+', label: 'Cities Covered', icon: MapPin }
            ].map((stat, index) => (
              <div key={index} className="text-center animate-fade-up" style={{ animationDelay: `${0.1 * index}s` }}>
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl md:text-4xl font-display font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              How FoodShare Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A simple process to connect food donors with organizations that can distribute it to those in need.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Donors Post Food',
                description: 'Restaurants, caterers, and individuals list surplus food with details and pickup location.',
                color: 'bg-primary/10 text-primary'
              },
              {
                step: '02',
                title: 'NGOs Accept Donations',
                description: 'Nearby NGOs receive real-time notifications and can accept available donations.',
                color: 'bg-accent/10 text-accent'
              },
              {
                step: '03',
                title: 'Food Gets Distributed',
                description: 'NGOs pick up the food and distribute it to communities and individuals in need.',
                color: 'bg-success/10 text-success'
              }
            ].map((item, index) => (
              <div key={index} className="glass-card rounded-2xl p-8 text-center hover:scale-[1.02] transition-transform duration-300 animate-fade-up" style={{ animationDelay: `${0.1 * index}s` }}>
                <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl ${item.color} text-2xl font-bold mb-6`}>
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Whether you're a restaurant with extra food or an NGO looking to serve your community, 
              join FoodShare today and be part of the solution.
            </p>
            <Link to="/signup">
              <Button variant="hero" size="xl">
                Join FoodShare Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-display font-bold text-background">FoodShare</span>
            </div>
            <p className="text-background/60 text-sm">
              © 2024 FoodShare. Reducing food waste, one meal at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
