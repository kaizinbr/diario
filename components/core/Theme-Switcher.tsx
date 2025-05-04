"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@mantine/core";
import { Moon, Sun } from "lucide-react";



export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Switch
            checked={theme === "dark"}
            onChange={(event) => setTheme(event.currentTarget.checked ? "dark" : "light")}
            size="lg"
            onLabel={<Sun size={16} />}
            offLabel={<Moon size={16} />}
        />
    );
}