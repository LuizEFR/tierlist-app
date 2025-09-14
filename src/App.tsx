import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layouts/AppLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TierListViewSimple from "./pages/TierListViewSimple";
import ExploreTierLists from "./pages/ExploreTierLists";
import Auth from "./pages/Auth";
import Pricing from "./pages/Pricing";
import Analytics from "./pages/Dashboard/Analytics";
import Categories from "./pages/Dashboard/Categories";
import Parameters from "./pages/Dashboard/Parameters";
import Products from "./pages/Dashboard/Products";
import TierLists from "./pages/Dashboard/TierLists";
import CreateTierList from "./pages/Dashboard/CreateTierList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/explore" element={<ExploreTierLists />} />
            <Route path="/tierlist/:id" element={<TierListViewSimple />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard/analytics" element={<AppLayout><Analytics /></AppLayout>} />
            <Route path="/dashboard/categories" element={<AppLayout><Categories /></AppLayout>} />
            <Route path="/dashboard/parameters" element={<AppLayout><Parameters /></AppLayout>} />
            <Route path="/dashboard/products" element={<AppLayout><Products /></AppLayout>} />
            <Route path="/dashboard/tierlists" element={<AppLayout><TierLists /></AppLayout>} />
            <Route path="/dashboard/tierlists/create" element={<AppLayout><CreateTierList /></AppLayout>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
