import { useAppSelector } from "@/app/hook";
import { Token } from "@/types/auth/auth";
import { SocketEvents } from "@/types/enums/socket-events";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import SocketIo from "socket.io-client";

interface ISocketInstance {
  socket: ReturnType<typeof SocketIo> | null;
  connected: boolean;
  onConnected: () => void;
  onDisconnected: () => void;
}

const SocketConext = createContext<ISocketInstance>({
  socket: null,
  connected: false,
  onConnected: () => {},
  onDisconnected: () => {},
});

const getSocket = (tokens: Token | null) => {
  const env = import.meta.env;
  const url =
    env.MODE === "production" ? env.VITE_API_SOCKET_URL_PROD : env.VITE_API_SOCKET_URL_DEV;

  return SocketIo(url, {
    auth: { tokens },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    autoConnect: true,
  });
};

export const SocketProvide: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<ReturnType<typeof SocketIo> | null>(null);
  const { tokens } = useAppSelector((state) => state.auth.data);
  const [connected, setConnected] = useState<boolean>(false);

  const onConnected = useCallback(() => {
    setConnected(true);
    // setReconnecting(false);
  }, []);

  const onDisconnected = useCallback(() => {
    // setReconnecting(false);
    setConnected(false);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket?.on(SocketEvents.CONNECTED_EVENT, onConnected);
    socket?.on(SocketEvents.DISCONNECTED_EVENT, onDisconnected);

    return () => {
      socket?.off(SocketEvents.CONNECTED_EVENT, onConnected);
      socket?.off(SocketEvents.DISCONNECTED_EVENT, onDisconnected);
    };
  }, [socket, socket, onConnected, onDisconnected]);

  useEffect(() => {
    let currentSocket: ReturnType<typeof SocketIo> | null = null;

    if (tokens) {
      currentSocket = getSocket(tokens);
      setSocket(currentSocket);
    } else {
      // Disconnect and clean up if no tokens
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
    }

    return () => {
      if (currentSocket) {
        currentSocket.disconnect();
      }
    };
  }, [tokens]);

  return (
    <SocketConext.Provider
      value={{
        socket,
        connected,
        onConnected: () => socket?.connect(),
        onDisconnected: () => socket?.disconnect(),
      }}
    >
      {children}
    </SocketConext.Provider>
  );
};

export const useSocket = () => useContext(SocketConext);
