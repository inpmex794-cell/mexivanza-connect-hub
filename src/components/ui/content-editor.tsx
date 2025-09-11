import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit3, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface EditableContentProps {
  title?: string;
  content: string;
  onSave?: (content: string) => void;
  isAdmin?: boolean;
  className?: string;
  variant?: "title" | "paragraph" | "card";
}

export const EditableContent: React.FC<EditableContentProps> = ({
  title,
  content,
  onSave,
  isAdmin = false,
  className,
  variant = "paragraph",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [editedTitle, setEditedTitle] = useState(title || "");

  const handleSave = () => {
    onSave?.(editedContent);
    setIsEditing(false);
    toast.success("Contenido guardado");
  };

  const handleCancel = () => {
    setEditedContent(content);
    setEditedTitle(title || "");
    setIsEditing(false);
  };

  if (!isAdmin) {
    if (variant === "card") {
      return (
        <Card className={className}>
          {title && (
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
          )}
          <CardContent>
            <p className="whitespace-pre-wrap">{content}</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className={className}>
        {title && variant === "title" && (
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
        )}
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <Card className={cn("border-dashed border-2 border-primary/50", className)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Editando contenido</span>
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {title && (
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Título"
              className="font-semibold"
            />
          )}
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Contenido"
            rows={variant === "paragraph" ? 3 : 6}
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      className={cn(
        "group relative hover:bg-muted/30 transition-colors rounded-lg p-2 -m-2",
        className
      )}
    >
      {title && variant === "title" && (
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
      )}
      
      {variant === "card" && (
        <Card>
          {title && (
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
          )}
          <CardContent>
            <p className="whitespace-pre-wrap">{content}</p>
          </CardContent>
        </Card>
      )}
      
      {variant === "paragraph" && (
        <p className="whitespace-pre-wrap">{content}</p>
      )}

      <Button
        size="sm"
        variant="ghost"
        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => setIsEditing(true)}
      >
        <Edit3 className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Toggle for admin mode
export const AdminModeToggle: React.FC<{
  isAdmin: boolean;
  onToggle: (admin: boolean) => void;
}> = ({ isAdmin, onToggle }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant={isAdmin ? "destructive" : "secondary"}
        onClick={() => onToggle(!isAdmin)}
        className="shadow-lg"
      >
        {isAdmin ? "Salir de edición" : "Modo edición"}
        <Edit3 className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};