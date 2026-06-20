"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  const adminPassword = process.env.ADMIN_PASSWORD || "woodcraft_admin";

  if (!session || session.value !== adminPassword) {
    redirect("/admin/login");
  }
}

const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

type RateLimitData = {
  attempts: number;
  lockUntil: number | null;
};

const globalForRateLimit = globalThis as unknown as {
  loginAttempts: Map<string, RateLimitData>;
};

const loginAttempts = globalForRateLimit.loginAttempts || new Map<string, RateLimitData>();
if (process.env.NODE_ENV !== "production") globalForRateLimit.loginAttempts = loginAttempts;

export async function loginAction(password: string) {
  const ip = "admin-login"; // Global rate limit for the single admin portal

  const record = loginAttempts.get(ip) || { attempts: 0, lockUntil: null };

  if (record.lockUntil && Date.now() < record.lockUntil) {
    const remainingTime = Math.ceil((record.lockUntil - Date.now()) / 1000 / 60);
    return { success: false, error: `Terlalu banyak percobaan. Coba lagi dalam ${remainingTime} menit.` };
  }

  const adminPassword = process.env.ADMIN_PASSWORD || "woodcraft_admin";

  if (password === adminPassword) {
    loginAttempts.delete(ip);
    const cookieStore = await cookies();
    const headersList = await headers();
    const host = headersList.get("host") || "";
    const proto = headersList.get("x-forwarded-proto") || "";
    const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1") || host.startsWith("192.168.");

    // Robust secure flag detection: only set secure if in prod, not local, and protocol is not explicitly http
    const isSecure = process.env.NODE_ENV === "production" && !isLocalhost && proto !== "http";

    cookieStore.set("admin_session", password, {
      httpOnly: true,
      secure: isSecure,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return { success: true };
  }
  
  record.attempts += 1;
  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockUntil = Date.now() + LOCKOUT_TIME;
  }
  loginAttempts.set(ip, record);
  
  const remaining = MAX_ATTEMPTS - record.attempts;
  return { 
    success: false, 
    error: remaining > 0 
      ? `Password salah. Sisa ${remaining} percobaan.` 
      : "Terlalu banyak percobaan. Akun terkunci sementara." 
  };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}
