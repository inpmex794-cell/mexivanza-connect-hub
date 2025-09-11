import React from "react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Gallery } from "@/components/ui/gallery";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { 
  Plane, 
  Scale, 
  Monitor, 
  MapPin, 
  Star, 
  Users, 
  Clock,
  Globe,
  Shield,
  Award,
  TrendingUp,
  Heart,
  MessageSquare
} from "lucide-react";
import heroImage from "@/assets/hero-mexico.jpg";

export const Home: React.FC = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Plane,
      title: t("services.travel.title", "Travel Services"),
      description: t("services.travel.description", "Comprehensive travel planning and booking services across Mexico"),
      features: [
        t("services.travel.feature1", "Custom itineraries"),
        t("services.travel.feature2", "Local experiences"),
        t("services.travel.feature3", "24/7 support")
      ],
      whatsappMessage: t("whatsapp.travel", "Travel Inquiry"),
      href: "/travel"
    },
    {
      icon: Scale,
      title: t("services.legal.title", "Legal Services"),
      description: t("services.legal.description", "Professional legal assistance and consultation services"),
      features: [
        t("services.legal.feature1", "Contract review"),
        t("services.legal.feature2", "Business formation"),
        t("services.legal.feature3", "Immigration support")
      ],
      whatsappMessage: t("whatsapp.legal", "Legal Consultation"),
      href: "/legal"
    },
    {
      icon: Monitor,
      title: t("services.digital.title", "Digital Solutions"),
      description: t("services.digital.description", "Modern technology solutions for businesses and individuals"),
      features: [
        t("services.digital.feature1", "Web development"),
        t("services.digital.feature2", "Digital marketing"),
        t("services.digital.feature3", "Tech consulting")
      ],
      whatsappMessage: t("whatsapp.digital", "Digital Consultation"),
      href: "/digital"
    }
  ];

  const feedPosts = [
    {
      id: 1,
      type: "service_update",
      title: t("feed.travel_update", "New Travel Packages Available"),
      content: t("feed.travel_content", "Discover amazing new destinations across Mexico with our curated travel experiences."),
      image: heroImage,
      time: "2h ago",
      likes: 24,
      comments: 8,
      category: "Travel"
    },
    {
      id: 2,
      type: "legal_tip",
      title: t("feed.legal_tip", "Legal Tip: Business Registration"),
      content: t("feed.legal_content", "Essential steps for registering your business in Mexico. Our legal experts guide you through the process."),
      time: "4h ago",
      likes: 18,
      comments: 5,
      category: "Legal"
    },
    {
      id: 3,
      type: "digital_showcase",
      title: t("feed.digital_showcase", "Digital Transformation Success Story"),
      content: t("feed.digital_content", "How we helped a local business increase their online presence by 300% with our digital solutions."),
      time: "1d ago",
      likes: 42,
      comments: 12,
      category: "Digital"
    }
  ];

  const stats = [
    { icon: Users, value: "10,000+", label: t("stats.clients", "Happy Clients") },
    { icon: MapPin, value: "32", label: t("stats.states", "States Covered") },
    { icon: Clock, value: "24/7", label: t("stats.support", "Support Available") },
    { icon: Award, value: "5+", label: t("stats.experience", "Years Experience") }
  ];

  return (
    <div className="flex min-h-screen bg-background pt-16">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Feed */}
      <main className="flex-1 ml-64 mr-80">
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          {/* Hero Post */}
          <Card className="shadow-soft">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={heroImage}
                  alt={t("hero.image.alt", "Mexivanza services across Mexico")}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-lg" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <Badge variant="secondary" className="mb-2">
                    <Globe className="mr-1 h-3 w-3" />
                    {t("hero.badge", "Featured")}
                  </Badge>
                  <h1 className="text-2xl font-bold mb-2">
                    {t("hero.title", "Comprehensive Services for Mexico")}
                  </h1>
                  <p className="text-white/90">
                    {t("hero.subtitle", "Travel, legal services and digital solutions across Mexico")}
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Button size="sm" variant="facebook">
                      {t("hero.cta", "Get Started")}
                    </Button>
                    <WhatsAppButton
                      message={t("whatsapp.general", "Hello! I'm interested in Mexivanza services.")}
                      variant="outline"
                      size="sm"
                    >
                      {t("contact.whatsapp", "WhatsApp")}
                    </WhatsAppButton>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>124</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>28</span>
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full mb-1">
                        <stat.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-lg font-semibold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feed Posts */}
          {feedPosts.map((post) => (
            <Card key={post.id} className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">M</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold">Mexivanza</span>
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{post.time}</span>
                    </div>
                    <h3 className="font-semibold mb-2">{post.title}</h3>
                    <p className="text-muted-foreground mb-4">{post.content}</p>
                    
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <Heart className="mr-2 h-4 w-4" />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          {post.comments}
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm">
                        {t("action.learn_more", "Learn More")}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Services Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t("services.title", "Our Services")}</h2>
            <div className="grid gap-4">
              {services.map((service, index) => (
                <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <service.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{service.title}</h3>
                        <p className="text-muted-foreground mb-3">{service.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {service.features.map((feature, featureIndex) => (
                            <Badge key={featureIndex} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            {t("action.learn_more", "Learn More")}
                          </Button>
                          <WhatsAppButton
                            message={service.whatsappMessage}
                            size="sm"
                            variant="ghost"
                          >
                            {t("contact.inquiry", "Inquiry")}
                          </WhatsAppButton>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <RightSidebar />
    </div>
  );
};