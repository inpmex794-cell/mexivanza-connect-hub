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
  Languages
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import heroImage from "@/assets/hero-mexico.jpg";

export const Home: React.FC = () => {
  const { t } = useLanguage();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "News" });
  const [showPostForm, setShowPostForm] = useState(false);

  const categories = [
    "News", "Fitness", "Cooking", "Travel", "Legal", "Real Estate", 
    "Business", "Web Development", "Events", "Ads"
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
          language: 'es'
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
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 shadow-medium border-b border-border/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                <span className="text-primary-foreground font-bold text-xl">M</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Mexivanza</h1>
                <p className="text-xs text-muted-foreground">AI Master Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <Button variant="ghost" size="sm" className="hover:bg-accent/50 transition-all duration-200">
                <Languages className="h-4 w-4 mr-2" />
                ES/EN
              </Button>
              
              {user ? (
                <div className="flex items-center space-x-2">
                  <Badge variant={isAdmin ? "default" : "secondary"}>
                    {isAdmin ? "Admin" : "Usuario"}
                  </Badge>
                  {isAdmin && (
                    <Button asChild size="sm" className="modern-button">
                      <Link to="/admin-dashboard">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Dashboard
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
                  <Button asChild size="sm" className="modern-button">
                    <Link to="/auth">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Únete
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex gap-6 px-6">
        {/* Left Sidebar - Navigation */}
        <aside className="w-72 min-h-screen bg-card/50 backdrop-blur-sm border-r border-border/30 p-6 rounded-tr-2xl">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start bg-primary-light text-primary font-medium rounded-xl py-3 h-auto">
              <HomeIcon className="mr-3 h-5 w-5" />
              <span className="text-base">Inicio</span>
            </Button>
            
            {user && (
              <div className="space-y-2">
                <Button asChild variant="ghost" className="w-full justify-start hover:bg-accent/50 rounded-xl py-3 h-auto transition-all duration-200">
                  <Link to="/dashboard">
                    <User className="mr-3 h-5 w-5" />
                    <span className="text-base">Mi Perfil</span>
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-accent/50 rounded-xl py-3 h-auto transition-all duration-200">
                  <Settings className="mr-3 h-5 w-5" />
                  <span className="text-base">Configuración</span>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10 rounded-xl py-3 h-auto transition-all duration-200" onClick={handleLogout}>
                  <LogOut className="mr-3 h-5 w-5" />
                  <span className="text-base">Cerrar Sesión</span>
                </Button>
              </div>
            )}
          </nav>

          {/* Services Section */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Servicios Premium
            </h3>
            <div className="space-y-3">
              <Button variant="ghost" className="w-full justify-start text-sm hover:bg-accent/50 rounded-xl py-3 h-auto transition-all duration-200">
                <Plane className="mr-3 h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="font-medium">Paquetes de Viaje</div>
                  <div className="text-xs text-muted-foreground">Experiencias únicas</div>
                </div>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm hover:bg-accent/50 rounded-xl py-3 h-auto transition-all duration-200">
                <Scale className="mr-3 h-5 w-5 text-success" />
                <div className="text-left">
                  <div className="font-medium">Servicios Legales</div>
                  <div className="text-xs text-muted-foreground">Asesoría profesional</div>
                </div>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm hover:bg-accent/50 rounded-xl py-3 h-auto transition-all duration-200">
                <Building className="mr-3 h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="font-medium">Bienes Raíces</div>
                  <div className="text-xs text-muted-foreground">Propiedades exclusivas</div>
                </div>
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm hover:bg-accent/50 rounded-xl py-3 h-auto transition-all duration-200">
                <Monitor className="mr-3 h-5 w-5 text-primary" />
                <div className="text-left">
                  <div className="font-medium">Desarrollo Web</div>
                  <div className="text-xs text-muted-foreground">Soluciones digitales</div>
                </div>
              </Button>
            </div>
          </div>
        </aside>

        {/* Center Feed */}
        <main className="flex-1 min-h-screen p-6 max-w-2xl">
          <div className="space-y-8 animate-fade-in">
            {/* Create Post Card */}
            {user && (
              <Card className="modern-card">
                <CardContent className="p-6">
                  {!showPostForm ? (
                    <Button 
                      onClick={() => setShowPostForm(true)}
                      variant="outline" 
                      className="w-full justify-start h-14 text-muted-foreground hover:text-foreground hover:bg-accent/50 border-border/50 rounded-xl transition-all duration-200"
                    >
                      <Plus className="mr-3 h-5 w-5" />
                      <span className="text-base">¿Qué quieres compartir hoy?</span>
                    </Button>
                  ) : (
                    <div className="space-y-6">
                      <Input
                        placeholder="Escribe un título atractivo..."
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        className="text-lg font-medium border-0 border-b border-border rounded-none focus:ring-0 focus:border-primary px-0 py-3"
                      />
                      <Textarea
                        placeholder="Comparte tu historia..."
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        rows={4}
                        className="resize-none border-border/50 rounded-xl focus:border-primary"
                      />
                      <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                        <SelectTrigger className="rounded-xl border-border/50">
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50 bg-card backdrop-blur-sm">
                          {categories.map((category) => (
                            <SelectItem key={category} value={category} className="rounded-lg">
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex justify-between items-center pt-4">
                        <Button 
                          onClick={() => setShowPostForm(false)} 
                          variant="ghost" 
                          className="text-muted-foreground hover:text-foreground"
                        >
                          Cancelar
                        </Button>
                        <Button onClick={handleCreatePost} className="modern-button">
                          <span className="font-medium">Publicar</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Hero Post */}
            <Card className="shadow-soft border-border">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={heroImage}
                    alt="Mexivanza Platform"
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-lg" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <Badge className="mb-2 bg-primary text-primary-foreground">
                      Destacado
                    </Badge>
                    <h2 className="text-2xl font-bold mb-2">
                      Plataforma Integral Mexivanza
                    </h2>
                    <p className="text-white/90">
                      Servicios profesionales de viaje, legal, desarrollo web y bienes raíces
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
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
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            {posts.map((post) => (
              <Card key={post.id} className="shadow-soft border-border">
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
        <aside className="w-80 min-h-screen bg-card border-l border-border p-4">
          {/* Weather Widget */}
          <Card className="mb-6 shadow-soft border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center">
                <Sun className="mr-2 h-4 w-4 text-yellow-500" />
                Clima en CDMX
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">24°C</div>
                  <div className="text-sm text-gray-500">Soleado</div>
                </div>
                <Sun className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          {/* Featured Services */}
          <Card className="mb-6 shadow-soft border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Servicios Destacados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-accent">
                <Plane className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">Paquetes de Viaje</div>
                  <div className="text-xs text-gray-500">Desde $2,500 MXN</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-accent">
                <Scale className="h-5 w-5 text-success" />
                <div>
                  <div className="text-sm font-medium">Consultoría Legal</div>
                  <div className="text-xs text-gray-500">Consulta gratuita</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-accent">
                <Building className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">Bienes Raíces</div>
                  <div className="text-xs text-gray-500">+500 propiedades</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Online Users */}
          <Card className="shadow-soft border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center">
                <Users className="mr-2 h-4 w-4 text-green-500" />
                Usuarios Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">2,847 usuarios en línea</span>
                </div>
                <div className="text-xs text-gray-500">
                  Última actualización hace 1 min
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <span className="font-bold text-gray-900">Mexivanza</span>
              </div>
              <p className="text-sm text-gray-600">
                Plataforma integral de servicios para México
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Servicios</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Viajes</li>
                <li>Legal</li>
                <li>Bienes Raíces</li>
                <li>Desarrollo Web</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Empresa</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Acerca de</li>
                <li>Contacto</li>
                <li>Carreras</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Privacidad</li>
                <li>Términos</li>
                <li>Cookies</li>
                <li>Soporte</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500">
            © 2024 Mexivanza. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};