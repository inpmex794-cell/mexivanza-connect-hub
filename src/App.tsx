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
import { BusinessDirectory } from "./components/business/business-directory";
import { WebsiteTemplates } from "./components/business/website-templates";
import { PaymentSystem } from "./components/payments/payment-system";
import { PostAd } from "./components/ads/post-ad";
import { VideoStreaming } from "./components/media/video-streaming";
import { PropertyListings } from "./components/real-estate/property-listings";
import { WeatherWidget } from "./components/weather/weather-widget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/directory" element={<BusinessDirectory />} />
                <Route path="/templates" element={<WebsiteTemplates />} />
                <Route path="/payments" element={<PaymentSystem />} />
                <Route path="/ads" element={<PostAd />} />
                <Route path="/videos" element={<VideoStreaming />} />
                <Route path="/real-estate" element={<PropertyListings />} />
                <Route path="/weather" element={<WeatherWidget />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
