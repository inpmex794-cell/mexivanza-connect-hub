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
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
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
  X
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
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">M</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">Mexivanza</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Languages className="h-4 w-4 mr-2" />
                ES/EN
              </Button>
              
              {user ? (
                <div className="flex items-center space-x-2">
                  <Badge variant={isAdmin ? "default" : "secondary"}>
                    {isAdmin ? "Admin" : "Usuario"}
                  </Badge>
                  {isAdmin && (
                    <Button asChild size="sm" className="bg-primary hover:bg-primary-hover text-primary-foreground">
                      <Link to="/admin-dashboard">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/auth">
                      <LogIn className="mr-2 h-4 w-4" />
                      Entrar
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="bg-primary hover:bg-primary-hover text-primary-foreground">
                    <Link to="/auth">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Registrar
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar - Navigation */}
        <aside className="w-64 min-h-screen bg-card border-r border-border p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start bg-accent text-primary">
              <HomeIcon className="mr-3 h-5 w-5" />
              Inicio
            </Button>
            
            {user && (
              <>
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link to="/dashboard">
                    <User className="mr-3 h-5 w-5" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-3 h-5 w-5" />
                  Configuración
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="mr-3 h-5 w-5" />
                  Cerrar Sesión
                </Button>
              </>
            )}
          </nav>

          {/* Services Section */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Servicios
            </h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Plane className="mr-3 h-4 w-4" />
                Viajes
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Scale className="mr-3 h-4 w-4" />
                Legal
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Building className="mr-3 h-4 w-4" />
                Inmobiliaria
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Monitor className="mr-3 h-4 w-4" />
                Desarrollo Web
              </Button>
            </div>
          </div>
        </aside>

        {/* Center Feed */}
        <main className="flex-1 min-h-screen bg-muted p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Create Post Card */}
            {user && (
              <Card className="shadow-sm border-border">
                <CardContent className="p-4">
                  {!showPostForm ? (
                    <Button 
                      onClick={() => setShowPostForm(true)}
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      ¿Qué tienes en mente?
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <Input
                        placeholder="Título del post..."
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      />
                      <Textarea
                        placeholder="Escribe algo..."
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        rows={3}
                      />
                      <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex space-x-2">
                        <Button onClick={handleCreatePost} size="sm" className="bg-primary hover:bg-primary-hover text-primary-foreground">
                          Publicar
                        </Button>
                        <Button 
                          onClick={() => setShowPostForm(false)} 
                          variant="outline" 
                          size="sm"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Hero Gallery Section */}
            <Card className="shadow-sm border-border overflow-hidden">
              <CardContent className="p-0">
                <Gallery images={heroGallery} cols={3} className="mb-0" />
                <div className="p-6">
                  <div className="text-center">
                    <EditableContent 
                      contentKey="hero-title"
                      defaultValue="Plataforma Integral Mexivanza"
                      className="text-2xl font-bold mb-2 block"
                    />
                    <EditableContent 
                      contentKey="hero-description"
                      defaultValue="Servicios profesionales de viaje, legal, desarrollo web y bienes raíces. Conectando México con soluciones de primera clase."
                      className="text-muted-foreground mb-4 block"
                      multiline
                    />
                    <div className="flex justify-center gap-4">
                      <WhatsAppButton
                        message={t("whatsapp.general_inquiry", "¡Hola! Estoy interesado en los servicios de Mexivanza.")}
                        className="bg-primary hover:bg-primary-hover"
                      >
                        Contactar WhatsApp
                      </WhatsAppButton>
                      <Button variant="outline">
                        Ver Servicios
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <div className="flex items-center space-x-4">
                      <Button size="sm" variant="ghost">
                        <Heart className="mr-2 h-4 w-4" />
                        124
                      </Button>
                      <Button size="sm" variant="ghost">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        28
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Share className="mr-2 h-4 w-4" />
                        Compartir
                      </Button>
                    </div>
                    <Badge className="bg-primary text-primary-foreground">
                      Destacado
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            {posts.map((post) => (
              <Card key={post.id} className="shadow-sm border-border">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.profiles?.avatar_url} />
                      <AvatarFallback className="bg-accent text-primary">
                        {post.profiles?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-foreground">
                          {post.profiles?.name || 'Usuario'}
                        </span>
                        {post.category && (
                          <Badge variant="secondary" className="text-xs">
                            {post.category}
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500">
                          <Clock className="inline h-3 w-3 mr-1" />
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-2 text-foreground">{post.title}</h3>
                      <p className="text-muted-foreground mb-4">{post.content}</p>
                      
                      <div className="flex items-center space-x-4 pt-2 border-t border-border">
                        <Button variant="ghost" size="sm">
                          <Heart className="mr-2 h-4 w-4" />
                          Me gusta
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Comentar
                        </Button>
                        <Button variant="ghost" size="sm">
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

        {/* Right Sidebar - Contextual Modules */}
        <RightSidebar />
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