import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Gallery } from '@/components/ui/gallery';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Heart, MessageSquare, Share, Clock, MapPin } from 'lucide-react';
import heroImage from '@/assets/hero-mexico.jpg';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  user_id: string;
  profiles?: {
    name: string;
    avatar_url?: string;
  } | null;
}

export const MainFeed: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'News' });
  const [showPostForm, setShowPostForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = [
    'News', 'Travel', 'Legal', 'Real Estate', 'Business', 
    'Web Development', 'Gaming', 'Finance', 'Events'
  ];

  const heroGallery = [
    {
      src: heroImage,
      alt: t('hero.platform_alt', 'Mexivanza Platform'),
      title: t('hero.platform_title', 'Mexivanza AI Platform'),
      description: t('hero.platform_desc', 'Your gateway to premium Mexican services')
    },
    {
      src: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800',
      alt: t('travel.discover_alt', 'Travel Mexico'),
      title: t('travel.discover_title', 'Discover Mexico'),
      description: t('travel.discover_desc', 'Premium travel packages')
    },
    {
      src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
      alt: t('legal.services_alt', 'Legal Services'),
      title: t('legal.services_title', 'Legal Excellence'),
      description: t('legal.services_desc', 'Professional legal consultation')
    }
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_posts')
        .select(`
          *,
          profiles (name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPosts((data || []) as any);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user) {
      toast.error(t('posts.login_required', 'Debes iniciar sesión para crear posts'));
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error(t('posts.complete_fields', 'Completa todos los campos'));
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
          scenario_tags: [newPost.category]
        }]);

      if (error) throw error;

      toast.success(t('posts.created_success', 'Post creado exitosamente'));
      setNewPost({ title: '', content: '', category: 'News' });
      setShowPostForm(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(t('posts.error_creating', 'Error al crear el post'));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <main className="flex-1 min-h-screen bg-background ml-64 mr-80 overflow-hidden">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6 container-safe">
        
        {/* Create Post Form */}
        {user && (
          <Card className="shadow-sm border-border bg-card hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              {!showPostForm ? (
                <Button 
                  onClick={() => setShowPostForm(true)}
                  variant="outline" 
                  className="w-full justify-start h-12 text-muted-foreground hover:text-foreground hover:bg-accent border-dashed"
                >
                  <Plus className="mr-3 h-5 w-5" />
                  {t('form.post_placeholder', '¿Qué quieres compartir hoy?')}
                </Button>
              ) : (
                <div className="space-y-4">
                  <Input
                    placeholder={t('form.post_title', 'Título del post...')}
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="text-base font-medium"
                  />
                  <Textarea
                    placeholder={t('form.post_content', 'Comparte tu experiencia...')}
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    rows={4}
                    className="resize-none"
                  />
                  <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.select_category', 'Selecciona categoría')} />
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
                      {t('button.cancel', 'Cancelar')}
                    </Button>
                    <Button onClick={handleCreatePost} size="sm" className="bg-primary hover:bg-primary-hover">
                      {t('button.create', 'Publicar')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Hero Gallery */}
        <Card className="shadow-sm border-border bg-card hover:shadow-md transition-all duration-200 overflow-hidden">
          <CardContent className="p-0">
            <Gallery images={heroGallery} cols={3} className="mb-0" />
            <div className="p-4 sm:p-6">
              <div className="text-center space-y-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {t('hero.title_default', 'Plataforma Integral Mexivanza')}
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  {t('hero.description_default', 'Servicios profesionales de viaje, legal, desarrollo web y bienes raíces. Conectando México con soluciones de primera clase.')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground min-w-[140px]">
                    {t('button.get_started', 'Comenzar')}
                  </Button>
                  <Button variant="outline" size="lg" className="min-w-[140px]">
                    {t('button.learn_more', 'Saber Más')}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-10 h-10 bg-muted rounded-full"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-3 bg-muted rounded w-1/6"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="shadow-sm border-border bg-card hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  {/* Post Header */}
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.profiles?.avatar_url} />
                      <AvatarFallback>
                        {post.profiles?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {post.profiles?.name || 'Usuario'}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(post.created_at)}
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {post.title}
                    </h3>
                    <p className="text-foreground leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                        <Heart className="h-4 w-4 mr-1" />
                        Me gusta
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Comentar
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <Share className="h-4 w-4 mr-1" />
                        Compartir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {posts.length === 0 && !loading && (
              <Card className="shadow-sm border-border bg-card">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground text-lg">
                    {t('posts.no_posts', 'No hay posts disponibles')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('posts.be_first', '¡Sé el primero en compartir algo!')}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </main>
  );
};