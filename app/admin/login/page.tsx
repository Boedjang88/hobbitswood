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
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] font-sans text-brand-dark">
      <div className="w-full max-w-sm rounded-xl border border-[#EAEAEA] bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-8 w-8 rounded bg-[#111]" />
          <h1 className="text-xl font-semibold tracking-tight">Admin Portal</h1>
          <p className="mt-2 text-sm text-brand-dark dark:text-brand-light">
            Enter your password to access the dashboard.
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#444]"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full rounded-md border border-[#EAEAEA] px-3 py-2 text-sm outline-none transition-colors focus:border-[#111] focus:ring-1 focus:ring-[#111]"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-[#111] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#333] disabled:opacity-50"
          >
            {isPending ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
