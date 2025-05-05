import Edit from "@/components/me/profile";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id);

    if (error) {
        console.error("Error fetching user", error);
    }
    // console.log("User data:", data);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Meu perfil</h1>
            <p className="mt-4">User ID: {user?.id}</p>
            <p className="mt-2">Email: {user?.email}</p>
            {data && data[0] && <Edit profile={data[0]} />}
        </div>
    );
}
