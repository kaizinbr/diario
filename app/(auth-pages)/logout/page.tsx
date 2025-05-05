import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Logout() {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Error signing out:", error);
        return null;
    }

    redirect("/login");
}