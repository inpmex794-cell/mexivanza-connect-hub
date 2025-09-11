import React, { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Zap,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Gauge,
  AlertTriangle,
  MapPin,
  Calendar
} from "lucide-react";

interface WeatherData {
  location: string;
  coordinates: { lat: number; lon: number };
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    visibility: number;
    pressure: number;
    uvIndex: number;
    feelsLike: number;
  };
  forecast: {
    date: string;
    day: string;
    high: number;
    low: number;
    condition: string;
    precipitation: number;
  }[];
  alerts: {
    type: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
}

// Mock weather data for major Mexican cities
const mockWeatherData: { [key: string]: WeatherData } = {
  'Mexico City': {
    location: 'Mexico City',
    coordinates: { lat: 19.4326, lon: -99.1332 },
    current: {
      temperature: 22,
      condition: 'partly-cloudy',
      humidity: 65,
      windSpeed: 8,
      visibility: 10,
      pressure: 1013,
      uvIndex: 6,
      feelsLike: 24
    },
    forecast: [
      { date: '2024-01-16', day: 'Hoy', high: 25, low: 15, condition: 'partly-cloudy', precipitation: 10 },
      { date: '2024-01-17', day: 'Mañana', high: 27, low: 16, condition: 'sunny', precipitation: 0 },
      { date: '2024-01-18', day: 'Jueves', high: 24, low: 14, condition: 'rainy', precipitation: 80 }
    ],
    alerts: []
  },
  'Cancún': {
    location: 'Cancún',
    coordinates: { lat: 21.1619, lon: -86.8515 },
    current: {
      temperature: 28,
      condition: 'sunny',
      humidity: 78,
      windSpeed: 12,
      visibility: 15,
      pressure: 1016,
      uvIndex: 8,
      feelsLike: 32
    },
    forecast: [
      { date: '2024-01-16', day: 'Hoy', high: 30, low: 24, condition: 'sunny', precipitation: 5 },
      { date: '2024-01-17', day: 'Mañana', high: 29, low: 23, condition: 'partly-cloudy', precipitation: 15 },
      { date: '2024-01-18', day: 'Jueves', high: 28, low: 22, condition: 'rainy', precipitation: 60 }
    ],
    alerts: [
      {
        type: 'heat',
        title: 'Heat Advisory',
        description: 'High temperatures expected. Stay hydrated and avoid prolonged sun exposure.',
        severity: 'medium'
      }
    ]
  },
  'Guadalajara': {
    location: 'Guadalajara',
    coordinates: { lat: 20.6597, lon: -103.3496 },
    current: {
      temperature: 26,
      condition: 'cloudy',
      humidity: 55,
      windSpeed: 6,
      visibility: 12,
      pressure: 1010,
      uvIndex: 4,
      feelsLike: 27
    },
    forecast: [
      { date: '2024-01-16', day: 'Hoy', high: 28, low: 18, condition: 'cloudy', precipitation: 20 },
      { date: '2024-01-17', day: 'Mañana', high: 26, low: 17, condition: 'rainy', precipitation: 70 },
      { date: '2024-01-18', day: 'Jueves', high: 25, low: 16, condition: 'partly-cloudy', precipitation: 30 }
    ],
    alerts: []
  }
};

export const WeatherWidget: React.FC<{ location?: string }> = ({ location = 'Mexico City' }) => {
  const { t, language } = useLanguage();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedCity, setSelectedCity] = useState(location);
  const [loading, setLoading] = useState(false);

  const cities = Object.keys(mockWeatherData);

  useEffect(() => {
    loadWeatherData(selectedCity);
  }, [selectedCity, language]); // Add language dependency

  const loadWeatherData = async (city: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const baseData = mockWeatherData[city] || mockWeatherData['Mexico City'];
      
      // Update forecast days based on language
      const updatedForecast = baseData.forecast.map((day, index) => ({
        ...day,
        day: index === 0 
          ? t("weather.today", "Hoy")
          : index === 1 
          ? t("weather.tomorrow", "Mañana")
          : language === 'es' ? 'Jueves' : 'Thursday'
      }));
      
      setWeatherData({
        ...baseData,
        forecast: updatedForecast
      });
    } catch (error) {
      console.error('Error loading weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string, size = 'w-8 h-8') => {
    switch (condition) {
      case 'sunny':
        return <Sun className={`${size} text-yellow-500`} />;
      case 'partly-cloudy':
        return <Cloud className={`${size} text-gray-400`} />;
      case 'cloudy':
        return <Cloud className={`${size} text-gray-500`} />;
      case 'rainy':
        return <CloudRain className={`${size} text-blue-500`} />;
      case 'stormy':
        return <Zap className={`${size} text-purple-500`} />;
      case 'snowy':
        return <CloudSnow className={`${size} text-blue-200`} />;
      default:
        return <Sun className={`${size} text-yellow-500`} />;
    }
  };

  const getConditionText = (condition: string) => {
    const conditions = {
      sunny: t("weather.sunny", "Sunny"),
      'partly-cloudy': t("weather.partly_cloudy", "Partly Cloudy"),
      cloudy: t("weather.cloudy", "Cloudy"),
      rainy: t("weather.rainy", "Rainy"),
      stormy: t("weather.stormy", "Stormy"),
      snowy: t("weather.snowy", "Snowy")
    };
    return conditions[condition as keyof typeof conditions] || condition;
  };

  const getAlertSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTemperature = (temp: number) => {
    return `${temp}°C`;
  };

  if (loading || !weatherData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-12 bg-muted rounded w-1/2"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-16 bg-muted rounded"></div>
              <div className="h-16 bg-muted rounded"></div>
              <div className="h-16 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* City Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent border-none text-sm font-medium focus:outline-none cursor-pointer"
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Current Weather */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold">{formatTemperature(weatherData.current.temperature)}</h3>
              <p className="text-muted-foreground">{getConditionText(weatherData.current.condition)}</p>
              <p className="text-sm text-muted-foreground">
                {t("weather.feels_like", "Feels like")} {formatTemperature(weatherData.current.feelsLike)}
              </p>
            </div>
            <div className="text-right">
              {getWeatherIcon(weatherData.current.condition, 'w-16 h-16')}
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <Droplets className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <div className="text-sm font-medium">{weatherData.current.humidity}%</div>
              <div className="text-xs text-muted-foreground">{t("weather.humidity", "Humidity")}</div>
            </div>
            
            <div className="text-center">
              <Wind className="w-5 h-5 text-gray-500 mx-auto mb-1" />
              <div className="text-sm font-medium">{weatherData.current.windSpeed} km/h</div>
              <div className="text-xs text-muted-foreground">{t("weather.wind", "Wind")}</div>
            </div>
            
            <div className="text-center">
              <Eye className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
              <div className="text-sm font-medium">{weatherData.current.visibility} km</div>
              <div className="text-xs text-muted-foreground">{t("weather.visibility", "Visibility")}</div>
            </div>
            
            <div className="text-center">
              <Gauge className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <div className="text-sm font-medium">{weatherData.current.pressure} mb</div>
              <div className="text-xs text-muted-foreground">{t("weather.pressure", "Pressure")}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Alerts */}
      {weatherData.alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {t("weather.alerts", "Weather Alerts")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weatherData.alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${getAlertSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5" />
                  <div>
                    <h4 className="font-medium">{alert.title}</h4>
                    <p className="text-sm mt-1">{alert.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 3-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Calendar className="w-5 h-5 mr-2" />
            {t("weather.forecast", "3-Day Forecast")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium w-20">
                  {day.day}
                </div>
                {getWeatherIcon(day.condition, 'w-6 h-6')}
                <div className="text-sm text-muted-foreground">
                  {getConditionText(day.condition)}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {day.precipitation > 0 && (
                  <div className="flex items-center text-xs text-blue-600">
                    <Droplets className="w-3 h-3 mr-1" />
                    {day.precipitation}%
                  </div>
                )}
                <div className="text-sm">
                  <span className="font-medium">{formatTemperature(day.high)}</span>
                  <span className="text-muted-foreground mx-1">/</span>
                  <span className="text-muted-foreground">{formatTemperature(day.low)}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* UV Index */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sun className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">{t("weather.uv_index", "UV Index")}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={weatherData.current.uvIndex > 7 ? "destructive" : weatherData.current.uvIndex > 4 ? "secondary" : "outline"}
              >
                {weatherData.current.uvIndex}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {weatherData.current.uvIndex > 7 
                  ? t("weather.uv_high", "High")
                  : weatherData.current.uvIndex > 4 
                  ? t("weather.uv_moderate", "Moderate")
                  : t("weather.uv_low", "Low")
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};