export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="max-w-2xl mx-auto w-full flex flex-col gap-12 min-h-screen items-start">
            {children}
        </div>
    );
}
