import { useGetUserMessageNotificatonsQuery } from "@/features/messaging/message.slice";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import React, { useCallback, useEffect, useMemo, useState, type JSX } from "react";
import {
  deleteNotification,
  // markAllAsRead,
  Notification,
  setNotifications,
  setReadNotification,
} from "@/features/messaging/notification.reducer";
import {
  BellIcon,
  CheckIcon,
  ClockIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { classNames, formatTime } from "@/utils";
import { PaginationComponent } from "@/components/paginations/PaginationComponent";

type InitialFilterState = Record<string, any>;

export default function Notifications(): JSX.Element {
  const TRANSACTION_LIMIT = 10;
  const { unread_notifications, notifications } = useAppSelector((state) => state.notifications);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);

  const [initialFilterState, setInitialFilterState] = useState<InitialFilterState>({
    limit: TRANSACTION_LIMIT,
    page,
  });

  const { data: notificationsData, isLoading } =
    useGetUserMessageNotificatonsQuery(initialFilterState);
  // Update page in filter state when page changes
  useEffect(() => {
    setInitialFilterState((prev) => ({
      ...prev,
      page,
    }));
  }, [page]);

  console.log(notificationsData);

  useEffect(() => {
    if (notificationsData?.success && notificationsData.data.docs) {
      const formattedNotifications = notificationsData.data.docs.map((request: any) => {
        console.log(request);
        return {
          _id: request._id,
          data: request,
          type: "NEW_REQUEST" as const,
          isRead: false, // You might want to track this on the backend
          createdAt: request.createdAt,
        };
      });
      dispatch(setNotifications(formattedNotifications));
    }
  }, [notificationsData, dispatch]);

  // Mark all notifications as read
  // const handleMarkAllAsRead = async () => {
  //   try {
  //     // await markAllAsRead({}).unwrap();
  //     dispatch(markAllAsRead());
  //   } catch (error) {
  //     console.error("Failed to mark all notifications as read:", error);
  //   }
  // };

  const totalPages = notificationsData?.data?.totalPages ?? 1;
  const hasNextPage = notificationsData?.data?.hasNextPage ?? false;

  const handleNextPage = () => {
    if (hasNextPage) {
      setPage((prevPage) => Math.min(prevPage + 1, totalPages));
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const sortedNotifications = useMemo(() => {
    const allNotifications = [...notifications, ...unread_notifications];

    return allNotifications.sort((a, b) => {
      if (a.isRead !== b.isRead) {
        return Number(a.isRead) - Number(b.isRead);
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [notifications, unread_notifications]);

  console.log(filter);

  const filteredNotifications = useMemo(() => {
    switch (filter) {
      case "unread":
        return sortedNotifications.filter((n) => !n.isRead);
      case "read":
        return sortedNotifications.filter((n) => n.isRead);
      default:
        return sortedNotifications;
    }
  }, [sortedNotifications, filter]);

  console.log(filteredNotifications);

  const unreadCount = useMemo(() => {
    return sortedNotifications.filter((n) => !n.isRead).length;
  }, [sortedNotifications]);

  const handleSelectNotification = useCallback((id: string) => {
    setSelectedNotifications((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }

      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map((n) => n._id)));
    }
  }, [selectedNotifications.size, filteredNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // await markAsRead({ notificationId }).unwrap();
      dispatch(setReadNotification({ notificationId }));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Delete notification
  const handleDeleteNotification = async (notificationId: string) => {
    try {
      // await deleteNotificationMutation({ notificationId }).unwrap();
      dispatch(deleteNotification({ notificationId }));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <div className="pt-24 lg:pt-[6rem] mx-auto max-w-7xl">
      <div className="flex-auto rounded-md w-full bg-white">
        <div className="rounded-t-md p-3 border-b-transparent border border-gray-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-medium text-gray-900">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {unreadCount} unread
                  </span>
                )}
              </h1>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1">
              {(["all", "unread", "read"] as const).map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={classNames(
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                    filter === filterOption
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedNotifications.size > 0 && (
            <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 rounded-md">
              <span className="text-sm text-blue-700">
                {selectedNotifications.size} notification{selectedNotifications.size > 1 ? "s" : ""}{" "}
                selected
              </span>
              <div className="flex space-x-2">
                <button
                  // onClick={() => handleBulkAction("read")}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800"
                >
                  Mark as Read
                </button>
                <button
                  // onClick={() => handleBulkAction("delete")}
                  className="text-xs font-medium text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          {/* Select All */}
          <div className="mt-3 flex items-center">
            <input
              type="checkbox"
              checked={
                selectedNotifications.size === filteredNotifications.length &&
                filteredNotifications.length > 0
              }
              onChange={handleSelectAll}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-600">Select all visible notifications</label>
          </div>
        </div>

        <div className="rounded-b-md overflow-hidden p-0 border border-gray-400">
          {filteredNotifications.length === 0 && (
            <div className=" mx-auto max-w-4xl px-4">
              <div className="text-center py-12">
                <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter === "unread" ? "You're all caught up!" : "No notifications to display."}
                </p>
              </div>
            </div>
          )}
          <ul className="w-full">
            {React.Children.toArray(
              filteredNotifications.map((notification) => (
                <NotificationItem
                  notification={notification}
                  isSelected={selectedNotifications.has(notification._id)}
                  onSelect={handleSelectNotification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                />
              ))
            )}
          </ul>
        </div>
      </div>

      {!isLoading && (
        <PaginationComponent
          page={page}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          prev={handlePreviousPage}
          next={handleNextPage}
          setPage={setPage}
          totalItems={notificationsData?.data?.totalMessages}
        />
      )}
    </div>
  );
}

const NotificationIcon = ({ type }: { type: string }) => {
  const iconProps = "w-4 h-4";

  switch (type) {
    case "NEW_REQUEST":
      return <EnvelopeIcon className={iconProps} />;
    case "WARNING":
      return <ExclamationTriangleIcon className={iconProps} />;
    case "WARNING":
      return <InformationCircleIcon className={iconProps} />;
    default:
      return <BellIcon className={iconProps} />;
  }
};

const NotificationItem = ({
  notification,
  isSelected,
  onSelect,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getNotificationContent = useCallback(() => {
    switch (notification.type) {
      case "NEW_REQUEST":
        return {
          title: `${
            notification.data?.userDetails?.username ?? notification.data?.user?.name
          } is requesting for account update`,
          message:
            notification.data.message?.substring(0, 100) +
            (notification.data.message && notification.data.message.length > 100 ? "..." : ""),
        };
      default:
        return {
          title: "New Notification",
          message: "You have a new notification",
        };
    }
  }, [notification]);

  const { title, message } = getNotificationContent();
  const avatarUrl = notification?.data?.userDetails?.avatar?.url;

  return (
    <li
      className={classNames(
        "relative group transition-all duration-200 ease-in-out",
        "border-l-4 hover:shadow-sm",
        notification.isRead
          ? "border-l-gray-200 bg-white hover:bg-gray-50"
          : "border-l-blue-500 bg-blue-50/30 hover:bg-blue-50/50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-2">
        <div className="flex items-start space-x-3">
          {/* Selection Checkbox */}
          <div className="flex items-center mt-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(notification._id)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
              aria-label={`Select notification from ${notification.data?.userDetails?.username}`}
            />
          </div>

          {/* Notification Icon */}
          <div
            className={classNames(
              "flex-shrink-0 mt-1 p-2 rounded-full transition-colors",
              notification.isRead ? "bg-gray-100 text-gray-500" : "bg-blue-100 text-blue-600"
            )}
          >
            <NotificationIcon type={notification?.type} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <a
              href={`/app/notifications/${notification?._id}`}
              className="block hover:no-underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3
                    className={classNames(
                      "text-sm leading-5 transition-colors",
                      notification.isRead ? "text-gray-700" : "text-gray-900 font-medium"
                    )}
                  >
                    {title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-5 line-clamp-2">{message}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    <time dateTime={notification.createdAt}>
                      {formatTime(notification.createdAt)}
                    </time>
                  </div>
                </div>

                {/* Avatar */}
                {avatarUrl && (
                  <div className="flex-shrink-0 ml-3">
                    <img
                      src={avatarUrl}
                      alt={`${notification.data?.userDetails?.username}'s avatar`}
                      className="h-8 w-8 rounded-full object-cover border border-gray-200"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </a>
          </div>
        </div>

        {/* Action Buttons - Show on hover or when notification is unread */}
        <div
          className={classNames(
            "flex items-center justify-end space-x-2 mt-1 transition-opacity duration-200",
            isHovered || !notification.isRead ? "opacity-100" : "opacity-0"
          )}
        >
          {!notification.isRead && (
            <button
              type="button"
              onClick={() => onMarkAsRead(notification._id)}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              title="Mark as read"
            >
              <CheckIcon className="h-3 w-3 mr-1" />
              Mark Read
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(notification._id)}
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            title="Delete notification"
          >
            <TrashIcon className="h-3 w-3 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};
