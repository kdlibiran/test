"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      setError("Sign up failed. Please try again with another email.");
      return;
    }

    const loginResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (loginResult?.error || !loginResult?.ok) {
      router.push("/login?registered=1");
      return;
    }

    router.push("/");
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-xs text-zinc-700 dark:text-zinc-300">
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="h-9 rounded-md border border-zinc-300 px-2 text-sm text-zinc-900 outline-none ring-0 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-zinc-700 dark:text-zinc-300">
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-9 rounded-md border border-zinc-300 px-2 text-sm text-zinc-900 outline-none ring-0 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-zinc-700 dark:text-zinc-300">
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-9 rounded-md border border-zinc-300 px-2 text-sm text-zinc-900 outline-none ring-0 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </label>

      {error && (
        <p className="text-xs text-red-500" aria-live="polite">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="mt-1 h-9 rounded-md bg-zinc-900 text-xs font-medium text-zinc-50 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Create account
      </button>
    </form>
  );
}

