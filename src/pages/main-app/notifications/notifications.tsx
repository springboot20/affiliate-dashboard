import { useGetUserMessageNotificatonsQuery } from "@/features/messaging/message.slice";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import React, { Fragment, useEffect, useState, type JSX } from "react";
import {
  deleteNotification,
  markAllAsRead,
  setNotifications,
  setReadNotification,
} from "@/features/messaging/notification.reducer";
import {
  BellIcon,
  CheckIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { classNames } from "@/utils";
import { PaginationComponent } from "@/components/paginations/PaginationComponent";
// import moment from "moment";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Transition,
} from "@headlessui/react";
import { useNavigate } from "react-router-dom";

type InitialFilterState = Record<string, any>;

export default function Notifications(): JSX.Element {
  const userRole = useAppSelector((state) => state.auth.data.user?.role);
  const TRANSACTION_LIMIT = 10;
  const { unread_notifications, notifications, totalUnreadCount } = useAppSelector(
    (state) => state.notifications
  );

  const dispatch = useAppDispatch();

  const [page, setPage] = useState(1);

  const [initialFilterState, setInitialFilterState] = useState<InitialFilterState>({
    limit: TRANSACTION_LIMIT,
    page,
  });

  const { data: notificationsData, isLoading } = useGetUserMessageNotificatonsQuery(
    initialFilterState,
    {
      skip: !["ADMIN", "MODERATOR"].includes(userRole || ""),
    }
  );
  // Update page in filter state when page changes
  useEffect(() => {
    setInitialFilterState((prev) => ({
      ...prev,
      page,
    }));
  }, [page]);

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
  const handleMarkAllAsRead = async () => {
    try {
      // await markAllAsRead({}).unwrap();
      dispatch(markAllAsRead());
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

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

  return (
    <section className="pt-24 lg:pt-[5rem]">
      <div className="max-w-7xl mx-auto px-4 2xl:px-0">
        <header className="py-4 flex items-center justify-between">
          <h2 className="lg:text-xl font-medium capitalize text-[#152F00]">Notifications</h2>

          <div className="flex items-center space-x-2">
            {totalUnreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                title="Mark all as read"
              >
                <CheckIcon className="w-4 h-4" />
                <span>Mark all read</span>
              </button>
            )}
          </div>
        </header>

        <div>
          <TabGroup>
            <TabList className="flex items-center gap-6 mb-3 border-b-2 border-blue-500">
              <Tab as={"div"} className="relative h-full outline-none">
                {({ selected }) => (
                  <>
                    <button
                      className={classNames(
                        selected && "text-gray-700 font-medium",
                        "focus:outline-none text-base font-satoshi font-normal py-2 shrink-0",
                        [...unread_notifications, ...notifications].length > 0
                          ? "flex items-center"
                          : ""
                      )}
                    >
                      All Notifications
                      {[...unread_notifications, ...notifications].length > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-sm justify-center flex items-center rounded-full h-6 w-6">
                          {React.Children.toArray(
                            [...unread_notifications, ...notifications].filter(
                              (notification) => !notification.isRead
                            ).length
                          )}
                        </span>
                      )}
                    </button>

                    {selected && (
                      <span className="select-none cursor-pointer bg-blue-500 w-full rounded-t-3xl block h-1 absolute bottom-0 shadow-none"></span>
                    )}
                  </>
                )}
              </Tab>

              <Tab as={"div"} className="relative h-full outline-none">
                {({ selected }) => (
                  <>
                    <button
                      className={classNames(
                        selected && "text-gray-700 font-medium",
                        "focus:outline-none text-base font-satoshi font-normal py-2",
                        unread_notifications.length > 0 ? "flex items-center" : ""
                      )}
                    >
                      New Notifications
                      {unread_notifications.length > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-sm justify-center flex items-center rounded-full h-6 w-6">
                          {unread_notifications.length}
                        </span>
                      )}
                    </button>

                    {selected && (
                      <span className="select-none cursor-pointer bg-blue-500 w-full rounded-t-3xl block h-1 absolute bottom-0 shadow-none"></span>
                    )}
                  </>
                )}
              </Tab>

              <Tab as={"div"} className="relative h-full outline-none">
                {({ selected }) => (
                  <>
                    <button
                      className={classNames(
                        selected && "text-gray-700 border-b-2 border-indigo-600 font-medium",
                        "focus:outline-none text-base font-satoshi font-normal py-2"
                      )}
                    >
                      Read Notifications
                    </button>
                    {selected && (
                      <span className="select-none cursor-pointer bg-blue-500 w-full rounded-t-3xl block h-1 absolute bottom-0 shadow-none"></span>
                    )}
                  </>
                )}
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <ul role="listbox" className="space-y-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <span className="text-gray-500">Loading notifications...</span>
                    </div>
                  ) : [...notifications, ...unread_notifications]?.length === 0 ? (
                    <div className="flex items-center justify-center h-32 flex-col">
                      <BellIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <span className="text-gray-500">No notifications found.</span>
                    </div>
                  ) : (
                    React.Children.toArray(
                      [...notifications, ...unread_notifications]
                        ?.sort((a, b) => Number(a.isRead) - Number(b.isRead))
                        ?.map((notification) => (
                          <ListItem key={notification?.createdAt} notification={notification} />
                        ))
                    )
                  )}
                </ul>
              </TabPanel>

              <TabPanel>
                <ul role="listbox" className="space-y-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <span className="text-gray-500">Loading notifications...</span>
                    </div>
                  ) : unread_notifications?.length === 0 ? (
                    <div className="flex items-center justify-center h-32 flex-col">
                      <BellIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <span className="text-gray-500">No notifications found.</span>
                    </div>
                  ) : (
                    React.Children.toArray(
                      unread_notifications?.map((notification) => (
                        <ListItem key={notification?.createdAt} notification={notification} />
                      ))
                    )
                  )}
                </ul>
              </TabPanel>

              <TabPanel>
                <ul role="listbox" className="space-y-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <span className="text-gray-500">Loading notifications...</span>
                    </div>
                  ) : notifications?.length === 0 ? (
                    <div className="flex items-center justify-center h-32 flex-col">
                      <BellIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <span className="text-gray-500">No notifications found.</span>
                    </div>
                  ) : (
                    React.Children.toArray(
                      notifications?.map((notification) => (
                        <ListItem key={notification?.createdAt} notification={notification} />
                      ))
                    )
                  )}
                </ul>
              </TabPanel>
            </TabPanels>
          </TabGroup>
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
    </section>
  );
}

export type ListItemProps = {};

export const ListItem = ({ notification }: { notification: any }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [openOptions, setOpenOptions] = useState<{ [key: string]: boolean }>({});

  const toggleOptions = (id: string, evt: React.MouseEvent) => {
    evt.stopPropagation();

    setOpenOptions((prev) => {
      return {
        ...prev,
        [id]: !openOptions[id],
      };
    });
  };

  useEffect(() => {
    if (!open) {
      setOpenOptions({});
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenOptions({});
    };

    if (Object.values(openOptions).some(Boolean)) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openOptions]);

  // const getNotificationIcon = (type: string) => {
  //   switch (type) {
  //     case "NEW_REQUEST":
  //       return <UserIcon className="w-5 h-5 text-blue-500" />;
  //     case "MESSAGE":
  //       return <BellAlertIcon className="w-5 h-5 text-green-500" />;
  //     default:
  //       return <BellIcon className="w-5 h-5 text-gray-500" />;
  //   }
  // };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

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
    <li
      className={classNames(
        "px-3 py-2 border-gray-500 border rounded-lg hover:bg-gray-50 group",
        !notification.isRead ? "bg-blue-50 border-l-4 border-l-blue-500" : "bg-gray-100"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <span className="size-10 rounded-full overflow-hidden block border-gray-500 border">
            <img
              src={notification?.data?.userDetails?.avatar?.url}
              className="h-full w-full object-center object-cover"
            />
          </span>

          <div className="space-y-1">
            {notification.type === "NEW_REQUEST" && (
              <h3 className="text-sm font-normal text-gray-600">
                <b className="capitalize">
                  {notification.data?.userDetails?.username ?? notification.data?.user?.name}
                </b>{" "}
                is requesting for <b>account update</b>
              </h3>
            )}

            <div className="px-1 border-l-2 border-gray-500  ">
              <p className="text-xs font-normal text-gray-600 line-clamp-2 italic">
                {notification.type === "NEW_REQUEST"
                  ? `${notification.data.message?.substring(0, 100)}${
                      notification.data.message?.length > 100 ? "..." : ""
                    }`
                  : "You have a new notification"}
              </p>
            </div>
            <div className="!mt-4">
              <button
                type="button"
                className="rounded-2xl capitalize px-3 py-2 text-xs font-medium bg-blue-500 text-white"
                onClick={() => navigate(`/app/notifications/${notification?._id}`)}
              >
                view details
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center space-x-1">
            <ClockIcon className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">{formatTime(notification.createdAt)}</span>
          </div>

          <Menu as="div" className="relative mt-1.5">
            <div>
              <MenuButton
                onClick={(e) => {
                  toggleOptions(notification?._id, e);
                }}
                className="flex items-center rounded-xl outline-none focus:outline-none group-hover:bg-white group-hover:px-1 group-hover:h-3 group-hover:border group-hover:border-gray-500  text-gray-900 cursor-pointer"
              >
                <span className="sr-only">Open auth menu</span>
                <EllipsisHorizontalIcon className="group-hover:h-6 group-hover:w-6 w-0 group-hover:opacity-100 opacity-0 transition-all ease-in-out duration-100 text-gray-600" />
              </MenuButton>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 z-10 mt-4 w-max origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-gray-500 ring-opacity-5 focus:outline-none">
                {!notification?.isRead && (
                  <MenuItem>
                    {({ active }) => (
                      <button
                        type="button"
                        title="delete notification"
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-800 font-medium"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification._id);
                          setOpenOptions((prev) => ({ ...prev, [notification?._id]: false }));
                        }}
                        role="button"
                      >
                        Mark as read
                        <CheckIcon className="h-4 w-4 mr-2" />
                      </button>
                    )}
                  </MenuItem>
                )}
                <MenuItem>
                  {({ active }) => (
                    <button
                      type="button"
                      title="delete notification"
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-800 font-medium"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification._id);
                        setOpenOptions((prev) => ({ ...prev, [notification?._id]: false }));
                      }}
                      role="button"
                    >
                      Delete notification
                      <TrashIcon className="h-4 w-4 mr-2" />
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Transition>
          </Menu>
        </div>
      </div>
    </li>
  );
};

// Notification Bell Icon Component
export const NotificationBell: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { totalUnreadCount } = useAppSelector((state) => state.notifications);

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-colors"
      aria-label={`Notifications ${totalUnreadCount > 0 ? `(${totalUnreadCount} unread)` : ""}`}
    >
      <BellIcon className="w-6 h-6" />
      {totalUnreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
          {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
        </span>
      )}
    </button>
  );
};
