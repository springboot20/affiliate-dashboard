import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { LocalStorage, removeCircularReferences } from "@/utils";

export interface Notification {
  _id: string;
  data: any;
  type: "NEW_REQUEST" | "STATUS_UPDATE" | "ADMIN_RESPONSE";
  isRead: boolean;
  createdAt: string;
}

interface InitialState {
  notifications: Notification[];
  unread_notifications: Notification[];
  isNewNotification: { [key: string]: boolean };
  totalUnreadCount: number;
  lastFetchTime: number | null;
}

const getInitialState = (): InitialState => ({
  notifications: (LocalStorage.get("read_notifications") as Notification[]) ?? [],
  unread_notifications: (LocalStorage.get("new_notifications") as Notification[]) ?? [],
  isNewNotification: {},
  totalUnreadCount: 0,
  lastFetchTime: null,
});

const initialState: InitialState = getInitialState();

export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<Notification>) => {
      const { payload } = action;

      const notificationId = payload?.data?._id;
      console.log(payload?.data?._id);

      if (notificationId) {
        const exists = state.unread_notifications.some((un) => {
          return un?.data?._id === notificationId;
        });

        console.log(exists);

        if (!exists) {
          const newNotification = {
            ...payload,
            isRead: false,
            createdAt: payload.createdAt || new Date().toISOString(),
          };

          state.unread_notifications.unshift(newNotification); // Add to beginning
          state.isNewNotification[notificationId] = true;
          state.totalUnreadCount += 1;

          // Keep only latest 50 unread notifications to prevent memory issues
          if (state.unread_notifications.length > 50) {
            state.unread_notifications = state.unread_notifications.slice(0, 50);
          }

          LocalStorage.set(
            "new_notifications",
            removeCircularReferences(state.unread_notifications)
          );
        }
      }

      console.log(payload);
    },

    // // Set multiple notifications (from API fetch)
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      const notifications = action.payload;

      console.log(notifications);

      notifications.forEach((notification) => {
        const notificationId = notification?.data?._id || notification?._id;

        if (notificationId) {
          if (notification.isRead) {
            const existsInRead = state.notifications.some(
              (n) => (n?.data?._id || n?._id) === notificationId
            );

            if (!existsInRead) {
              state.notifications.push(notification);
            }
          } else {
            const existsInUnread = state.unread_notifications.some(
              (n) => (n?.data?._id || n?._id) === notificationId
            );

            if (!existsInUnread) {
              state.unread_notifications.push(notification);
              state.isNewNotification[notificationId] = true;
            }
          }
        }
      });

      // Update counts
      state.totalUnreadCount = state.unread_notifications.length;
      state.lastFetchTime = Date.now();

      // Update local storage
      LocalStorage.set("read_notifications", removeCircularReferences(state.notifications));
      LocalStorage.set("new_notifications", removeCircularReferences(state.unread_notifications));
    },

    // Mark a specific notification as read
    setReadNotification: (state, action: PayloadAction<{ notificationId: string }>) => {
      const { notificationId } = action.payload;

      const readNotificationIndex = state.unread_notifications.findIndex((n) => {
        return (n.data?._id || n._id) === notificationId;
      });

      if (readNotificationIndex !== -1) {
        const notification = state.unread_notifications[readNotificationIndex];
        const updatedNotification = { ...notification, isRead: true };

        // Add to read notifications if not already there
        const existsInRead = state.notifications.some(
          (n) => (n?.data?._id || n?._id) === notificationId
        );

        if (!existsInRead) {
          state.notifications.push(updatedNotification);
        }

        // Remove from unread
        state.unread_notifications.splice(readNotificationIndex, 1);
        state.isNewNotification[notificationId] = false;
        state.totalUnreadCount = Math.max(0, state.totalUnreadCount - 1);

        // Update local storage
        LocalStorage.set("read_notifications", removeCircularReferences(state.notifications));
        LocalStorage.set("new_notifications", removeCircularReferences(state.unread_notifications));
      }
    },

    // Delete a notification
    deleteNotification: (state, action: PayloadAction<{ notificationId: string }>) => {
      const { notificationId } = action.payload;

      // Remove from both arrays
      const wasInUnread = state.unread_notifications.some(
        (n) => (n?.data?._id || n?._id) === notificationId
      );

      state.notifications = state.notifications.filter(
        (n) => (n?.data?._id || n?._id) !== notificationId
      );

      state.unread_notifications = state.unread_notifications.filter(
        (n) => (n?.data?._id || n?._id) !== notificationId
      );

      if (wasInUnread) {
        state.totalUnreadCount = Math.max(0, state.totalUnreadCount - 1);
      }

      delete state.isNewNotification[notificationId];

      // Update local storage
      LocalStorage.set("read_notifications", removeCircularReferences(state.notifications));
      LocalStorage.set("new_notifications", removeCircularReferences(state.unread_notifications));
    },

    // Update notification status (for status changes)
    updateNotificationStatus: (
      state,
      action: PayloadAction<{
        notificationId: string;
        status: "PENDING" | "APPROVED" | "REJECTED";
        adminNotes?: string;
      }>
    ) => {
      const { notificationId, status, adminNotes } = action.payload;

      // Update in both arrays
      [state.notifications, state.unread_notifications].forEach((array) => {
        const notification = array.find((n) => (n?.data?._id || n?._id) === notificationId);

        if (notification && notification.data) {
          notification.data.status = status;
          if (adminNotes) {
            notification.data.adminNotes = adminNotes;
          }
          notification.data.updatedAt = new Date().toISOString();
        }
      });

      // Update local storage
      LocalStorage.set("read_notifications", removeCircularReferences(state.notifications));
      LocalStorage.set("new_notifications", removeCircularReferences(state.unread_notifications));
    },

    // Set unread count from API
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.totalUnreadCount = action.payload;
    },

    markAllAsRead: (state) => {
      // Move all unread notifications to read notifications array
      for (const notification of state.unread_notifications) {
        const notificationId = notification?.data?._id;

        if (notificationId) {
          const existsInRead = state.notifications.some((n) => n?.data?._id === notificationId);

          if (!existsInRead) {
            state.notifications.push(removeCircularReferences({ ...notification, isRead: true }));
          }

          // Set notification as not new
          state.isNewNotification[notificationId] = false;
        }
      }

      // Clear unread notifications
      state.unread_notifications = [];

      // Update local storage
      LocalStorage.set("read_notifications", removeCircularReferences(state.notifications));
      LocalStorage.set("new_notifications", []);
    },

    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unread_notifications = [];
      state.isNewNotification = {};

      LocalStorage.set("read_notifications", []);
      LocalStorage.set("new_notifications", []);
    },
  },
});

export const notificationReducer = notificationSlice.reducer;
export const {
  setNotification,
  setReadNotification,
  setNotifications,
  deleteNotification,
  updateNotificationStatus,
  setUnreadCount,
  markAllAsRead
} = notificationSlice.actions;
