"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// import { Indicator } from "@mantine/core";
// import { Avatar } from "@mantine/core";
import { AnimatePresence, motion } from "motion/react";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Settings, LogOut, ChevronUp, Home, Folder } from "lucide-react";

import useScrollDirection from "@/hooks/useScrollDirection";

import { type User as UserType } from "@supabase/supabase-js";
import AvatarBtn from "@/components/core/Avatar-btn";

export default function Navigator({ user }: { user: UserType | null }) {
    // console.log(user)
    const pathname = usePathname();
    const supabase = createClient();

    const [full_name, setFullName] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [avatar_url, setAvatarUrl] = useState<string | null>(null);
    const scrollDirection = useScrollDirection();

    const [isExpanded, setIsExpanded] = useState(false);

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
                setFullName(data.full_name);
                setUsername(data.username);
                setAvatarUrl(data.avatar_url);
            }
        } catch (error) {
            console.log("Error loading user data!", error);
        }
    }, [user, supabase]);

    useEffect(() => {
        if (user) {
            getProfile();
        } else {
            console.log("User not found!");
        }
    }, [user, getProfile]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsExpanded(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    });

    return (
        <div className="relative w-full flex justify-center">
            <motion.nav
                initial={{ scale: 0.9, opacity: 0, bottom: "-100px", y: 20 }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    bottom: scrollDirection > "down" ? "16px" : "-100px",
                    y: 0,
                    // width: isExpanded ? "100%" : "296px",
                }}
                exit={{ scale: 0.9, opacity: 0, bottom: "-100px", y: 20 }}
                transition={{
                    type: "spring", // Usa spring para um efeito mais fluido
                    stiffness: 200, // Controla a rigidez da mola
                    damping: 20, // Controla o amortecimento (quanto menor, mais "pulante")
                    bounce: 0.3, // Adiciona o efeito de "overshoot"
                    duration: 0.3,
                }}
                className={`
                    fixed bottom-6 w-74
                    transition-all duration-300 z-[999]
                    mx-auto flex items-center justify-evenly
                    backdrop-blur-xl
                    bg-white/90 border border-neutral-300
                    rounded-2xl p-3
                    shadow-lg  max-w-full
                    
                `}
            >
                {user ? (
                    <motion.div
                        initial={{ height: "auto" }}
                        animate={{
                            height: isExpanded ? "300px" : "40.8px",
                            // opacity: isExpanded ? 1 : 0.9,
                        }}
                        transition={{
                            type: "spring", // Usa spring para um efeito mais fluido
                            stiffness: 200, // Controla a rigidez da mola
                            damping: 20, // Controla o amortecimento (quanto menor, mais "pulante")
                            bounce: 0.3, // Adiciona o efeito de "overshoot"
                            duration: 0.5, // Duração da animação
                        }}
                        className="w-full overflow-hidden flex flex-col items-center relative"
                    >
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-row flex-wrap items-center gap-3 w-full"
                                >
                                    <Link
                                        onClick={() =>
                                            setIsExpanded(!isExpanded)
                                        }
                                        href="/me"
                                        className={`
                                            bg-neutral-200 text-black rounded-xl text-xs
                                            p-2 w-full flex flex-row items-center gap-1 justify-start 
                                            hover:bg-neutral-300 transition-all duration-200 ease-in-out
                                        `}
                                    >
                                        <AvatarBtn
                                            avatar_url={avatar_url || ""}
                                        />
                                        <div className="flex flex-col justify-center">
                                            <span className="text-xs font-semibold">
                                                {full_name ? full_name : "Nome"}
                                            </span>
                                            <span className="text-[10px] font-light">
                                                {username
                                                    ? `@${username}`
                                                    : "Perfil"}
                                            </span>
                                        </div>
                                    </Link>
                                    <Link
                                        onClick={() =>
                                            setIsExpanded(!isExpanded)
                                        }
                                        href="/"
                                        className={`
                                            bg-neutral-200 text-black rounded-xl text-xs
                                            p-2 size-20.5 flex flex-col items-center gap-1 justify-center 
                                            hover:bg-neutral-300 transition-all duration-200 ease-in-out
                                        `}
                                    >
                                        <Home className="h-4" />
                                        Home
                                    </Link>
                                    <Link
                                        onClick={() =>
                                            setIsExpanded(!isExpanded)
                                        }
                                        href="#"
                                        className={`
                                            bg-neutral-200 text-black rounded-xl text-xs
                                            p-2 size-20.5 flex flex-col items-center gap-1 justify-center 
                                            hover:bg-neutral-300 transition-all duration-200 ease-in-out
                                        `}
                                    >
                                        <Folder className="h-4" />
                                        Organizar
                                    </Link>

                                    <Link
                                        href="/settings"
                                        className={`
                                            bg-neutral-200 text-black rounded-xl text-xs
                                            p-2 size-20.5 flex flex-col items-center gap-1 justify-center  
                                            hover:bg-neutral-300 transition-all duration-200 ease-in-out
                                        `}
                                    >
                                        <Settings className="h-4" />
                                        Config.
                                    </Link>
                                    <Link
                                        onClick={() =>
                                            setIsExpanded(!isExpanded)
                                        }
                                        href="/logout"
                                        className={`
                                            bg-red-200 text-black rounded-xl text-xs
                                            p-2 w-full flex flex-col items-center gap-1 justify-center 
                                            hover:bg-red-300 transition-all duration-200 ease-in-out
                                        `}
                                    >
                                        <LogOut className="h-4" />
                                        Sair
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div className="flex flex-row gap-3 absolute bottom-0 justify-between w-full">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className={`
                                flex  cursor-pointer
                                flex-row items-center
                                data-[active=true]:text-blue-celestial
                                hover:text-blue-celestial
                                transition-all duration-200 ease-in-out
                            `}
                            >
                                <AvatarBtn avatar_url={avatar_url || ""} />
                                <ChevronUp
                                    className={`
                                    h-4 transition duration-200
                                    ${isExpanded ? "rotate-180" : "rotate-0"}
                                `}
                                />
                            </button>
                            <Link
                                onClick={() => setIsExpanded(!isExpanded)}
                                href={"/"}
                                className={`
                                cursor-pointer
                                flex-row  gap-1
                                data-[active=true]:text-blue-celestial
                                hover:text-blue-celestial
                                transition-all duration-200 ease-in-out
                                bg-[#eea0ff] text-black rounded-xl text-xs
                                w-[40.8px] flex items-center justify-center     
                            `}
                            >
                                <Home className="h-4" />
                            </Link>
                            <Link
                                onClick={() => setIsExpanded(!isExpanded)}
                                href={"/add"}
                                className={`
                                flex cursor-pointer
                                flex-col items-center gap-1
                                bg-[#7ae582] text-black font-semibold
                                hover:bg-[#7ae582]/80 
                                rounded-xl 
                                px-6 py-2
                                transition-all duration-200 ease-in-out
                            `}
                            >
                                Pensamento
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex flex-row gap-3 items-center justify-center">
                        <Link
                            href="/login"
                            className={`
                                flex cursor-pointer
                                flex-col items-center gap-1
                                bg-black rounded-xl text-white
                                px-6 py-2
                                transition-all duration-200 ease-in-out
                            `}
                        >
                            Entrar
                        </Link>
                        <Link
                            href="/sign-up"
                            className={`
                                flex cursor-pointer
                                flex-col items-center gap-1
                                bg-black rounded-xl text-white
                                px-6 py-2
                                transition-all duration-200 ease-in-out
                            `}
                        >
                            Cadastrar
                        </Link>
                    </div>
                )}
            </motion.nav>
        </div>
    );
}

// export function DesktopNavigator({ user }: { user: User | null }) {
//     const pathname = usePathname();
//     const supabase = createClient();

//     const [name, setName] = useState<string | null>(null);
//     const [username, setUsername] = useState<string | null>(null);
//     const [avatar_url, setAvatarUrl] = useState<string | null>(null);
//     const scrollDirection = useScrollDirection();

//     const getProfile = useCallback(async () => {
//         try {
//             const { data, error, status } = await supabase
//                 .from("profiles")
//                 .select(`name, username, avatar_url`)
//                 .eq("id", user?.id)
//                 .single();

//             if (error && status !== 406) {
//                 console.log(error);
//                 throw error;
//             }

//             if (data) {
//                 setName(data.name);
//                 setUsername(data.username);
//                 setAvatarUrl(data.avatar_url);
//             }
//         } catch (error) {
//             console.log("Error loading user data!");
//         }
//     }, [user, supabase]);

//     useEffect(() => {
//         getProfile();
//     }, [user, getProfile]);

//     return (
//         <div className="relative hidden md:block">
//             <nav
//                 className={`
//                     fixed
//                     ${scrollDirection > "down" ? "top-0" : "-top-24"}
//                     transition-all duration-300 z-[999]
//                     left-0 flex w-full items-center justify-evenly
//                     backdrop-blur-xl
//                     bg-bunker-950/70 h-16
//                     px-6 py-1
//                 `}
//             >
//                 <div className="max-w-4xl flex flex-row w-full justify-between items-center">
//                     <div
//                         className={`
//                         flex flex-row items-center justify-evenly
//                     `}
//                     >
//                         <Link
//                             href={`https://pitchforkd.me/`}
//                             className={
//                                 FFDisplay.className + ` font-bold mr-8 text-xl`
//                             }
//                         >
//                             Pitchforkd
//                         </Link>
//                         <button>
//                             <Link
//                                 data-active={pathname === "/home"}
//                                 href={`/home`}
//                                 className={`
//                                     flex  basis-0 cursor-pointer
//                                     flex-col items-center gap-1 rounded-8 p-3
//                                     data-[active=true]:text-green-pastel
//                                     hover:text-green-pastel
//                                     transition-all duration-200 ease-in-out
//                                 `}
//                             >
//                                 <Icon type="home" className="h-5" />
//                             </Link>
//                         </button>
//                         <button>
//                             <Link
//                                 data-active={pathname === "/search"}
//                                 href={`/search`}
//                                 className={`
//                                     flex  basis-0 cursor-pointer
//                                     flex-col items-center gap-1 rounded-8 p-3
//                                     data-[active=true]:text-orange-safety
//                                     hover:text-orange-safety
//                                     transition-all duration-200 ease-in-out
//                                 `}
//                             >
//                                 <Icon type="search" className="h-5" />
//                             </Link>
//                         </button>
//                         <button>
//                             <Link
//                                 data-active={pathname === "/notifications"}
//                                 href={`/notifications`}
//                                 className={`
//                                     flex cursor-pointer
//                                     flex-col items-center gap-1 rounded-8 p-3
//                                     data-[active=true]:text-blue-celestial
//                                     hover:text-blue-celestial
//                                     transition-all duration-200 ease-in-out
//                                 `}
//                             >
//                                 <TbBellFilled className="size-6" />
//                             </Link>
//                         </button>
//                     </div>

//                     <button className="">
//                         <Link
//                             data-active={
//                                 pathname === "/me" || pathname === `${username}`
//                             }
//                             href={username ? `/${username}` : "/me"}
//                             className={`
//                                 flex basis-0 cursor-pointer
//                                 flex-row items-center gap-2
//                                 py-3 pl-4
//                                 data-[active=true]:text-green-pastel
//                                 hover:text-green-pastel
//                                 transition-all duration-200 ease-in-out
//                             `}
//                         >
//                             {avatar_url ? (
//                                 <>
//                                     <div className="flex flex-col items-end justify-center">
//                                         <span className="text-xs font-semibold">
//                                             {name}
//                                         </span>
//                                         <span className="text-[10px] font-light">
//                                             {`@${username}`}
//                                         </span>
//                                     </div>
//                                     <Avatar
//                                         size={36}
//                                         src={avatar_url}
//                                         isIcon={true}
//                                     />
//                                 </>
//                             ) : (
//                                 <TbUserFilled className="size-6" />
//                             )}
//                         </Link>
//                     </button>
//                 </div>
//             </nav>
//         </div>
//     );
// }
