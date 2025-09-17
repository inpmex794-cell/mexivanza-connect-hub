import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { api } from '../services/api';
import { Save, ArrowLeft, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PageFormData {
  title: string;
  slug: string;
  content: string;
  status: string;
}

export function PageCreator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<PageFormData>({
    title: '',
    slug: '',
    content: '',
    status: 'published'
  });

  useEffect(() => {
    if (isEdit) {
      fetchPageData();
    }
  }, [id, isEdit]);

  const fetchPageData = async () => {
    try {
      // This would fetch existing page data for editing
      // const response = await api.getPage(id);
      // if (response.success) {
      //   setFormData(response.data);
      // }
    } catch (error) {
      console.error('Error fetching page:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (field: keyof PageFormData, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug from title
      if (field === 'title') {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Validate required fields
      if (!formData.title || !formData.content) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      let response;
      if (isEdit) {
        response = await api.updatePage({ id, ...formData });
      } else {
        response = await api.createPage(formData);
      }

      if (response.success) {
        toast({
          title: "Success",
          description: `Page ${isEdit ? 'updated' : 'created'} successfully`
        });
        navigate('/dashboard/pages');
      } else {
        throw new Error(response.message || 'Failed to save page');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      toast({
        title: "Error",
        description: "Failed to save page",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard/pages')}
          >
            <ArrowLeft size={16} />
            <span className="ml-2">Back to Pages</span>
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              {isEdit ? 'Edit Page' : 'Create New Page'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isEdit ? 'Update your page content' : 'Create a new page for your site'}
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="ml-2">Saving...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span className="ml-2">{isEdit ? 'Update' : 'Create'} Page</span>
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2" size={20} />
            Page Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="About Us"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="about-us"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Write your page content here..."
              rows={12}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}