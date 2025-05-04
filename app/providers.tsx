import { MantineProvider } from "@mantine/core";
import { ThemeProvider } from "next-themes";

export default function Providers({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <MantineProvider >{children}</MantineProvider>
        </ThemeProvider>
    );
}
// This file is used to wrap the application with providers like MantineProvider and ThemeProvider.
