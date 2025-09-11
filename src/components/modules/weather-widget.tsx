import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudSnow, 
  Wind, 
  Droplets, 
  Thermometer,
  Eye,
  MapPin,
  AlertTriangle
} from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  uvIndex: number;
  forecast: {
    day: string;
    high: number;
    low: number;
    condition: string;
  }[];
  alerts?: {
    type: string;
    description: string;
  }[];
}

export const WeatherWidget: React.FC = () => {
  const { t, language } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate weather data fetch
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 600000); // Update every 10 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchWeatherData = async () => {
    // Simulate API call - replace with actual weather API
    setTimeout(() => {
      setWeather({
        location: "Ciudad de México",
        temperature: 22,
        condition: "partly-cloudy",
        humidity: 65,
        windSpeed: 12,
        visibility: 10,
        uvIndex: 6,
        forecast: [
          { day: t("weather.today", "Today"), high: 25, low: 18, condition: 'sunny' },
          { day: t("weather.tomorrow", "Tomorrow"), high: 23, low: 16, condition: 'cloudy' },
          { day: t("weather.day_after", "Day after"), high: 26, low: 19, condition: 'partly-cloudy' }
        ],
        alerts: [
          {
            type: 'uv',
            description: t("weather.uv_alert", "High UV index. Use sunscreen.")
          }
        ]
      });
      setLoading(false);
    }, 1000);
  };

  const getWeatherIcon = (condition: string, size: number = 24) => {
    const className = `h-${size} w-${size}`;
    switch (condition) {
      case 'sunny':
        return <Sun className={`${className} text-yellow-500`} />;
      case 'cloudy':
        return <Cloud className={`${className} text-gray-500`} />;
      case 'partly-cloudy':
        return <Cloud className={`${className} text-blue-400`} />;
      case 'rainy':
        return <CloudRain className={`${className} text-blue-600`} />;
      case 'snowy':
        return <CloudSnow className={`${className} text-blue-200`} />;
      default:
        return <Sun className={`${className} text-yellow-500`} />;
    }
  };

  const getConditionText = (condition: string) => {
    const conditions = {
      'sunny': language === 'es' ? 'Soleado' : 'Sunny',
      'cloudy': language === 'es' ? 'Nublado' : 'Cloudy',
      'partly-cloudy': language === 'es' ? 'Parcialmente nublado' : 'Partly Cloudy',
      'rainy': language === 'es' ? 'Lluvioso' : 'Rainy',
      'snowy': language === 'es' ? 'Nevando' : 'Snowy'
    };
    return conditions[condition as keyof typeof conditions] || condition;
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            {t("weather.error", "Unable to load weather data")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Weather */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-lg">{weather.location}</CardTitle>
            </div>
            {getWeatherIcon(weather.condition, 6)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground">
                {weather.temperature}°C
              </div>
              <div className="text-sm text-muted-foreground">
                {getConditionText(weather.condition)}
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <div className="text-sm">
                <div className="text-muted-foreground">
                  {t("weather.humidity", "Humidity")}
                </div>
                <div className="font-medium">{weather.humidity}%</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-gray-500" />
              <div className="text-sm">
                <div className="text-muted-foreground">
                  {t("weather.wind", "Wind")}
                </div>
                <div className="font-medium">{weather.windSpeed} km/h</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-purple-500" />
              <div className="text-sm">
                <div className="text-muted-foreground">
                  {t("weather.visibility", "Visibility")}
                </div>
                <div className="font-medium">{weather.visibility} km</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-orange-500" />
              <div className="text-sm">
                <div className="text-muted-foreground">
                  {t("weather.uv_index", "UV Index")}
                </div>
                <div className="font-medium">{weather.uvIndex}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {weather.alerts && weather.alerts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-4">
            {weather.alerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">
                    {t("weather.alert", "Weather Alert")}
                  </p>
                  <p className="text-yellow-700">{alert.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 3-Day Forecast */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            {t("weather.forecast", "3-Day Forecast")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weather.forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getWeatherIcon(day.condition, 5)}
                  <span className="text-sm font-medium">{day.day}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{day.high}°</span>
                  <span className="text-muted-foreground">{day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground text-center">
        {t("weather.last_updated", "Last updated")}: {new Date().toLocaleTimeString(language === 'es' ? 'es-MX' : 'en-US')}
      </div>
    </div>
  );
};