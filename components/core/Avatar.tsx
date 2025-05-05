"use client";
import { useState, useEffect } from "react";
import { Avatar as UserAvatar } from "@mantine/core";
import { createClient } from "@/utils/supabase/client";

export default function Avatar({
    src,
    size,
    className,
    isIcon,
}: {
    src: string | null;
    size: number;
    className?: string;
    isIcon?: boolean;
}) {
    const supabase = createClient();
    const [avatarSrc, setAvatarSrc] = useState<string | null>(src);


    useEffect(() => {
        async function downloadImage(path: string) {
            try {

                if (path.startsWith("https")) {
                    setAvatarSrc(path);
                    return;
                }

                if (path.startsWith("data:image")) {
                    setAvatarSrc(path);
                    return;
                }

                const { data } = supabase.storage
                    .from("avatars")
                    .getPublicUrl(path);

                setAvatarSrc(data.publicUrl);

                // console.log("Downloaded image:", data);
            } catch (error) {
                console.log("Error downloading image: ", error);
            }
        }

        if (src) downloadImage(src);
    }, [src, supabase]);

    return (
        <UserAvatar
            src={avatarSrc}
            alt="Avatar"
            className={`
                ${className}
                size-6 !rounded-(--icon) text-woodsmoke-700
            `}
            size={size}
        />
    );
}
