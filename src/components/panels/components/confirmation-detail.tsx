import { UserIcon } from "@/components/icons/Icons";
import {
  useGetAccountDetailsQuery,
  useGetAccountByNumberQuery,
} from "@/features/account/account.slice";
import { formatMoney } from "@/utils";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

type InitialValues = {
  account?: string;
  bank?: string;
  beneficiary?: string;
  amount: number;
  narration: string;
  category: string;
  pin: string[];
};

type ConfirmationDetailsProps = {
  values: InitialValues;
};

export const ConfirmationDetails = ({ values }: ConfirmationDetailsProps) => {
  const { data: from_account_details, isLoading: isLoadingFrom } = useGetAccountDetailsQuery(
    { accountId: values?.account! },
    { skip: !values?.account }
  );

  const { data: to_account_details, isLoading: isLoadingTo } = useGetAccountByNumberQuery(
    { account_number: values?.beneficiary! },
    { skip: !values?.beneficiary }
  );

  const [details, setDetails] = useState<Record<string, any>>({});

  useEffect(() => {
    if (to_account_details?.data && from_account_details?.data) {
      setDetails({
        to_account_details: to_account_details?.data,
        from_account_details: from_account_details?.data,
      });
    }
  }, [to_account_details?.data, from_account_details?.data]);

  console.log(details);

  return isLoadingFrom || isLoadingTo ? (
    <p>loading</p>
  ) : (
    <>
      <header className="text-center">
        <h1>{formatMoney(values?.amount, "NGN", "en-NG")}</h1>
      </header>

      <div className="">
        <div className="flex items-center justify-between mb-4">
          <span className="capitalize text-sm font-inter font-semibold">account number</span>
          <span className="capitalize text-sm font-inter font-medium text-gray-700">
            {details?.to_account_details?.account_number}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="capitalize text-sm font-inter font-semibold">name</span>
          {(() => {
            const firstname = details?.to_account_details?.profile?.firstname;
            const lastname = details?.to_account_details?.profile?.lastname;

            const avatarUrl = details?.to_account_details?.user?.avatar?.url;

            return (
              <div className="inline-flex items-center gap-2 justify-center">
                {avatarUrl ? (
                  <div className="overflow-hidden size-7 rounded-full border border-gray-400">
                    <img
                      src={avatarUrl}
                      alt={`${firstname} ${lastname}`}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                ) : (
                  <span className="shrink-0 flex justify-center items-center size-7 border border-gray-400 bg-gray-50 rounded-full">
                    <UserIcon className="h-4 fill-gray-600" />
                  </span>
                )}

                <span className="capitalize text-sm font-inter font-medium text-gray-700">
                  {firstname} {lastname}
                </span>
              </div>
            );
          })()}
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="capitalize text-sm font-inter font-semibold">amount</span>
          <span className="capitalize text-sm font-inter font-medium text-gray-700">
            {formatMoney(values?.amount, "NGN", "en-NG")}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="capitalize text-sm font-inter font-semibold">narration</span>
          <span className="capitalize text-sm font-inter font-medium text-gray-700">
            {values?.narration}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="capitalize text-sm font-inter font-semibold">category</span>
          <span className="capitalize text-sm font-inter font-medium text-gray-700">
            {values?.category}
          </span>
        </div>

        <hr className="block my-4 border-gray-400" />

        <div>
          <div className="rounded-3xl p-5 bg-gray-100">
            <div className="flex items-center justify-between mb-2 py-2 border-b-2 border-gray-500 border-dashed">
              <div className="inline-flex space-x-1">
                <span className="capitalize text-sm font-inter font-semibold">
                  available balance
                </span>
                <span className="capitalize text-sm font-inter font-medium text-gray-800">
                  (
                  {details?.from_account_details?.wallet?.balance
                    ? formatMoney(
                        details?.from_account_details?.wallet?.balance,
                        details?.from_account_details?.wallet?.currency === "USD" ? "USD" : "NGN",
                        details?.from_account_details?.wallet?.currency === "USD"
                          ? "en-US"
                          : "en-NG"
                      )
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
                        details?.from_account_details?.wallet?.balance,
                        details?.from_account_details?.wallet?.currency === "USD" ? "USD" : "NGN",
                        details?.from_account_details?.wallet?.currency === "USD"
                          ? "en-US"
                          : "en-NG"
                      )
                    : "N/A"}
                  )
                </span>
              </div>
              <span className="capitalize text-xs font-inter font-normal text-gray-700">
                -
                {formatMoney(
                  values?.amount,
                  details?.from_account_details?.wallet?.currency === "USD" ? "USD" : "NGN",
                  details?.from_account_details?.wallet?.currency === "USD" ? "en-US" : "en-NG"
                )}
              </span>
            </div>
            <div className="flex items-center justify-between my-3">
              <span className="capitalize text-xs font-inter font-normal">narration</span>
              <span className="capitalize text-xs font-inter font-normal text-gray-700">
                {values?.narration}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
