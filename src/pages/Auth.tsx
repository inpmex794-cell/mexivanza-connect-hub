import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Mail, Lock, ArrowLeft } from "lucide-react";

export const Auth: React.FC = () => {
  const [authType, setAuthType] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.email === 'mexivanza@mexivanza.com' || isAdmin) {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, isAdmin, navigate]);

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
                  Iniciar Sesión
                </>
              ) : (
                <>
                  <UserPlus className="inline mr-2 h-5 w-5" />
                  Crear Cuenta
                </>
              )}
            </CardTitle>
            <CardDescription>
              {authType === "login" 
                ? "Accede a tu cuenta de Mexivanza"
                : "Únete a la plataforma Mexivanza"
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
                {loading ? "Procesando..." : (
                  authType === "login" ? "Iniciar Sesión" : "Crear Cuenta"
                )}
              </Button>
            </form>

            <Separator className="my-6" />
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {authType === "login" 
                  ? "¿No tienes cuenta?" 
                  : "¿Ya tienes cuenta?"
                }
              </p>
              <Button 
                variant="outline" 
                onClick={() => setAuthType(authType === "login" ? "register" : "login")}
                className="w-full"
              >
                {authType === "login" ? "Crear Cuenta" : "Iniciar Sesión"}
              </Button>
            </div>

            {/* Admin Notice */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                💡 <strong>Administradores:</strong> Usa mexivanza@mexivanza.com para acceso administrativo completo
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};