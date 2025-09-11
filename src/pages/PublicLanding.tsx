import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gallery } from '@/components/ui/gallery';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WeatherWidget } from '@/components/weather/weather-widget';
import { TravelBookingEngine } from '@/components/travel/travel-booking-engine';
import { 
  Plane, 
  Scale, 
  Building, 
  Monitor, 
  MessageSquare, 
  MapPin,
  Shield,
  Star,
  Users,
  Clock
} from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import heroImage from '@/assets/hero-mexico.jpg';

export const PublicLanding: React.FC = () => {
  const { t } = useLanguage();

  const heroGallery = [
    {
      src: heroImage,
      alt: "Mexivanza Platform",
      title: t('hero.mexivanza_title', 'Plataforma Mexivanza AI'),
      description: t('hero.mexivanza_desc', 'Tu gateway a servicios premium mexicanos')
    },
    {
      src: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800",
      alt: "Travel Mexico",
      title: t('hero.travel_title', 'Descubre México'),
      description: t('hero.travel_desc', 'Paquetes de viaje y experiencias premium')
    },
    {
      src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800",
      alt: "Legal Services",
      title: t('hero.legal_title', 'Excelencia Legal'),
      description: t('hero.legal_desc', 'Servicios de consultoría legal profesional')
    }
  ];

  const services = [
    {
      icon: <Plane className="h-8 w-8" />,
      title: t('services.travel', 'Viajes'),
      description: t('services.travel_desc', 'Paquetes premium y experiencias únicas'),
      href: '/travel/categories',
      color: 'text-blue-600',
      stats: '500+ paquetes'
    },
    {
      icon: <Scale className="h-8 w-8" />,
      title: t('services.legal', 'Legal'),
      description: t('services.legal_desc', 'Consulta legal y documentos'),
      href: '/legal',
      color: 'text-green-600',
      stats: 'Consulta gratuita'
    },
    {
      icon: <Building className="h-8 w-8" />,
      title: t('services.real_estate', 'Bienes Raíces'),
      description: t('services.real_estate_desc', 'Propiedades verificadas'),
      href: '/real-estate',
      color: 'text-purple-600',
      stats: '1000+ propiedades'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: t('directory.title', 'Directorio'),
      description: t('directory.subtitle', 'Negocios verificados'),
      href: '/business-directory',
      color: 'text-green-600',
      stats: 'Verificado'
    },
    {
      icon: <Monitor className="h-8 w-8" />,
      title: t('services.web_development', 'Desarrollo Web'),
      description: t('services.web_development_desc', 'Sitios web profesionales'),
      href: '/web-development',
      color: 'text-orange-600',
      stats: 'IA incluida'
    }
  ];

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: t('features.security', 'Seguridad Total'),
      description: t('features.security_desc', 'Encriptación de extremo a extremo')
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: t('features.verified_agents', 'Agentes Verificados'),
      description: t('features.verified_agents_desc', 'Profesionales certificados')
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: t('features.support_24_7', 'Soporte 24/7'),
      description: t('features.support_24_7_desc', 'Asistencia cuando la necesites')
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: t('features.premium_quality', 'Calidad Premium'),
      description: t('features.premium_quality_desc', 'Solo los mejores servicios')
    }
  ];

  const testimonials = [
    {
      name: "María González",
      role: t('testimonials.client', 'Cliente'),
      content: t('testimonials.maria', 'Excelente servicio, me ayudaron con todos mis documentos legales de manera rápida y profesional.'),
      rating: 5
    },
    {
      name: "Carlos Ramírez",
      role: t('testimonials.business_owner', 'Empresario'),
      content: t('testimonials.carlos', 'La plataforma perfecta para encontrar servicios confiables. Muy recomendado.'),
      rating: 5
    },
    {
      name: "Ana López",
      role: t('testimonials.traveler', 'Viajera'),
      content: t('testimonials.ana', 'Planificaron el viaje perfecto a México. Todo fue increíble desde el primer día.'),
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative">
          <Gallery images={heroGallery} cols={3} className="h-[60vh] object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t('hero.main_title', 'Mexivanza AI')}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                {t('hero.main_subtitle', 'Tu plataforma integral para servicios premium en México')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary-hover">
                  <Link to="/auth" className="flex items-center">
                    {t('button.get_started', 'Comenzar Ahora')}
                  </Link>
                </Button>
                <WhatsAppButton
                  message={t('whatsapp.general_inquiry', '¡Hola! Estoy interesado en los servicios de Mexivanza.')}
                  className="bg-[#25D366] hover:bg-[#25D366]/90"
                  size="lg"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  {t('button.contact_whatsapp', 'WhatsApp')}
                </WhatsAppButton>
              </div>
            </div>
          </div>
        </section>

        {/* Weather Widget */}
        <section className="py-6 bg-muted/50">
          <div className="container mx-auto px-4">
            <WeatherWidget />
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('services.our_services', 'Nuestros Servicios')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('services.services_subtitle', 'Conectamos México con soluciones de primera clase')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`${service.color} mb-4`}>
                    {service.icon}
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                  <Badge variant="secondary">{service.stats}</Badge>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={service.href}>
                      {t('button.explore', 'Explorar')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Travel Booking Engine Preview */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <TravelBookingEngine />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('features.why_choose_us', '¿Por qué elegirnos?')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('features.features_subtitle', 'La confianza y calidad que mereces')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary/10 text-primary rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('testimonials.what_clients_say', 'Lo que dicen nuestros clientes')}
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('cta.ready_to_start', '¿Listo para comenzar?')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t('cta.join_thousands', 'Únete a miles de usuarios satisfechos')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/auth">
                  {t('button.create_account', 'Crear Cuenta')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-primary-foreground hover:bg-white hover:text-primary">
                {t('button.learn_more', 'Saber Más')}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};