import { createClient } from "@/utils/supabase/client";

export default async function usernameAlreadyExists({
    username,
    actualUsername,
}: {
    username: string;
    actualUsername: string;
}) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("lowercased_username", username.toLowerCase());

    if (error) {
        console.log(error);
        return false;
    }
    console.log(actualUsername);
    console.log(username);
    console.log(data);

    if (data.length > 0) {
        if (data[0].username === actualUsername) {
            console.log("false");
            return false;
        } else {
            console.log("true");
            return true;
        }
    }
}
