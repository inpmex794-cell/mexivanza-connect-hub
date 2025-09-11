import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/hooks/use-language";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* Service Routes */}
                <Route path="/travel" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Travel Services - Coming Soon</h1></div>} />
                <Route path="/legal" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Legal Services - Coming Soon</h1></div>} />
                <Route path="/digital" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Digital Services - Coming Soon</h1></div>} />
                {/* Regional Routes */}
                <Route path="/regions/*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Regional Pages - Coming Soon</h1></div>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
