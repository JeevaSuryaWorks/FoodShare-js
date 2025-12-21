import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Leaf, LogOut, User, Menu, X, ChevronDown } from 'lucide-react';
import NotificationBell from './NotificationBell';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getDashboardLink = () => {
    if (!userData) return '/';
    return userData.role === 'donor' ? '/donor/dashboard' : '/ngo/dashboard';
  };

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={cn(
          "relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      >
        {children}
        {isActive && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-fade-in" />
        )}
      </Link>
    );
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-border/50 shadow-sm"
          : "bg-transparent backdrop-blur-0 border-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">
              FoodShare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/leaderboard">Leaderboard</NavLink>

            {currentUser && userData ? (
              <>
                <NavLink to={getDashboardLink()}>Dashboard</NavLink>
                {userData.role === 'donor' && (
                  <NavLink to="/donor/add-donation">Add Donation</NavLink>
                )}

                <div className="w-px h-6 bg-border mx-2" />

                {/* Notification Bell */}
                <NotificationBell />

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="pl-2 pr-4 ml-2 gap-2 h-10 rounded-full hover:bg-muted/50 border border-transparent hover:border-border/50 transition-all">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                        {userData.photoURL ? (
                          <img src={userData.photoURL} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                        ) : (
                          <User className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex flex-col items-start text-xs">
                        <span className="font-semibold">{userData.displayName?.split(' ')[0]}</span>
                      </div>
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2">
                    <div className="px-2 py-1.5 text-sm font-semibold text-foreground">
                      {userData.displayName}
                    </div>
                    <div className="px-2 pb-2 text-xs text-muted-foreground border-b border-border/50 mb-1">
                      {userData.role === 'donor' ? 'Donor Account' : 'NGO Account'}
                    </div>

                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardLink()} className="cursor-pointer">
                        <Leaf className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link to="/login">
                  <Button variant="ghost" className="rounded-full">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="hero" className="rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border shadow-2xl p-4 animate-fade-up">
            <div className="flex flex-col gap-2">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="p-3 hover:bg-muted rounded-xl transition-colors font-medium">
                Home
              </Link>
              <Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)} className="p-3 hover:bg-muted rounded-xl transition-colors font-medium">
                Leaderboard
              </Link>

              {currentUser && userData ? (
                <>
                  <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} className="p-3 hover:bg-muted rounded-xl transition-colors font-medium">
                    Dashboard
                  </Link>
                  {userData.role === 'donor' && (
                    <Link to="/donor/add-donation" onClick={() => setMobileMenuOpen(false)} className="p-3 hover:bg-muted rounded-xl transition-colors font-medium">
                      Add Donation
                    </Link>
                  )}
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="p-3 hover:bg-muted rounded-xl transition-colors font-medium">
                    My Profile
                  </Link>
                  <div className="h-px bg-border my-2" />
                  <Button variant="destructive" onClick={handleLogout} className="w-full justify-start">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">Sign In</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="hero" className="w-full justify-center">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
