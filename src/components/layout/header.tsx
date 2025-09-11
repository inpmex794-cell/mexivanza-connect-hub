import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X, LogOut, LogIn, UserPlus, Shield } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, userRole, isAdmin, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleAuthClick = (type: "login" | "register") => {
    navigate(`/auth?type=${type}`);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-border shadow-soft overflow-hidden">
      <div className="flex h-full items-center justify-between px-4 container-safe max-w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <div className="h-8 w-8 rounded-lg bg-primary flex-shrink-0"></div>
          <span className="text-lg sm:text-xl font-bold text-foreground truncate">Mexivanza</span>
        </Link>

        {/* Center Search/Navigation */}
        <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-4 lg:mx-8 min-w-0">
          <div className="relative w-full min-w-0">
            <input
              type="text"
              placeholder={t("search.placeholder", "Search services, regions...")}
              className="w-full max-w-full px-4 py-2 pl-10 bg-muted rounded-full border-0 text-sm focus:ring-2 focus:ring-primary focus:outline-none box-border"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Desktop Auth & Language */}
        <div className="hidden md:flex items-center space-x-3">
          <LanguageToggle
            language={language}
            onLanguageChange={setLanguage}
          />
          {user ? (
            <div className="flex items-center space-x-3">
              <Badge 
                variant={isAdmin ? "default" : userRole === 'verified' ? "secondary" : "outline"} 
                className={cn(
                  "px-3 py-1",
                  isAdmin && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                  userRole === 'verified' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                )}
              >
                {isAdmin 
                  ? t("dashboard.admin", "Admin") 
                  : userRole === 'verified' 
                    ? t("dashboard.verified", "Verified") 
                    : t("dashboard.user", "User")
                }
              </Badge>
              {isAdmin && (
                <Button asChild size="sm" variant="facebook">
                  <Link to="/admin-dashboard">
                    <Shield className="mr-2 h-4 w-4" />
                    {t("nav.admin", "Admin Panel")}
                  </Link>
                </Button>
              )}
              {userRole === 'verified' && !isAdmin && (
                <Button asChild size="sm" variant="outline">
                  <Link to="/verified-dashboard">
                    <Shield className="mr-2 h-4 w-4" />
                    {t("nav.verified", "Verified Panel")}
                  </Link>
                </Button>
              )}
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleAuthClick("login")}
                className="whitespace-nowrap overflow-hidden text-ellipsis min-w-0 max-w-[120px] sm:max-w-none"
              >
                <LogIn className="mr-1 h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">{t("auth.login_full", "Login / Iniciar sesión")}</span>
                <span className="sm:hidden">{t("nav.login", "Login")}</span>
              </Button>
              <Button 
                variant="facebook" 
                size="sm"
                onClick={() => handleAuthClick("register")}
                className="whitespace-nowrap overflow-hidden text-ellipsis min-w-0 max-w-[130px] sm:max-w-none"
              >
                <UserPlus className="mr-1 h-4 w-4 flex-shrink-0" />
                <span className="hidden sm:inline">{t("auth.register_full", "Register / Registrarse")}</span>
                <span className="sm:hidden">{t("nav.register", "Register")}</span>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden border-t bg-card",
          isMenuOpen ? "block" : "hidden"
        )}
      >
        <div className="flex flex-col space-y-4 p-4">
          <div className="relative">
            <input
              type="text"
              placeholder={t("search.placeholder", "Search...")}
              className="w-full px-4 py-2 pl-10 bg-muted rounded-full border-0 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col space-y-2 pt-4 border-t">
            <LanguageToggle
              language={language}
              onLanguageChange={setLanguage}
              className="self-start"
            />
            {user ? (
              <>
                <div className="flex items-center space-x-2 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Badge 
                    variant={isAdmin ? "default" : userRole === 'verified' ? "secondary" : "outline"}
                    className={cn(
                      isAdmin && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                      userRole === 'verified' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    )}
                  >
                    {isAdmin 
                      ? t("dashboard.admin", "Admin") 
                      : userRole === 'verified' 
                        ? t("dashboard.verified", "Verified") 
                        : t("dashboard.user", "User")
                    }
                  </Badge>
                </div>
                {isAdmin && (
                  <Button 
                    variant="facebook" 
                    className="w-full justify-start"
                    onClick={() => {
                      navigate("/admin-dashboard");
                      setIsMenuOpen(false);
                    }}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    {t("nav.admin", "Admin Panel")}
                  </Button>
                )}
                {userRole === 'verified' && !isAdmin && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      navigate("/verified-dashboard");
                      setIsMenuOpen(false);
                    }}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    {t("nav.verified", "Verified Panel")}
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("dashboard.logout", "Logout")}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    handleAuthClick("login");
                    setIsMenuOpen(false);
                  }}
                >
                  <LogIn className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{t("auth.login_full", "Login / Iniciar sesión")}</span>
                </Button>
                <Button 
                  variant="facebook" 
                  className="w-full"
                  onClick={() => {
                    handleAuthClick("register");
                    setIsMenuOpen(false);
                  }}
                >
                  <UserPlus className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{t("auth.register_full", "Register / Registrarse")}</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};