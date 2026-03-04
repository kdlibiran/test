"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { createAuthedSocket } from "../lib/socket";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

type SocketContextValue = {
  socket: Socket | null;
  connected: boolean;
};

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  connected: false,
});

function getUserIdFromAccessToken(
  accessToken: string | undefined,
): string | number | undefined {
  if (!accessToken) return undefined;
  try {
    const [, payloadBase64] = accessToken.split(".");
    if (!payloadBase64) return undefined;
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson) as { sub?: string | number };
    return payload.sub;
  } catch {
    return undefined;
  }
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  const accessToken = (session as any)?.accessToken as string | undefined;
  const userId = getUserIdFromAccessToken(accessToken);
  const isAuthenticated = status === "authenticated" && !!accessToken && !!userId;

  useEffect(() => {
    if (!isAuthenticated || !accessToken || !userId) {
      return;
    }

    const s = createAuthedSocket(BASE_URL, {
      token: accessToken,
      userId,
    });

    setSocket(s);

    s.on("connect", () => {
      setConnected(true);
    });

    s.on("disconnect", () => {
      setConnected(false);
    });

    return () => {
      s.off("connect");
      s.off("disconnect");
      s.disconnect();
    };
  }, [isAuthenticated, accessToken, userId]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}

