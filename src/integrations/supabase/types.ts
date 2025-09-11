export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          business_id: number
          date: string
          id: number
          payment_status: string
          service: string
          status: string
          user_id: string
        }
        Insert: {
          business_id: number
          date: string
          id?: number
          payment_status?: string
          service?: string
          status?: string
          user_id?: string
        }
        Update: {
          business_id?: number
          date?: string
          id?: number
          payment_status?: string
          service?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      businesses: {
        Row: {
          category: string
          created_at: string
          description: string
          documents: string
          id: number
          location: string
          name: string
          user_id: string
          verified: boolean
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          documents?: string
          id?: number
          location?: string
          name?: string
          user_id?: string
          verified?: boolean
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          documents?: string
          id?: number
          location?: string
          name?: string
          user_id?: string
          verified?: boolean
        }
        Relationships: []
      }
      members: {
        Row: {
          id: string
          team_id: string | null
          user_id: string
        }
        Insert: {
          id?: string
          team_id?: string | null
          user_id: string
        }
        Update: {
          id?: string
          team_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string | null
          id: number
          receiver_id: string | null
          sender_id: string
          timestamp: string | null
        }
        Insert: {
          content?: string | null
          id?: number
          receiver_id?: string | null
          sender_id?: string
          timestamp?: string | null
        }
        Update: {
          content?: string | null
          id?: number
          receiver_id?: string | null
          sender_id?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: number
          message: string
          read: boolean
          type: string
          user_id: string
        }
        Insert: {
          id?: number
          message?: string
          read?: boolean
          type?: string
          user_id?: string
        }
        Update: {
          id?: number
          message?: string
          read?: boolean
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          category: string
          content: string
          created_at: string
          id: number
          likes: number
          media_url: string
          user_id: string
        }
        Insert: {
          category?: string
          content?: string
          created_at?: string
          id?: number
          likes?: number
          media_url?: string
          user_id?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: number
          likes?: number
          media_url?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          age: number
          avatar_url: string
          created_at: string
          email: string
          id: string
          location: string
          name: string
          phone: string
          tier: string
        }
        Insert: {
          age: number
          avatar_url?: string
          created_at?: string
          email?: string
          id?: string
          location?: string
          name?: string
          phone?: string
          tier?: string
        }
        Update: {
          age?: number
          avatar_url?: string
          created_at?: string
          email?: string
          id?: string
          location?: string
          name?: string
          phone?: string
          tier?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_business_listing: {
        Args: { business_id: number }
        Returns: {
          category: string
          created_at: string
          description: string
          id: number
          location: string
          name: string
          verified: boolean
        }[]
      }
      get_public_profile: {
        Args: { user_id: string }
        Returns: {
          avatar_url: string
          created_at: string
          id: string
          location: string
          name: string
          tier: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
