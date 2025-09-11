import React, { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useReactiveContent } from "@/hooks/use-reactive-content";
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
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { VideoStreamingModule } from "@/components/modules/video-streaming";
import { GamingHubModule } from "@/components/modules/gaming-hub";
import { FinancialDashboardModule } from "@/components/modules/financial-dashboard";
import { VerifiedAgentsModule } from "@/components/modules/verified-agents-demo";
import { VideoUploadModule } from "@/components/modules/video-upload";
import { TrademarkRegistrationModule } from "@/components/modules/trademark-registration";
import { LegalDocumentGeneratorModule } from "@/components/modules/legal-document-generator";
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
  BarChart3,
  FileText
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import heroImage from "@/assets/hero-mexico.jpg";

export const Home: React.FC = () => {
  const { t, language } = useLanguage(); // Use direct language hook
  const { user, userRole, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Debug: Log when language changes
  useEffect(() => {
    console.log('Home component language changed to:', language);
    console.log('Sample translation test:', t("services.premium"));
  }, [language, t]);
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "News" });
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingContent, setEditingContent] = useState<{[key: string]: boolean}>({});
  const [editValues, setEditValues] = useState<{[key: string]: string}>({});

  const categories = [
    "News", "Fitness", "Cooking", "Travel", "Legal", "Real Estate", 
    "Business", "Web Development", "Events", "Ads"
  ];

  // Role-based redirection - enforce admin sovereignty
  useEffect(() => {
    if (user?.email === 'mexivanza@mexivanza.com' || isAdmin) {
      navigate('/admin-dashboard');
    } else if (user && userRole === 'verified') {
      navigate('/verified-dashboard');
    } else if (user) {
      // Regular authenticated users stay on main home
      navigate('/home');
    }
  }, [user, userRole, isAdmin, navigate]);

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

  // Fetch posts and listen for language changes
  useEffect(() => {
    fetchPosts();
    
    // Listen for language change events
    const handleLanguageChange = () => {
      fetchPosts(); // Refetch posts to get them in the correct language context
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, [language]); // Add language as dependency

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
      toast.error(t("posts.login_required", "Debes iniciar sesión para crear posts"));
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error(t("posts.complete_fields", "Por favor completa el título y contenido"));
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

      toast.success(t("post.created_success", "Post creado exitosamente"));
      setNewPost({ title: "", content: "", category: "News" });
      setShowPostForm(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(t("posts.error_creating", "Error al crear el post"));
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success(t("auth.logout_success", "Sesión cerrada exitosamente"));
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
                  {language === 'en' ? 'Premium Services' : 'Servicios Premium'} | {t("services.premium", "Servicios Premium")}
                </h3>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start text-sm hover:bg-accent rounded-lg p-3">
                    <Plane className="mr-3 h-4 w-4 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">{t("services.travel", "Viajes")}</div>
                      <div className="text-xs text-muted-foreground">{t("services.travel_desc", "Paquetes premium")}</div>
                    </div>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm hover:bg-accent rounded-lg p-3">
                    <Scale className="mr-3 h-4 w-4 text-success" />
                    <div className="text-left">
                      <div className="font-medium">{t("services.legal", "Legal")}</div>
                      <div className="text-xs text-muted-foreground">{t("services.legal_desc", "Consulta gratuita")}</div>
                    </div>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm hover:bg-accent rounded-lg p-3">
                    <Building className="mr-3 h-4 w-4 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">{t("real_estate.inmobiliaria", "Real Estate")}</div>
                      <div className="text-xs text-muted-foreground">+500 {t("services.realestate_desc", "properties")}</div>
                    </div>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm hover:bg-accent rounded-lg p-3" asChild>
                    <Link to="/business-directory">
                      <Users className="mr-3 h-4 w-4 text-success" />
                      <div className="text-left">
                        <div className="font-medium">{t("directory.title", "Directorio")}</div>
                        <div className="text-xs text-muted-foreground">{t("directory.verified_businesses", "Negocios verificados")}</div>
                      </div>
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-sm hover:bg-accent rounded-lg p-3">
                    <Monitor className="mr-3 h-4 w-4 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">{t("services.webdev", "Desarrollo Web")}</div>
                      <div className="text-xs text-muted-foreground">{t("services.webdev_desc", "Soluciones digitales")}</div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Center Feed - Main Content */}
          <main className="flex-1 min-h-screen bg-background ml-64 mr-80 overflow-hidden">
            <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6 container-safe">
              {/* Create Post Card */}
              {user && (
                <Card className="shadow-sm border-border bg-card hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                  {!showPostForm ? (
                    <Button 
                      onClick={() => setShowPostForm(true)}
                      variant="outline" 
                      className="w-full justify-start h-12 text-muted-foreground hover:text-foreground hover:bg-accent border-dashed text-wrap"
                    >
                      <Plus className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="text-sm sm:text-base truncate">¿Qué quieres compartir hoy?</span>
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
                          <SelectValue placeholder={t("form.select_category", "Selecciona una categoría")} />
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
                  <div className="p-4 sm:p-6">
                    <div className="text-center space-y-4">
                      <EditableContent 
                        contentKey="hero-title"
                        defaultValue={t("hero.title_default", "Plataforma Integral Mexivanza")}
                        className="text-2xl sm:text-3xl font-bold text-foreground block overflow-wrap break-word"
                      />
                      <EditableContent 
                        contentKey="hero-description"
                        defaultValue={t("hero.description_default", "Servicios profesionales de viaje, legal, desarrollo web y bienes raíces. Conectando México con soluciones de primera clase.")}
                        className="text-muted-foreground text-base sm:text-lg leading-relaxed block overflow-wrap break-word"
                        multiline
                      />
                      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                        <WhatsAppButton
                          message={t("whatsapp.general_inquiry", "¡Hola! Estoy interesado en los servicios de Mexivanza.")}
                          className="bg-[#25D366] hover:bg-[#25D366]/90 text-white px-4 sm:px-6 py-3 text-sm sm:text-base"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          WhatsApp
                        </WhatsAppButton>
                        <Button asChild variant="outline" size="lg" className="px-4 sm:px-6 py-3 text-sm sm:text-base">
                          <Link to="/travel/categories">
                            <Plane className="mr-2 h-4 w-4" />
                            {t("travel.explore_packages", "Explorar Paquetes")}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Featured Services Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Card className="shadow-sm border-border bg-card hover:shadow-md transition-all duration-200 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Plane className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold">{t("services.travel", "Servicios de Viaje")}</CardTitle>
                        <CardDescription className="text-sm">{t("services.travel_desc", "Paquetes y experiencias premium")}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs">
                        <Plane className="mr-1 h-3 w-3" />
                        {t("travel.flights", "Vuelos")}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Building className="mr-1 h-3 w-3" />
                        {t("travel.hotels", "Hoteles")}
                      </Badge>
                      <Badge variant="outline" className="text-xs">500+ {t("travel.packages", "paquetes")}</Badge>
                    </div>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to="/travel/categories">
                        {t("button.explore", "Explorar")}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-border bg-card hover:shadow-md transition-all duration-200 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-success/10 p-2 rounded-lg">
                        <Scale className="h-6 w-6 text-success" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold">{t("services.legal", "Servicios Legales")}</CardTitle>
                        <CardDescription className="text-sm">{t("services.legal_desc", "Consultoría legal profesional")}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs">
                        <FileText className="mr-1 h-3 w-3" />
                        {t("legal.documents", "Documentos")}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Scale className="mr-1 h-3 w-3" />
                        {t("legal.consultation", "Consultoría")}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{t("legal.free_consultation", "Consulta gratuita")}</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      {t("button.contact", "Contactar")}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-border bg-card hover:shadow-md transition-all duration-200 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Building className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold">{t("services.real_estate", "Bienes Raíces")}</CardTitle>
                        <CardDescription className="text-sm">{t("services.real_estate_desc", "Propiedades verificadas")}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs">1000+ {t("real_estate.properties", "propiedades")}</Badge>
                      <Badge variant="outline" className="text-xs">
                        <Shield className="mr-1 h-3 w-3" />
                        {t("real_estate.verified", "Verificadas")}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      {t("button.explore", "Explorar")}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-border bg-card hover:shadow-md transition-all duration-200 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Monitor className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold">{t("services.web_development", "Desarrollo Web")}</CardTitle>
                        <CardDescription className="text-sm">{t("services.web_development_desc", "Sitios web profesionales")}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs">
                        <Monitor className="mr-1 h-3 w-3" />
                        AI {t("web_dev.included", "incluido")}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{t("web_dev.professional", "Profesional")}</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      {t("button.request_quote", "Solicitar Cotización")}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Service Modules */}
              <div className="space-y-6">
                <VideoStreamingModule />
                <GamingHubModule />
                <FinancialDashboardModule />
                <VerifiedAgentsModule />
                <VideoUploadModule />
                <TrademarkRegistrationModule />
                <LegalDocumentGeneratorModule />
              </div>

              {/* Posts Feed */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{t("posts.recent_posts", "Posts Recientes")}</h2>
                  <Badge variant="outline">{posts.length} {t("posts.posts", "posts")}</Badge>
                </div>
                
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <Card key={post.id} className="shadow-sm border-border bg-card hover:shadow-md transition-shadow duration-200">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={post.profiles?.avatar_url} />
                              <AvatarFallback>{post.profiles?.name?.[0] || 'U'}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm">{post.profiles?.name || 'Usuario'}</span>
                                <Badge variant="outline" className="text-xs">{post.category}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-lg font-semibold">{post.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-muted-foreground mb-4 line-clamp-3">{post.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-4">
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-primary">
                              <Heart className="h-4 w-4 mr-1" />
                              <span className="text-xs">Me gusta</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-primary">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              <span className="text-xs">Comentar</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-primary">
                              <Share className="h-4 w-4 mr-1" />
                              <span className="text-xs">Compartir</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="shadow-sm border-border bg-card">
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">{t("posts.no_posts", "No hay posts disponibles")}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </main>
          
          {/* Right Sidebar - Contextual modules */}
          <RightSidebar />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};