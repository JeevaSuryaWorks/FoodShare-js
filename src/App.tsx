import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DonorDashboard from "./pages/DonorDashboard";
import NGODashboard from "./pages/NGODashboard";
import AddDonation from "./pages/AddDonation";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";

import { useEffect } from "react";
import { BRANDING } from "@/constants/branding";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    console.info(
      `%c ${BRANDING.FRAMEWORK_NAME} Initialized `,
      'background: #000; color: #fff; padding: 4px; border-radius: 4px; font-weight: bold;'
    );
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/donor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['donor']}>
                    <DonorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/donor/add-donation"
                element={
                  <ProtectedRoute allowedRoles={['donor']}>
                    <AddDonation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ngo/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ngo']}>
                    <NGODashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['donor', 'ngo']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <Leaderboard />
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
