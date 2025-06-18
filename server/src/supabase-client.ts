import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv"

dotenv.config();
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.PRIVATE_SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: true,
  },
});
