import React from 'react';

export default async function Layout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <main>{children}</main>
        </>
    );
}