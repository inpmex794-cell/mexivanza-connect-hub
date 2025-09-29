import React, { useState, useEffect } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
  Button, Input, Label, Separator
} from "@/components/ui";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  LogIn, UserPlus, Mail, Lock, ArrowLeft
} from "lucide-react";

export const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [authType, setAuthType] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user, userRole, isAdmin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam === "register") setAuthType("register");
  }, [searchParams]);

useEffect(() => {
  if (user) {
    if (isAdmin === true) {
      navigate("/admin-dashboard");
    } else if (userRole === "verified") {
      navigate("/verified-dashboard");
    } else {
      navigate("/account"); // ✅ This is the correct customer dashboard
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
      const result = authType === "login"
        ? await signIn(email, password)
        : await signUp(email, password);

      if (result.error) {
        const msg = result.error.message;
        if (msg.includes("Invalid login credentials")) {
          toast.error("Credenciales inválidas. Verifica tu email y contraseña.");
        } else if (msg.includes("User already registered")) {
          toast.error("Este email ya está registrado. Intenta iniciar sesión.");
        } else if (msg.includes("Password should be at least")) {
          toast.error("La contraseña debe tener al menos 6 caracteres.");
        } else {
          toast.error(msg);
        }
      } else {
        toast.success(authType === "register"
          ? "Cuenta creada exitosamente. ¡Bienvenido a Mexivanza!"
          : "Inicio de sesión exitoso. ¡Bienvenido de vuelta!");
      }
    } catch {
      toast.error("Error inesperado. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Button>

        <Card className="shadow-elegant">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <CardTitle className="text-2xl">
              {authType === "login" ? (
                <>
                  <LogIn className="inline mr-2 h-5 w-5" />
                  Login / Iniciar Sesión
                </>
              ) : (
                <>
                  <UserPlus className="inline mr-2 h-5 w-5" />
                  Register / Crear Cuenta
                </>
              )}
            </CardTitle>
            <CardDescription>
              {authType === "login"
                ? "Access your Mexivanza account / Accede a tu cuenta de Mexivanza"
                : "Join the Mexivanza platform / Únete a la plataforma Mexivanza"}
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? t("auth.processing", "Processing...")
                  : authType === "login"
                    ? t("auth.login_button", "Sign In")
                    : t("auth.register_button", "Create Account")}
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {authType === "login"
                  ? t("auth.no_account", "Don't have an account?")
                  : t("auth.have_account", "Already have an account?")}
              </p>
              <Button
                variant="outline"
                onClick={() => setAuthType(authType === "login" ? "register" : "login")}
                className="w-full"
              >
                {authType === "login"
                  ? t("auth.switch_to_register", "Create Account")
                  : t("auth.switch_to_login", "Sign In")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
