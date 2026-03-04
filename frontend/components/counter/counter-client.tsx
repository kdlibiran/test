"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useSocket } from "@/app/socket-provider";
import { CounterSkeleton } from "@/components/counter/counter-skeleton";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

type LoadingAction = "get" | "inc" | "dec" | null;

export function CounterClient() {
  const { data: session, status } = useSession();
  const { socket, connected } = useSocket();
  const [counter, setCounter] = useState<number | null>(null);
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);

  const accessToken = (session as any)?.accessToken as string | undefined;
  const isAuthenticated = status === "authenticated" && !!accessToken;

  useEffect(() => {
    if (!isAuthenticated || !socket) {
      return;
    }

    const handler = (payload: { value: number }) => {
      setCounter(payload.value);
    };

    socket.on("counter:total", handler);

    return () => {
      socket.off("counter:total", handler);
    };
  }, [isAuthenticated, socket]);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      return;
    }

    const getInitial = async () => {
      try {
        setLoadingAction("get");
        const res = await fetch(`${BASE_URL}/counter`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (res.ok) {
          const data = (await res.json()) as { value: number };
          setCounter(data.value);
        }
      } finally {
        setLoadingAction(null);
      }
    };

    void getInitial();
  }, [isAuthenticated, accessToken]);

  if (status === "loading") {
    return <CounterSkeleton />;
  }

  const increment = async () => {
    if (!accessToken) return;
    try {
      setLoadingAction("inc");
      await fetch(`${BASE_URL}/counter/increment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const decrement = async () => {
    if (!accessToken) return;
    try {
      setLoadingAction("dec");
      await fetch(`${BASE_URL}/counter/decrement`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } finally {
      setLoadingAction(null);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loadingAction === "get" && counter === null) {
    return <CounterSkeleton />;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <span
          className={`text-xs font-medium ${
            connected
              ? "text-emerald-700 dark:text-emerald-300"
              : "text-red-700 dark:text-red-300"
          }`}
        >
          {connected ? "WebSocket connected" : "WebSocket disconnected"}
        </span>
        <div className="mt-2 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 text-3xl font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
          {counter ?? "–"}
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={decrement}
            disabled={loadingAction === "dec"}
            className="h-9 rounded-md bg-zinc-900 px-4 text-xs font-medium text-zinc-50 hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Decrement
          </button>
          <button
            type="button"
            onClick={increment}
            disabled={loadingAction === "inc"}
            className="h-9 rounded-md bg-zinc-900 px-4 text-xs font-medium text-zinc-50 hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Increment
          </button>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="h-8 text-xs text-zinc-600 underline underline-offset-2 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
