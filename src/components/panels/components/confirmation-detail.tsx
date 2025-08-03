import { UserIcon } from "@/components/icons/Icons";
import { useGetAccountDetailsQuery } from "@/features/account/account.slice";
import { formatMoney } from "@/utils";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

type ConfirmationDetailsProps = {
  values: any;
};

export const ConfirmationDetails = ({ values }: ConfirmationDetailsProps) => {
  const fromAccountId = values?.account || values?.from_account; // or values?.from_account if using that
  const toAccountId = values?.beneficiary || values?.to_account; // this is the one you should use

  const [details, setDetails] = useState<Record<string, any>>({});

  const { data: from_account_details, isLoading: isLoadingFrom } = useGetAccountDetailsQuery(
    { accountId: fromAccountId },
    { skip: !fromAccountId }
  );

  const { data: to_account_details_id, isLoading: isLoadingToWithId } = useGetAccountDetailsQuery(
    { accountId: toAccountId },
    { skip: !toAccountId }
  );

  useEffect(() => {
    const newDetails: Record<string, any> = {};

    if (from_account_details?.data) {
      newDetails.from_account_details = from_account_details.data;
    }

    if (to_account_details_id?.data) {
      newDetails.to_account_details = to_account_details_id.data;
    }

    setDetails(newDetails);
  }, [from_account_details, to_account_details_id]);

  const isLoadingRequired = (fromAccountId && isLoadingFrom) || (toAccountId && isLoadingToWithId);

  const recipientDetails = details.to_account_details;

  if (isLoadingRequired) {
    return (
      <div className="bg-white p-4">
        <p className="text-center">Loading transaction details...</p>
      </div>
    );
  }

  if (fromAccountId && !details.from_account_details) {
    return (
      <div className="bg-white p-4">
        <p className="text-center text-red-500">Error loading account details</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <header className="text-center mb-4">
        <h1>
          {values?.amount ? formatMoney(values.amount, "NGN", "en-NG") : "Amount not available"}
        </h1>
      </header>

      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="capitalize text-sm font-inter font-semibold">account number</span>
          <span className="capitalize text-sm font-inter font-medium text-gray-700">
            {recipientDetails?.account_number || values?.beneficiary || "N/A"}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="capitalize text-sm font-inter font-semibold">name</span>
          {(() => {
            const firstname = recipientDetails?.user?.firstname || recipientDetails?.firstname;
            const lastname = recipientDetails?.user?.lastname || recipientDetails?.lastname;
            const avatarUrl = recipientDetails?.user?.avatar?.url || recipientDetails?.avatar?.url;

            return (
              <div className="inline-flex items-center gap-2 justify-center">
                {avatarUrl ? (
                  <div className="overflow-hidden size-7 rounded-full border border-gray-400">
                    <img
                      src={avatarUrl}
                      alt={`${firstname || ""} ${lastname || ""}`}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                ) : (
                  <span className="shrink-0 flex justify-center items-center size-7 border border-gray-400 bg-gray-50 rounded-full">
                    <UserIcon className="h-4 fill-gray-600" />
                  </span>
                )}

                <span className="capitalize text-sm font-inter font-medium text-gray-700">
                  {firstname && lastname
                    ? `${firstname} ${lastname}`
                    : firstname || lastname || "N/A"}
                </span>
              </div>
            );
          })()}
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="capitalize text-sm font-inter font-semibold">amount</span>
          <span className="capitalize text-sm font-inter font-medium text-gray-700">
            {values?.amount ? formatMoney(values.amount, "NGN", "en-NG") : "N/A"}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="capitalize text-sm font-inter font-semibold">narration</span>
          <span className="capitalize text-sm font-inter font-medium text-gray-700">
            {values?.narration || "N/A"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="capitalize text-sm font-inter font-semibold">category</span>
          <span className="capitalize text-sm font-inter font-medium text-gray-700">
            {values?.category || "N/A"}
          </span>
        </div>

        <hr className="block my-4 border-gray-400" />

        <div className="rounded-3xl p-5 bg-gray-100">
          <div className="flex items-center justify-between mb-2 py-2 border-b-2 border-gray-500 border-dashed">
            <div className="flex space-x-1 items-center">
              <span className="capitalize text-sm font-inter font-semibold">available balance</span>
              <span className="capitalize text-sm font-inter font-medium text-gray-800">
                (
                {details?.from_account_details?.wallet?.balance
                  ? formatMoney(
                      details.from_account_details.wallet.balance,
                      details.from_account_details.wallet.currency === "USD" ? "USD" : "NGN",
                      details.from_account_details.wallet.currency === "USD" ? "en-US" : "en-NG"
                    )
                  : details?.from_account_details?.balance
                  ? formatMoney(details.from_account_details.balance, "NGN", "en-NG")
                  : "N/A"}
                )
              </span>
            </div>

            <CheckCircleIcon className="size-7 text-green-500" strokeWidth={2} />
          </div>

          <div className="flex items-center justify-between my-3">
            <div className="inline-flex space-x-1">
              <span className="capitalize text-xs font-inter font-normal">available balance</span>
              <span className="capitalize text-xs font-inter font-normal text-gray-800">
                (
                {details?.from_account_details?.wallet?.balance
                  ? formatMoney(
                      details.from_account_details.wallet.balance,
                      details.from_account_details.wallet.currency === "USD" ? "USD" : "NGN",
                      details.from_account_details.wallet.currency === "USD" ? "en-US" : "en-NG"
                    )
                  : details?.from_account_details?.balance
                  ? formatMoney(details.from_account_details.balance, "NGN", "en-NG")
                  : "N/A"}
                )
              </span>
            </div>
            <span className="capitalize text-xs font-inter font-normal text-gray-700">
              -
              {values?.amount
                ? formatMoney(
                    values.amount,
                    details?.from_account_details?.wallet?.currency === "USD" ? "USD" : "NGN",
                    details?.from_account_details?.wallet?.currency === "USD" ? "en-US" : "en-NG"
                  )
                : "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between my-3">
            <span className="capitalize text-xs font-inter font-normal">narration</span>
            <span className="capitalize text-xs font-inter font-normal text-gray-700">
              {values?.narration || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
