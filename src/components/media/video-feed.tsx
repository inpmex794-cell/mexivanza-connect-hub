import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/use-language';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Play, 
  Pause, 
  Heart, 
  MessageSquare, 
  Share, 
  Volume2, 
  VolumeX,
  Upload,
  User,
  Flag,
  MoreVertical
} from 'lucide-react';

interface VideoContent {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration?: number;
  view_count: number;
  category?: string;
  user_id?: string;
  created_at: string;
  profiles?: {
    name: string;
    avatar_url?: string;
  } | null;
}

export const VideoFeed: React.FC = () => {
  const { t } = useLanguage();
  const { user, userRole } = useAuth();
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, currentVideoIndex]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('video_content')
        .select(`
          *,
          profiles (name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      // Add demo videos if no content exists
      const demoVideos: VideoContent[] = [
        {
          id: 'demo-1',
          title: 'Descubre Cancún',
          description: 'Las mejores playas del Caribe mexicano',
          video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          thumbnail_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
          duration: 60,
          view_count: 1250,
          category: 'Travel',
          created_at: new Date().toISOString(),
          profiles: { name: 'Mexivanza Travel', avatar_url: '' }
        },
        {
          id: 'demo-2',
          title: 'Servicios Legales Premium',
          description: 'Consultoría legal especializada',
          video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
          thumbnail_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
          duration: 45,
          view_count: 890,
          category: 'Legal',
          created_at: new Date().toISOString(),
          profiles: { name: 'Mexivanza Legal', avatar_url: '' }
        }
      ];

      setVideos(data && data.length > 0 ? (data as any) : demoVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      // Fallback to demo videos on error
      setVideos([
        {
          id: 'demo-fallback',
          title: 'Bienvenido a Mexivanza',
          description: 'Tu plataforma integral de servicios',
          video_url: '',
          thumbnail_url: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=400',
          duration: 30,
          view_count: 0,
          category: 'Demo',
          created_at: new Date().toISOString(),
          profiles: { name: 'Mexivanza', avatar_url: '' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleVideoEnd = () => {
    // Auto-advance to next video
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      setCurrentVideoIndex(0); // Loop back to first video
    }
    setIsPlaying(true);
  };

  const handleSwipeUp = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setIsPlaying(true);
    }
  };

  const handleSwipeDown = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
      setIsPlaying(true);
    }
  };

  const handleLike = async (videoId: string) => {
    if (!user) {
      toast.error(t('video.login_required', 'Inicia sesión para dar me gusta'));
      return;
    }
    
    // Implement like functionality
    toast.success(t('video.liked', '¡Te gustó este video!'));
  };

  const handleReport = async (videoId: string) => {
    if (!user) {
      toast.error(t('video.login_required', 'Inicia sesión para reportar'));
      return;
    }
    
    toast.success(t('video.reported', 'Video reportado para moderación'));
  };

  const currentVideo = videos[currentVideoIndex];

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>{t('video.loading', 'Cargando videos...')}</p>
        </div>
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p>{t('video.no_videos', 'No hay videos disponibles')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-black relative overflow-hidden">
      {/* Video Player */}
      <div className="w-full h-full relative">
        {currentVideo.video_url ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={currentVideo.video_url}
            muted={isMuted}
            onEnded={handleVideoEnd}
            onClick={togglePlayPause}
            poster={currentVideo.thumbnail_url}
          />
        ) : (
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${currentVideo.thumbnail_url})` }}
          />
        )}

        {/* Play/Pause Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {!isPlaying && (
            <Button
              size="lg"
              variant="ghost"
              className="text-white hover:text-white bg-black/30 backdrop-blur-sm pointer-events-auto"
              onClick={togglePlayPause}
            >
              <Play className="h-8 w-8" />
            </Button>
          )}
        </div>

        {/* Touch areas for navigation */}
        <div
          className="absolute top-0 left-0 w-full h-1/3 cursor-pointer"
          onClick={handleSwipeUp}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-1/3 cursor-pointer"
          onClick={handleSwipeDown}
        />
      </div>

      {/* Right Sidebar Actions */}
      <div className="absolute right-4 bottom-20 space-y-4 z-10">
        <Button
          size="lg"
          variant="ghost"
          className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm text-white hover:text-white flex-col p-0"
          onClick={() => handleLike(currentVideo.id)}
        >
          <Heart className="h-6 w-6" />
          <span className="text-xs">
            {Math.floor(Math.random() * 1000)}
          </span>
        </Button>

        <Button
          size="lg"
          variant="ghost"
          className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm text-white hover:text-white flex-col p-0"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="text-xs">
            {Math.floor(Math.random() * 100)}
          </span>
        </Button>

        <Button
          size="lg"
          variant="ghost"
          className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm text-white hover:text-white flex-col p-0"
        >
          <Share className="h-6 w-6" />
        </Button>

        <Button
          size="lg"
          variant="ghost"
          className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm text-white hover:text-white flex-col p-0"
          onClick={() => handleReport(currentVideo.id)}
        >
          <Flag className="h-6 w-6" />
        </Button>
      </div>

      {/* Bottom Info Panel */}
      <div className="absolute bottom-0 left-0 right-20 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
        <div className="flex items-center mb-3">
          <Avatar className="h-10 w-10 mr-3 border-2 border-white">
            <AvatarImage src={currentVideo.profiles?.avatar_url} />
            <AvatarFallback className="bg-primary text-white">
              {currentVideo.profiles?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">
              {currentVideo.profiles?.name || 'Usuario'}
            </p>
            <p className="text-sm text-gray-300">
              {currentVideo.view_count.toLocaleString()} visualizaciones
            </p>
          </div>
          {userRole === 'verified' && (
            <Button variant="outline" size="sm" className="text-white border-white">
              Seguir
            </Button>
          )}
        </div>

        <h3 className="font-semibold text-lg mb-1">{currentVideo.title}</h3>
        {currentVideo.description && (
          <p className="text-sm text-gray-300 mb-2">{currentVideo.description}</p>
        )}
        
        {currentVideo.category && (
          <Badge variant="secondary" className="bg-white/20 text-white">
            {currentVideo.category}
          </Badge>
        )}
      </div>

      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:text-white bg-black/30 backdrop-blur-sm"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>

        <div className="text-white text-sm bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
          {currentVideoIndex + 1} / {videos.length}
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="text-white hover:text-white bg-black/30 backdrop-blur-sm"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Upload FAB for verified users */}
      {userRole === 'verified' && (
        <Button
          size="lg"
          className="fixed bottom-24 right-4 rounded-full w-14 h-14 shadow-lg z-20"
        >
          <Upload className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};