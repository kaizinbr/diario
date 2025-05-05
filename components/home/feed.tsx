/* eslint-disable @typescript-eslint/no-explicit-any */
// import Image from "next/image";
import CardPost from "@/components/home/card-post";

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

// function PostCard({
//     title,
//     description,
//     imageSrc,
//     date,
// }: {
//     title: string;
//     description: string;
//     imageSrc: string;
//     date: Date;
// }) {
//     return (
//         <div
//             className={`
//                 border border-gray-300 bg-white rounded-3xl p-4
//                 flex flex-col gap-2
//             `}
//         >
//             {title && title.length > 0 && (
//                 <h1 className="text-lg font-bold">{title}</h1>
//             )}
//             <p className="text-sm text-gray-500 mb-2">{description}</p>
//             {imageSrc && (
//                 <picture className=" w-full max-h-[300px] overflow-hidden rounded-2xl flex justify-center items-center">
//                     <Image
//                         src={imageSrc}
//                         alt={title}
//                         width={500}
//                         height={500}
//                         className="size-full object-cover "
//                     />
//                 </picture>
//             )}
//             <span className="text-xs text-gray-500">
//                 {date.toLocaleDateString()}
//             </span>
//         </div>
//     );
// }

export default function Feed({
    dateValue,
    modeValue,
    posts,
    userId,
}: {
    dateValue: Date;
    modeValue: string | null;
    posts: unknown[];
    userId: string;
}) {
    const supabase = createClient();
    // console.log(posts)

    const [feedPosts, updateFeedPosts] = useState<any[]>(posts);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);

            if (modeValue === "Todos os posts") {
                const { data, error } = await supabase
                    .from("posts")
                    .select("*")
                    .eq("author_id", userId)
                    .order("created_at", { ascending: false })

                if (error) {
                    console.error("Error fetching posts:", error);
                } else {
                    console.log(data);
                    updateFeedPosts(data || []);
                }
                setLoading(false);
                return;
            } else {
                // Obtém o início e o final do dia
                const startOfDay = new Date(dateValue);
                startOfDay.setHours(0, 0, 0, 0);

                const endOfDay = new Date(dateValue);
                endOfDay.setHours(23, 59, 59, 999);

                const { data, error } = await supabase
                    .from("posts")
                    .select("*")
                    .eq("author_id", userId)
                    .gte("created_at", startOfDay.toISOString()) // Maior ou igual ao início do dia
                    .lt("created_at", endOfDay.toISOString()) // Menor que o final do dia
                    .order("created_at", { ascending: false })

                if (error) {
                    console.error("Error fetching posts:", error);
                } else {
                    console.log(data);
                    updateFeedPosts(data || []);
                }
            }

            setLoading(false);
        };

        fetchPosts();
    }, [supabase, userId, dateValue, modeValue]);

    return (
        <div className=" mt-8">
            <h2 className="text-2xl font-bold mb-6">Posts</h2>
            <div
                className={`
                    flex flex-col w-full gap-4
                `}
            >
                {feedPosts.map((post: any) => (
                    <CardPost key={post.id} post={post} edit={false} />
                ))}

                {loading && (
                    <div className="flex justify-center items-center h-20">
                        <span className="text-gray-500">Loading...</span>
                    </div>
                )}

                {/* Se não houver posts e não estiver carregando, exibe uma mensagem */}
                {feedPosts.length === 0 && !loading && (
                    <div className="flex justify-center items-center h-20">
                        <span className="text-gray-500">
                            Nenhum post ainda...
                        </span>
                    </div>
                )}

                {/* Example Post Cards */}
                {/* <div
                    className={`
                    border border-gray-400 rounded-3xl p-4
                    flex flex-col gap-2
                `}
                >
                    <h1 className="text-lg font-bold">Post 1</h1>
                    <p className="text-sm text-gray-500 mb-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                    </p>
                    <picture className=" w-full max-h-[300px] overflow-hidden rounded-2xl flex justify-center items-center">
                        <Image
                            src="/1.jpeg"
                            alt="Post 1"
                            width={500}
                            height={500}
                            className="size-full object-cover "
                        />
                    </picture>
                    <span className="text-xs text-gray-500">
                        {value.toLocaleDateString()}
                    </span>
                </div>
                <div
                    className={`
                    border border-gray-300 bg-white rounded-3xl p-4
                    flex flex-col gap-2
                `}
                >
                    <h1 className="text-lg font-bold">Post 1</h1>
                    <p className="text-sm text-gray-500 mb-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                    </p>
                    <picture className=" w-full max-h-[300px] overflow-hidden rounded-2xl flex justify-center items-center">
                        <Image
                            src="/2.png"
                            alt="Post 1"
                            width={500}
                            height={500}
                            className="size-full object-cover "
                        />
                    </picture>
                    <span className="text-xs text-gray-500">
                        {value.toLocaleDateString()}
                    </span>
                </div> */}
            </div>
        </div>
    );
}
