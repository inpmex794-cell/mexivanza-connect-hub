import React, { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Gallery } from "@/components/ui/gallery";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { Header } from "@/components/layout/header";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { AdminButton, EditButton } from "@/components/ui/admin-button";
import { VideoStreamingModule } from "@/components/modules/video-streaming";
import { GamingHubModule } from "@/components/modules/gaming-hub";
import { FinancialDashboardModule } from "@/components/modules/financial-dashboard";
import { VerifiedAgentsModule } from "@/components/modules/verified-agents-demo";
import { 
  Home as HomeIcon,
  User,
  Settings,
  LogOut,
  Plus,
  Heart,
  MessageSquare,
  Share,
  Clock,
  MapPin,
  Sun,
  CloudRain,
  Users,
  Building,
  Briefcase,
  Scale,
  Plane,
  Monitor,
  UserPlus,
  LogIn,
  Shield,
  Languages,
  Edit3,
  Save,
  X,
  Video,
  Gamepad2,
  BarChart3
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import heroImage from "@/assets/hero-mexico.jpg";

export const Home: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "News" });
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingContent, setEditingContent] = useState<{[key: string]: boolean}>({});
  const [editValues, setEditValues] = useState<{[key: string]: string}>({});

  const categories = [
    "News", "Fitness", "Cooking", "Travel", "Legal", "Real Estate", 
    "Business", "Web Development", "Events", "Ads"
  ];

  // Auto-redirect admin users to dashboard
  useEffect(() => {
    if (user?.email === 'mexivanza@mexivanza.com' && isAdmin) {
      navigate('/admin-dashboard');
    }
  }, [user, isAdmin, navigate]);

  // Sample gallery images for hero section
  const heroGallery = [
    {
      src: heroImage,
      alt: "Mexivanza Platform Hero",
      title: "Mexivanza AI Master Platform",
      description: "Your gateway to premium Mexican services"
    },
    {
      src: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800",
      alt: "Travel Mexico",
      title: "Discover Mexico",
      description: "Premium travel packages and experiences"
    },
    {
      src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800", 
      alt: "Legal Services",
      title: "Legal Excellence",
      description: "Professional legal consultation services"
    }
  ];

  // Fetch posts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('user_posts')
        .select(`
          *,
          profiles (name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Inline editing functions
  const startEditing = (key: string, currentValue: string) => {
    setEditingContent(prev => ({ ...prev, [key]: true }));
    setEditValues(prev => ({ ...prev, [key]: currentValue }));
  };

  const saveEdit = async (key: string) => {
    // Here you would typically save to database
    console.log(`Saving ${key}:`, editValues[key]);
    setEditingContent(prev => ({ ...prev, [key]: false }));
    toast.success("Contenido actualizado");
  };

  const cancelEdit = (key: string) => {
    setEditingContent(prev => ({ ...prev, [key]: false }));
    setEditValues(prev => ({ ...prev, [key]: "" }));
  };

  const EditableContent: React.FC<{
    contentKey: string;
    defaultValue: string;
    className?: string;
    multiline?: boolean;
  }> = ({ contentKey, defaultValue, className, multiline = false }) => {
    const isEditing = editingContent[contentKey];
    const currentValue = editValues[contentKey] || defaultValue;

    if (!isAdmin) {
      return <span className={className}>{defaultValue}</span>;
    }

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          {multiline ? (
            <Textarea
              value={currentValue}
              onChange={(e) => setEditValues(prev => ({ ...prev, [contentKey]: e.target.value }))}
              className="flex-1"
              rows={2}
            />
          ) : (
            <Input
              value={currentValue}
              onChange={(e) => setEditValues(prev => ({ ...prev, [contentKey]: e.target.value }))}
              className="flex-1"
            />
          )}
          <Button size="sm" onClick={() => saveEdit(contentKey)}>
            <Save className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => cancelEdit(contentKey)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    return (
      <div className="group flex items-center gap-2">
        <span className={className}>{defaultValue}</span>
        <Button
          size="sm"
          variant="ghost"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => startEditing(contentKey, defaultValue)}
        >
          <Edit3 className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  const handleCreatePost = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión para crear posts");
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error("Por favor completa el título y contenido");
      return;
    }

    try {
      const { error } = await supabase
        .from('user_posts')
        .insert([{
          user_id: user.id,
          title: newPost.title,
          content: newPost.content,
          category: newPost.category,
          scenario_tags: [newPost.category],
          language: language
        }]);

      if (error) throw error;

      toast.success("Post creado exitosamente");
      setNewPost({ title: "", content: "", category: "News" });
      setShowPostForm(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error("Error al crear el post");
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Sesión cerrada exitosamente");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Use the proper Header component with language toggle */}
      <Header />

      {/* Main Layout - Three Column Structure */}
      <div className="pt-16 min-h-screen bg-muted/30">
        <div className="max-w-7xl mx-auto flex">
          {/* Left Sidebar - Fixed Navigation */}
          <aside className="w-64 bg-card border-r border-border fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto shadow-sm">
            <div className="p-4">
              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start bg-primary/10 text-primary font-medium rounded-lg">
                  <HomeIcon className="mr-3 h-5 w-5" />
                  Inicio
                </Button>
                
                {user && (
                  <>
                    <Button asChild variant="ghost" className="w-full justify-start hover:bg-accent rounded-lg">
                      <Link to="/dashboard">
                        <User className="mr-3 h-5 w-5" />
                        Mi Dashboard
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start hover:bg-accent rounded-lg">
                      <Settings className="mr-3 h-5 w-5" />
                      Configuración
                    </Button>
                  </>
                )}
              </nav>

              {/* Services Section */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-3">
                  Servicios Premium
                </h3>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start text-sm hover:bg-accent rounded-lg p-3">
                    <Plane className="mr-3 h-4 w-4 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">Viajes</div>
                      <div className="text-xs text-muted-foreground">Paquetes premium</div>
                    </div>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm hover:bg-accent rounded-lg p-3">
                    <Scale className="mr-3 h-4 w-4 text-success" />
                    <div className="text-left">
                      <div className="font-medium">Legal</div>
                      <div className="text-xs text-muted-foreground">Consulta gratuita</div>
                    </div>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm hover:bg-accent rounded-lg p-3">
                    <Building className="mr-3 h-4 w-4 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">Inmobiliaria</div>
                      <div className="text-xs text-muted-foreground">+500 propiedades</div>
                    </div>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm hover:bg-accent rounded-lg p-3">
                    <Monitor className="mr-3 h-4 w-4 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">Desarrollo Web</div>
                      <div className="text-xs text-muted-foreground">Soluciones digitales</div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Center Feed - Main Content */}
          <main className="flex-1 min-h-screen bg-background ml-64 mr-80">
            <div className="max-w-2xl mx-auto p-6 space-y-6">
              {/* Create Post Card */}
              {user && (
                <Card className="shadow-sm border-border bg-card hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  {!showPostForm ? (
                    <Button 
                      onClick={() => setShowPostForm(true)}
                      variant="outline" 
                      className="w-full justify-start h-12 text-muted-foreground hover:text-foreground hover:bg-accent border-dashed"
                    >
                      <Plus className="mr-3 h-5 w-5" />
                      <span className="text-base">¿Qué quieres compartir hoy?</span>
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <Input
                        placeholder="Título del post..."
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        className="text-base font-medium"
                      />
                      <Textarea
                        placeholder="Comparte tu experiencia..."
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        rows={4}
                        className="resize-none"
                      />
                      <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex justify-between items-center pt-2">
                        <Button 
                          onClick={() => setShowPostForm(false)} 
                          variant="ghost" 
                          size="sm"
                        >
                          Cancelar
                        </Button>
                        <Button onClick={handleCreatePost} size="sm" className="bg-primary hover:bg-primary-hover text-primary-foreground px-6">
                          Publicar
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              )}

              {/* Hero Gallery Section */}
              <Card className="shadow-sm border-border bg-card hover:shadow-md transition-all duration-200 overflow-hidden">
                <CardContent className="p-0">
                  <Gallery images={heroGallery} cols={3} className="mb-0" />
                  <div className="p-6">
                    <div className="text-center space-y-4">
                      <EditableContent 
                        contentKey="hero-title"
                        defaultValue="Plataforma Integral Mexivanza"
                        className="text-3xl font-bold text-foreground block"
                      />
                      <EditableContent 
                        contentKey="hero-description"
                        defaultValue="Servicios profesionales de viaje, legal, desarrollo web y bienes raíces. Conectando México con soluciones de primera clase."
                        className="text-muted-foreground text-lg leading-relaxed block"
                        multiline
                      />
                      <div className="flex justify-center gap-4 pt-4">
                        <WhatsAppButton
                          message={t("whatsapp.general_inquiry", "¡Hola! Estoy interesado en los servicios de Mexivanza.")}
                          className="bg-[#25D366] hover:bg-[#25D366]/90 text-white px-6 py-3"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Contactar WhatsApp
                        </WhatsAppButton>
                        <Button variant="outline" className="px-6 py-3">
                          Ver Servicios
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                      <div className="flex items-center space-x-6">
                        <Button size="sm" variant="ghost" className="hover:bg-accent">
                          <Heart className="mr-2 h-4 w-4" />
                          124
                        </Button>
                        <Button size="sm" variant="ghost" className="hover:bg-accent">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          28
                        </Button>
                        <Button size="sm" variant="ghost" className="hover:bg-accent">
                          <Share className="mr-2 h-4 w-4" />
                          Compartir
                        </Button>
                      </div>
                      <Badge className="bg-primary text-primary-foreground px-3 py-1">
                        Destacado
                      </Badge>
                    </div>
                  </div>
                </CardContent>
               </Card>

              {/* Module Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="shadow-sm border-border bg-card hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Video className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Video Streaming</h3>
                        <p className="text-sm text-muted-foreground">Upload and share videos</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Open Video Hub
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-border bg-card hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Gamepad2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Gaming Hub</h3>
                        <p className="text-sm text-muted-foreground">Discover amazing games</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Explore Games
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-border bg-card hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <BarChart3 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Stock Market</h3>
                        <p className="text-sm text-muted-foreground">Financial market data</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Market
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-border bg-card hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Verified Agents</h3>
                        <p className="text-sm text-muted-foreground">Connect with professionals</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Find Agents
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Module Components */}
              <div id="video-streaming">
                <VideoStreamingModule />
              </div>
              <div id="gaming-hub">
                <GamingHubModule />
              </div>
              <div id="financial-dashboard">
                <FinancialDashboardModule />
              </div>
              <div id="verified-agents">
                <VerifiedAgentsModule />
              </div>

              {/* Posts Feed */}
              {posts.map((post) => (
                <Card key={post.id} className="shadow-sm border-border bg-card hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={post.profiles?.avatar_url} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {post.profiles?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="font-semibold text-foreground text-base">
                            {post.profiles?.name || 'Usuario'}
                          </span>
                          {post.category && (
                            <Badge variant="secondary" className="text-xs px-2 py-1">
                              {post.category}
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Clock className="inline h-3 w-3 mr-1" />
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-semibold mb-3 text-foreground text-lg">{post.title}</h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">{post.content}</p>
                        
                        <div className="flex items-center space-x-6 pt-4 border-t border-border">
                          <Button variant="ghost" size="sm" className="hover:bg-accent hover:text-primary">
                            <Heart className="mr-2 h-4 w-4" />
                            Me gusta
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-accent hover:text-primary">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Comentar
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-accent hover:text-primary">
                            <Share className="mr-2 h-4 w-4" />
                            Compartir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>

          {/* Right Sidebar - Fixed Contextual Modules */}
          <div className="w-80 fixed right-0 top-16 h-[calc(100vh-4rem)] bg-card border-l border-border shadow-sm overflow-y-auto">
            <RightSidebar />
          </div>
        </div>
      </div>

      {/* SEO Meta Tags */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Mexivanza",
          "description": "Plataforma integral de servicios profesionales en México",
          "url": "https://mexivanza.com",
          "logo": "https://mexivanza.com/logo.png",
          "sameAs": [
            "https://wa.me/525555555555"
          ],
          "serviceArea": {
            "@type": "Country",
            "name": "Mexico"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Servicios Mexivanza",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Paquetes de Viaje",
                  "description": "Experiencias de viaje personalizadas en México"
                }
              },
              {
                "@type": "Offer", 
                "itemOffered": {
                  "@type": "Service",
                  "name": "Servicios Legales",
                  "description": "Consultoría legal profesional"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service", 
                  "name": "Desarrollo Web",
                  "description": "Soluciones digitales empresariales"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Bienes Raíces", 
                  "description": "Propiedades premium en México"
                }
              }
            ]
          }
        })}
      </script>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">M</span>
                </div>
                <EditableContent 
                  contentKey="footer-brand"
                  defaultValue="Mexivanza"
                  className="font-bold text-foreground"
                />
              </div>
              <EditableContent 
                contentKey="footer-description"
                defaultValue="Plataforma integral de servicios para México"
                className="text-sm text-muted-foreground"
                multiline
              />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Servicios</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Viajes</li>
                <li>Legal</li>
                <li>Bienes Raíces</li>
                <li>Desarrollo Web</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Empresa</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Acerca de</li>
                <li>Contacto</li>
                <li>Carreras</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacidad</li>
                <li>Términos</li>
                <li>Cookies</li>
                <li>Soporte</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
            <EditableContent 
              contentKey="footer-copyright"
              defaultValue="© 2024 Mexivanza. Todos los derechos reservados."
              className=""
            />
          </div>
        </div>
      </footer>
    </div>
  );
};