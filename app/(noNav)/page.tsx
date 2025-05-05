import HomePage from "@/components/home/main";

import { createClient } from "@/utils/supabase/server";

export default async function Home() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .eq("author_id", user?.id)        
        .gte("created_at", startOfDay.toISOString()) // Maior ou igual ao início do dia
        .lt("created_at", endOfDay.toISOString()) // Menor que o final do dia
        .order("created_at", { ascending: false })
        .limit(30);

    if (error) {
        console.error("Error fetching posts:", error);
        return null;
    }

    // console.log(posts);
    return <HomePage posts={posts} userId={user!.id} />;
}
