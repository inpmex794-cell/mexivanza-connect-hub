import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Globe, DollarSign, Calendar, Palette } from 'lucide-react';

export function SettingsPage() {
  const [settings, setSettings] = useState({
    site_name: 'Mexivanza',
    site_description: 'Mexico\'s premier travel platform',
    default_currency: 'USD',
    default_language: 'en',
    date_format: 'MM/DD/YYYY',
    allow_bookings: true,
    require_approval: false,
    email_notifications: true,
    contact_email: 'contact@mexivanza.com',
    phone_number: '+52 999 123 4567',
    address: 'Playa del Carmen, Quintana Roo, Mexico'
  });

  const handleSave = async () => {
    // In real implementation, save to API
    console.log('Saving settings:', settings);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Configure your travel platform settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Settings size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">General Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="site_name">Site Name</Label>
              <Input
                id="site_name"
                value={settings.site_name}
                onChange={(e) => setSettings({...settings, site_name: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="site_description">Site Description</Label>
              <Textarea
                id="site_description"
                value={settings.site_description}
                onChange={(e) => setSettings({...settings, site_description: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({...settings, contact_email: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                value={settings.phone_number}
                onChange={(e) => setSettings({...settings, phone_number: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => setSettings({...settings, address: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Localization */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Globe size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Localization</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label>Default Currency</Label>
              <Select value={settings.default_currency} onValueChange={(value) => setSettings({...settings, default_currency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="MXN">MXN - Mexican Peso</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Default Language</Label>
              <Select value={settings.default_language} onValueChange={(value) => setSettings({...settings, default_language: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Date Format</Label>
              <Select value={settings.date_format} onValueChange={(value) => setSettings({...settings, date_format: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Booking Settings */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Calendar size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Booking Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Online Bookings</Label>
                <p className="text-sm text-muted-foreground">Enable customers to book trips online</p>
              </div>
              <Switch
                checked={settings.allow_bookings}
                onCheckedChange={(checked) => setSettings({...settings, allow_bookings: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Require Approval</Label>
                <p className="text-sm text-muted-foreground">Manually approve all bookings</p>
              </div>
              <Switch
                checked={settings.require_approval}
                onCheckedChange={(checked) => setSettings({...settings, require_approval: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send booking confirmation emails</p>
              </div>
              <Switch
                checked={settings.email_notifications}
                onCheckedChange={(checked) => setSettings({...settings, email_notifications: checked})}
              />
            </div>
          </div>
        </div>

        {/* Brand Settings */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Palette size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Brand Colors</h2>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Primary Color</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-8 h-8 bg-primary rounded border border-border"></div>
                  <span className="text-sm text-muted-foreground">#004aad</span>
                </div>
              </div>
              <div>
                <Label>Accent Color</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-8 h-8 bg-accent rounded border border-border"></div>
                  <span className="text-sm text-muted-foreground">#ffb400</span>
                </div>
              </div>
            </div>
            
            <div>
              <Label>Background Color</Label>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-8 h-8 bg-background rounded border border-border"></div>
                <span className="text-sm text-muted-foreground">#f0f4ff</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}