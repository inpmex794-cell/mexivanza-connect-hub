import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Mail, Lock, ArrowLeft, Shield, CheckCircle } from "lucide-react";

export const Auth: React.FC = () => {
  const [authType, setAuthType] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user, userRole, isAdmin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Redirect if already logged in based on role
  useEffect(() => {
    if (user) {
      if (user.email === 'mexivanza@mexivanza.com' || isAdmin) {
        navigate('/admin-dashboard');
      } else if (userRole === 'verified') {
        navigate('/verified-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, userRole, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      let result;
      if (authType === "login") {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password);
      }

      if (result.error) {
        if (result.error.message.includes("Invalid login credentials")) {
          toast.error("Credenciales inválidas. Verifica tu email y contraseña.");
        } else if (result.error.message.includes("User already registered")) {
          toast.error("Este email ya está registrado. Intenta iniciar sesión.");
        } else if (result.error.message.includes("Password should be at least")) {
          toast.error("La contraseña debe tener al menos 6 caracteres.");
        } else {
          toast.error(result.error.message);
        }
      } else {
        if (authType === "register") {
          toast.success("Cuenta creada exitosamente. ¡Bienvenido a Mexivanza!");
        } else {
          toast.success("Inicio de sesión exitoso. ¡Bienvenido de vuelta!");
        }
      }
    } catch (error) {
      toast.error("Error inesperado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Button>

        {/* Auth Card */}
        <Card className="shadow-elegant">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <CardTitle className="text-2xl">
              {authType === "login" ? (
                <>
                  <LogIn className="inline mr-2 h-5 w-5" />
                  <span className="break-words">Login / Iniciar Sesión</span>
                </>
              ) : (
                <>
                  <UserPlus className="inline mr-2 h-5 w-5" />
                  <span className="break-words">Register / Crear Cuenta</span>
                </>
              )}
            </CardTitle>
            <CardDescription className="break-words">
              {authType === "login" 
                ? "Access your Mexivanza account / Accede a tu cuenta de Mexivanza"
                : "Join the Mexivanza platform / Únete a la plataforma Mexivanza"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="inline mr-2 h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">
                  <Lock className="inline mr-2 h-4 w-4" />
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? t("auth.processing", "Processing...") : (
                  authType === "login" ? t("auth.login_button", "Sign In") : t("auth.register_button", "Create Account")
                )}
              </Button>
            </form>

            <Separator className="my-6" />
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {authType === "login" 
                  ? t("auth.no_account", "Don't have an account?") 
                  : t("auth.have_account", "Already have an account?")
                }
              </p>
              <Button 
                variant="outline" 
                onClick={() => setAuthType(authType === "login" ? "register" : "login")}
                className="w-full"
              >
                {authType === "login" ? t("auth.switch_to_register", "Create Account") : t("auth.switch_to_login", "Sign In")}
              </Button>
            </div>

            {/* Demo Accounts Notice */}
            <div className="mt-6 space-y-3">
              <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-semibold text-red-800 dark:text-red-200">Admin Access</span>
                </div>
                <p className="text-xs text-red-700 dark:text-red-300">
                  <strong>mexivanza@mexivanza.com</strong> - Full administrative access to all platform features
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-xs font-medium text-green-800 dark:text-green-200">Verified User</span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Access to encrypted messaging, ad posting, and real estate listings
                  </p>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-1">
                    <UserPlus className="h-3 w-3 text-blue-600" />
                    <span className="text-xs font-medium text-blue-800 dark:text-blue-200">Basic User</span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Standard access to public content and basic features
                  </p>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground text-center mt-2">
                💡 Create your own account or use mexivanza@mexivanza.com for full demo access
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};