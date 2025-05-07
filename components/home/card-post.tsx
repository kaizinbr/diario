/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo, useCallback } from "react";
import { formatTimeAsTime } from "@/lib/time";

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
    profiles: Profile;
};

interface Profile {
    id: string;
    bio: string;
    color: string;
    website: string;
    pronouns: string;
    username: string;
    full_name: string;
    avatar_url: string;
    created_at: string;
    updated_at: string | null;
    lower_username: string;
}

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
                item.type !== "image" &&
                item.type !== "heading" &&
                item.type !== "imageBlock"
        )
        .slice(0, 5);

    const output = useMemo(() => {
        return generateHTML(
            {
                type: "doc",
                content: reduced,
            },
            [...extensions]
        );
    }, [post]);

    const url =
        post.content.content.find(
            (item: { type: string; attrs?: { src?: string } }) =>
                item.type === "imageBlock" || item.type === "image"
        )?.attrs?.src || null;

    // console.log("URL", post.profiles.avatar_url);
    
    useEffect(() => {
        async function fetchPostImage() {}

        fetchPostImage();
    }, [post]);

    return (
        <div
            className={`
                flex flex-row 
                bg-woodsmoke-700
                w-full gap-4
                transition-all duration-200 ease-in-out   
                rounded-3xl  relative
                post-${post.id}
                group
            `}
        >
            <div className="w-9 flex flex-row relative">
                <picture className="rounded-xl size-9 absolute top-3 flex items-center justify-center overflow-hidden z-10">
                    <Image
                        src={
                            `https://ehgrxskoduebhqzayeii.supabase.co/storage/v1/object/public/avatars/${post.profiles.avatar_url}` ||
                            ""
                        }
                        alt="Foto de perfil"
                        width={50}
                        height={50}
                        className="w-full"
                    />
                </picture>
                <div className="w-0.5 h-[calc(100%+16px)] group-first:mt-3 group-last:h-4 bg-neutral-300 ml-4.5 absolute z-0"></div>
            </div>
            <Link
                href={`/p/${post.room}`}
                // href="#"
                className={`
                    border border-neutral-400 bg-transparent rounded-3xl p-4
                    flex flex-col gap-2
                    shadow-none hover:shadow-lg
                    w-[calc(100%-36px)]
                    !transition-all !duration-200 !ease-in-out
                `}
            >
                <span className="text-xs text-neutral-500">
                    {post.profiles.username} -{" "}
                    {formatTimeAsTime(new Date(post.created_at))}
                </span>
                {title && title.length > 0 && (
                    <h1 className="text-lg font-bold">{title}</h1>
                )}
                <div className="flex flex-col gap-3 max-h-[500px] overflow-clip displaying">
                    {output && (
                        <div
                            className="text-sm text-neutral-600 mb-2 cardContent cardPostProseMirror"
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
