import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminButton } from "@/components/ui/admin-button";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Globe, AlertTriangle } from "lucide-react";

interface FinancialData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  change_amount: number;
  change_percent: number;
  volume: number;
  market_cap: number;
  last_updated: string;
}

export const FinancialDashboardModule: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isAdmin } = useAuth();
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
    // Set up real-time updates
    const interval = setInterval(fetchFinancialData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchFinancialData = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_data')
        .select('*')
        .order('market_cap', { ascending: false })
        .limit(10);

      if (error) throw error;
      setFinancialData(data || []);
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'es' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4" />;
    if (change < 0) return <TrendingDown className="h-4 w-4" />;
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            {t("financial.title", "Bolsa de Valores")}
          </h2>
          <p className="text-muted-foreground">
            {t("financial.subtitle", "Mexican Stock Market Dashboard")}
          </p>
        </div>
        {isAdmin && (
          <AdminButton action="settings">
            {t("financial.manage", "Manage Data")}
          </AdminButton>
        )}
      </div>

      {/* Disclaimer */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">
                {t("financial.disclaimer_title", "Investment Disclaimer")}
              </p>
              <p className="text-yellow-700 mt-1">
                {t("financial.disclaimer", "This information is for educational purposes only and should not be considered as investment advice. Always consult with a financial advisor before making investment decisions.")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("financial.total_market_cap", "Total Market Cap")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(financialData.reduce((sum, item) => sum + (item.market_cap || 0), 0))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("financial.active_stocks", "Active Stocks")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {financialData.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("financial.market_status", "Market Status")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600">
                {t("financial.market_open", "Market Open")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock List */}
      <div className="space-y-4">
        {financialData.map((stock) => (
          <Card key={stock.id} className="hover:shadow-medium transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-bold text-primary text-sm">
                      {stock.symbol.substring(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{stock.symbol}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {stock.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      {formatCurrency(stock.current_price)}
                    </div>
                    <div className={`text-sm flex items-center gap-1 ${getChangeColor(stock.change_percent)}`}>
                      {getChangeIcon(stock.change_percent)}
                      {stock.change_percent > 0 ? '+' : ''}{stock.change_percent.toFixed(2)}%
                    </div>
                  </div>

                  <div className="text-right hidden md:block">
                    <div className="text-sm text-muted-foreground">
                      {t("financial.volume", "Volume")}
                    </div>
                    <div className="font-medium text-foreground">
                      {formatNumber(stock.volume)}
                    </div>
                  </div>

                  <div className="text-right hidden lg:block">
                    <div className="text-sm text-muted-foreground">
                      {t("financial.market_cap", "Market Cap")}
                    </div>
                    <div className="font-medium text-foreground">
                      {formatNumber(stock.market_cap)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {financialData.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t("financial.no_data", "No financial data available")}
            </h3>
            <p className="text-muted-foreground">
              {t("financial.no_data_desc", "Financial data will appear here when available.")}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-muted-foreground text-center">
        {t("financial.last_updated", "Last updated")}: {new Date().toLocaleString(language === 'es' ? 'es-MX' : 'en-US')}
      </div>
    </div>
  );
};