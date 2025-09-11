import React, { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  CreditCard,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  XCircle,
  Package,
  DollarSign,
  Percent
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image?: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface PaymentHistory {
  id: string;
  business_id: number;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  items: CartItem[];
}

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Legal Consultation',
    description: '1-hour consultation with certified lawyer',
    price: 1500.00,
    currency: 'MXN',
    category: 'Legal'
  },
  {
    id: '2',
    name: 'Travel Package - Cancún',
    description: '3 days/2 nights all-inclusive package',
    price: 8500.00,
    currency: 'MXN',
    category: 'Travel'
  },
  {
    id: '3',
    name: 'Website Development',
    description: 'Professional business website',
    price: 12000.00,
    currency: 'MXN',
    category: 'Digital'
  },
  {
    id: '4',
    name: 'Business Registration',
    description: 'Complete business incorporation service',
    price: 3500.00,
    currency: 'MXN',
    category: 'Legal'
  }
];

export const PaymentSystem: React.FC = () => {
  const { t } = useLanguage();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.16; // 16% IVA in Mexico
  };

  const processPayment = async () => {
    if (cart.length === 0) return;

    setProcessingPayment(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create payment record
      const paymentRecord: PaymentHistory = {
        id: Date.now().toString(),
        business_id: 1, // Mock business ID
        amount: calculateTotal() + calculateTax(calculateTotal()),
        currency: 'MXN',
        status: 'completed',
        created_at: new Date().toISOString(),
        items: [...cart]
      };

      setPaymentHistory(prev => [paymentRecord, ...prev]);
      setCart([]);
      
      // Show success notification
      alert(t("payment.success", "Payment processed successfully!"));
    } catch (error) {
      console.error('Payment error:', error);
      alert(t("payment.error", "Payment failed. Please try again."));
    } finally {
      setProcessingPayment(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            {t("payment.completed", "Completed")}
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            {t("payment.failed", "Failed")}
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary">
            {t("payment.pending", "Pending")}
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'MXN') => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const subtotal = calculateTotal();
  const tax = calculateTax(subtotal);
  const total = subtotal + tax;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{t("payment.title", "Payment System")}</h1>
        <p className="text-muted-foreground">
          {t("payment.subtitle", "Secure payments for verified businesses")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                {t("payment.products", "Available Services")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {product.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold">
                              {formatCurrency(product.price, product.currency)}
                            </span>
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {product.category}
                            </Badge>
                          </div>
                          
                          <Button
                            size="sm"
                            onClick={() => addToCart(product)}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            {t("payment.add", "Add")}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>{t("payment.history", "Payment History")}</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{t("payment.no_history", "No payment history yet")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <Card key={payment.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">
                              {formatCurrency(payment.amount, payment.currency)}
                            </span>
                            {getStatusBadge(payment.status)}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          {payment.items.length} {t("payment.items", "items")}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Shopping Cart */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                {t("payment.cart", "Shopping Cart")}
                {cart.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{t("payment.empty_cart", "Your cart is empty")}</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <span className="font-medium text-sm">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cart Summary */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t("payment.subtotal", "Subtotal")}</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center">
                        {t("payment.tax", "IVA (16%)")}
                        <Percent className="w-3 h-3 ml-1" />
                      </span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>{t("payment.total", "Total")}</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    className="w-full"
                    onClick={processPayment}
                    disabled={processingPayment}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {processingPayment
                      ? t("payment.processing", "Processing...")
                      : t("payment.checkout", "Secure Checkout")
                    }
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};