import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminButton } from "@/components/ui/admin-button";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Shield, MapPin, Phone, Mail, Star, MessageCircle, Users, Plus } from "lucide-react";
import { toast } from "sonner";

interface VerifiedAgent {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  region: string;
  avatar_url?: string;
  bio?: string;
  license_number?: string;
  verification_status: string;
  is_active: boolean;
  is_demo?: boolean;
}

// Demo data for verified agents
const demoAgents: VerifiedAgent[] = [
  {
    id: "1",
    name: "María González",
    phone: "5215555555555",
    email: "maria@example.com",
    region: "North",
    bio: "Especialista en bienes raíces comerciales con 10 años de experiencia en el norte de México.",
    license_number: "LIC-001-2023",
    verification_status: "verified",
    is_active: true,
    is_demo: true
  },
  {
    id: "2", 
    name: "Carlos Ramírez",
    phone: "5215555555556",
    email: "carlos@example.com",
    region: "Central",
    bio: "Experto en propiedades residenciales y comerciales en la región central de México.",
    license_number: "LIC-002-2023",
    verification_status: "verified",
    is_active: true,
    is_demo: true
  },
  {
    id: "3",
    name: "Ana López",
    phone: "5215555555557", 
    email: "ana@example.com",
    region: "Pacific",
    bio: "Agente especializada en propiedades de lujo en la costa del Pacífico.",
    license_number: "LIC-003-2023",
    verification_status: "verified",
    is_active: true,
    is_demo: true
  }
];

export const VerifiedAgentsModule: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, isAdmin } = useAuth();
  const [agents, setAgents] = useState<VerifiedAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const regions = [
    { key: 'all', label: t("agents.all_regions", "All Regions") },
    { key: 'North', label: t("region.north", "North") },
    { key: 'Pacific', label: t("region.pacific", "Pacific") },
    { key: 'Central', label: t("region.central", "Central") },
    { key: 'Southeast', label: t("region.southeast", "Southeast") }
  ];

  useEffect(() => {
    // Load demo data
    setTimeout(() => {
      const filteredAgents = selectedRegion === 'all' 
        ? demoAgents 
        : demoAgents.filter(agent => agent.region === selectedRegion);
      setAgents(filteredAgents);
      setLoading(false);
    }, 500);
  }, [selectedRegion]);

  const handleContactAgent = (agent: VerifiedAgent) => {
    const message = t("agents.contact_message", `Hello! I'm interested in real estate services in ${agent.region}. Can you help me?`);
    if (agent.phone) {
      const whatsappUrl = `https://wa.me/${agent.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      toast.info(t("agents.contact_info", "Contact information not available"));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6" />
            {t("agents.title", "Verified Real Estate Agents")}
          </h2>
          <p className="text-muted-foreground">
            {t("agents.subtitle", "Connect with certified real estate professionals")}
          </p>
        </div>
        {isAdmin && (
          <AdminButton action="add">
            {t("agents.add_agent", "Add Agent")}
          </AdminButton>
        )}
      </div>

      {/* Region Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {regions.map((region) => (
          <Button
            key={region.key}
            variant={selectedRegion === region.key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedRegion(region.key)}
            className="whitespace-nowrap"
          >
            {region.label}
          </Button>
        ))}
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-medium transition-all">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={agent.avatar_url} />
                    <AvatarFallback>
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{agent.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {agent.region}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge variant="default" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    {t("agents.verified", "Verified")}
                  </Badge>
                  {agent.is_demo && (
                    <Badge variant="secondary" className="text-xs">
                      Demo
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {agent.bio && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {agent.bio}
                </p>
              )}

              {agent.license_number && (
                <div className="text-xs text-muted-foreground">
                  {t("agents.license", "License")}: {agent.license_number}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    4.8
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {Math.floor(Math.random() * 50) + 10}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleContactAgent(agent)}
                  className="flex-1"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {t("agents.contact", "Contact")}
                </Button>
                
                {agent.phone && (
                  <WhatsAppButton
                    message={t("agents.whatsapp_message", `Hi ${agent.name}! I need real estate assistance in ${agent.region}.`)}
                    phoneNumber={agent.phone}
                    size="sm"
                    variant="whatsapp"
                    className="px-3"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </WhatsAppButton>
                )}
              </div>

              {/* Contact Info */}
              <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                {agent.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    {agent.phone}
                  </div>
                )}
                {agent.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {agent.email}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {agents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t("agents.no_agents", "No verified agents found")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {selectedRegion === 'all' 
                ? t("agents.no_agents_desc", "No verified agents are currently available.")
                : t("agents.no_agents_region", `No verified agents found in ${regions.find(r => r.key === selectedRegion)?.label}.`)
              }
            </p>
            {isAdmin && (
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t("agents.add_first", "Add First Agent")}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {t("agents.verification_note", "All agents are verified and licensed real estate professionals")}
        </p>
      </div>
    </div>
  );
};