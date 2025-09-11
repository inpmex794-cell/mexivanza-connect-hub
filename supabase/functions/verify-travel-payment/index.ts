import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id } = await req.json();

    if (!session_id) {
      throw new Error("Session ID is required");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Create Supabase service client
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Update booking based on payment status
    const paymentStatus = session.payment_status === "paid" ? "paid" : "failed";
    const bookingStatus = session.payment_status === "paid" ? "confirmed" : "pending";

    const { data: booking, error: updateError } = await supabaseService
      .from("travel_bookings")
      .update({
        payment_status: paymentStatus,
        booking_status: bookingStatus,
        updated_at: new Date().toISOString()
      })
      .eq("stripe_session_id", session_id)
      .select()
      .single();

    if (updateError) {
      console.error("Booking update error:", updateError);
      throw new Error("Failed to update booking status");
    }

    // Get package details for confirmation
    const { data: packageData } = await supabaseService
      .from("travel_packages")
      .select("title, duration")
      .eq("id", booking.package_id)
      .single();

    return new Response(JSON.stringify({
      success: session.payment_status === "paid",
      booking,
      package: packageData,
      payment_status: paymentStatus
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});