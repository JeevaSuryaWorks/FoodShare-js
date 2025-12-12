import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Leaf, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">
              FoodShare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {currentUser && userData ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Dashboard
                </Link>
                {userData.role === 'donor' && (
                  <Link
                    to="/donor/add-donation"
                    className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                  >
                    Add Donation
                  </Link>
                )}
                <div className="flex items-center gap-4 pl-4 border-l border-border">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-foreground">{userData.displayName}</p>
                      <p className="text-muted-foreground text-xs capitalize">{userData.role}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="hero">Get Started</Button>
                </Link>
              </>
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
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            {currentUser && userData ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{userData.displayName}</p>
                    <p className="text-muted-foreground text-sm capitalize">{userData.role}</p>
                  </div>
                </div>
                <Link
                  to={getDashboardLink()}
                  className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {userData.role === 'donor' && (
                  <Link
                    to="/donor/add-donation"
                    className="px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Add Donation
                  </Link>
                )}
                <Button variant="ghost" onClick={handleLogout} className="justify-start">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">Login</Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="hero" className="w-full">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
