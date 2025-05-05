/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";

// import PastRelativeTime from "../core/PastRelativeTime";
// import EditOptions from "./EditOptions";
import { motion } from "motion/react";

// import Icon from "../core/Icon";
// import LikeBtn from "./LikeBtn";
// import { PenSquare } from "lucide-react";

import { generateHTML } from "@tiptap/html";
import extensions from "@/components/tiptap-templates/simple/extensios";

interface Post {
    title: string;
    content: string | unknown;
    public: boolean;
    author_id: string;
    id: string;
    created_at: string;
    updated_at: string;
    room: string;
    image: string;
}

interface User {
    id: string;
    updated_at: string;
    username: string;
    full_name: string;
    avatar_url: string;
    website: string;
    bio: string;
    pronouns: string;
}

type Content = {
    type: string;
    content: Array<{
        type: string;
        attrs?: {
            class?: string | null;
            textAlign?: string;
            src?: string;
            align?: string;
            width?: string;
        };
        content?: Array<{
            text: string;
            type: string;
            marks?: Array<{
                type: string;
            }>;
        }>;
    }>;
};

type Entry = {
    id: string;
    created_at: string;
    updated_at: string;
    room: string;
    content: Content;
    title: string | null;
    public: boolean;
    author_id: string;
    book_id: string | null;
    image: string | null;
    author_username: string;
    author_img: string | null;
    is_quote: boolean;
    quoted_id: string | null;
    raw: string;
    username: string;
};

type Data = Entry[];

export default function CardPost({
    post,
    edit,
}: {
    post: Entry;
    edit?: boolean;
}) {
    // const supabase = createClient();
    const [postImg, setPostImg] = useState<string | null>(null);

    // const [postData, setPostData] = useState<any | null>(null);
    const title = post.title || null;

    const reduced = post.content.content
        .filter(
            (item: { type: string }) =>
                item.type !== "imageBlock" && item.type !== "heading"
        )
        .slice(0, 5);

    const output = useMemo(() => {
        return generateHTML(
            {
                type: "doc",
                content: reduced,
            },
            [...extensions],
        );
    }, [post]);


    const url =
        post.content.content.find(
            (item: { type: string; attrs?: { src?: string } }) =>
                item.type === "imageBlock"
        )?.attrs?.src || null;
    // console.log("URL", url);    
    // if (url) {
    //     setPostImg(url);
    // }
    useEffect(() => {
        async function fetchPostImage() {}

        fetchPostImage();
    }, [post]);

    // if (post.content.length === 0) {
    //     return null;
    // }

    return (
        <div
            // whileTap={{ scale: 0.8 }}
            className={`
                flex flex-col 
                bg-woodsmoke-700
                max-w-[600px] w-full
                transition-all duration-200 ease-in-out   
                rounded-3xl  relative
                post-${post.id}
        `}
        >
            <Link
                // href={`/${edit ? "compose" : "p"}/${post.room}`}
                href="#"
                className={`
                    border border-gray-400 bg-transparent rounded-3xl p-4
                    flex flex-col gap-2
                    shadow-none hover:shadow-lg 
                    !transition-all !duration-200 !ease-in-out
                `}
            >
                <span className="text-xs text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                </span>
                {title && title.length > 0 && (
                    <h1 className="text-lg font-bold">{title}</h1>
                )}
                <div className="flex flex-col gap-3 pt-2 pb-0 max-h-[500px] overflow-clip displaying">
                    {output && (
                        <div
                            className="text-sm text-gray-600 mb-2 cardContent cardPostProseMirror"
                            dangerouslySetInnerHTML={{ __html: output }}
                        ></div>
                    )}
                </div>
                {url && (
                    <picture className=" w-full max-h-[300px] overflow-hidden rounded-2xl flex justify-center items-center">
                        <Image
                            src={url}
                            alt={title || ""}
                            width={500}
                            height={500}
                            className="size-full object-cover "
                        />
                    </picture>
                )}
            </Link>

            {/* <div className="flex w-full flex-row justify gap-3 p-3 ">
                {edit ? (
                    <span
                        className={`
                            text-xs text-woodsmoke-100
                            px-6 py-1 rounded-full border  
                            ${
                                post.public
                                    ? "bg-green-800  border-green-600"
                                    : "bg-red-800/40 border-red-600"
                            }
                        `}
                    >
                        {post.public ? "Publicado" : "Privado"}
                    </span>
                ) : (
                    <>
                        <Link
                            href={`/status/${post.room}`}
                            className=" text-xs text-woodsmoke-100"
                        >
                            <Icon
                                name="eye"
                                type="comment"
                                className="size-6"
                            />
                        </Link>
                        <ShareBtn room={post.room} edit={edit} />
                        <LikeBtn postId={post.id} />
                    </>
                )}
            </div> */}
        </div>
    );
}
