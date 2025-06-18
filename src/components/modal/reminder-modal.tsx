import {
  useGetAccountByNumberQuery,
  useGetAccountDetailsQuery,
} from "@/features/account/account.slice";
import { formatMoney } from "@/utils";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect, useState } from "react";
import { UserIcon } from "../icons/Icons";

type TransactionDetailReminderModalProps = {
  open: boolean;
  close: () => void;
  values: any;
  setTab: (tab: string) => void;
  setStep: (step: number) => void;
};

export const TransactionDetailReminderModalComponent: React.FC<
  TransactionDetailReminderModalProps
> = ({ open, values, close, setTab, setStep }) => {
  console.log(values);

  const [details, setDetails] = useState<Record<string, any>>({});

  const { data: to_account_details_id, isLoading: isLoadingToWithId } = useGetAccountDetailsQuery(
    { accountId: values?.to_account! },
    { skip: !values?.to_account }
  );

  const { data: to_account_details, isLoading: isLoadingTo } = useGetAccountByNumberQuery(
    { account_number: values?.beneficiary! },
    { skip: !values?.beneficiary }
  );

  useEffect(() => {
    const newDetails: Record<string, any> = {};

    // Set to account details (prioritize ID-based fetch over number-based)
    if (to_account_details_id?.data) {
      newDetails.to_account_details_id = to_account_details_id.data;
      newDetails.to_account_details = to_account_details_id.data; // Use this as primary
    } else if (to_account_details?.data) {
      newDetails.to_account_details = to_account_details.data;
    }

    setDetails(newDetails);
  }, [to_account_details?.data, to_account_details_id?.data]);

  console.log(details);

  const recipientDetails = details.to_account_details_id || details.to_account_details;

  return (
    <Transition show={open} as={Fragment}>
      <Dialog open={open} onClose={close} className="relative z-40">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out values-[closed]:opacity-0" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="flex h-screen items-center justify-center">
                <DialogPanel className="p-4 bg-white rounded-md max-w-md w-full relative min-h-44">
                  <div className="max-w-full h-full">
                    <div className="flex h-7 items-center justify-end">
                      <button
                        type="button"
                        onClick={() => close()}
                        className="h-10 w-10 z-20 flex items-center justify-center rounded-full"
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-5" strokeWidth={2.5} />
                      </button>
                    </div>

                    <div className="flex flex-col">
                      <h3 className="text-center text-lg font-medium text-gray-800">Reminder</h3>
                      <p className="my-4 font-normal text-gray-700 text-center">
                        Double check the transfer details before you proceed. Please note that
                        successful transafers cannot be reversed
                      </p>

                      {isLoadingToWithId || isLoadingTo ? (
                        <p>loading...</p>
                      ) : (
                        <div className="rounded-xl p-3 bg-gray-100">
                          <h4 className="text-lg font-inter font-medium">Transaction Details</h4>

                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="capitalize text-sm font-inter font-medium">
                                account number
                              </span>
                              <span className="capitalize text-sm font-inter font-normal text-gray-700">
                                {recipientDetails?.account_number || "N/A"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mb-2">
                              <span className="capitalize text-sm font-inter font-medium">
                                name
                              </span>
                              {(() => {
                                const firstname =
                                  recipientDetails?.profile?.firstname ||
                                  recipientDetails?.user?.firstname;
                                const lastname =
                                  recipientDetails?.profile?.lastname ||
                                  recipientDetails?.user?.lastname;
                                const avatarUrl = recipientDetails?.user?.avatar?.url;

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

                                    <span className="capitalize text-sm font-inter font-normal text-gray-700">
                                      {firstname && lastname ? `${firstname} ${lastname}` : "N/A"}
                                    </span>
                                  </div>
                                );
                              })()}
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="capitalize text-sm font-inter font-medium">
                                amount
                              </span>
                              <span className="capitalize text-sm font-inter font-normal text-gray-700">
                                {formatMoney(values?.amount, "NGN", "en-NG")}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <button
                        type="button"
                        title="recheck details"
                        className="rounded-3xl capitalize font-medium text-sm px-2 py-2.5 ring-1 ring-[#A1E96F] w-full"
                        onClick={() => {
                          close();
                          setStep(1);
                          setTab("confirmation-details");
                        }}
                      >
                        recheck
                      </button>
                      <button
                        type="button"
                        title="continue to pay"
                        className="rounded-3xl capitalize font-medium text-sm px-2 py-2.5 w-full bg-[#A1E96F] text-[#152F00]"
                        onClick={() => {
                          close();
                          setStep(2);
                          setTab("transaction-pin");
                        }}
                      >
                        continue
                      </button>
                    </div>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
