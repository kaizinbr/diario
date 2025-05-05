import Link from "next/link";

export default function Out() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-neutral-100">
            <h1 className="text-4xl font-bold mb-4">Opa</h1>
            <p className="text-lg">Parece que você não entrou ainda</p>
            <p className="text-lg">
                Faça{" "}
                <Link className="underline !font-semibold" href={"/login"}>
                    Login
                </Link>{" "}
                ou{" "}
                <Link className="underline !font-semibold" href={"/sign-up"}>
                    Cadastre-se
                </Link>
            </p>
        </div>
    );
}
