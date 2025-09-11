import React, { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import {
  Home,
  MapPin,
  Bed,
  Bath,
  Square,
  DollarSign,
  Heart,
  Share2,
  Filter,
  Search
} from "lucide-react";

interface Property {
  id: string;
  title: string;
  description: string;
  property_type: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  square_meters: number;
  location: string;
  images: string[];
  features: string[];
  status: string;
}

const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Apartment in Roma Norte',
    description: 'Beautiful 2-bedroom apartment in trendy Roma Norte neighborhood',
    property_type: 'Apartment',
    price: 4500000,
    currency: 'MXN',
    bedrooms: 2,
    bathrooms: 2,
    square_meters: 85,
    location: 'Roma Norte, Mexico City',
    images: ['/property-1.jpg'],
    features: ['Balcony', 'Parking', 'Gym', 'Rooftop'],
    status: 'active'
  },
  {
    id: '2', 
    title: 'Beachfront Villa in Cancún',
    description: 'Luxury villa with private beach access',
    property_type: 'Villa',
    price: 15000000,
    currency: 'MXN',
    bedrooms: 4,
    bathrooms: 3,
    square_meters: 250,
    location: 'Zona Hotelera, Cancún',
    images: ['/property-2.jpg'],
    features: ['Beach Access', 'Pool', 'Garden', 'Security'],
    status: 'active'
  }
];

export const PropertyListings: React.FC = () => {
  const { t } = useLanguage();
  const [properties, setProperties] = useState<Property[]>(sampleProperties);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const propertyTypes = ['Apartment', 'House', 'Villa', 'Condo', 'Commercial'];

  const formatPrice = (price: number, currency: string = 'MXN') => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(price);
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || property.property_type === selectedType;
    const matchesPrice = (!priceRange.min || property.price >= parseFloat(priceRange.min)) &&
                        (!priceRange.max || property.price <= parseFloat(priceRange.max));
    
    return matchesSearch && matchesType && matchesPrice;
  });

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{t("realestate.title", "Real Estate")}</h1>
        <p className="text-muted-foreground">
          {t("realestate.subtitle", "Find your perfect property in Mexico")}
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("realestate.search", "Search properties...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="">{t("realestate.all_types", "All Types")}</option>
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <Input
              placeholder={t("realestate.min_price", "Min Price")}
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              type="number"
            />
            
            <Input
              placeholder={t("realestate.max_price", "Max Price")}
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              type="number"
            />
          </div>
        </CardContent>
      </Card>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="hover:shadow-lg transition-shadow group">
            <div className="relative">
              <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                <Home className="w-16 h-16 text-muted-foreground" />
              </div>
              <Badge className="absolute top-2 left-2">
                {property.property_type}
              </Badge>
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {property.title}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.location}
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {property.description}
              </p>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  {property.bedrooms}
                </div>
                <div className="flex items-center">
                  <Bath className="w-4 h-4 mr-1" />
                  {property.bathrooms}
                </div>
                <div className="flex items-center">
                  <Square className="w-4 h-4 mr-1" />
                  {property.square_meters}m²
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {property.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-lg font-bold text-primary">
                  {formatPrice(property.price, property.currency)}
                </div>
                <WhatsAppButton
                  message={t("whatsapp.property_inquiry", `I'm interested in: ${property.title}`)}
                  size="sm"
                >
                  {t("contact.inquire", "Inquire")}
                </WhatsAppButton>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};