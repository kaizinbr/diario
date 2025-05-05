"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { Avatar as Ava2 } from "@mantine/core";
import { Pen } from "lucide-react";

export default function Avatar({
    uid,
    url,
    size,
    onUpload,
}: {
    uid: string | null;
    url: string | null;
    size: number;
    onUpload: (url: string) => void;
}) {
    const supabase = createClient();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        async function downloadImage(path: string) {
            try {
                const { data, error } = await supabase.storage
                    .from("avatars")
                    .download(path);
                if (error) {
                    throw error;
                }

                const url = URL.createObjectURL(data);
                setAvatarUrl(url);
            } catch (error) {
                console.log("Error downloading image: ", error);
            }
        }

        if (url) downloadImage(url);
    }, [url, supabase]);

    const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
        event
    ) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image to upload.");
            }

            const file = event.target.files[0];
            const fileExt = file.name.split(".").pop();
            const filePath = `${uid}-${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            onUpload(filePath);

            // console.log(colors);
        } catch (error) {
            alert("Error uploading avatar!");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex relative flex-col justify-center items-center size-48 rounded-[3.4rem] ">
            {avatarUrl ? (
                <picture
                    className={`
                        flex flex-row justify-center items-center
                        bg-neutral-800 rounded-[3.4rem] overflow-hidden
                        size-48
                        
                    `}
                >
                    {avatarUrl && (
                        <Image
                            width={size}
                            height={size}
                            src={avatarUrl}
                            alt="Avatar"
                            className={`
                                object-cover object-center
                                min-w-full
                                avatar image
                            `}
                            style={{ height: size, width: size }}
                        />
                    )}
                </picture>
            ) : (
                <Ava2
                    size={size}
                    radius="xl"
                    src={avatarUrl}
                    className="rounded-full"
                    alt="Avatar"
                    style={{ height: size, width: size }}
                />
            )}
            <div style={{ width: size }} className="absolute w-full">
                <label
                    className="size-48 cursor-pointer flex rounded-[3.4rem] justify-center items-center"
                    htmlFor="single"
                >
                    {uploading ? (
                        <div className="size-48 flex rounded-[3.4rem] justify-center items-center bg-black/40">
                            Uploading ...
                        </div>
                    ) : (
                        ""
                    )}
                </label>
                <input
                    style={{
                        visibility: "hidden",
                        position: "absolute",
                    }}
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                />
            </div>
        </div>
    );
}
