import CreatePost from "@/components/create/main";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    console.log(id);
    return (
        <CreatePost id={id} />
    );
}
