import * as React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";

interface WhatsAppButtonProps {
  message: string;
  phoneNumber?: string;
  className?: string;
  size?: "default" | "sm" | "lg" | "xl";
  variant?: "whatsapp" | "outline" | "ghost";
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  message,
  phoneNumber = "5215555555555", // Default Mexican number format
  className,
  size = "default",
  variant = "whatsapp",
}) => {
  const { t } = useLanguage();

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleWhatsAppClick}
      className={cn("gap-2", className)}
    >
      <MessageCircle className="h-4 w-4" />
      WhatsApp
    </Button>
  );
};

// Pre-configured WhatsApp buttons for different services
export const TravelWhatsAppButton: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useLanguage();
  return (
    <WhatsAppButton
      message={t("whatsapp.travel")}
      className={className}
    />
  );
};

export const LegalWhatsAppButton: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useLanguage();
  return (
    <WhatsAppButton
      message={t("whatsapp.legal")}
      className={className}
    />
  );
};

export const DigitalWhatsAppButton: React.FC<{ className?: string }> = ({ className }) => {
  const { t } = useLanguage();
  return (
    <WhatsAppButton
      message={t("whatsapp.digital")}
      className={className}
    />
  );
};