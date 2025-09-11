import React, { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  Play,
  Video,
  Upload,
  Eye,
  Users,
  Calendar,
  Radio,
  FileVideo,
  Camera,
  Mic,
  Settings,
  Share2
} from "lucide-react";

interface VideoContent {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url?: string;
  duration: number;
  category: string;
  is_live: boolean;
  view_count: number;
  created_at: string;
  business_id?: number;
  user_id: string;
}

interface UploadForm {
  title: string;
  description: string;
  category: string;
  video_file: File | null;
  thumbnail_file: File | null;
}

const categories = [
  'Business',
  'Travel',
  'Legal',
  'Digital',
  'Education',
  'Entertainment',
  'Tutorial',
  'Product Demo',
  'Event',
  'Testimonial'
];

export const VideoStreaming: React.FC = () => {
  const { t } = useLanguage();
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [userVideos, setUserVideos] = useState<VideoContent[]>([]);
  const [activeTab, setActiveTab] = useState<'browse' | 'upload' | 'live' | 'manage'>('browse');
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [uploadForm, setUploadForm] = useState<UploadForm>({
    title: '',
    description: '',
    category: '',
    video_file: null,
    thumbnail_file: null
  });

  const sampleVideos: VideoContent[] = [
    {
      id: '1',
      title: 'How to Start a Business in Mexico',
      description: 'Complete guide to business registration and legal requirements',
      video_url: '/sample-video-1.mp4',
      thumbnail_url: '/sample-thumb-1.jpg',
      duration: 1200, // 20 minutes
      category: 'Legal',
      is_live: false,
      view_count: 2500,
      created_at: '2024-01-15T10:00:00Z',
      user_id: 'sample-user-1'
    },
    {
      id: '2',
      title: 'Digital Marketing Strategies for Mexican Businesses',
      description: 'Proven techniques to grow your business online',
      video_url: '/sample-video-2.mp4',
      thumbnail_url: '/sample-thumb-2.jpg',
      duration: 900, // 15 minutes
      category: 'Digital',
      is_live: false,
      view_count: 1800,
      created_at: '2024-01-14T14:30:00Z',
      user_id: 'sample-user-2'
    },
    {
      id: '3',
      title: 'Live: Cancún Travel Tips',
      description: 'Real-time Q&A about traveling to Cancún',
      video_url: '/live-stream-1',
      thumbnail_url: '/live-thumb-1.jpg',
      duration: 0,
      category: 'Travel',
      is_live: true,
      view_count: 45,
      created_at: '2024-01-16T16:00:00Z',
      user_id: 'sample-user-3'
    }
  ];

  useEffect(() => {
    setVideos(sampleVideos);
    loadUserVideos();
  }, []);

  const loadUserVideos = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('video_content')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserVideos(data || []);
    } catch (error) {
      console.error('Error loading user videos:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleFileUpload = (field: 'video_file' | 'thumbnail_file', file: File | null) => {
    setUploadForm(prev => ({ ...prev, [field]: file }));
  };

  const uploadVideo = async () => {
    if (!uploadForm.title || !uploadForm.video_file) {
      alert(t("video.validation_error", "Please provide title and video file"));
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert(t("video.login_required", "Please login to upload videos"));
        return;
      }

      // Simulate video upload process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const videoData = {
        title: uploadForm.title,
        description: uploadForm.description,
        category: uploadForm.category,
        video_url: `/uploads/${Date.now()}_${uploadForm.video_file.name}`,
        thumbnail_url: uploadForm.thumbnail_file ? `/uploads/thumb_${Date.now()}_${uploadForm.thumbnail_file.name}` : null,
        duration: 300, // Mock duration
        user_id: user.id,
        is_live: false,
        view_count: 0
      };

      const { error } = await supabase
        .from('video_content')
        .insert([videoData]);

      if (error) throw error;

      // Reset form
      setUploadForm({
        title: '',
        description: '',
        category: '',
        video_file: null,
        thumbnail_file: null
      });

      alert(t("video.upload_success", "Video uploaded successfully!"));
      loadUserVideos();
    } catch (error) {
      console.error('Upload error:', error);
      alert(t("video.upload_error", "Upload failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const startLiveStream = async () => {
    setLoading(true);
    try {
      // Simulate live stream setup
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLive(true);
      alert(t("video.live_started", "Live stream started!"));
    } catch (error) {
      console.error('Live stream error:', error);
      alert(t("video.live_error", "Failed to start live stream"));
    } finally {
      setLoading(false);
    }
  };

  const stopLiveStream = async () => {
    setIsLive(false);
    alert(t("video.live_stopped", "Live stream stopped"));
  };

  const renderVideoCard = (video: VideoContent) => (
    <Card key={video.id} className="group hover:shadow-lg transition-all">
      <div className="relative">
        <div className="aspect-video bg-black rounded-t-lg flex items-center justify-center relative overflow-hidden">
          {video.thumbnail_url ? (
            <img
              src={video.thumbnail_url}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Video className="w-16 h-16 text-white/50" />
          )}
          
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
          
          <Button
            size="lg"
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/50"
          >
            <Play className="w-8 h-8 text-white ml-1" />
          </Button>
          
          {video.is_live && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              <Radio className="w-3 h-3 mr-1" />
              {t("video.live", "LIVE")}
            </Badge>
          )}
          
          {!video.is_live && video.duration > 0 && (
            <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
              {formatDuration(video.duration)}
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {video.title}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {video.description}
            </p>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-3">
                <span className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {formatViewCount(video.view_count)}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {video.category}
                </Badge>
              </div>
              
              <span>
                {new Date(video.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button size="sm" className="flex-1">
                <Play className="w-3 h-3 mr-1" />
                {video.is_live ? t("video.watch_live", "Watch Live") : t("video.watch", "Watch")}
              </Button>
              <Button size="sm" variant="outline">
                <Share2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{t("video.title", "Video & Streaming")}</h1>
        <p className="text-muted-foreground">
          {t("video.subtitle", "Share knowledge and showcase your expertise through video content")}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { id: 'browse', label: t("video.browse", "Browse"), icon: Video },
          { id: 'upload', label: t("video.upload", "Upload"), icon: Upload },
          { id: 'live', label: t("video.live_stream", "Live Stream"), icon: Radio },
          { id: 'manage', label: t("video.my_videos", "My Videos"), icon: FileVideo }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab.id as any)}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Live Streams */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Radio className="w-5 h-5 mr-2 text-red-500" />
              {t("video.live_now", "Live Now")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.filter(v => v.is_live).map(renderVideoCard)}
            </div>
          </div>

          {/* Recent Videos */}
          <div>
            <h2 className="text-xl font-semibold mb-4">{t("video.recent", "Recent Videos")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.filter(v => !v.is_live).map(renderVideoCard)}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                {t("video.upload_new", "Upload New Video")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("video.title_label", "Video Title")} *
                </label>
                <Input
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={t("video.title_placeholder", "Enter video title")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("video.description_label", "Description")}
                </label>
                <Textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t("video.description_placeholder", "Describe your video content")}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("video.category_label", "Category")}
                </label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">{t("video.select_category", "Select Category")}</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("video.file_label", "Video File")} *
                </label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <div className="text-center">
                    <FileVideo className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      {uploadForm.video_file ? uploadForm.video_file.name : t("video.drag_drop", "Drag and drop or click to select video file")}
                    </p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileUpload('video_file', e.target.files?.[0] || null)}
                      className="hidden"
                      id="video-upload"
                    />
                    <Button variant="outline" onClick={() => document.getElementById('video-upload')?.click()}>
                      {t("video.select_file", "Select File")}
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("video.thumbnail_label", "Thumbnail (Optional)")}
                </label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                  <div className="text-center">
                    <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-2">
                      {uploadForm.thumbnail_file ? uploadForm.thumbnail_file.name : t("video.thumbnail_desc", "Upload custom thumbnail")}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('thumbnail_file', e.target.files?.[0] || null)}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <Button size="sm" variant="outline" onClick={() => document.getElementById('thumbnail-upload')?.click()}>
                      {t("video.select_image", "Select Image")}
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                onClick={uploadVideo}
                disabled={loading || !uploadForm.title || !uploadForm.video_file}
                className="w-full"
              >
                {loading ? t("video.uploading", "Uploading...") : t("video.upload_button", "Upload Video")}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'live' && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Radio className="w-5 h-5 mr-2" />
                {t("video.live_streaming", "Live Streaming")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isLive ? (
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <Radio className="w-12 h-12 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {t("video.ready_to_stream", "Ready to Go Live?")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("video.stream_description", "Share your expertise in real-time with the Mexivanza community")}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Camera className="w-4 h-4 mr-1" />
                        {t("video.camera_ready", "Camera Ready")}
                      </div>
                      <div className="flex items-center">
                        <Mic className="w-4 h-4 mr-1" />
                        {t("video.mic_ready", "Mic Ready")}
                      </div>
                      <div className="flex items-center">
                        <Settings className="w-4 h-4 mr-1" />
                        {t("video.settings_ok", "Settings OK")}
                      </div>
                    </div>
                    
                    <Button
                      onClick={startLiveStream}
                      disabled={loading}
                      size="lg"
                      className="bg-red-500 hover:bg-red-600"
                    >
                      {loading ? t("video.starting", "Starting...") : t("video.go_live", "Go Live")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <Radio className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center justify-center">
                      <Badge className="bg-red-500 hover:bg-red-600 mr-2">
                        {t("video.live", "LIVE")}
                      </Badge>
                      {t("video.streaming_now", "You're Live!")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("video.viewers_watching", "Viewers are watching your stream")}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">42</div>
                      <div className="text-xs text-muted-foreground">{t("video.viewers", "Viewers")}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">15:30</div>
                      <div className="text-xs text-muted-foreground">{t("video.duration", "Duration")}</div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={stopLiveStream}
                    variant="destructive"
                    size="lg"
                  >
                    {t("video.stop_stream", "End Stream")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t("video.my_content", "My Content")}</h2>
            <Badge variant="secondary">
              {userVideos.length} {t("video.videos", "videos")}
            </Badge>
          </div>

          {userVideos.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileVideo className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {t("video.no_content", "No videos yet")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t("video.no_content_desc", "Upload your first video or start a live stream to share your expertise.")}
                </p>
                <div className="flex space-x-2 justify-center">
                  <Button onClick={() => setActiveTab('upload')}>
                    <Upload className="w-4 h-4 mr-2" />
                    {t("video.upload_first", "Upload Video")}
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('live')}>
                    <Radio className="w-4 h-4 mr-2" />
                    {t("video.go_live_first", "Go Live")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userVideos.map(renderVideoCard)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};