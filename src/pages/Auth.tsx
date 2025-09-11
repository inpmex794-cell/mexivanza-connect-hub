import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/use-language";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";

export const Auth: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") as "login" | "register" || "login";
  const [authType, setAuthType] = useState<"login" | "register">(initialType);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // This will be replaced with actual Supabase authentication
    console.log(`${authType} attempt:`, { email, password });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.error("Por favor conecta Supabase para habilitar la autenticación");
    setLoading(false);
  };

  const handleForgotPassword = () => {
    toast.info("Función de recuperación de contraseña disponible con Supabase");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md shadow-strong border-0">
        <CardHeader className="text-center pb-4">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="h-8 w-8 rounded-lg bg-primary"></div>
            <span className="text-xl font-bold">Mexivanza</span>
          </Link>
          <CardTitle className="text-2xl">
            {authType === "login" ? t("auth.login") : t("auth.register")}
          </CardTitle>
          <CardDescription>
            {authType === "login" 
              ? "Ingresa a tu cuenta para continuar"
              : "Crea una cuenta para comenzar"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-all duration-300 focus:shadow-soft"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="transition-all duration-300 focus:shadow-soft"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              variant="facebook"
              size="lg"
              disabled={loading}
            >
              {loading ? "..." : (authType === "login" ? t("auth.login") : t("auth.register"))}
            </Button>

            {authType === "login" && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={handleForgotPassword}
              >
                {t("auth.forgot")}
              </Button>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              {authType === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
            </p>
            <Button
              variant="link"
              onClick={() => setAuthType(authType === "login" ? "register" : "login")}
            >
              {authType === "login" ? t("auth.register") : t("auth.login")}
            </Button>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              🔐 Para habilitar la autenticación completa, conecta tu proyecto a Supabase usando el botón verde en la interfaz.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};