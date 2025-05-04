import { createClient } from "@supabase/supabase-js";

// Criando o Supabase Client com SERVICE_ROLE_KEY (apenas no backend)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

export default supabaseAdmin;
