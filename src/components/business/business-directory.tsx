import React, { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { supabase } from "@/integrations/supabase/client";
import {
  Search,
  MapPin,
  Star,
  Clock,
  Shield,
  Phone,
  Globe,
  Filter,
  Building2
} from "lucide-react";

interface Business {
  id: number;
  name: string;
  description: string;
  category: string;
  location: string;
  phone?: string;
  website?: string;
  logo_url?: string;
  rating: number;
  review_count: number;
  verified: boolean;
  verification_status: string;
  payment_enabled: boolean;
  template_enabled: boolean;
  created_at: string;
}

export const BusinessDirectory: React.FC = () => {
  const { t } = useLanguage();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const categories = [
    "Travel",
    "Legal",
    "Digital",
    t("services.realestate", "Real Estate"),
    "Restaurant",
    "Healthcare",
    "Education",
    "Automotive"
  ];

  const locations = [
    "Mexico City",
    "Guadalajara", 
    "Monterrey",
    "Cancún",
    "Tijuana",
    "León",
    "Puebla",
    "Mérida"
  ];

  useEffect(() => {
    fetchBusinesses();
  }, [searchTerm, selectedCategory, selectedLocation]);

  const fetchBusinesses = async () => {
    try {
      let query = supabase
        .from('businesses')
        .select('*')
        .order('rating', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      if (selectedLocation) {
        query = query.eq('location', selectedLocation);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBusinesses(data || []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || business.category === selectedCategory;
    const matchesLocation = !selectedLocation || business.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const getVerificationBadge = (status: string, verified: boolean) => {
    if (verified) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <Shield className="w-3 h-3 mr-1" />
          {t("business.verified", "Verified")}
        </Badge>
      );
    }
    
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            {t("business.pending", "Pending")}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            {t("business.rejected", "Rejected")}
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("loading", "Loading businesses...")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{t("directory.title", "Business Directory")}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t("directory.subtitle", "Discover verified businesses across Mexico offering travel, legal, digital, and more services.")}
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("directory.search", "Search businesses...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="">{t("directory.all_categories", "All Categories")}</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="">{t("directory.all_locations", "All Locations")}</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setSelectedCategory("");
              setSelectedLocation("");
            }}>
              <Filter className="w-4 h-4 mr-2" />
              {t("directory.clear_filters", "Clear Filters")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {t("directory.results_count", `${filteredBusinesses.length} businesses found`)}
        </p>
        <Button variant="outline" size="sm">
          <Building2 className="w-4 h-4 mr-2" />
          {t("directory.add_business", "Add Your Business")}
        </Button>
      </div>

      {/* Business Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses.map((business) => (
          <Card key={business.id} className="hover:shadow-lg transition-shadow group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {business.logo_url ? (
                    <img
                      src={business.logo_url}
                      alt={business.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {business.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {business.category}
                      </Badge>
                      {getVerificationBadge(business.verification_status, business.verified)}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {business.description}
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{business.location}</span>
                </div>
                
                {business.rating > 0 && (
                  <div className="flex items-center space-x-1">
                    <div className="flex">{renderStars(business.rating)}</div>
                    <span>({business.review_count})</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {business.payment_enabled && (
                  <Badge variant="outline" className="text-xs">
                    💳 {t("business.payments", "Payments")}
                  </Badge>
                )}
                {business.template_enabled && (
                  <Badge variant="outline" className="text-xs">
                    🌐 {t("business.website", "Website")}
                  </Badge>
                )}
              </div>
              
              <div className="flex space-x-2">
                <WhatsAppButton
                  message={t("whatsapp.business_inquiry", `Hello! I'm interested in ${business.name}'s services.`)}
                  size="sm"
                  className="flex-1"
                >
                  {t("contact.whatsapp", "WhatsApp")}
                </WhatsAppButton>
                
                {business.website && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(business.website, '_blank')}
                  >
                    <Globe className="w-4 h-4" />
                  </Button>
                )}
                
                {business.phone && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`tel:${business.phone}`, '_self')}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBusinesses.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {t("directory.no_results", "No businesses found")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t("directory.no_results_desc", "Try adjusting your search criteria or browse all businesses.")}
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setSelectedLocation("");
              }}
            >
              {t("directory.view_all", "View All Businesses")}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};