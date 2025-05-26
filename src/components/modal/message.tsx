import { useSocket } from "@/context/SocketContext";
import { classNames } from "@/utils";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Transition,
  TransitionChild,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FormikHelpers, useFormik } from "formik";
import React, { Fragment, useEffect, useState } from "react";
import * as yup from "yup";
import { CustomErrorMessage } from "../Error";
import {
  useGetUserPendingRequesMessageQuery,
  useSendRequesMessageMutation,
} from "@/features/messaging/message.slice";
import { toast } from "react-toastify";

type SendMessageModalProps = {
  open: boolean;
  close: () => void;
};

type InitialValues = {
  action: "CLOSE_ACCOUNT" | "SUSPEND_ACCOUNT" | "UNSUSPEND_ACCOUNT" | "UNCLOSE_ACCOUNT" | "NONE";
  message: string;
};

export const SendMessageModal: React.FC<SendMessageModalProps> = ({ open, close }) => {
  const [pendingRequests, setPendingRequests] = useState<number>(0);

  const { socket, connected } = useSocket();
  const { data, refetch } = useGetUserPendingRequesMessageQuery(undefined, {
    skip: !open,
  });

  const [sendRequestMessage] = useSendRequesMessageMutation();

  const handleSendRequesMessage = async (
    values: InitialValues,
    { resetForm }: FormikHelpers<InitialValues>
  ) => {
    if (!socket || !connected) return;

    if (pendingRequests >= 3) {
      toast(
        "You have reached the maximum number of pending requests (3). Please wait for them to be reviewed.",
        {
          type: "warning",
        }
      );
      return;
    }

    try {
      const response = await sendRequestMessage({ ...values }).unwrap();

      const { data, message } = response;

      console.log(data);
      resetForm();
      refetch();
      setPendingRequests((prev) => prev + 1);
      toast(message, { type: "success", className: "text-xs" });

      setTimeout(() => {
        close();
      }, 3000);
    } catch (error: any) {
      const message = error?.data?.message;

      toast(message, { type: "error", className: "text-xs" });
    }
  };

  useEffect(() => {
    if (!connected) return;

    if (socket && open && data) {
      const _pendingRequests = data?.data?.pendingRequests;
      setPendingRequests(_pendingRequests);
      refetch();
    }
  }, [socket, open, data]);

  console.log(pendingRequests);

  const {
    values,
    setFieldValue,
    handleBlur,
    handleChange,
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    isValid,
  } = useFormik<InitialValues>({
    initialValues: {
      action: "NONE",
      message: "",
    },
    onSubmit: handleSendRequesMessage,
    validationSchema: yup.object({
      action: yup
        .string()
        .oneOf(["CLOSE_ACCOUNT", "SUSPEND_ACCOUNT", "UNSUSPEND_ACCOUNT", "UNCLOSE_ACCOUNT"])
        .required("Please choose an action"),
      message: yup
        .string()
        .min(10, "Message must be at least 10 characters")
        .max(500, "Message cannot exceed 500 characters")
        .required("Message is required"),
    }),
  });

  const actionLabels = {
    CLOSE_ACCOUNT: "Close Account",
    UNCLOSE_ACCOUNT: "Reopen Account",
    SUSPEND_ACCOUNT: "Suspend Account",
    UNSUSPEND_ACCOUNT: "Unsuspend Account",
  };

  const actionDescriptions = {
    CLOSE_ACCOUNT: "Permanently close your account and delete all data",
    UNCLOSE_ACCOUNT: "Reactivate a previously closed account",
    SUSPEND_ACCOUNT: "Temporarily suspend account access",
    UNSUSPEND_ACCOUNT: "Restore access to a suspended account",
  };

  const getPriority = (action: string) => {
    if (action.startsWith("UN")) {
      return { color: "green", urgent: false };
    }
    return { color: "red", urgent: true };
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog open={open} onClose={close} className="relative z-30">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0" />
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
                <DialogPanel className="p-4 bg-white rounded-md max-w-md w-full relative">
                  <button
                    type="button"
                    onClick={() => close()}
                    className="h-10 w-10 z-20 flex items-center justify rounded-full absolute top-0 right-0"
                  >
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon className="h-5" strokeWidth={2.5} />
                  </button>

                  <div className="mb-6">
                    <DialogTitle as="h1" className="text-xl font-bold text-gray-900 mb-2">
                      Submit Account Request
                    </DialogTitle>
                    <p className="text-sm text-gray-600">
                      Request account changes that require admin approval.
                      {pendingRequests > 0 && (
                        <span className="text-amber-600 font-medium">
                          You have{" "}
                          <span className="bg-amber-500 text-white rounded-full size-6  text-xs inline-flex items-center justify-center">
                            {pendingRequests}
                            {pendingRequests > 1 ? "s" : ""}
                          </span>{" "}
                          pending request{pendingRequests > 1 ? "s" : ""}.
                        </span>
                      )}
                    </p>
                  </div>

                  <form className="mt-5" onSubmit={handleSubmit}>
                    <fieldset className="mb-2">
                      <label
                        htmlFor="action"
                        className="text-sm font-medium mb-2 inline-block text-gray-700"
                      >
                        Request action
                      </label>
                      <select
                        name="action"
                        id="action"
                        value={values.action}
                        onBlur={handleBlur}
                        onChange={(event) => {
                          setFieldValue("action", event.target.value);
                        }}
                        className={classNames(
                          "w-full focus:outline-none appearance-none px-3 py-2.5 rounded-md block text-sm",
                          // "w-full block focus:outline-none rounded px-3 py-2 appearance-none text-sm",
                          touched.action && errors.action
                            ? "border-red-500 border focus:ring-red-500 focus:ring-1"
                            : "border focus:ring-2 focus:ring-[#A1E96F]"
                        )}
                      >
                        <option value="NONE">---select-request-action---</option>
                        {React.Children.toArray(
                          Object.entries(actionLabels).map(([value, label]) => (
                            <option value={value}>{label}</option>
                          ))
                        )}
                      </select>

                      {values.action !== "NONE" && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <span
                              className={classNames(
                                getPriority(values.action).color === "green"
                                  ? "bg-green-500"
                                  : "bg-red-500",
                                "px-2 py-1 !font-medium !text-xs w-max !text-white rounded-full"
                              )}
                            >
                              {actionLabels[values.action]}
                            </span>

                            {getPriority(values.action).urgent && (
                              <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full font-medium ml-1.5">
                                high priority
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-normal mt-1 text-gray-600">
                            {actionDescriptions[values.action]}
                          </p>
                        </div>
                      )}

                      {errors.action && touched.action && (
                        <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
                          {errors.action}
                        </CustomErrorMessage>
                      )}
                    </fieldset>

                    <fieldset>
                      <label
                        htmlFor="message"
                        className="text-sm font-medium mb-2 inline-block text-gray-700"
                      >
                        Request Details{" "}
                        <span className="text-gray-500 font-normal ml-2">
                          ({values.message.length}/500)
                        </span>
                      </label>
                      <textarea
                        name="message"
                        id="message"
                        value={values.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={classNames(
                          "w-full outline-none appearance-none p-3 rounded-md block text-sm",
                          touched.message && errors.message
                            ? "border-red-500 border focus:ring-red-500 focus:ring-1"
                            : "border focus:ring-2 focus:ring-[#A1E96F]"
                        )}
                        rows={4}
                      ></textarea>

                      {errors.message && touched.message && (
                        <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
                          {errors.message}
                        </CustomErrorMessage>
                      )}
                    </fieldset>

                    <div className="flex items-center gap-4">
                      <button
                        title="send message"
                        type="button"
                        className="mt-3 px-2 py-2.5 text-white rounded-md text-sm bg-red-500 text-center w-full capitalize"
                        onClick={() => {
                          close();
                        }}
                      >
                        cancel
                      </button>
                      <button
                        title="send message"
                        type="submit"
                        disabled={isSubmitting || !isValid || pendingRequests >= 3}
                        className="mt-3 px-2 py-2.5 rounded-md text-sm bg-[#A1E96F] text-center w-full capitalize text-[#152F00]"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Submitting...
                          </span>
                        ) : (
                          "Submit Request"
                        )}
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
