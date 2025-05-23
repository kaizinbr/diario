"use client";

import {  Avatar } from "@mantine/core";


export default function AvatarBtn({ avatar_url }: { avatar_url: string }) {


    const url = `https://ehgrxskoduebhqzayeii.supabase.co/storage/v1/object/public/avatars/${avatar_url}`;


    return (
        // <Menu offset={12}
        //     classNames={{
        //         dropdown: "bg-white border !border-neutral-300 !rounded-2xl",
        //         item: "hover:bg-[#2C2D2F] hover:text-white",
        //     }}
        // >
        //     <Menu.Target>
        //         <Avatar
        //             size={40}
        //             src={url}
        //             variant="default"
        //             radius="12px"
        //         />
        //     </Menu.Target>

        //     <Menu.Dropdown>
        //         <Menu.Item
        //             leftSection={<User size={14} />}
        //             onClick={() => router.push("/me")}
        //         >
        //             Perfil
        //         </Menu.Item>
        //         <Menu.Item
        //             leftSection={<Settings size={14} />}
        //             onClick={() => router.push("/settings")}
        //         >
        //             Settings
        //         </Menu.Item>
        //         <Menu.Item
        //             leftSection={<LogOut size={14} />}
        //             onClick={handleLogout}
        //         >
        //             Logout
        //         </Menu.Item>
        //     </Menu.Dropdown>
        // </Menu>
        <Avatar
                    size={40}
                    src={url}
                    variant="default"
                    radius="12px"
                />
    );
}
