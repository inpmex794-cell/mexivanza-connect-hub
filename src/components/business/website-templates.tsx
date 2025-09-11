import React, { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Gallery } from "@/components/ui/gallery";
import {
  Globe,
  Edit3,
  Eye,
  Save,
  Palette,
  Layout,
  Camera,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram
} from "lucide-react";

interface TemplateSection {
  id: string;
  type: 'hero' | 'services' | 'gallery' | 'contact' | 'footer';
  title: string;
  content: string;
  editable: boolean;
}

const defaultTemplate: TemplateSection[] = [
  {
    id: 'hero',
    type: 'hero',
    title: 'Hero Section',
    content: JSON.stringify({
      title: 'Your Business Name',
      tagline: 'Professional services you can trust',
      background: '/placeholder-hero.jpg'
    }),
    editable: true
  },
  {
    id: 'services',
    type: 'services',
    title: 'Services',
    content: JSON.stringify({
      title: 'Our Services',
      services: [
        { title: 'Service 1', description: 'High quality service description', icon: '🔧' },
        { title: 'Service 2', description: 'Another service description', icon: '💼' },
        { title: 'Service 3', description: 'Third service description', icon: '🎯' }
      ]
    }),
    editable: true
  },
  {
    id: 'gallery',
    type: 'gallery',
    title: 'Gallery',
    content: JSON.stringify({
      title: 'Our Work',
      images: [
        '/placeholder-1.jpg',
        '/placeholder-2.jpg',
        '/placeholder-3.jpg'
      ]
    }),
    editable: true
  },
  {
    id: 'contact',
    type: 'contact',
    title: 'Contact',
    content: JSON.stringify({
      title: 'Contact Us',
      phone: '+52 555 123 4567',
      email: 'info@yourbusiness.com',
      address: 'Mexico City, Mexico',
      hours: 'Mon-Fri 9AM-6PM'
    }),
    editable: true
  },
  {
    id: 'footer',
    type: 'footer',
    title: 'Footer',
    content: JSON.stringify({
      copyright: '© 2024 Your Business. All rights reserved.',
      social: {
        facebook: '',
        twitter: '',
        instagram: ''
      }
    }),
    editable: true
  }
];

export const WebsiteTemplates: React.FC = () => {
  const { t } = useLanguage();
  const [template, setTemplate] = useState<TemplateSection[]>(defaultTemplate);
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('modern');

  const themes = [
    { id: 'modern', name: 'Modern', colors: ['bg-blue-500', 'bg-blue-600', 'bg-blue-700'] },
    { id: 'warm', name: 'Warm', colors: ['bg-orange-500', 'bg-red-500', 'bg-yellow-500'] },
    { id: 'nature', name: 'Nature', colors: ['bg-green-500', 'bg-emerald-600', 'bg-teal-500'] },
    { id: 'elegant', name: 'Elegant', colors: ['bg-purple-500', 'bg-indigo-600', 'bg-violet-500'] }
  ];

  const updateSection = (sectionId: string, newContent: string) => {
    setTemplate(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, content: newContent }
        : section
    ));
  };

  const renderSection = (section: TemplateSection) => {
    const content = JSON.parse(section.content);

    switch (section.type) {
      case 'hero':
        return (
          <div className="relative h-96 bg-gradient-to-r from-primary to-primary-foreground text-white overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 flex items-center justify-center h-full text-center p-8">
              <div>
                <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
                <p className="text-xl opacity-90">{content.tagline}</p>
                <Button className="mt-6" size="lg">
                  {t("template.get_started", "Get Started")}
                </Button>
              </div>
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center mb-8">{content.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.services.map((service: any, index: number) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center mb-8">{content.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {content.images.map((image: string, index: number) => (
                <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <Camera className="w-12 h-12 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="py-12 bg-muted/50 rounded-lg">
            <h2 className="text-3xl font-bold text-center mb-8">{content.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>{content.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>{content.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{content.address}</span>
                </div>
              </div>
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-4">{t("template.contact_form", "Send Message")}</h3>
                <div className="space-y-3">
                  <div className="h-10 bg-muted rounded"></div>
                  <div className="h-10 bg-muted rounded"></div>
                  <div className="h-20 bg-muted rounded"></div>
                  <Button className="w-full">{t("template.send", "Send")}</Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'footer':
        return (
          <footer className="bg-muted py-8 mt-12 rounded-lg">
            <div className="text-center">
              <div className="flex justify-center space-x-4 mb-4">
                <Facebook className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer" />
                <Twitter className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer" />
                <Instagram className="w-6 h-6 text-muted-foreground hover:text-primary cursor-pointer" />
              </div>
              <p className="text-sm text-muted-foreground">{content.copyright}</p>
            </div>
          </footer>
        );

      default:
        return null;
    }
  };

  const renderEditor = (section: TemplateSection) => {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {section.title}
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateSection(section.id, section.content)}
            >
              <Save className="w-4 h-4 mr-2" />
              {t("template.save", "Save")}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={section.content}
            onChange={(e) => updateSection(section.id, e.target.value)}
            className="min-h-32"
            placeholder="Edit content..."
          />
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("template.title", "Website Builder")}</h1>
          <p className="text-muted-foreground">
            {t("template.subtitle", "Create a professional website for your business")}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={editMode ? "default" : "outline"}
            onClick={() => setEditMode(!editMode)}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {t("template.edit", "Edit")}
          </Button>
          
          <Button
            variant={previewMode ? "default" : "outline"}
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {t("template.preview", "Preview")}
          </Button>
        </div>
      </div>

      {/* Theme Selector */}
      {editMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              {t("template.themes", "Choose Theme")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {themes.map((theme) => (
                <Card
                  key={theme.id}
                  className={`cursor-pointer transition-all ${
                    selectedTheme === theme.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex space-x-1 mb-2">
                      {theme.colors.map((color, index) => (
                        <div key={index} className={`w-6 h-6 rounded ${color}`} />
                      ))}
                    </div>
                    <p className="text-sm font-medium">{theme.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Editor/Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        {editMode && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Layout className="w-5 h-5" />
              <h2 className="text-xl font-semibold">{t("template.editor", "Editor")}</h2>
            </div>
            {template.map((section) => renderEditor(section))}
          </div>
        )}

        {/* Preview Panel */}
        <div className={editMode ? '' : 'lg:col-span-2'}>
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="w-5 h-5" />
            <h2 className="text-xl font-semibold">{t("template.preview", "Preview")}</h2>
            <Badge variant="secondary">{themes.find(t => t.id === selectedTheme)?.name}</Badge>
          </div>
          
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-background min-h-screen">
                {template.map((section) => (
                  <div key={section.id} className="p-6">
                    {renderSection(section)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">{t("template.ready", "Ready to go live?")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("template.ready_desc", "Publish your website and start attracting customers")}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                {t("template.save_draft", "Save Draft")}
              </Button>
              <Button>
                <Globe className="w-4 h-4 mr-2" />
                {t("template.publish", "Publish Website")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};