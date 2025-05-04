"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Indicator } from "@mantine/core";
import { Avatar } from "@mantine/core";

import { useState, useCallback, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
// import {
//     TbUserFilled,
//     TbBellFilled,
// } from "react-icons/tb";
import localFont from "next/font/local";

import useScrollDirection from "@/hooks/useScrollDirection";

import { type User } from "@supabase/supabase-js";
import AvatarBtn from "@/components/core/Avatar-btn";

export default function Navigator({ user }: { user: User | null }) {
    const pathname = usePathname();
    const supabase = createClient();

    const [username, setUsername] = useState<string | null>(null);
    const [avatar_url, setAvatarUrl] = useState<string | null>(null);
    const scrollDirection = useScrollDirection();

    const getProfile = useCallback(async () => {
        try {
            const { data, error, status } = await supabase
                .from("profiles")
                .select(`full_name, username, avatar_url`)
                .eq("id", user?.id)
                .single();

            if (error && status !== 406) {
                console.log(error);
                throw error;
            }

            if (data) {
                setUsername(data.username);
                setAvatarUrl(data.avatar_url);
            }
        } catch (error) {
            console.log("Error loading user data!");
        }
    }, [user, supabase]);

    useEffect(() => {
        getProfile();
    }, [user, getProfile]);

    return (
        <div className="relative md:hidden w-full flex justify-center">
            <nav
                className={`
                    fixed
                    ${scrollDirection > "down" ? "" : "-bottom-24"} bottom-4
                    transition-all duration-300 z-[999]
                    mx-auto flex items-center justify-evenly
                    backdrop-blur-xl
                    bg-white border border-gray-300
                    rounded-2xl px-3 py-2 gap-3
                    shadow-lg
                `}
            >
                <button
                    className={`
                                flex  cursor-pointer
                                flex-col items-center gap-1
                                data-[active=true]:text-blue-celestial
                                hover:text-blue-celestial
                                transition-all duration-200 ease-in-out
                            `}
                >
                    <AvatarBtn avatar_url={avatar_url || ""} />
                </button>

                <Link
                    data-active={
                        pathname === "/me" || pathname === `${username}`
                    }
                    href={username ? `/${username}` : "/me"}
                    className={`
                                flex cursor-pointer
                                flex-col items-center gap-1
                                bg-black rounded-xl text-white
                                px-4 py-2
                                transition-all duration-200 ease-in-out
                            `}
                >
                    Criar post
                </Link>
            </nav>
        </div>
    );
}

export function DesktopNavigator({ user }: { user: User | null }) {
    const pathname = usePathname();
    const supabase = createClient();

    const [name, setName] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [avatar_url, setAvatarUrl] = useState<string | null>(null);
    const scrollDirection = useScrollDirection();

    const getProfile = useCallback(async () => {
        try {
            const { data, error, status } = await supabase
                .from("profiles")
                .select(`name, username, avatar_url`)
                .eq("id", user?.id)
                .single();

            if (error && status !== 406) {
                console.log(error);
                throw error;
            }

            if (data) {
                setName(data.name);
                setUsername(data.username);
                setAvatarUrl(data.avatar_url);
            }
        } catch (error) {
            console.log("Error loading user data!");
        }
    }, [user, supabase]);

    useEffect(() => {
        getProfile();
    }, [user, getProfile]);

    return (
        <div className="relative hidden md:block">
            <nav
                className={`
                    fixed
                    ${scrollDirection > "down" ? "top-0" : "-top-24"}
                    transition-all duration-300 z-[999]
                    left-0 flex w-full items-center justify-evenly
                    backdrop-blur-xl
                    bg-bunker-950/70 h-16
                    px-6 py-1
                `}
            >
                <div className="max-w-4xl flex flex-row w-full justify-between items-center">
                    <div
                        className={`
                        flex flex-row items-center justify-evenly
                    `}
                    >
                        <Link
                            href={`https://pitchforkd.me/`}
                            className={
                                FFDisplay.className + ` font-bold mr-8 text-xl`
                            }
                        >
                            Pitchforkd
                        </Link>
                        <button>
                            <Link
                                data-active={pathname === "/home"}
                                href={`/home`}
                                className={`
                                    flex  basis-0 cursor-pointer
                                    flex-col items-center gap-1 rounded-8 p-3
                                    data-[active=true]:text-green-pastel
                                    hover:text-green-pastel
                                    transition-all duration-200 ease-in-out
                                `}
                            >
                                <Icon type="home" className="h-5" />
                            </Link>
                        </button>
                        <button>
                            <Link
                                data-active={pathname === "/search"}
                                href={`/search`}
                                className={`
                                    flex  basis-0 cursor-pointer
                                    flex-col items-center gap-1 rounded-8 p-3
                                    data-[active=true]:text-orange-safety
                                    hover:text-orange-safety
                                    transition-all duration-200 ease-in-out
                                `}
                            >
                                <Icon type="search" className="h-5" />
                            </Link>
                        </button>
                        <button>
                            <Link
                                data-active={pathname === "/notifications"}
                                href={`/notifications`}
                                className={`
                                    flex cursor-pointer
                                    flex-col items-center gap-1 rounded-8 p-3
                                    data-[active=true]:text-blue-celestial
                                    hover:text-blue-celestial
                                    transition-all duration-200 ease-in-out
                                `}
                            >
                                <TbBellFilled className="size-6" />
                            </Link>
                        </button>
                    </div>

                    <button className="">
                        <Link
                            data-active={
                                pathname === "/me" || pathname === `${username}`
                            }
                            href={username ? `/${username}` : "/me"}
                            className={`
                                flex basis-0 cursor-pointer
                                flex-row items-center gap-2
                                py-3 pl-4
                                data-[active=true]:text-green-pastel
                                hover:text-green-pastel
                                transition-all duration-200 ease-in-out
                            `}
                        >
                            {avatar_url ? (
                                <>
                                    <div className="flex flex-col items-end justify-center">
                                        <span className="text-xs font-semibold">
                                            {name}
                                        </span>
                                        <span className="text-[10px] font-light">
                                            {`@${username}`}
                                        </span>
                                    </div>
                                    <Avatar
                                        size={36}
                                        src={avatar_url}
                                        isIcon={true}
                                    />
                                </>
                            ) : (
                                <TbUserFilled className="size-6" />
                            )}
                        </Link>
                    </button>
                </div>
            </nav>
        </div>
    );
}
