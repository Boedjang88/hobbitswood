"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/auth";

export default function AdminLogin() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const password = formData.get("password") as string;
      const result = await loginAction(password);
      if (result.success) {
        window.location.href = "/admin";
        return prevState;
      }
      return result;
    },
    null
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] dark:bg-zinc-950 font-sans text-brand-dark dark:text-zinc-100 transition-colors duration-300">
      <div className="w-full max-w-sm rounded-xl border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm transition-colors duration-300">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-8 w-8 rounded bg-[#111] dark:bg-zinc-100" />
          <h1 className="text-xl font-semibold tracking-tight text-brand-dark dark:text-zinc-100 font-serif">Admin Portal</h1>
          <p className="mt-2 text-sm text-brand-dark/70 dark:text-zinc-400">
            Enter your password to access the dashboard.
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#444] dark:text-zinc-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full rounded-md border border-[#EAEAEA] dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm outline-none transition-colors text-brand-dark dark:text-zinc-100 focus:border-[#111] dark:focus:border-zinc-700 focus:ring-1 focus:ring-[#111] dark:focus:ring-zinc-700"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div className="rounded-md bg-red-50 dark:bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-[#111] dark:bg-zinc-100 px-4 py-2.5 text-sm font-medium text-white dark:text-zinc-900 transition-all hover:bg-[#333] dark:hover:bg-white disabled:opacity-50"
          >
            {isPending ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
