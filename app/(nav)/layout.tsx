import Navigator from '@/components/core/nav';
import React from 'react';
import { createClient } from "@/utils/supabase/server";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <>
            <main className='max-w-2xl mx-auto w-full'>{children}</main>
            <Navigator user={user} />
        </>
    );
}