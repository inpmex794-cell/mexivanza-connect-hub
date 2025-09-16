import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId, language = 'es' } = await req.json();

    console.log('Sending booking confirmation:', { bookingId, language });

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    
    const supabaseServiceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get booking details
    const { data: booking, error: bookingError } = await supabaseServiceClient
      .from('travel_bookings')
      .select(`
        *,
        travel_packages (
          title,
          description,
          city,
          region,
          duration,
          gallery
        )
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError) throw bookingError;

    const packageTitle = booking.travel_packages?.title?.[language] || booking.travel_packages?.title?.es || 'Travel Package';
    const packageDescription = booking.travel_packages?.description?.[language] || booking.travel_packages?.description?.es || '';

    const formatPrice = (amount: number) => {
      return new Intl.NumberFormat(language === 'es' ? 'es-MX' : 'en-US', {
        style: 'currency',
        currency: 'MXN'
      }).format(amount);
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString(
        language === 'es' ? 'es-MX' : 'en-US',
        { 
          weekday: 'long',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }
      );
    };

    // Prepare email content
    const userSubject = language === 'es' 
      ? `¡Confirmación de reserva! - ${packageTitle}`
      : `Booking Confirmation! - ${packageTitle}`;

    const adminSubject = language === 'es'
      ? `Nueva reserva confirmada - ${packageTitle}`
      : `New confirmed booking - ${packageTitle}`;

    const userEmailContent = language === 'es' ? `
      <h1>¡Tu reserva está confirmada!</h1>
      <p>Hola ${booking.traveler_name},</p>
      <p>¡Excelentes noticias! Tu reserva de viaje con Mexivanza ha sido confirmada.</p>
      
      <div style="background-color: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2>Detalles de tu reserva</h2>
        <p><strong>Número de reserva:</strong> ${booking.id}</p>
        <p><strong>Paquete:</strong> ${packageTitle}</p>
        <p><strong>Destino:</strong> ${booking.travel_packages?.city}, ${booking.travel_packages?.region}</p>
        <p><strong>Fecha de inicio:</strong> ${formatDate(booking.travel_start_date)}</p>
        <p><strong>Fecha de fin:</strong> ${formatDate(booking.travel_end_date)}</p>
        <p><strong>Duración:</strong> ${booking.travel_packages?.duration} días</p>
        <p><strong>Número de viajeros:</strong> ${booking.number_of_travelers}</p>
        <p><strong>Total pagado:</strong> ${formatPrice(booking.total_amount)}</p>
      </div>

      ${booking.special_requests ? `
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3>Solicitudes especiales</h3>
          <p>${booking.special_requests}</p>
        </div>
      ` : ''}

      <p>Te contactaremos pronto con más detalles sobre tu viaje. Si tienes alguna pregunta, no dudes en contactarnos.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p>¡Gracias por elegir Mexivanza!</p>
        <p>El equipo de Mexivanza</p>
        <p>WhatsApp: +52 55 1234 5678</p>
        <p>Email: viajes@mexivanza.com</p>
      </div>
    ` : `
      <h1>Your booking is confirmed!</h1>
      <p>Hello ${booking.traveler_name},</p>
      <p>Great news! Your travel booking with Mexivanza has been confirmed.</p>
      
      <div style="background-color: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2>Booking Details</h2>
        <p><strong>Booking number:</strong> ${booking.id}</p>
        <p><strong>Package:</strong> ${packageTitle}</p>
        <p><strong>Destination:</strong> ${booking.travel_packages?.city}, ${booking.travel_packages?.region}</p>
        <p><strong>Start date:</strong> ${formatDate(booking.travel_start_date)}</p>
        <p><strong>End date:</strong> ${formatDate(booking.travel_end_date)}</p>
        <p><strong>Duration:</strong> ${booking.travel_packages?.duration} days</p>
        <p><strong>Number of travelers:</strong> ${booking.number_of_travelers}</p>
        <p><strong>Total paid:</strong> ${formatPrice(booking.total_amount)}</p>
      </div>

      ${booking.special_requests ? `
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3>Special Requests</h3>
          <p>${booking.special_requests}</p>
        </div>
      ` : ''}

      <p>We'll contact you soon with more details about your trip. If you have any questions, please don't hesitate to contact us.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p>Thank you for choosing Mexivanza!</p>
        <p>The Mexivanza Team</p>
        <p>WhatsApp: +52 55 1234 5678</p>
        <p>Email: travel@mexivanza.com</p>
      </div>
    `;

    const adminEmailContent = `
      <h1>New Travel Booking Confirmed</h1>
      <p>A new travel booking has been confirmed and paid.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2>Booking Details</h2>
        <p><strong>Booking ID:</strong> ${booking.id}</p>
        <p><strong>Customer:</strong> ${booking.traveler_name}</p>
        <p><strong>Email:</strong> ${booking.traveler_email}</p>
        <p><strong>WhatsApp:</strong> ${booking.traveler_whatsapp || 'Not provided'}</p>
        <p><strong>Package:</strong> ${packageTitle}</p>
        <p><strong>Destination:</strong> ${booking.travel_packages?.city}, ${booking.travel_packages?.region}</p>
        <p><strong>Travel dates:</strong> ${formatDate(booking.travel_start_date)} - ${formatDate(booking.travel_end_date)}</p>
        <p><strong>Travelers:</strong> ${booking.number_of_travelers}</p>
        <p><strong>Total amount:</strong> ${formatPrice(booking.total_amount)}</p>
        <p><strong>Payment status:</strong> ${booking.payment_status}</p>
        <p><strong>Booking status:</strong> ${booking.booking_status}</p>
      </div>

      ${booking.special_requests ? `
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3>Special Requests</h3>
          <p>${booking.special_requests}</p>
        </div>
      ` : ''}

      <p>Please follow up with the customer to provide detailed itinerary and travel information.</p>
    `;

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "Mexivanza Travel <noreply@mexivanza.com>",
      to: [booking.traveler_email],
      subject: userSubject,
      html: userEmailContent,
    });

    console.log("User confirmation email sent:", userEmailResponse);

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Mexivanza Bookings <bookings@mexivanza.com>",
      to: ["mexivanza@mexivanza.com"],
      subject: adminSubject,
      html: adminEmailContent,
    });

    console.log("Admin notification email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        userEmailId: userEmailResponse.data?.id,
        adminEmailId: adminEmailResponse.data?.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in send-booking-confirmation function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});