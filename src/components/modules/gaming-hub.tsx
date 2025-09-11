import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminButton } from "@/components/ui/admin-button";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Gamepad2, Star, Play, ThumbsUp, MessageSquare, Plus } from "lucide-react";
import { toast } from "sonner";

interface GameContent {
  id: string;
  title: string;
  description?: string;
  game_type?: string;
  platform?: string;
  rating?: number;
  image_url?: string;
  video_url?: string;
  trailer_url?: string;
  likes: number;
  user_id?: string;
  created_at: string;
  is_demo?: boolean;
}

export const GamingHubModule: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isAdmin } = useAuth();
  const [games, setGames] = useState<GameContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedGames, setLikedGames] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('gaming_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      console.error('Error fetching games:', error);
      toast.error(t("gaming.fetch_error", "Failed to load games"));
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (gameId: string) => {
    if (!user) {
      toast.error(t("auth.required", "Please login to like games"));
      return;
    }

    try {
      const game = games.find(g => g.id === gameId);
      if (!game) return;

      const isLiked = likedGames.has(gameId);
      const newLikeCount = isLiked ? game.likes - 1 : game.likes + 1;

      const { error } = await supabase
        .from('gaming_content')
        .update({ likes: newLikeCount })
        .eq('id', gameId);

      if (error) throw error;

      // Update local state
      setGames(prev => prev.map(g => 
        g.id === gameId ? { ...g, likes: newLikeCount } : g
      ));

      const newLikedGames = new Set(likedGames);
      if (isLiked) {
        newLikedGames.delete(gameId);
      } else {
        newLikedGames.add(gameId);
      }
      setLikedGames(newLikedGames);

    } catch (error) {
      console.error('Error updating like:', error);
      toast.error(t("gaming.like_error", "Failed to update like"));
    }
  };

  const getPlatformColor = (platform?: string) => {
    switch (platform?.toLowerCase()) {
      case 'pc': return 'bg-blue-100 text-blue-800';
      case 'console': return 'bg-green-100 text-green-800';
      case 'mobile': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Gamepad2 className="h-6 w-6" />
            {t("gaming.title", "Gaming Hub")}
          </h2>
          <p className="text-muted-foreground">
            {t("gaming.subtitle", "Discover amazing games and share your favorites")}
          </p>
        </div>
        {isAdmin && (
          <AdminButton action="add">
            {t("gaming.add_game", "Add Game")}
          </AdminButton>
        )}
      </div>

      {/* Featured Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['Action', 'Adventure', 'Strategy', 'RPG', 'Simulation', 'Sports'].map((category) => (
          <Badge key={category} variant="secondary" className="whitespace-nowrap">
            {category}
          </Badge>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card key={game.id} className="overflow-hidden hover:shadow-medium transition-all group">
            <div className="relative">
              {game.image_url ? (
                <img 
                  src={game.image_url} 
                  alt={game.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Gamepad2 className="h-16 w-16 text-primary" />
                </div>
              )}
              
              {game.is_demo && (
                <Badge className="absolute top-2 right-2" variant="secondary">
                  Demo
                </Badge>
              )}

              {game.trailer_url && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="lg" variant="secondary">
                    <Play className="mr-2 h-5 w-5" />
                    {t("gaming.watch_trailer", "Watch Trailer")}
                  </Button>
                </div>
              )}

              {/* Rating */}
              {game.rating && (
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {game.rating.toFixed(1)}
                </div>
              )}
            </div>

            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground line-clamp-2 flex-1">
                  {game.title}
                </h3>
                {game.platform && (
                  <Badge className={getPlatformColor(game.platform)}>
                    {game.platform}
                  </Badge>
                )}
              </div>

              {game.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {game.description}
                </p>
              )}

              {game.game_type && (
                <Badge variant="outline" className="mb-3">
                  {game.game_type}
                </Badge>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(game.id)}
                    className={likedGames.has(game.id) ? 'text-red-500' : ''}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {game.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {t("gaming.discuss", "Discuss")}
                  </Button>
                </div>
                
                {game.video_url && (
                  <Button size="sm" variant="outline">
                    <Play className="h-4 w-4 mr-1" />
                    {t("gaming.play", "Play")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {games.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t("gaming.no_games", "No games available")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t("gaming.no_games_desc", "Be the first to add a game to the hub!")}
            </p>
            {isAdmin && (
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t("gaming.add_first", "Add First Game")}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};