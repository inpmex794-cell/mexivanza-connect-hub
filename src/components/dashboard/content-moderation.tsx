import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/hooks/use-language';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Flag, 
  Eye,
  AlertTriangle,
  MessageSquare,
  Image as ImageIcon,
  Video,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface PendingContent {
  id: string;
  title: string;
  content: string;
  category: string;
  is_ad: boolean;
  ad_status: string;
  created_at: string;
  user_id: string;
  images?: any;
  video_url?: string;
  profiles?: {
    name: string;
    avatar_url?: string;
  } | null;
}

export const ContentModeration: React.FC = () => {
  const { t } = useLanguage();
  const [pendingContent, setPendingContent] = useState<PendingContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<PendingContent | null>(null);
  const [moderationNote, setModerationNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [moderating, setModerating] = useState<string | null>(null);

  const fetchPendingContent = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_posts')
        .select(`
          *,
          profiles (name, avatar_url)
        `)
        .eq('ad_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPendingContent((data as unknown as PendingContent[]) || []);
    } catch (error) {
      console.error('Error fetching pending content:', error);
      toast.error(t('admin.error_loading_content', 'Error loading pending content'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingContent();
  }, []);

  const moderateContent = async (contentId: string, status: 'approved' | 'rejected', note?: string) => {
    try {
      setModerating(contentId);
      
      const { error } = await supabase
        .from('user_posts')
        .update({ 
          ad_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', contentId);

      if (error) throw error;

      toast.success(
        status === 'approved' 
          ? t('admin.content_approved', 'Content approved successfully')
          : t('admin.content_rejected', 'Content rejected')
      );

      fetchPendingContent();
      setSelectedContent(null);
      setModerationNote('');
    } catch (error) {
      console.error('Error moderating content:', error);
      toast.error(t('admin.error_moderating', 'Error moderating content'));
    } finally {
      setModerating(null);
    }
  };

  const getContentTypeIcon = (content: PendingContent) => {
    if (content.video_url) return <Video className="h-4 w-4" />;
    if (content.images) return <ImageIcon className="h-4 w-4" />;
    return <MessageSquare className="h-4 w-4" />;
  };

  const getPriorityLevel = (content: PendingContent) => {
    const daysSinceCreated = Math.floor(
      (Date.now() - new Date(content.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceCreated > 3) return 'high';
    if (daysSinceCreated > 1) return 'medium';
    return 'low';
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {t('priority.high', 'High Priority')}
        </Badge>;
      case 'medium':
        return <Badge variant="outline" className="text-xs border-yellow-200 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          {t('priority.medium', 'Medium')}
        </Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">
          {t('priority.low', 'Low')}
        </Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('admin.content_moderation', 'Content Moderation')}
          </h2>
          <p className="text-muted-foreground">
            {t('admin.content_moderation_desc', 'Review and moderate user-generated content')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-orange-600">
            {pendingContent.length} {t('admin.pending_review', 'pending review')}
          </Badge>
          <Button 
            onClick={fetchPendingContent} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t('button.refresh', 'Refresh')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Flag className="h-5 w-5 mr-2" />
                {t('admin.pending_content', 'Pending Content')}
              </CardTitle>
              <CardDescription>
                {t('admin.click_to_review', 'Click on any item to review in detail')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                      <div className="h-10 w-10 bg-muted rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : pendingContent.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">{t('admin.no_pending_content', 'No content pending moderation')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingContent.map((content) => {
                    const priority = getPriorityLevel(content);
                    return (
                      <div 
                        key={content.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                          selectedContent?.id === content.id ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setSelectedContent(content)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={content.profiles?.avatar_url} />
                              <AvatarFallback>
                                {content.profiles?.name?.charAt(0).toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-sm">{content.profiles?.name}</span>
                                <Badge variant="outline" className="text-xs">{content.category}</Badge>
                                {content.is_ad && (
                                  <Badge variant="secondary" className="text-xs">
                                    {t('content.advertisement', 'Ad')}
                                  </Badge>
                                )}
                              </div>
                              <h4 className="font-medium text-sm mb-1">{content.title}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {content.content}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                {getContentTypeIcon(content)}
                                <span className="text-xs text-muted-foreground">
                                  {new Date(content.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            {getPriorityBadge(priority)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Review Panel */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                {t('admin.review_panel', 'Review Panel')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedContent ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">{selectedContent.title}</h3>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm">{selectedContent.content}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedContent.profiles?.avatar_url} />
                      <AvatarFallback>
                        {selectedContent.profiles?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{selectedContent.profiles?.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(selectedContent.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{selectedContent.category}</Badge>
                    {selectedContent.is_ad && (
                      <Badge variant="secondary">{t('content.advertisement', 'Advertisement')}</Badge>
                    )}
                    {getPriorityBadge(getPriorityLevel(selectedContent))}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t('admin.moderation_note', 'Moderation Note (Optional)')}
                    </label>
                    <Textarea
                      placeholder={t('admin.moderation_note_placeholder', 'Add a note about your decision...')}
                      value={moderationNote}
                      onChange={(e) => setModerationNote(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => moderateContent(selectedContent.id, 'approved', moderationNote)}
                      disabled={moderating === selectedContent.id}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t('button.approve', 'Approve')}
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => moderateContent(selectedContent.id, 'rejected', moderationNote)}
                      disabled={moderating === selectedContent.id}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {t('button.reject', 'Reject')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-sm">
                    {t('admin.select_content_to_review', 'Select content from the list to review')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};