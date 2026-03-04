import { io, Socket } from "socket.io-client";

type SocketAuth = {
  token: string;
  userId: string | number;
};

export function createAuthedSocket(
  baseUrl: string,
  auth: SocketAuth,
): Socket {
  return io(baseUrl, {
    transports: ["websocket"],
    auth,
  });
}

