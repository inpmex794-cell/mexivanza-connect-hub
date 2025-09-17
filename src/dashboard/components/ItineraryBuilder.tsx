import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TripMap } from '@/components/maps/trip-map';
import { GoogleMapsProvider } from '@/components/maps/google-maps-loader';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Clock, 
  MapPin, 
  Image,
  ChevronUp,
  ChevronDown,
  Eye,
  Map
} from 'lucide-react';

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  location: string;
  time: string;
  image: string;
  lat?: number;
  lng?: number;
}

interface ItineraryBuilderProps {
  itinerary: ItineraryDay[];
  onChange: (itinerary: ItineraryDay[]) => void;
}

export function ItineraryBuilder({ itinerary, onChange }: ItineraryBuilderProps) {
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('builder');

  const addDay = () => {
    const newDay: ItineraryDay = {
      day: itinerary.length + 1,
      title: '',
      description: '',
      location: '',
      time: '09:00',
      image: '',
      lat: undefined,
      lng: undefined
    };
    onChange([...itinerary, newDay]);
  };

  const removeDay = (index: number) => {
    const updated = itinerary.filter((_, i) => i !== index);
    // Renumber days
    const renumbered = updated.map((day, i) => ({ ...day, day: i + 1 }));
    onChange(renumbered);
  };

  const updateDay = (index: number, field: keyof ItineraryDay, value: string | number) => {
    const updated = [...itinerary];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const moveDay = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === itinerary.length - 1)
    ) {
      return;
    }

    const updated = [...itinerary];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap the items
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    
    // Renumber days
    const renumbered = updated.map((day, i) => ({ ...day, day: i + 1 }));
    onChange(renumbered);
  };

  if (previewMode) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Itinerary Preview - Mobile View</CardTitle>
          <Button variant="outline" onClick={() => setPreviewMode(false)}>
            Exit Preview
          </Button>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm mx-auto bg-card border rounded-lg p-4 space-y-4">
            <h3 className="font-bold text-lg text-center">Trip Itinerary</h3>
            {itinerary.map((day, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">Day {day.day}</Badge>
                  <span className="text-sm text-muted-foreground">{day.time}</span>
                </div>
                {day.image && (
                  <div className="w-full h-32 bg-muted rounded mb-2 flex items-center justify-center">
                    <Image size={24} className="text-muted-foreground" />
                  </div>
                )}
                <h4 className="font-semibold">{day.title || 'Untitled Day'}</h4>
                {day.location && (
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <MapPin size={12} className="mr-1" />
                    {day.location}
                  </p>
                )}
                <p className="text-sm mt-2">{day.description || 'No description'}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Itinerary Builder</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setPreviewMode(true)}>
            <Eye size={16} />
            <span className="ml-2">Preview</span>
          </Button>
          <Button onClick={addDay}>
            <Plus size={16} />
            <span className="ml-2">Add Day</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6 mt-4">
        {itinerary.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No itinerary days yet. Click "Add Day" to get started.</p>
          </div>
        ) : (
          itinerary.map((day, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GripVertical size={16} className="text-muted-foreground cursor-move" />
                    <Badge variant="outline">Day {day.day}</Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveDay(index, 'up')}
                      disabled={index === 0}
                    >
                      <ChevronUp size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveDay(index, 'down')}
                      disabled={index === itinerary.length - 1}
                    >
                      <ChevronDown size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDay(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`title-${index}`}>Day Title</Label>
                    <Input
                      id={`title-${index}`}
                      value={day.title}
                      onChange={(e) => updateDay(index, 'title', e.target.value)}
                      placeholder="e.g., Arrival in Cancun"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`time-${index}`}>Time</Label>
                    <Input
                      id={`time-${index}`}
                      type="time"
                      value={day.time}
                      onChange={(e) => updateDay(index, 'time', e.target.value)}
                    />
                  </div>
                </div>

                  <div className="space-y-2">
                    <Label htmlFor={`location-${index}`} className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      Location
                    </Label>
                    <Input
                      id={`location-${index}`}
                      value={day.location}
                      onChange={(e) => updateDay(index, 'location', e.target.value)}
                      placeholder="e.g., Cancun International Airport"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`lat-${index}`}>Latitude</Label>
                      <Input
                        id={`lat-${index}`}
                        type="number"
                        step="any"
                        value={day.lat || ''}
                        onChange={(e) => updateDay(index, 'lat', parseFloat(e.target.value) || undefined)}
                        placeholder="19.4326"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`lng-${index}`}>Longitude</Label>
                      <Input
                        id={`lng-${index}`}
                        type="number"
                        step="any"
                        value={day.lng || ''}
                        onChange={(e) => updateDay(index, 'lng', parseFloat(e.target.value) || undefined)}
                        placeholder="-99.1332"
                      />
                    </div>
                  </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${index}`}>Description</Label>
                  <Textarea
                    id={`description-${index}`}
                    value={day.description}
                    onChange={(e) => updateDay(index, 'description', e.target.value)}
                    placeholder="Describe the activities and experiences for this day..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`image-${index}`} className="flex items-center">
                    <Image size={16} className="mr-1" />
                    Image URL
                  </Label>
                  <Input
                    id={`image-${index}`}
                    value={day.image}
                    onChange={(e) => updateDay(index, 'image', e.target.value)}
                    placeholder="https://example.com/day-image.jpg"
                  />
                  {day.image && (
                    <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
                      <Image size={24} className="text-muted-foreground" />
                      <span className="ml-2 text-sm text-muted-foreground">Preview</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {itinerary.length > 0 && (
          <div className="text-center pt-4">
            <Button variant="outline" onClick={addDay}>
              <Plus size={16} />
              <span className="ml-2">Add Another Day</span>
            </Button>
          </div>
            )}

            {itinerary.length > 0 && (
              <div className="text-center pt-4">
                <Button variant="outline" onClick={addDay}>
                  <Plus size={16} />
                  <span className="ml-2">Add Another Day</span>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="map">
            <div className="mt-4">
              <GoogleMapsProvider>
                <TripMap
                  itinerary={itinerary}
                  height="500px"
                  showRoutes={true}
                  interactive={true}
                />
              </GoogleMapsProvider>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}