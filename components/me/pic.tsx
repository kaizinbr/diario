import Avatar from "@/components/core/Avatar";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function Pic({ src }: { src: string | null }) {
    

    return <Avatar src={src} size={100} />;
}