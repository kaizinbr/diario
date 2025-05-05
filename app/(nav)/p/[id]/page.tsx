import { createClient } from "@/utils/supabase/server";
import { DisplayEditor } from "@/components/post/display";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    console.log(id);

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("posts")
        .select("content,title,image,author_id,public")
        .eq("room", id)
        .single();

    if (error) {
        console.error("error", error);
        return;
    }

    return <DisplayEditor initialContent={data?.content} id={id} />;
}
