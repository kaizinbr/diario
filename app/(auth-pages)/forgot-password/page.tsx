import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/core/form-message";
import { SubmitButton } from "@/components/core/submit-button";
import { Input } from "@/components/core/input";
import { Label } from "@/components/core/label";
import Link from "next/link";

export const metadata = {
    title: "Esqueci a senha | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};

export default async function ForgotPassword(props: {
    searchParams: Promise<Message>;
}) {
    const searchParams = await props.searchParams;
    return (
        <div className="w-full min-h-screen p-5 flex justify-center items-center">
            <form className="flex-1 flex flex-col min-w-64 rounded-2xl py-8 px-5 bg-bunker-800">
                <div>
                    <h1 className="text-2xl font-bold">Redefinir senha</h1>
                    <p className="text-sm text-neutral-700">
                        Lembra da senha?{" "}
                        <Link
                            className="text-neutral-700 font-medium underline"
                            href="/login"
                        >
                            Entre por aqui
                        </Link>
                    </p>
                </div>
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        name="email"
                        placeholder="you@example.com"
                        required
                    />
                    <SubmitButton className="rounded-xl text-center py-3 border border-neutral-900 cursor-pointer !font-semibold bg-neutral-900 text-neutral-500 hover:bg-main-600 hover:border-main-600 transition-all duration-200" formAction={forgotPasswordAction}>
                        Redefinir senha
                    </SubmitButton>
                    <FormMessage message={searchParams} />
                </div>
            </form>
        </div>
    );
}
