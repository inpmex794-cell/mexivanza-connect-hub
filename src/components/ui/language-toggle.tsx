import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Language = "es" | "en";

interface LanguageToggleProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  language,
  onLanguageChange,
  className,
}) => {
  console.log('LanguageToggle rendered with language:', language);
  
  return (
    <div className={cn("flex items-center rounded-full border border-border bg-background p-1 shadow-soft", className)}>
      <Button
        variant={language === "es" ? "facebook" : "ghost"}
        size="sm"
        onClick={() => {
          console.log('ES button clicked, calling onLanguageChange with "es"');
          onLanguageChange("es");
        }}
        className="h-8 px-3 text-xs rounded-full flex items-center gap-1"
      >
        <span className="text-sm">🇲🇽</span>
        ES
      </Button>
      <Button
        variant={language === "en" ? "facebook" : "ghost"}
        size="sm"
        onClick={() => {
          console.log('EN button clicked, calling onLanguageChange with "en"');
          onLanguageChange("en");
        }}
        className="h-8 px-3 text-xs rounded-full flex items-center gap-1"
      >
        <span className="text-sm">🇺🇸</span>
        EN
      </Button>
    </div>
  );
};