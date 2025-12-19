import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AuthProvider } from "@/contexts/AuthContext";
import { SignInModalProvider } from "@/contexts/SignInModalContext";
import { PendingActionsHandler } from "@/components/PendingActionsHandler";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import BrowseByLocation from "./pages/BrowseByLocation";
import BrowseByIndustry from "./pages/BrowseByIndustry";
import BrandDetail from "./pages/BrandDetail";
import IndustryDetail from "./pages/IndustryDetail";
import StateDetail from "./pages/StateDetail";
import Compare from "./pages/Compare";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import OwnershipPath from "./pages/OwnershipPath";
import Academy from "./pages/Academy";
import About from "./pages/About";
import Advisors from "./pages/Advisors";
import Profile from "./pages/Profile";
import Saved from "./pages/Saved";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SignInModalProvider>
          <PendingActionsHandler />
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <ScrollToTop />
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/best-franchises" element={<Browse />} />
          <Route path="/best-franchises/in" element={<BrowseByLocation />} />
          <Route path="/best-franchises/in/:stateName" element={<StateDetail />} />
          <Route path="/best-franchises/for" element={<BrowseByIndustry />} />
          <Route path="/best-franchises/for/:categorySlug" element={<IndustryDetail />} />
          <Route path="/best-franchises/brand/:slug" element={<BrandDetail />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/ownership-path" element={<OwnershipPath />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/advisors" element={<Advisors />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </SignInModalProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
