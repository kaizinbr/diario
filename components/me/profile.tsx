/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import usernameAlreadyExists from "@/lib/usernameAlreadyExists";
import containsSpecialChars from "@/lib/containsSpecialChars";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Avatar from "@/components/me/avatar-edit";

export default function Edit({ profile }: { profile: any }) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [name, setName] = useState<string | null>(profile.full_name);
    const [username, setUsername] = useState<string | null>(profile.username);
    const actualUsername = profile.username;

    const [avatar_url, setAvatarUrl] = useState<string | null>(
        profile.avatar_url
    );

    const [message, setMessage] = useState<string>("");

    const router = useRouter();
    async function updateProfile({
        username,
        avatar_url,
        name,
    }: {
        username: string | null;
        name: string | null;
        avatar_url: string | null;
    }) {
        try {
            setLoading(true);

            const lowercasedUsername = username?.toLowerCase();

            const { error } = await supabase.from("profiles").upsert({
                id: profile?.id as string,
                full_name: name,
                username,
                lower_username: lowercasedUsername,
                avatar_url,
            });
            if (error) throw error;
            alert("Profile updated!");
            router.push(`/`);
        } catch (error) {
            alert("Error updating the data!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="form-widget flex flex-col justify-center w-full px-5 max-w-2xl pt-16  relative">
            {/* FOTO DE PERFIL */}
            <Avatar
                uid={profile.id}
                url={avatar_url!}
                size={192}
                onUpload={(url) => {
                    setAvatarUrl(url);
                }}
            />

            {/* FORMULARIO DE DADOS DE USUARIO */}
            <form
                className={`
                    profile  
                    flex-1 flex flex-col w-full
                    rounded-2xl py-5 bg-bunker-800
                    gap-3 mt-8
                `}
                autoComplete="off"
                spellCheck="false"
            >
                <h1 className="text-lg font-semibold">Dados pessoais</h1>
                <div>
                    <label
                        htmlFor="name"
                        className={`
                                    text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70
                                    text-bunker-300
                                `}
                    >
                        Nome
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={name || ""}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu Nome..."
                        maxLength={20}
                        className={`
                                        outline-none
                                        transition duration-200 ease-in-out
                                        text-3xl font-bold 
                                        flex h-10 w-full rounded-xl 
                                        border border-bunker-700 bg-bunker-700 px-3 py-2 
                                        ring-offset-background 
                                        placeholder:text-neutral-400 focus-visible:outline-none 
                                `}
                    ></input>
                </div>
                <div className="">
                    <label
                        htmlFor="username"
                        className={`
                                    text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70
                                    text-bunker-300
                                `}
                    >
                        Nome de usuário
                    </label>
                    <div
                        className={`
                                    flex flex-row py-1
                                    ${message != "" ? "text-red-500" : ""}
                                    transition duration-200 ease-in-out
                                    flex h-10 w-full rounded-xl
                                            border border-bunker-700 bg-bunker-700 px-3 py-2
                                            ring-offset-background
                                            placeholder:text-neutral-400 focus-visible:outline-none
                                `}
                    >
                        <span className="">@</span>
                        <input
                            type="text"
                            name="username"
                            value={username || ""}
                            onKeyUp={async (e) => {
                                if (e.currentTarget.value.trim() === "") {
                                    setDisabled(true);
                                    setMessage("Username não pode ser vazio");
                                } else if (e.currentTarget.value.length < 3) {
                                    setDisabled(true);
                                    setMessage(
                                        "Username deve ter pelo menos 3 caracteres"
                                    );
                                } else if (
                                    await usernameAlreadyExists({
                                        username: e.currentTarget.value,
                                        actualUsername: actualUsername ?? "",
                                    })
                                ) {
                                    console.log("user already exists");
                                    setDisabled(true);
                                    setMessage("Username já existe");
                                } else if (
                                    containsSpecialChars(
                                        (e.target as HTMLInputElement).value
                                    )
                                ) {
                                    setDisabled(true);
                                    setMessage(
                                        "Username não pode conter caracteres especiais"
                                    );
                                } else if (
                                    (e.target as HTMLInputElement).value
                                        .length > 20
                                ) {
                                    setDisabled(true);
                                    console.log("user too long");
                                    setMessage(
                                        "O nome de usuário deve ter no máximo 20 caracteres"
                                    );
                                } else {
                                    setDisabled(false);
                                    setMessage("");
                                }
                            }}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Seu Username..."
                            maxLength={20}
                            className={`
                                            outline-none
                                            transition duration-200 ease-in-out
                                            ring-offset-background
                                            placeholder:text-neutral-400 focus-visible:outline-none w-full
                                        `}
                        ></input>
                    </div>
                </div>
                {message != "" ? (
                    <span className="text-red-500 text-sm">{message}</span>
                ) : null}
            </form>
            
            <button
                className={`
                            py-2 px-6
                            flex justify-center items-center
                            text-white text-sm !font-semibold rounded-xl
                            fixed right-4
                            max-w-2xl mx-auto top-4
                            cursor-pointer
                            transition-all duration-300
                            z-[500]
                            ${
                                disabled
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : " bg-neutral-900 hover:bg-main-600 cursor-pointer"
                            }
                        `}
                onClick={() =>
                    updateProfile({
                        name,
                        username,
                        avatar_url,
                    })
                }
                disabled={disabled}
            >
                {loading ? "Salvando..." : "Salvar"}
            </button>
        </div>
    );
}
