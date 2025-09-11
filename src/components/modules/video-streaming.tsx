import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminButton } from "@/components/ui/admin-button";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Play, Upload, Users, Eye, Clock, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

interface VideoContent {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  user_id: string;
  category?: string;
  view_count: number;
  duration?: number;
  is_live: boolean;
  created_at: string;
  is_demo?: boolean;
}

export const VideoStreamingModule: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isAdmin } = useAuth();
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    video_url: "",
    category: "Entertainment"
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('video_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleUpload = async () => {
    if (!user || !newVideo.title || !newVideo.video_url) {
      toast.error(t("video.upload_error", "Please fill in all required fields"));
      return;
    }

    setIsUploading(true);
    try {
      const { error } = await supabase
        .from('video_content')
        .insert([{
          title: newVideo.title,
          description: newVideo.description,
          video_url: newVideo.video_url,
          category: newVideo.category,
          user_id: user.id,
          view_count: 0,
          is_live: false
        }]);

      if (error) throw error;

      toast.success(t("video.upload_success", "Video uploaded successfully"));
      setNewVideo({ title: "", description: "", video_url: "", category: "Entertainment" });
      fetchVideos();
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error(t("video.upload_error", "Failed to upload video"));
    } finally {
      setIsUploading(false);
    }
  };

  const updateViewCount = async (videoId: string) => {
    try {
      await supabase
        .from('video_content')
        .update({ 
          view_count: videos.find(v => v.id === videoId)?.view_count + 1 || 1 
        })
        .eq('id', videoId);
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t("video.title", "Video Streaming")}
          </h2>
          <p className="text-muted-foreground">
            {t("video.subtitle", "Watch and share video content")}
          </p>
        </div>
        {isAdmin && (
          <AdminButton action="add">
            {t("video.manage", "Manage Videos")}
          </AdminButton>
        )}
      </div>

      {/* Upload Section for Verified Users */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              {t("video.upload", "Upload Video")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder={t("video.title_placeholder", "Video title")}
              value={newVideo.title}
              onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
            />
            <Textarea
              placeholder={t("video.description_placeholder", "Video description")}
              value={newVideo.description}
              onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
            />
            <Input
              placeholder={t("video.url_placeholder", "Video URL")}
              value={newVideo.video_url}
              onChange={(e) => setNewVideo({...newVideo, video_url: e.target.value})}
            />
            <Button onClick={handleUpload} disabled={isUploading} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? t("video.uploading", "Uploading...") : t("video.upload", "Upload Video")}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:shadow-medium transition-shadow">
            <div className="relative">
              {video.thumbnail_url ? (
                <img 
                  src={video.thumbnail_url} 
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Play className="h-16 w-16 text-primary" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => updateViewCount(video.id)}
                >
                  <Play className="mr-2 h-5 w-5" />
                  {t("video.play", "Play")}
                </Button>
              </div>
              {video.is_demo && (
                <Badge className="absolute top-2 right-2" variant="secondary">
                  Demo
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                {video.title}
              </h3>
              {video.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {video.description}
                </p>
              )}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {video.view_count}
                  </span>
                  {video.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {Math.floor(video.duration / 60)}m
                    </span>
                  )}
                </div>
                {video.category && (
                  <Badge variant="outline" className="text-xs">
                    {video.category}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {videos.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t("video.no_videos", "No videos available")}
            </h3>
            <p className="text-muted-foreground">
              {t("video.no_videos_desc", "Be the first to upload a video!")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};