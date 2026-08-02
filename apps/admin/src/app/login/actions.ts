"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  
  const masterUser = process.env.ADMIN_USER || "admin";
  const masterPassword = process.env.ADMIN_PASSWORD || "atpdev2026";
  
  if (username === masterUser && password === masterPassword) {
    cookies().set("admin_session", "authenticated", { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7 // 1 semana
    });
    redirect("/");
  } else {
    return { error: "Credenciales incorrectas" };
  }
}

export async function logoutAction() {
  cookies().delete("admin_session");
  redirect("/login");
}
