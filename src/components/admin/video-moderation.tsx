import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/use-language';
import { supabase } from '@/integrations/supabase/client';
import { 
  Video, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Flag,
  AlertTriangle,
  Clock,
  Play,
  RefreshCw,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface VideoContent {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  category?: string;
  duration?: number;
  view_count: number;
  is_live: boolean;
  is_demo: boolean;
  created_at: string;
  user_id: string;
  business_id?: number;
  profiles?: {
    name: string;
    avatar_url?: string;
  };
}

interface ModerationFlag {
  id: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  automated: boolean;
}

export const VideoModeration: React.FC = () => {
  const { t } = useLanguage();
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [moderating, setModerating] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'flagged' | 'live'>('all');

  const fetchVideos = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('video_content')
        .select(`
          *,
          profiles (name, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (filter === 'live') {
        query = query.eq('is_live', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      setVideos((data as unknown as VideoContent[]) || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error(t('admin.error_loading_videos', 'Error loading video content'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [filter]);

  const moderateVideo = async (videoId: string, action: 'approve' | 'reject' | 'flag') => {
    try {
      setModerating(videoId);
      
      // In a real implementation, you would update the video status
      // For now, we'll simulate the action
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(
        action === 'approve' 
          ? t('admin.video_approved', 'Video approved')
          : action === 'reject'
          ? t('admin.video_rejected', 'Video rejected')
          : t('admin.video_flagged', 'Video flagged for review')
      );

      fetchVideos();
      setSelectedVideo(null);
    } catch (error) {
      console.error('Error moderating video:', error);
      toast.error(t('admin.error_moderating_video', 'Error moderating video'));
    } finally {
      setModerating(null);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getContentFlags = (video: VideoContent): ModerationFlag[] => {
    const flags: ModerationFlag[] = [];
    
    // Simulate AI-based content analysis
    if (video.title.toLowerCase().includes('urgent') || video.title.toLowerCase().includes('emergency')) {
      flags.push({
        id: '1',
        reason: t('moderation.clickbait_detected', 'Potential clickbait detected'),
        severity: 'medium',
        automated: true
      });
    }
    
    if (video.view_count > 10000) {
      flags.push({
        id: '2',
        reason: t('moderation.high_engagement', 'High engagement content - requires review'),
        severity: 'low',
        automated: true
      });
    }

    if (video.is_live) {
      flags.push({
        id: '3',
        reason: t('moderation.live_content', 'Live content - monitor in real-time'),
        severity: 'high',
        automated: true
      });
    }

    return flags;
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {t('priority.high', 'High Risk')}
        </Badge>;
      case 'medium':
        return <Badge variant="outline" className="text-xs border-yellow-200 text-yellow-800">
          <Flag className="h-3 w-3 mr-1" />
          {t('priority.medium', 'Medium Risk')}
        </Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">
          <Eye className="h-3 w-3 mr-1" />
          {t('priority.low', 'Low Risk')}
        </Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('admin.video_moderation', 'Video Moderation')}
          </h2>
          <p className="text-muted-foreground">
            {t('admin.video_moderation_desc', 'Monitor and moderate video content for policy compliance')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
          >
            <option value="all">{t('filter.all_videos', 'All Videos')}</option>
            <option value="flagged">{t('filter.flagged_only', 'Flagged Only')}</option>
            <option value="live">{t('filter.live_only', 'Live Only')}</option>
          </select>
          <Button 
            onClick={fetchVideos} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t('button.refresh', 'Refresh')}
          </Button>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="aspect-video bg-muted rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </CardHeader>
            </Card>
          ))
        ) : videos.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {t('admin.no_videos', 'No Videos Found')}
            </h3>
            <p className="text-muted-foreground">
              {filter === 'flagged' 
                ? t('admin.no_flagged_videos', 'No flagged videos at this time')
                : filter === 'live'
                ? t('admin.no_live_videos', 'No live streams currently active')
                : t('admin.no_videos_uploaded', 'No videos have been uploaded yet')
              }
            </p>
          </div>
        ) : (
          videos.map((video) => {
            const flags = getContentFlags(video);
            const highestSeverity = flags.reduce((max, flag) => {
              const severityOrder = { low: 1, medium: 2, high: 3 };
              return severityOrder[flag.severity] > severityOrder[max] ? flag.severity : max;
            }, 'low' as const);

            return (
              <Card key={video.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative">
                    <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                      {video.thumbnail_url ? (
                        <img 
                          src={video.thumbnail_url} 
                          alt={video.title}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      ) : (
                        <Play className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    
                    {/* Overlay badges */}
                    <div className="absolute top-2 left-2 flex space-x-1">
                      {video.is_live && (
                        <Badge className="bg-red-500 text-white">
                          {t('video.live', 'LIVE')}
                        </Badge>
                      )}
                      {flags.length > 0 && getSeverityBadge(highestSeverity)}
                    </div>
                    
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                        {formatDuration(video.duration)}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-medium line-clamp-2 mb-1">{video.title}</h3>
                    {video.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {video.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={video.profiles?.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {video.profiles?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{video.profiles?.name}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{video.view_count.toLocaleString()} views</span>
                    <span>{new Date(video.created_at).toLocaleDateString()}</span>
                  </div>

                  {flags.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-orange-600">
                        {t('moderation.flags_detected', 'Moderation Flags')}:
                      </p>
                      <div className="space-y-1">
                        {flags.slice(0, 2).map((flag) => (
                          <div key={flag.id} className="text-xs text-muted-foreground flex items-center">
                            <Flag className="h-3 w-3 mr-1" />
                            {flag.reason}
                          </div>
                        ))}
                        {flags.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{flags.length - 2} {t('moderation.more_flags', 'more flags')}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        {t('button.review', 'Review Video')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>
                          {t('admin.video_review', 'Video Review')} - {video.title}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                          <video
                            src={video.video_url}
                            controls
                            className="w-full h-full rounded-lg"
                            poster={video.thumbnail_url}
                          >
                            {t('video.not_supported', 'Your browser does not support the video tag.')}
                          </video>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-2">{t('video.details', 'Video Details')}</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>{t('video.title', 'Title')}:</strong> {video.title}</div>
                              <div><strong>{t('video.category', 'Category')}:</strong> {video.category || 'N/A'}</div>
                              <div><strong>{t('video.duration', 'Duration')}:</strong> {formatDuration(video.duration)}</div>
                              <div><strong>{t('video.views', 'Views')}:</strong> {video.view_count.toLocaleString()}</div>
                              <div><strong>{t('video.uploaded', 'Uploaded')}:</strong> {new Date(video.created_at).toLocaleString()}</div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">{t('moderation.analysis', 'Content Analysis')}</h4>
                            {flags.length > 0 ? (
                              <div className="space-y-2">
                                {flags.map((flag) => (
                                  <div key={flag.id} className="flex items-start space-x-2 p-2 bg-muted rounded-lg">
                                    <Flag className="h-4 w-4 mt-0.5 text-orange-500" />
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-1">
                                        {getSeverityBadge(flag.severity)}
                                        {flag.automated && (
                                          <Badge variant="outline" className="text-xs">
                                            <Shield className="h-3 w-3 mr-1" />
                                            {t('moderation.ai_detected', 'AI Detected')}
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-sm">{flag.reason}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-muted-foreground">
                                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                <p className="text-sm">{t('moderation.no_flags', 'No content violations detected')}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4 border-t">
                          <Button
                            variant="outline"
                            className="text-orange-600 border-orange-200 hover:bg-orange-50"
                            onClick={() => moderateVideo(video.id, 'flag')}
                            disabled={moderating === video.id}
                          >
                            <Flag className="h-4 w-4 mr-2" />
                            {t('button.flag', 'Flag for Review')}
                          </Button>
                          <Button
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => moderateVideo(video.id, 'reject')}
                            disabled={moderating === video.id}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            {t('button.remove', 'Remove')}
                          </Button>
                          <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => moderateVideo(video.id, 'approve')}
                            disabled={moderating === video.id}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {t('button.approve', 'Approve')}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};