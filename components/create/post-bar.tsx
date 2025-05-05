/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

// supabase
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
// lucide-react
import { Trash2 } from "lucide-react";
// mantine
import { useDisclosure } from "@mantine/hooks";
import { Modal, LoadingOverlay } from "@mantine/core";
import Link from "next/link";

export default function PostBar({
    id,
    loggedId,
    authorId,
    isPublic,
}: {
    id: string;
    loggedId: string;
    authorId: string;
    isPublic: boolean;
}) {
    const supabase = createClient();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [publicPost, setPublicPost] = useState(isPublic);
    const [opened, { open, close }] = useDisclosure(false);

    const [visible, { toggle }] = useDisclosure(false);

    const publishState = async () => {
        const { data: session } = await supabase.auth.getSession();
        console.log(session);

        if (!session) {
            return;
        }

        console.log("Post é: ", publicPost);

        await supabase
            .from("posts")
            .update({
                public: !publicPost,
            })
            .eq("room", id);

        console.log("Post atualizado com sucesso!");
        setPublicPost(!publicPost);

        console.log("Post agora é: ", !publicPost);
    };

    const deletePost = async () => {
        close()
        toggle();
        const { data: session } = await supabase.auth.getSession();
        console.log(session);

        if (!session) {
            return;
        }

        console.log("Post é: ", publicPost);

        await supabase.from("posts").delete().eq("room", id);

        console.log("Post deletado com sucesso!");
        router.push("/");
    };

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                centered
                withCloseButton={false}
                classNames={{
                    content: "rounded-lg bg-white dark:bg-neutral-800",
                    header: "rounded-t-lg",
                    close: "rounded-tr-lg",
                }}
            >
                <div className="flex flex-col gap-4">
                    <h1 className="text-lg font-semibold">Deletar post</h1>
                    <p className="text-sm text-neutral-500">
                        Tem certeza que deseja deletar esse post? Essa ação não
                        pode ser desfeita.
                    </p>
                    <div className="flex flex-row gap-2 ">
                        <button
                            onClick={async () => {
                                await deletePost();
                            }}
                            className="px-4 py-2 rounded-xl bg-red-400 text-white cursor-pointer !font-semibold w-1/2"
                        >
                            Deletar
                        </button>
                        <button
                            onClick={() => close()}
                            className="px-4 py-2 rounded-xl bg-neutral-200 text-neutral-800 cursor-pointer font-semibold w-1/2"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </Modal>
            <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <div
                className={`
                    sticky top-0 z-10 flex items-center justify-between w-full px-4 py-2 
                    bg-white border-b border-neutral-200
                    dark:bg-neutral-800 dark:border-neutral-700
                `}
            >
                <div className="post-bar flex items-center gap-2 w-full justify-between">
                    <h1>Novo pensamento</h1>
                    <div className="flex flex-row gap-2">
                        <button
                            type="button"
                            className="px-3 py-2 rounded-xl bg-red-400 text-white cursor-pointer font-semibold"
                            onClick={async () => {
                                open();
                            }}
                        >
                            <Trash2 size={16} className="" />
                        </button>
                        <Link
                            type="button"
                            className="px-4 py-2 rounded-xl bg-black text-white cursor-pointer font-semibold"
                            href={`/p/${id}`}
                        >
                            Ver post
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
