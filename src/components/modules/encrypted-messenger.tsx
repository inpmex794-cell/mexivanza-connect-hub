import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, Phone, Video, Shield, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  is_read: boolean;
  message_type: 'text' | 'image' | 'video' | 'voice';
}

interface Conversation {
  id: string;
  name: string;
  last_message: string;
  avatar_url?: string;
  is_online: boolean;
  unread_count: number;
}

export const EncryptedMessenger: React.FC = () => {
  const { user, userRole } = useAuth();
  const { t } = useLanguage();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Only allow verified users to access encrypted messaging
  if (userRole !== 'verified' && userRole !== 'admin') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {t('messenger.encrypted_title', 'Messenger Encriptado')}
          </CardTitle>
          <CardDescription>
            {t('messenger.verification_required', 'Requiere verificación premium para acceder a mensajería encriptada')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {t('messenger.upgrade_prompt', 'Actualiza a Verificado ($10/mes) para acceder a mensajería encriptada punto a punto')}
            </p>
            <Button variant="facebook">
              {t('button.upgrade_now', 'Actualizar Ahora')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      // Demo conversations for verified users
      const demoConversations: Conversation[] = [
        {
          id: '1',
          name: 'Agent García',
          last_message: 'Hola, ¿en qué puedo ayudarte?',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40',
          is_online: true,
          unread_count: 2
        },
        {
          id: '2',
          name: 'Legal Team',
          last_message: 'Documentos listos para revisión',
          is_online: false,
          unread_count: 0
        },
        {
          id: '3',
          name: 'Travel Support',
          last_message: 'Tu reserva está confirmada',
          is_online: true,
          unread_count: 1
        }
      ];
      setConversations(demoConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      // Demo messages
      const demoMessages: Message[] = [
        {
          id: '1',
          content: 'Hola, ¿en qué puedo ayudarte hoy?',
          sender_id: 'agent',
          recipient_id: user?.id || '',
          created_at: new Date().toISOString(),
          is_read: true,
          message_type: 'text'
        },
        {
          id: '2',
          content: 'Necesito información sobre documentos legales',
          sender_id: user?.id || '',
          recipient_id: 'agent',
          created_at: new Date().toISOString(),
          is_read: true,
          message_type: 'text'
        }
      ];
      setMessages(demoMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setLoading(true);
    try {
      // In real implementation, this would encrypt and send to Supabase
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender_id: user?.id || '',
        recipient_id: selectedConversation,
        created_at: new Date().toISOString(),
        is_read: false,
        message_type: 'text'
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      toast.success(t('messenger.message_sent', 'Mensaje enviado'));
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('messenger.send_error', 'Error al enviar mensaje'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-[600px] flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4 text-primary" />
            {t('messenger.conversations', 'Conversaciones')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`w-full p-3 text-left hover:bg-accent rounded-none border-b border-border ${
                  selectedConversation === conversation.id ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={conversation.avatar_url} />
                      <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conversation.is_online && (
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-success rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{conversation.name}</p>
                      {conversation.unread_count > 0 && (
                        <Badge variant="destructive" className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conversation.last_message}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {conversations.find(c => c.id === selectedConversation)?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-sm">
                      {conversations.find(c => c.id === selectedConversation)?.name}
                    </CardTitle>
                    <CardDescription className="text-xs flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      {t('messenger.encrypted', 'Encriptado de extremo a extremo')}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_id === user?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t border-border p-4">
              <div className="flex items-center gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('messenger.type_message', 'Escribe un mensaje...')}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage} disabled={loading || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {t('messenger.select_conversation', 'Selecciona una conversación para comenzar')}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};