import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [new URL("https://ehgrxskoduebhqzayeii.supabase.co/**")],
    },
};

export default nextConfig;
