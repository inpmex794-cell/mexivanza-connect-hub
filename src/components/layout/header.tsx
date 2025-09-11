import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/hooks/use-language";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { key: "nav.home", href: "/" },
    { key: "nav.travel", href: "/travel" },
    { key: "nav.legal", href: "/legal" },
    { key: "nav.digital", href: "/digital" },
  ];

  const handleAuthClick = (type: "login" | "register") => {
    // For now, just log - will be connected to Supabase
    console.log(`${type} clicked - requires Supabase integration`);
    navigate(`/auth?type=${type}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-hero"></div>
          <span className="text-xl font-bold text-foreground">Mexivanza</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.href}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth & Language */}
        <div className="hidden md:flex items-center space-x-4">
          <LanguageToggle
            language={language}
            onLanguageChange={setLanguage}
          />
          <Button 
            variant="ghost" 
            onClick={() => handleAuthClick("login")}
          >
            {t("nav.login")}
          </Button>
          <Button 
            variant="hero" 
            onClick={() => handleAuthClick("register")}
          >
            {t("nav.register")}
          </Button>
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
          "md:hidden border-t bg-background",
          isMenuOpen ? "block" : "hidden"
        )}
      >
        <nav className="container mx-auto flex flex-col space-y-4 p-4">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.href}
              className="text-foreground hover:text-primary transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="flex flex-col space-y-2 pt-4 border-t">
            <LanguageToggle
              language={language}
              onLanguageChange={setLanguage}
              className="self-start"
            />
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => {
                handleAuthClick("login");
                setIsMenuOpen(false);
              }}
            >
              {t("nav.login")}
            </Button>
            <Button 
              variant="hero" 
              className="w-full"
              onClick={() => {
                handleAuthClick("register");
                setIsMenuOpen(false);
              }}
            >
              {t("nav.register")}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};