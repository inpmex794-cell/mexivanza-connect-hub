import React, { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { MapPin, Phone, Mail, MessageSquare, Clock } from "lucide-react";
import { toast } from "sonner";

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const contactInfo = [
    {
      icon: MapPin,
      title: t("contact.address", "Address"),
      content: "Ciudad de México, México"
    },
    {
      icon: Phone,
      title: t("contact.phone", "Phone"),
      content: "+52 55 1234 5678"
    },
    {
      icon: Mail,
      title: t("contact.email", "Email"),
      content: "contact@mexivanza.com"
    },
    {
      icon: Clock,
      title: t("contact.hours", "Business Hours"),
      content: t("contact.hours_content", "Mon-Fri: 9AM-6PM (CST)")
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    toast.success(t("contact.message_sent", "Message sent successfully!"));
    setFormData({ name: "", email: "", message: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t("contact.title", "Contact Us")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("contact.subtitle", "Get in touch with our team. We're here to help with all your needs.")}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {t("contact.send_message", "Send us a Message")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {t("contact.name", "Name")}
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t("contact.name_placeholder", "Your full name")}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {t("contact.email", "Email")}
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t("contact.email_placeholder", "your@email.com")}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {t("contact.message", "Message")}
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={t("contact.message_placeholder", "How can we help you?")}
                      rows={5}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    {t("contact.send", "Send Message")}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-4">
                    {t("contact.or_whatsapp", "Or contact us directly via WhatsApp:")}
                  </p>
                  <WhatsAppButton
                    message={t("whatsapp.contact_inquiry", "Hello! I'd like to get in touch with Mexivanza.")}
                    className="w-full bg-[#25D366] hover:bg-[#25D366]/90"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {t("button.contact_whatsapp", "Contact WhatsApp")}
                  </WhatsAppButton>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <info.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {info.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {info.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};