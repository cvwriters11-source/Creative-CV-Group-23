import { isPaystackConfigured } from "@/lib/paystack";

export function getAdminEnvStatus() {
  const supabaseUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return {
    paystack: isPaystackConfigured(),
    supabase: supabaseUrl && supabaseAnon,
    resend: Boolean(process.env.RESEND_API_KEY),
    contactTo: process.env.CONTACT_TO_EMAIL || "info@creative-cv.co.za",
    adminEmail: process.env.ADMIN_EMAIL || "info@creative-cv.co.za (default)",
  };
}
