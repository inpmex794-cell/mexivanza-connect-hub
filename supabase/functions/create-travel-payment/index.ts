import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingData } = await req.json();
    
    // Create Supabase client using the anon key for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Authenticate user if auth header is present
    let user = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      user = data.user;
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get customer email - use user email or booking email
    const customerEmail = user?.email || bookingData.traveler_email;

    // Check if a Stripe customer record exists
    const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create a one-time payment session for travel booking
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: { 
              name: `Travel Package: ${bookingData.package_title}`,
              description: `${bookingData.duration} days trip for ${bookingData.number_of_travelers} traveler(s)`
            },
            unit_amount: Math.round(bookingData.total_amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/travel/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/travel/packages`,
      metadata: {
        booking_id: bookingData.booking_id,
        package_id: bookingData.package_id,
        user_id: user?.id || 'guest',
      },
    });

    // Create booking record in Supabase
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { data: booking, error: bookingError } = await supabaseService
      .from("travel_bookings")
      .insert({
        user_id: user?.id,
        package_id: bookingData.package_id,
        traveler_name: bookingData.traveler_name,
        traveler_email: bookingData.traveler_email,
        traveler_whatsapp: bookingData.traveler_whatsapp,
        travel_start_date: bookingData.travel_start_date,
        travel_end_date: bookingData.travel_end_date,
        number_of_travelers: bookingData.number_of_travelers,
        special_requests: bookingData.special_requests,
        total_amount: bookingData.total_amount,
        stripe_session_id: session.id,
        payment_status: "pending",
        booking_status: "pending"
      })
      .select()
      .single();

    if (bookingError) {
      console.error("Booking creation error:", bookingError);
      throw new Error("Failed to create booking record");
    }

    return new Response(JSON.stringify({ 
      url: session.url,
      booking_id: booking.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});