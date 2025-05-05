"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import supabaseAdmin from "@/utils/supabase/admin";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { fakerPT_BR } from "@faker-js/faker";

export async function checkUserProvider(email: string) {
    if (!email) return { error: "Email é obrigatório" };

    // Listar usuários no Supabase
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) return { error: "Erro ao buscar usuários" };

    // Encontrar o usuário pelo email
    const user = data.users.find((user) => user.email === email);
    if (!user) return { error: "Usuário não encontrado" };

    // Verificar se o usuário foi criado via Google
    const isGoogleUser = user.app_metadata?.provider === "google";

    return { isGoogleUser };
}

export async function signUpWithGoogle() {
    const origin = (await headers()).get("origin");
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/auth/callback/google`,
        },
    });

    if (error) {
        if (error.code === "invalid_credentials") {
            return encodedRedirect(
                "error",
                "/sign-in",
                "Credenciais inválidas, verifique as informações e tente novamente"
            );
        } else {
            console.error(error.code + " " + error.message);
            return encodedRedirect("error", "/sign-in", error.message);
        }
    }

    if (data.url) {
        redirect(data.url); // use the redirect API for your server framework
    }
}

export async function signInWithGoogle() {
    const origin = (await headers()).get("origin");
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/auth/callback/google`,
        },
    });

    if (error) {
        if (error.code === "invalid_credentials") {
            return encodedRedirect(
                "error",
                "/sign-in",
                "Credenciais inválidas, verifique as informações e tente novamente"
            );
        } else {
            console.error(error.code + " " + error.message);
            return encodedRedirect("error", "/sign-in", error.message);
        }
    }

    if (data.url) {
        redirect(data.url); // use the redirect API for your server framework
    }
}

export const signUpAction = async (formData: FormData) => {
    const nome = formData.get("nome")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const supabase = await createClient();
    const origin = (await headers()).get("origin");
    // console.log(origin);

    if (!email || !password) {
        return encodedRedirect(
            "error",
            "/sign-up",
            "Preencha os campos de email e senha"
        );
    }

    // const emailExists = await supabase.auth.user

    const {
        data: { user },
        error,
    } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}`,
            data: {
                name: nome,
            },
        },
    });

    if (error) {
        if (error.code === "user_already_exists") {
            return encodedRedirect(
                "error",
                "/sign-up",
                "Esse e-mail já está registrado, tente redefinir sua senha"
            );
        } else {
            console.error(error.code + " " + error.message);
            return encodedRedirect("error", "/sign-up", error.message);
        }
    }

    console.log("user", user);

    // define dados temporarios de perfil para evitar erros pela expiração do link de confirmação
    // fakerPT_BR.internet.username({ firstName: 'kaio', lastName: 'nunes'})
    const animal = fakerPT_BR.animal.type();
    const tempUsername = fakerPT_BR.internet.username({
        firstName: nome?.substring(0, 10),
        lastName: animal,
    });

    // const tempName = generateUsername("", 0, 15);
    // console.log("username temporario:", tempUsername);
    const lowercased_username = tempUsername.toLowerCase();

    const { data, error: setProfileError } = await supabase
        .from("profiles")
        .insert({
            id: user!.id,
            username: tempUsername,
            lowercased_username,
            name: nome,
            public: false,
        });

    if (setProfileError) {
        console.error(setProfileError.code + " " + setProfileError.message);
    } else {
        return encodedRedirect(
            "success",
            "/sign-up",
            "Deu certo, obrigado! Verifique seu email para confirmar sua conta"
        );
    }
};

export const signInAction = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        if (error.code === "invalid_credentials") {
            console.error(error.code + " " + error.message);
            return encodedRedirect(
                "error",
                "/login",
                "Credenciais inválidas, verifique as informações e tente novamente"
            );
        } else {
            console.error(error.code + " " + error.message);
            return encodedRedirect("error", "/login", error.message);
        }
    }

    return redirect("/");
};

export const forgotPasswordAction = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const supabase = await createClient();
    const origin = (await headers()).get("origin");
    const callbackUrl = formData.get("callbackUrl")?.toString();

    if (!email) {
        return encodedRedirect(
            "error",
            "/forgot-password",
            "Preencha o campo Email"
        );
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}`,
    });

    if (error) {
        console.error(error.code + " " + error.message);
        return encodedRedirect(
            "error",
            "/forgot-password",
            "Erro ao enviar email de redefinição de senha"
        );
    }

    if (callbackUrl) {
        return redirect(callbackUrl);
    }

    return encodedRedirect(
        "success",
        "/forgot-password",
        "Verifique seu email para redefinir sua senha"
    );
};

export const resetPasswordAction = async (formData: FormData) => {
    const supabase = await createClient();

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password || !confirmPassword) {
        encodedRedirect(
            "error",
            "/protected/reset-password",
            "Preencha os campos de senha"
        );
    }

    if (password !== confirmPassword) {
        encodedRedirect(
            "error",
            "/protected/reset-password",
            "As senhas não coincidem"
        );
    }

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        // console.error(error);
        if (error.code == "422") {
            encodedRedirect(
                "error",
                "/protected/reset-password",
                "Sua nova senha deve ser diferente da anterior"
            );
        } else {
            encodedRedirect(
                "error",
                "/protected/reset-password",
                "Falha ao redefinir senha, tente utilizar uma senha diferente da anterior"
            );
        }
    }

    encodedRedirect(
        "success",
        "/protected/reset-password",
        "Senha redefinida com sucesso"
    );
};

export const signOutAction = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/sign-in");
};
