import { CreditCardIcon } from "@/components/icons/Icons";
import { LoadingSpinner } from "@/components/loaders/spinner";
import { useGetRequestMessageByIdQuery } from "@/features/messaging/message.slice";
import { useGetTransactionDetailsQuery } from "@/features/transactions/transaction.slice";
import { classNames, formatDate, formatMoney } from "@/utils";
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
  CurrencyDollarIcon,
  ArrowPathIcon,
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  BellAlertIcon,
  ClipboardIcon,
  DocumentIcon,
  HashtagIcon,
  BuildingStorefrontIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useEffect, useMemo, useState, type JSX } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
    const actions = action?.split("_");

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

  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const messageId = searchParams.get("messageId");
  const [details, setDetails] = useState<Record<string, any>>({});
  const [type, setType] = useState<"message" | "transaction" | null>(null);

  const {
    data: notificationData,
    isLoading: messageLoading,
    isFetching: messageFetching,
  } = useGetRequestMessageByIdQuery(messageId!, {
    skip: !messageId,
  });

  const {
    data: transaction,
    isLoading: txLoading,
    isFetching: txFetching,
  } = useGetTransactionDetailsQuery(transactionId!, {
    skip: !transactionId,
  });

  console.log(type);

  useEffect(() => {
    if (messageId && notificationData) {
      setDetails(notificationData.data);
      setType("message");
    } else if (transactionId && transaction) {
      setType("transaction");
      setDetails(transaction.data);
    }
  }, [messageId, notificationData, transactionId, transaction]);

  const loading = messageLoading || txLoading || messageFetching || txFetching;

  return (
    <Fragment>
      <div className="pt-24 lg:pt-[6rem] mx-auto max-w-2xl">
        <header className="flex items-center justify-between">
          <button
            title="back"
            type="button"
            className="flex items-center gap-3 hover:underline active:underline font-medium mb-4"
            onClick={() => navigate("/app/notifications")}
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

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center h-[30vh]">
            <LoadingSpinner />
          </div>
        )}

        {/* No details */}
        {!loading && !details?._id && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">No notification details found.</p>
          </div>
        )}

        {type === "message" && details?._id && (
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
                        alt={details?.user?.firstname}
                        className="w-10 h-10 rounded-full bg-gray-200 object-cover shrink-0"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {details?.user?.firstname} {details?.user?.lastname}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <EnvelopeIcon className="w-3 h-3" />
                          {details?.user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {details?.action && (
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
                )}
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
                        alt={details?.reviewedBy?.firstname}
                        className="w-10 h-10 rounded-full bg-gray-200 object-cover shrink-0"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {details?.reviewedBy?.firstname}
                          {details?.reviewedBy?.lastname}
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
                      <p className="text-sm text-gray-600">{formatDateTime(details?.createdAt)}</p>
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
        )}

        {type === "transaction" && details?._id && (
          <TransactionDetails transaction={{ ...details }} />
        )}
      </div>
    </Fragment>
  );
}

type TransactionDetailsProps = Record<string, any>;

const getStatusConfig = (status: string) => {
  switch (status) {
    case "IN_PROGRESS":
      return {
        color: "text-amber-600 bg-amber-50 border-amber-200",
        icon: ClockIcon,
        text: "In Progress",
      };
    case "COMPLETED":
      return {
        color: "text-green-600 bg-green-50 border-green-200",
        icon: CheckCircleIcon,
        text: "Completed",
      };
    case "FAILED":
      return {
        color: "text-red-600 bg-red-50 border-red-200",
        icon: XCircleIcon,
        text: "Failed",
      };
    case "PENDING":
      return {
        color: "text-blue-600 bg-blue-50 border-blue-200",
        icon: BellAlertIcon,
        text: "Pending",
      };
    default:
      return {
        color: "text-gray-600 bg-gray-50 border-gray-200",
        icon: ClockIcon,
        text: status,
      };
  }
};

const getTypeConfig = (type: string) => {
  switch (type) {
    case "DEPOSIT":
      return {
        color: "text-green-600",
        icon: ArrowDownLeftIcon,
        text: "Deposit",
      };
    case "WITHDRAWAL":
      return {
        color: "text-red-600",
        icon: ArrowUpRightIcon,
        text: "Withdrawal",
      };
    case "TRANSFER":
      return {
        color: "text-blue-600",
        icon: ArrowPathIcon,
        text: "Transfer",
      };
    default:
      return {
        color: "text-gray-600",
        icon: CurrencyDollarIcon,
        text: type,
      };
  }
};

const TransactionDetails = ({ transaction }: TransactionDetailsProps) => {
  console.log(transaction);

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const createdDate = formatDate(transaction?.createdAt);
  const updatedDate = formatDate(transaction?.updatedAt);
  const statusConfig = useMemo(() => getStatusConfig(transaction?.status), [transaction?.status]);
  const typeConfig = useMemo(() => getTypeConfig(transaction?.type), [transaction?.type]);
  const StatusIcon = statusConfig.icon;
  const TypeIcon = typeConfig.icon;

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* Transaction Overview */}
        <div className="bg-white rounded-xl border border-gray-300 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full bg-white shadow-sm ${typeConfig.color}`}>
                  <TypeIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {formatMoney(
                      transaction?.amount,
                      transaction?.currency === "NGN" ? "NGN" : "USD",
                      // "NGN",
                      transaction?.currency === "NGN" ? "en-NG" : "en-NG"
                    )}
                  </h2>
                  <p className="text-gray-600">{typeConfig.text} Transaction</p>
                </div>
              </div>
              <div
                className={classNames(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full border",
                  statusConfig.color
                )}
              >
                <StatusIcon className="w-4 h-4" />
                <span className="text-sm font-medium">{statusConfig.text}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <HashtagIcon className="w-4 h-4" />
                  Reference
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {transaction?.reference}
                  </span>
                  <button
                    onClick={() => copyToClipboard(transaction?.reference, "reference")}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {copiedField === "reference" ? (
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    ) : (
                      <ClipboardIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <DocumentIcon className="w-4 h-4" />
                  Description
                </span>
                <span className="text-gray-900 font-medium">{transaction?.description}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <BuildingStorefrontIcon className="w-4 h-4" />
                  Gateway
                </span>
                <span className="text-gray-900 font-medium">{transaction?.detail.gateway}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Created
                </span>
                <div className="text-right">
                  <div className="text-gray-900 font-medium">{createdDate.date}</div>
                  <div className="text-sm text-gray-500">{createdDate.time}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <ArrowPathIcon className="w-4 h-4" />
                  Updated
                </span>
                <div className="text-right">
                  <div className="text-gray-900 font-medium">{updatedDate.date}</div>
                  <div className="text-sm text-gray-500">{updatedDate.time}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <UserIcon className="w-4 h-4 stroke-gray-600 fill-none" />
                  User ID
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {transaction?.user?._id
                      ? `${transaction.user._id.slice(0, 4)}...${transaction.user._id.slice(-4)}`
                      : "N/A"}
                  </span>
                  <button
                    onClick={() => copyToClipboard(transaction?.user?._id, "userId")}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {copiedField === "userId" ? (
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    ) : (
                      <ClipboardIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CreditCardIcon className="w-5 h-5" />
              Account Information
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Sender Account
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                    <ArrowUpRightIcon className="w-4 h-4 text-red-600" />
                    <span className="font-mono text-gray-900">
                      {transaction?.detail.senderAccountNumber}
                    </span>
                    <button
                      title="copy"
                      onClick={() =>
                        copyToClipboard(transaction?.detail.senderAccountNumber, "sender")
                      }
                      className="ml-auto p-1 hover:bg-red-100 rounded transition-colors"
                    >
                      {copiedField === "sender" ? (
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      ) : (
                        <ClipboardIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Receiver Account
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <ArrowDownLeftIcon className="w-4 h-4 text-green-600" />
                    <span className="font-mono text-gray-900">
                      {transaction?.detail?.receiverAccountNumber ?? "N/A"}
                    </span>
                    <button
                      title="copy"
                      onClick={() =>
                        copyToClipboard(transaction?.detail?.receiverAccountNumber, "receiver")
                      }
                      className="ml-auto p-1 hover:bg-green-100 rounded transition-colors"
                    >
                      {copiedField === "receiver" ? (
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                      ) : (
                        <ClipboardIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Transaction Timeline */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Transaction Initiated</p>
                  <p className="text-xs text-gray-500">
                    {createdDate.date} at {createdDate.time}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    transaction?.status === "COMPLETED"
                      ? "bg-green-600"
                      : transaction?.status === "FAILED"
                      ? "bg-red-600"
                      : "bg-amber-600"
                  }`}
                ></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {transaction?.status === "COMPLETED"
                      ? "Payment Completed"
                      : transaction?.status === "FAILED"
                      ? "Payment Failed"
                      : "Processing Payment"}
                  </p>
                  <p className="text-xs text-gray-500">Current status</p>
                </div>
              </div>
              {transaction?.status !== "COMPLETED" && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Completion</p>
                    <p className="text-xs text-gray-400">Pending</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
