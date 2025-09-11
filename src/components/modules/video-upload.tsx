import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Video, Play } from "lucide-react";

interface VideoUploadProps {
  onUploadSuccess?: () => void;
}

export const VideoUploadModule: React.FC<VideoUploadProps> = ({ onUploadSuccess }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    category: "",
    video_url: ""
  });

  const categories = [
    "Travel", "Legal", "Business", "Technology", "Entertainment", "Education"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Debes iniciar sesión para subir videos");
      return;
    }

    if (!videoData.title || !videoData.video_url) {
      toast.error("Título y URL del video son requeridos");
      return;
    }

    setUploading(true);
    
    try {
      const { error } = await supabase
        .from('video_content')
        .insert([{
          user_id: user.id,
          title: videoData.title,
          description: videoData.description,
          video_url: videoData.video_url,
          category: videoData.category || "General",
          thumbnail_url: `https://img.youtube.com/vi/${extractVideoId(videoData.video_url)}/maxresdefault.jpg`
        }]);

      if (error) throw error;

      toast.success("Video subido exitosamente");
      setVideoData({ title: "", description: "", category: "", video_url: "" });
      onUploadSuccess?.();
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error("Error al subir el video");
    } finally {
      setUploading(false);
    }
  };

  const extractVideoId = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : "";
  };

  const previewUrl = videoData.video_url ? `https://www.youtube.com/embed/${extractVideoId(videoData.video_url)}` : null;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Subir Video
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder={t("form.title", "Título del video")}
              value={videoData.title}
              onChange={(e) => setVideoData({ ...videoData, title: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Textarea
              placeholder={t("form.description", "Descripción del video")}
              value={videoData.description}
              onChange={(e) => setVideoData({ ...videoData, description: e.target.value })}
              rows={3}
            />
          </div>
          
          <div>
            <Select value={videoData.category} onValueChange={(value) => setVideoData({ ...videoData, category: value })}>
              <SelectTrigger>
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
          </div>
          
          <div>
            <Input
              placeholder="URL del video (YouTube, Vimeo, etc.)"
              value={videoData.video_url}
              onChange={(e) => setVideoData({ ...videoData, video_url: e.target.value })}
              required
            />
          </div>

          {previewUrl && (
            <div className="aspect-video w-full">
              <iframe
                src={previewUrl}
                className="w-full h-full rounded-lg"
                allowFullScreen
                title="Video Preview"
              />
            </div>
          )}
          
          <Button 
            type="submit" 
            disabled={uploading || !user}
            className="w-full"
          >
            {uploading ? "Subiendo..." : "Subir Video"}
            <Video className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};