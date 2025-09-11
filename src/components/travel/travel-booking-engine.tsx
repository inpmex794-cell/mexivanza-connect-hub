import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plane, 
  Hotel, 
  Shield, 
  Anchor, 
  Home, 
  MapPin, 
  Car, 
  Users,
  Calendar,
  Clock,
  Star
} from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface BookingCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  featured: boolean;
  price_range: string;
  availability: number;
}

export const TravelBookingEngine: React.FC = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('flights');

  const categories: BookingCategory[] = [
    {
      id: 'flights',
      name: t('travel.flights', 'Vuelos'),
      icon: <Plane className="h-5 w-5" />,
      description: t('travel.flights_desc', 'Vuelos nacionales e internacionales'),
      featured: true,
      price_range: '$150 - $800',
      availability: 245
    },
    {
      id: 'hotels',
      name: t('travel.hotels', 'Hoteles'),
      icon: <Hotel className="h-5 w-5" />,
      description: t('travel.hotels_desc', 'Hoteles boutique y resorts de lujo'),
      featured: true,
      price_range: '$80 - $500',
      availability: 156
    },
    {
      id: 'insurance',
      name: t('travel.insurance', 'Seguros'),
      icon: <Shield className="h-5 w-5" />,
      description: t('travel.insurance_desc', 'Protección completa de viaje'),
      featured: false,
      price_range: '$25 - $150',
      availability: 89
    },
    {
      id: 'cruises',
      name: t('travel.cruises', 'Cruceros'),
      icon: <Anchor className="h-5 w-5" />,
      description: t('travel.cruises_desc', 'Experiencias marítimas premium'),
      featured: true,
      price_range: '$300 - $2000',
      availability: 34
    },
    {
      id: 'airbnb',
      name: t('travel.airbnb', 'Airbnb'),
      icon: <Home className="h-5 w-5" />,
      description: t('travel.airbnb_desc', 'Alojamientos únicos y locales'),
      featured: false,
      price_range: '$40 - $300',
      availability: 789
    },
    {
      id: 'guides',
      name: t('travel.guides', 'Guías Turísticos'),
      icon: <MapPin className="h-5 w-5" />,
      description: t('travel.guides_desc', 'Expertos locales certificados'),
      featured: false,
      price_range: '$50 - $200',
      availability: 67
    },
    {
      id: 'charters',
      name: t('travel.charters', 'Charters'),
      icon: <Users className="h-5 w-5" />,
      description: t('travel.charters_desc', 'Transporte privado y grupal'),
      featured: false,
      price_range: '$200 - $1500',
      availability: 23
    },
    {
      id: 'car_rentals',
      name: t('travel.car_rentals', 'Renta de Autos'),
      icon: <Car className="h-5 w-5" />,
      description: t('travel.car_rentals_desc', 'Vehículos para todos los presupuestos'),
      featured: false,
      price_range: '$30 - $150',
      availability: 134
    }
  ];

  const featuredCategories = categories.filter(cat => cat.featured);
  const allCategories = categories;

  const renderCategoryCard = (category: BookingCategory) => (
    <Card 
      key={category.id} 
      className={`cursor-pointer transition-all hover:shadow-md ${
        selectedCategory === category.id ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => setSelectedCategory(category.id)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {category.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </div>
          </div>
          {category.featured && (
            <Badge variant="secondary">
              <Star className="h-3 w-3 mr-1" />
              {t('travel.featured', 'Destacado')}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t('travel.price_range', 'Rango de precios')}
            </span>
            <span className="font-medium">{category.price_range}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t('travel.availability', 'Disponibles')}
            </span>
            <span className="font-medium">{category.availability} opciones</span>
          </div>
        </div>
        <Button className="w-full mt-4" size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          {t('button.book_now', 'Reservar Ahora')}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {t('travel.booking_engine', 'Motor de Reservas de Viaje')}
        </h2>
        <p className="text-muted-foreground">
          {t('travel.booking_subtitle', 'Todo lo que necesitas para tu próximo viaje en un solo lugar')}
        </p>
      </div>

      <Tabs defaultValue="featured" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="featured">
            <Star className="h-4 w-4 mr-2" />
            {t('travel.featured_services', 'Servicios Destacados')}
          </TabsTrigger>
          <TabsTrigger value="all">
            <Users className="h-4 w-4 mr-2" />
            {t('travel.all_services', 'Todos los Servicios')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {featuredCategories.map(renderCategoryCard)}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allCategories.map(renderCategoryCard)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">1,500+</div>
            <div className="text-sm text-muted-foreground">
              {t('travel.stats.total_options', 'Opciones totales')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted-foreground">
              {t('travel.stats.support', 'Soporte')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">98%</div>
            <div className="text-sm text-muted-foreground">
              {t('travel.stats.satisfaction', 'Satisfacción')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">50+</div>
            <div className="text-sm text-muted-foreground">
              {t('travel.stats.destinations', 'Destinos')}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};