// src/lib/supabaseClient.ts
// This file is a compatibility wrapper so imports from "@/lib/supabaseClient" work.
// It reuses the actual client defined in src/integrations/supabase/client.ts.

export { supabase } from '@/integrations/supabase/client';
