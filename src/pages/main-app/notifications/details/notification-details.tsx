import { LoadingSpinner } from "@/components/loaders/spinner";
import { useGetRequestMessageByIdQuery } from "@/features/messaging/message.slice";
import { classNames } from "@/utils";
import {
  ArrowLeftIcon,
  ClockIcon,
  UserIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as StatusClockIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState, type JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function NotificationDetails(): JSX.Element {
  const navigate = useNavigate();

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

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      PENDING: {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: StatusClockIcon,
        label: "Pending Review",
      },
      IN_REVIEW: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: ExclamationTriangleIcon,
        label: "In Review",
      },
      APPROVED: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircleIcon,
        label: "Approved",
      },
      REJECTED: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircleIcon,
        label: "Rejected",
      },
    };
    return configs[status as keyof typeof configs] || configs.PENDING;
  };

  const getPriorityConfig = (priority: string) => {
    const configs = {
      LOW: { color: "bg-gray-100 text-gray-700 border-gray-200" },
      MEDIUM: { color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      HIGH: { color: "bg-orange-100 text-orange-800 border-orange-200" },
      URGENT: { color: "bg-red-100 text-red-800 border-red-200" },
    };
    return configs[priority as keyof typeof configs] || configs.MEDIUM;
  };

  const getActionConfig = (action: string) => {
    console.log(action);

    let actions = action?.split("_");

    console.log(actions);

    const isDestructive =
      actions?.includes("CLOSE") || actions?.includes("SUSPEND") || actions?.includes("DELETE");
    return {
      color: isDestructive
        ? "bg-red-100 text-red-800 border-red-200"
        : "bg-green-100 text-green-800 border-green-200",
      label: actions
        ?.join(" ")
        ?.toLowerCase()
        ?.replace(/\b\w/g, (l) => l.toUpperCase()),
    };
  };

  const { notificationId } = useParams<{ notificationId: string }>();
  const [details, setDetails] = useState<Record<string, any>>({});

  const { data: notificationData, isLoading } = useGetRequestMessageByIdQuery(notificationId!, {
    skip: !notificationId,
  });

  useEffect(() => {
    if (notificationData) {
      setDetails(notificationData?.data);
    }
  }, [notificationData]);

  return (
    <Fragment>
      <div className="pt-24 lg:pt-[5rem] mx-auto max-w-2xl">
        <header className="flex items-center justify-between">
          <button
            title="back"
            type="button"
            className="flex items-center gap-3 hover:underline active:underline font-medium mb-4"
            onClick={() => navigate("/admin/notifications")}
          >
            <ArrowLeftIcon className="size-4 shrink-0" />
            back
          </button>

          {details && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ClockIcon className="w-4 h-4" />
              {formatTime(details?.createdAt)}
            </div>
          )}
        </header>

        <div className="">
          {isLoading ? (
            <div className="flex items-center justify-center h-[20vh]">
              <LoadingSpinner />
            </div>
          ) : details ? (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">
                      Account Request Details
                    </h1>
                    <p className="text-sm text-gray-600 font-mono bg-white px-3 py-1 rounded-full border">
                      ID: {details?._id}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div
                      className={classNames(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border",
                        getStatusConfig(details?.status).color
                      )}
                    >
                      {(() => {
                        const StatusIcon = getStatusConfig(details?.status).icon;
                        return <StatusIcon className="w-4 h-4" />;
                      })()}
                      {getStatusConfig(details?.status).label}
                    </div>

                    <div
                      className={classNames(
                        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
                        getPriorityConfig(details?.priority).color
                      )}
                    >
                      {details?.priority} Priority
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-6 bg-gray-50/20">
                {/* User Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4 col-span-full">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <UserIcon className="w-5 h-5" />
                      User Information
                    </h3>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={details?.user?.avatar?.url}
                          alt={details?.username}
                          className="w-10 h-10 rounded-full bg-gray-200 object-cover shrink-0"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{details?.username}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <EnvelopeIcon className="w-3 h-3" />
                            {details?.userEmail}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <ChatBubbleLeftRightIcon className="w-5 h-5" />
                      Request Action
                    </h3>

                    <div className="bg-gray-50 rounded-lg p-4 h-fit">
                      <div
                        className={classNames(
                          "inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border",
                          getActionConfig(details?.action)?.color
                        )}
                      >
                        {getActionConfig(details?.action).label}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Request Message</h3>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <p className="text-gray-700 leading-relaxed">{details?.message}</p>

                    {details?.reviewedBy && (
                      <div className="pl-4 flex items-center justify-between">
                        <span className=" italic font-inter font-normal text-gray-400 text-xs">
                          {details?.adminNotes}
                        </span>
                        <span className="text-xs font-normal text-gray-400 italic">
                          {formatDateTime(details?.updatedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reviewer Section */}

                {details?.reviewedBy && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Reviewed By</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={details?.reviewedBy?.avatar?.url}
                          alt={details?.reviewedBy?.username}
                          className="w-10 h-10 rounded-full bg-gray-200 object-cover shrink-0"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {details?.reviewedBy?.username}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <EnvelopeIcon className="w-3 h-3" />
                            {details?.reviewedBy?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timeline Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <ClockIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Request Created</p>
                        <p className="text-sm text-gray-600">
                          {formatDateTime(details?.createdAt)}
                        </p>
                      </div>
                    </div>

                    {details?.reviewedAt && (
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Under Review</p>
                          <p className="text-sm text-gray-600">
                            {formatDateTime(details?.reviewedAt)}
                          </p>
                        </div>
                      </div>
                    )}

                    {details?.updatedAt !== details?.createdAt && (
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Last Updated</p>
                          <p className="text-sm text-gray-600">
                            {formatDateTime(details?.updatedAt)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 justify-center">
                  <button className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                    Mark as Reviewed
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600">No notification details found.</p>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
