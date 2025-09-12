import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

// Define what fields are safe to expose publicly vs authenticated users
export type PublicProfile = Pick<Profile, 'id' | 'name' | 'avatar_url' | 'verification_status'>;
export type AuthenticatedProfile = Pick<Profile, 'id' | 'name' | 'avatar_url' | 'verification_status' | 'region' | 'business_type'>;
export type OwnerProfile = Profile;

export const profilesService = {
  // Get public profile info (minimal data for unauthenticated users)
  async getPublicProfile(profileId: string): Promise<PublicProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, avatar_url, verification_status')
      .eq('id', profileId)
      .single();
    
    if (error || !data) return null;
    return data as PublicProfile;
  },

  // Get authenticated profile info (more data for logged-in users)
  async getAuthenticatedProfile(profileId: string): Promise<AuthenticatedProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return this.getPublicProfile(profileId);

    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, avatar_url, verification_status, region, business_type')
      .eq('id', profileId)
      .single();
    
    if (error || !data) return null;
    return data as AuthenticatedProfile;
  },

  // Get own profile (all data for profile owner)
  async getOwnProfile(): Promise<OwnerProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error || !data) return null;
    return data;
  },

  // Get multiple public profiles (for directory, feed, etc.)
  async getPublicProfiles(limit = 20, offset = 0): Promise<PublicProfile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, avatar_url, verification_status')
      .range(offset, offset + limit - 1);
    
    if (error || !data) return [];
    return data as PublicProfile[];
  },

  // Search profiles by name (public data only)
  async searchProfiles(query: string): Promise<PublicProfile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, avatar_url, verification_status')
      .ilike('name', `%${query}%`)
      .limit(10);
    
    if (error || !data) return [];
    return data as PublicProfile[];
  },

  // Update profile (only owner can update their own)
  async updateProfile(updates: Partial<OwnerProfile>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be authenticated to update profile');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select('*')
      .single();
    
    if (error) throw error;
    return data;
  }
};