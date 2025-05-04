import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/core/form-message";
import { SubmitButton } from "@/components/core/submit-button";
import { Input } from "@/components/core/input";
import { Label } from "@/components/core/label";
import Link from "next/link";

export const metadata = {
    title: "Entrar | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};

export default async function Login(props: { searchParams: Promise<Message> }) {
    const searchParams = await props.searchParams;
    return (
        <div className="w-full min-h-screen p-5 flex justify-center items-center">
            <form className="flex-1 flex flex-col min-w-64 rounded-2xl py-8 px-5 bg-bunker-800">
                <h1 className="text-2xl font-bold">Entre com sua conta</h1>
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" placeholder="wjsn@vacas.com" required />
                    <div className="flex justify-between items-center">
                        <Label htmlFor="password">Senha</Label>
                        <Link
                            className="text-xs text-neutral-300 underline"
                            href="/forgot-password"
                        >
                            Esqueci a senha
                        </Link>
                    </div>
                    <Input
                        type="password"
                        name="password"
                        placeholder="Sua senha"
                        required
                    />
                    <SubmitButton
                        className="rounded-xl text-center !font-medium bg-main-500 border-2 border-main-500 hover:bg-main-600 hover:border-main-600 transition-all duration-200"
                        pendingText="Entrando..."
                        formAction={signInAction}
                    >
                        Entrar
                    </SubmitButton>
                    <FormMessage message={searchParams} />
                </div>
                {/* <button
                    type="button"
                    onClick={signInWithGoogle}
                    className={`
                                        w-full mt-3
                                        border border-bunker-600 rounded-xl
                                        p-2 text-center transition-all duration-200
                                        hover:border-main-600 cursor-pointer
                                        flex items-center justify-center
                                    `}
                >
                    <BsGoogle className="size-5 mr-3" />
                    Entrar com Google
                </button> */}
                <div className="text-base text-neutral-300 flex items-center flex-col w-full gap-2 mt-6 font-medium">
                    <p className="">Não tem uma conta?</p>
                    <Link
                        href="/sign-up"
                        className="w-full border border-bunker-600 rounded-xl p-2 text-center transition-all duration-200 hover:border-main-600"
                    >
                        Crie uma conta
                    </Link>
                </div>
            </form>
        </div>
    );
}
