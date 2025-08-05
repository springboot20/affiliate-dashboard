import { CreditCardIcon, UserIcon } from "@/components/icons/Icons";
import {
  useGetTransactionDetailsQuery,
  useDownloadReceiptMutation,
  useGetReceiptDataQuery,
} from "@/features/transactions/transaction.slice";
import { classNames, formatDate, formatMoney, shareTransaction } from "@/utils";
import {
  ArrowDownLeftIcon,
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  ArrowUpRightIcon,
  BellAlertIcon,
  BuildingStorefrontIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClipboardIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentIcon,
  HashtagIcon,
  ShareIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

export default function TransactionDetails() {
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const { transactionId } = useParams<{ transactionId: string }>();

  const { data, refetch } = useGetTransactionDetailsQuery(transactionId!, {
    skip: !transactionId,
  });
  const [downloadMutation, { isLoading: isDownloading }] = useDownloadReceiptMutation();

  const { data: receiptData } = useGetReceiptDataQuery(transactionId!, {
    skip: !transactionId,
  });

  const downloadReceiptFile = async (transactionId: string, transactionRef: string) => {
    try {
      const result = await downloadMutation(transactionId).unwrap();

      console.log(result);

      // Create blob URL and trigger download
      const blob = new Blob([result as BlobPart], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `receipt-${transactionRef}.pdf`;
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error("Download failed:", error);
      return { success: false, error };
    }
  };

  const handleDownloadReceipt = async () => {
    if (!transactionId || !transactionData?.reference) return;
    try {
      const result = await downloadReceiptFile(transactionId, transactionData.reference);

      console.log(result);

      if (!result.success) {
        alert("Failed to download receipt. Please try again.");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download receipt. Please try again.");
    }
  };

  const handleShareTransaction = async () => {
    if (!receiptInfo) return;
    setIsSharing(true);
    try {
      const result = await shareTransaction(receiptInfo);

      if (result.success) {
        if (result.method === "clipboard") {
          setShareMessage("Transaction details copied to clipboard!");
          setTimeout(() => setShareMessage(null), 3000);
        }
      } else {
        alert("Failed to share transaction. Please try again.");
      }
    } catch (error) {
      console.error("Share error:", error);
      alert("Failed to share transaction. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  const handleRefreshStatus = () => {
    // Trigger a refetch of transaction data
    if (transactionId) {
      // You might want to add a refetch method to your query
      refetch(); // Simple approach, or use RTK Query's refetch
    }
  };

  const transactionData = data?.data as any;
  const receiptInfo = receiptData?.data;

  const statusConfig = useMemo(
    () => getStatusConfig(transactionData?.status),
    [transactionData?.status]
  );
  const typeConfig = useMemo(() => getTypeConfig(transactionData?.type), [transactionData?.type]);
  const StatusIcon = statusConfig.icon;
  const TypeIcon = typeConfig.icon;
  const createdDate = formatDate(transactionData?.createdAt);
  const updatedDate = formatDate(transactionData?.updatedAt);

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
    <section className="py-24 lg:py-[8rem]">
      <div className="max-w-4xl mx-auto px-4 2xl:px-0">
        <button
          title="back"
          type="button"
          className="flex items-center gap-3 hover:underline active:underline text-sm font-medium mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="size-4 shrink-0" />
          back
        </button>

        {shareMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {shareMessage}
          </div>
        )}

        <div className="max-w-full">
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
                            transactionData?.amount,
                            transactionData?.currency === "NGN" ? "NGN" : "USD",
                            // "NGN",
                            transactionData?.currency === "NGN" ? "en-NG" : "en-NG"
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
                          {transactionData?.reference}
                        </span>
                        <button
                          onClick={() => copyToClipboard(transactionData?.reference, "reference")}
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
                      <span className="text-gray-900 font-medium">
                        {transactionData?.description}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <BuildingStorefrontIcon className="w-4 h-4" />
                        Gateway
                      </span>
                      <span className="text-gray-900 font-medium">
                        {transactionData?.detail.gateway}
                      </span>
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
                          {transactionData?.user?._id
                            ? `${transactionData.user._id.slice(
                                0,
                                4
                              )}...${transactionData.user._id.slice(-4)}`
                            : "N/A"}
                        </span>
                        <button
                          onClick={() => copyToClipboard(transactionData?.user?._id, "userId")}
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
                            {transactionData?.detail.senderAccountNumber}
                          </span>
                          <button
                            title="copy"
                            onClick={() =>
                              copyToClipboard(transactionData?.detail.senderAccountNumber, "sender")
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
                            {transactionData?.detail?.receiverAccountNumber ?? "N/A"}
                          </span>
                          <button
                            title="copy"
                            onClick={() =>
                              copyToClipboard(
                                transactionData?.detail?.receiverAccountNumber,
                                "receiver"
                              )
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
              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-2.5 space-y-3">
                  <button
                    onClick={handleDownloadReceipt}
                    disabled={isDownloading}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">
                      {isDownloading ? "Downloading..." : "Download Receipt"}
                    </span>
                  </button>
                  <button
                    onClick={handleShareTransaction}
                    disabled={isSharing}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <ShareIcon className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Share Transaction</span>
                  </button>
                  <button
                    onClick={handleRefreshStatus}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <ArrowPathIcon className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">Check Status</span>
                  </button>
                </div>
              </div>

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
                          transactionData?.status === "COMPLETED"
                            ? "bg-green-600"
                            : transactionData?.status === "FAILED"
                            ? "bg-red-600"
                            : "bg-amber-600"
                        }`}
                      ></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {transactionData?.status === "COMPLETED"
                            ? "Payment Completed"
                            : transactionData?.status === "FAILED"
                            ? "Payment Failed"
                            : "Processing Payment"}
                        </p>
                        <p className="text-xs text-gray-500">Current status</p>
                      </div>
                    </div>
                    {transactionData?.status !== "COMPLETED" && (
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
        </div>
      </div>
    </section>
  );
}

/**
 *
 */
