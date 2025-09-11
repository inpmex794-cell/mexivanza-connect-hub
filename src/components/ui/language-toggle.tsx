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
  return (
    <div className={cn("flex items-center rounded-lg border bg-card p-1", className)}>
      <Button
        variant={language === "es" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLanguageChange("es")}
        className="h-8 px-3 text-xs"
      >
        ES
      </Button>
      <Button
        variant={language === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => onLanguageChange("en")}
        className="h-8 px-3 text-xs"
      >
        EN
      </Button>
    </div>
  );
};