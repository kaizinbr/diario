/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

// supabase
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";



import defaultContent from "@/components/tiptap-templates/simple/data/content.json";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

export default function CreatePost ({ id }: { id: string }) {
    

    const supabase = createClient();

    const [loggedId, setLoggedId] = useState("");
    const [authorId, setAuthorId] = useState("");
    const [publicPost, setPublicPost] = useState(false);
    const [initialContent, setInitialContent] = useState<object>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // fetch data
        const contentfetch = async () => {
            const { data: session } = await supabase.auth.getSession();
            console.log(session);

            if (!session) {
                return;
            }

            const exists = await supabase
                .from("posts")
                .select("*")
                .eq("room", id);

            if (exists.data?.length === 0) {
                setAuthorId(session!.session!.user.id);
                console.log("Hmm, parece que esse post não existe ainda");
                console.log("Um momento, estou criando...");
                await supabase.from("posts").insert([
                    {
                        room: id,
                        content: "",
                        author_id: session!.session!.user.id,
                    },
                ]);

                console.log("Post criado com sucesso!");
                // setInitialContent();

                setLoading(false);
                return;
            } else {
                console.log("Post encontrado!");
                const { data, error } = await supabase
                    .from("posts")
                    .select("content,title,image,author_id,public")
                    .eq("room", id)
                    .single();

                if (data) {
                    const cont = data.content;
                    setInitialContent(cont);
                    console.log("data", data);
                    console.log("content being set:", cont);

                    // setTimeout(() => {
                    //     setInitialContent(cont);
                    //     console.log("data dps de 5s", initialContent);
                    // }, 5000);
                }

                if (error) {
                    console.error("error", error);
                    return;
                }

                // setInitialContent(data.content);
                // setTitle(data.title);
                // setImage(data.image);
                setAuthorId(data.author_id);
                setPublicPost(data.public);
                // console.log(data.author_id);
                setLoading(false);
            }
        };

        const checkIfCanSee = async () => {
            const { data } = await supabase.auth.getSession();

            if (data.session) {
                setLoggedId(data.session.user.id);
                console.log(data.session.user.id);
                // console.log(authorId, loggedId);
            }
        };

        contentfetch();
        checkIfCanSee();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            {loading ? (
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Loading...</p>
                </div>
            ) :  (
                
                <SimpleEditor id={id} initialContent={initialContent} authorId={authorId} loggedId={loggedId} isPublic={publicPost} />
            )}
        </>
    );
}
