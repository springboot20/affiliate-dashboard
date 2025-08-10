import { useAppDispatch, useAppSelector } from "@/app/hook";
import { MessagingApiSlice } from "@/features/messaging/message.slice";
import {
  setNotification,
  updateNotificationStatus,
} from "@/features/messaging/notification.reducer";
import { Token } from "@/types/auth/auth";
import { SocketEvents } from "@/types/enums/socket-events";
import React, { createContext, useCallback, useContext, useEffect, useState, useRef } from "react";
import SocketIo from "socket.io-client";

interface ISocketInstance {
  socket: ReturnType<typeof SocketIo> | null;
  connected: boolean;
  onConnected: () => void;
  onDisconnected: () => void;
}

const SocketContext = createContext<ISocketInstance>({
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

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<ReturnType<typeof SocketIo> | null>(null);
  const { tokens } = useAppSelector((state) => state.auth.data);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [connected, setConnected] = useState<boolean>(false);
  const [reconnecting, setReconnecting] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const userRole = useAppSelector((state) => state.auth.data.user?.role);
  const socketRef = useRef<ReturnType<typeof SocketIo> | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  console.log(reconnecting, "reconnecting");

  const onConnected = useCallback(() => {
    setConnected(true);
    setReconnecting(false);

    // Clear any pending reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const onDisconnected = useCallback((error: string) => {
    console.error("Socket error:", error);
    setReconnecting(true);
    setConnected(false);
  }, []);

  const onSocketError = useCallback((error: any) => {
    console.error("Socket error:", error);
    setConnected(false);

    // Handle specific authentication errors
    if (
      error.message?.includes("Authentication failed") ||
      error.message?.includes("Unauthorized")
    ) {
      console.warn("🚫 Authentication failed, cleaning up socket");
      if (socketRef.current) {
        socketRef.current?.disconnect();
        setSocket(null);
        socketRef.current = null;
      }
    }
  }, []);

  const handleOnStatusUpdate = useCallback(
    (data: any) => {
      dispatch(
        updateNotificationStatus({
          notificationId: data._id || data.requestId,
          status: data.status,
          adminNotes: data.adminNotes,
        })
      );

      // Invalidate relevant queries
      dispatch(MessagingApiSlice.util.invalidateTags(["MessageNotification"]));
    },
    [dispatch]
  );

  const handleOnNewAdminRequest = useCallback(
    (data: any) => {
      console.log(data);
      dispatch(
        setNotification({
          _id: data._id || data.data?._id,
          data: data.data || data,
          type: data?.type || "NEW_REQUEST",
          isRead: data?.isRead ? true : false,
          createdAt: data.createdAt || new Date().toISOString(),
        })
      );

      dispatch(MessagingApiSlice.util.invalidateTags(["MessageNotification", "UnreadCount"]));
    },
    [dispatch]
  );

  const handleOnNewAdminMessaegBroadCast = useCallback(
    (data: any) => {
      console.log(data);
      dispatch(
        setNotification({
          _id: data._id || data.data?._id,
          data: data.data || data,
          type: data?.type || "NEW_REQUEST",
          isRead: data?.isRead ? true : false,
          createdAt: data.createdAt || new Date().toISOString(),
        })
      );

      dispatch(MessagingApiSlice.util.invalidateTags(["MessageNotification", "UnreadCount"]));
    },
    [dispatch]
  );

  const handleTransactionNotification = useCallback(
    (data: any) => {
      console.log(data);
      dispatch(
        setNotification({
          _id: data._id || data.data?._id,
          data: data.data || data,
          type: data?.type || "NEW_REQUEST",
          isRead: data?.isRead,
          createdAt: data.createdAt,
        })
      );
    },
    [dispatch]
  );

  useEffect(() => {
    if (!socket) return;

    socketRef.current = socket;

    socket?.on(SocketEvents.CONNECTED_EVENT, onConnected);
    socket?.on(SocketEvents.DISCONNECTED_EVENT, onDisconnected);
    socket?.on(SocketEvents.SOCKET_ERROR_EVENT, onSocketError);

    // Request Message Event
    socket.on(SocketEvents.NEW_ADMIN_REQUEST, (data) => {
      console.log("line 151: ", data);
    });
    socket?.on(SocketEvents.REQUEST_STATUS_UPADATE, handleOnStatusUpdate);

    // Transaction Events
    socket?.on(SocketEvents.TRANSFER_TRANSACTION, handleTransactionNotification);
    socket?.on(SocketEvents.DEBIT_TRANSACTION, handleTransactionNotification);
    socket?.on(SocketEvents.DEPOSIT_TRANSACTION, handleTransactionNotification);

    socket.on("connect", () => {
      if (["ADMIN", "MODERATOR"].includes(userRole)) {
        socket.emit(SocketEvents.JOIN_ADMIN_ROOM);
      } else if (userRole === "USER") {
        socket.emit(SocketEvents.JOIN_USER_ROOM);
      }
    });

    socket?.on(SocketEvents.ADMIN_MESSAGE_BROADCAST, handleOnNewAdminMessaegBroadCast);

    return () => {
      socket?.off("connect");
      socket?.off(SocketEvents.CONNECTED_EVENT, onConnected);
      socket?.off(SocketEvents.DISCONNECTED_EVENT, onDisconnected);
      socket?.off(SocketEvents.SOCKET_ERROR_EVENT, onSocketError);

      // Request Message Event
      socket?.off(SocketEvents.NEW_ADMIN_REQUEST, handleOnNewAdminRequest);
      socket?.off(SocketEvents.REQUEST_STATUS_UPADATE, handleOnStatusUpdate);
      socket?.off(SocketEvents.ADMIN_MESSAGE_BROADCAST, handleOnNewAdminMessaegBroadCast);

      // Transaction Events
      socket?.off(SocketEvents.TRANSFER_TRANSACTION, handleTransactionNotification);
      socket?.off(SocketEvents.DEBIT_TRANSACTION, handleTransactionNotification);
      socket?.off(SocketEvents.DEPOSIT_TRANSACTION, handleTransactionNotification);
    };
  }, [
    socket,
    onConnected,
    onDisconnected,
    onSocketError,
    handleOnNewAdminRequest,
    handleOnNewAdminMessaegBroadCast,
    handleOnStatusUpdate,
    userRole,
    handleTransactionNotification,
  ]);

  useEffect(() => {
    // Clean up existing socket
    if (socketRef.current) {
      console.log("🧹 Cleaning up existing socket");
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
      setReconnecting(false);
    }

    // Only create socket if authenticated with valid tokens
    if (isAuthenticated && tokens?.accessToken) {
      console.log("🚀 Initializing new socket connection");
      const newSocket = getSocket(tokens);

      if (newSocket) {
        setSocket(newSocket);

        // Connect after a small delay to ensure proper setup
        setTimeout(() => {
          if (newSocket && !newSocket.connected) {
            newSocket.connect();
          }
        }, 100);
      }
    } else {
      console.log("❌ No valid authentication, skipping socket initialization");
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [tokens?.accessToken, isAuthenticated, tokens]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        onConnected: () => socket?.connect(),
        onDisconnected: () => socket?.disconnect(),
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);
