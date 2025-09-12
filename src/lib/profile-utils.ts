import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

/**
 * Filters profile data based on user authentication status and relationship to profile owner
 * Protects sensitive personal information from public exposure
 */
export function filterProfileData(
  profile: Profile,
  currentUserId?: string,
  isAuthenticated: boolean = false
): Partial<Profile> {
  // If viewing own profile, return all data
  if (currentUserId && profile.id === currentUserId) {
    return profile;
  }

  // Base public fields that are safe to show
  const publicFields: Partial<Profile> = {
    id: profile.id,
    name: profile.name,
    avatar_url: profile.avatar_url,
    profile_type: profile.profile_type,
    verification_status: profile.verification_status,
    created_at: profile.created_at,
  };

  // For authenticated users, show additional non-sensitive fields
  if (isAuthenticated) {
    return {
      ...publicFields,
      region: profile.region, // General region is ok, not exact location
      business_type: profile.business_type,
      language_preference: profile.language_preference,
    };
  }

  // For anonymous/public users, only show minimal safe information
  return publicFields;
}

/**
 * Filters verified agent data to protect contact information
 */
export function filterAgentData(
  agent: Database['public']['Tables']['verified_agents']['Row'],
  currentUserId?: string,
  isAuthenticated: boolean = false
): Partial<Database['public']['Tables']['verified_agents']['Row']> {
  // If viewing own agent profile, return all data
  if (currentUserId && agent.user_id === currentUserId) {
    return agent;
  }

  // Public fields for verified agents
  const publicFields = {
    id: agent.id,
    name: agent.name,
    region: agent.region,
    avatar_url: agent.avatar_url,
    verification_status: agent.verification_status,
    is_active: agent.is_active,
    created_at: agent.created_at,
    bio: agent.bio, // Bio is ok for public viewing of verified agents
  };

  // For authenticated users, show license number but still protect contact info
  if (isAuthenticated) {
    return {
      ...publicFields,
      license_number: agent.license_number,
    };
  }

  return publicFields;
}

/**
 * Sanitizes location data to prevent exact address exposure
 */
export function sanitizeLocation(location?: string | null): string | null {
  if (!location) return null;
  
  // Remove specific addresses, keep only city/region level information
  const parts = location.split(',');
  if (parts.length > 2) {
    // Return only city and state/region, remove street addresses
    return parts.slice(-2).join(',').trim();
  }
  
  return location;
}
