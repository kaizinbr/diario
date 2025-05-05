import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/core/form-message";
import { SubmitButton } from "@/components/core/submit-button";
import { Input } from "@/components/core/input";
import { Label } from "@/components/core/label";
// import { BsGoogle } from "react-icons/bs";
import Link from "next/link";

export const metadata = {
    title: "Criar conta | Pitchforkd",
    description: "Avalie álbuns de música e veja o que a comunidade acha deles",
};

export default async function Signup(props: {
    searchParams: Promise<Message>;
}) {
    const searchParams = await props.searchParams;
    if ("message" in searchParams) {
        return (
            <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
                <FormMessage message={searchParams} />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-5 flex justify-center items-center">
            <form className="flex-1 flex flex-col min-w-64 rounded-2xl py-8 px-5 bg-bunker-800">
                <h1 className="text-2xl font-bold">Cadastre-se</h1>
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                        name="nome"
                        placeholder="Karl Marx da Silva"
                        required
                    />
                    <Label htmlFor="email">Email</Label>
                    <Input
                        name="email"
                        placeholder="fimaocapitalismo@exemplo.com"
                        required
                    />
                    <Label htmlFor="password">Senha</Label>
                    <Input
                        type="password"
                        name="password"
                        placeholder="Sua senha"
                        minLength={6}
                        required
                    />
                    <SubmitButton
                        className="rounded-xl text-center py-3 border border-neutral-900 cursor-pointer !font-semibold bg-neutral-900 text-neutral-50 hover:bg-main-600 hover:border-main-600 transition-all duration-200"
                        formAction={signUpAction}
                        pendingText="Cadastrando..."
                    >
                        Cadastrar
                    </SubmitButton>
                    <FormMessage message={searchParams} />
                </div>
                <div className="text-base text-neutral-900 flex items-center flex-col w-full gap-2 mt-6 font-medium">
                    <p className="">Já tem uma conta?</p>
                    <Link
                        href="/login"
                        className="w-full border border-neutral-900 font-semibold rounded-xl p-2 text-center transition-all duration-200 hover:border-main-600"
                    >
                        Entre por aqui
                    </Link>
                </div>
            </form>
        </div>
    );
}
