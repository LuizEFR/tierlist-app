import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layouts/AppLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TierListView from "./pages/TierListView";
import ExploreTierLists from "./pages/ExploreTierLists";
import Auth from "./pages/Auth";
import Pricing from "./pages/Pricing";

// Lazy load dashboard components
const Analytics = React.lazy(() => import("./pages/Dashboard/Analytics"));
const Categories = React.lazy(() => import("./pages/Dashboard/Categories"));
const Parameters = React.lazy(() => import("./pages/Dashboard/Parameters"));
const Products = React.lazy(() => import("./pages/Dashboard/Products"));
const TierLists = React.lazy(() => import("./pages/Dashboard/TierLists"));
const CreateTierList = React.lazy(() => import("./pages/Dashboard/CreateTierList"));

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
            <Route path="/tierlist/:id" element={<TierListView />} />
            
            {/* Dashboard Routes with Lazy Loading */}
            <Route
              path="/dashboard/*"
              element={
                <Suspense fallback={<div>Carregando...</div>}>
                  <AppLayout>
                    <Routes>
                      <Route path="analytics" element={<Analytics />} />
                      <Route path="categories" element={<Categories />} />
                      <Route path="parameters" element={<Parameters />} />
                      <Route path="products" element={<Products />} />
                      <Route path="tierlists" element={<TierLists />} />
                      <Route path="tierlists/create" element={<CreateTierList />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AppLayout>
                </Suspense>
              }
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

