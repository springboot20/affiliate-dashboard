import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { CustomErrorMessage } from "@/components/Error";
import { classNames, formatMoney } from "@/utils";
import React, { useEffect, useState } from "react";
import { useGetUserAccountsQuery } from "@/features/account/account.slice";
import { useValidateAccountNumber } from "@/hooks/useValidateAccountNumber";

type SendMoneyPanelComponentProps = {
  onClose: () => void;
  open: boolean;
};

type InitialValues = {
  account: string;
  bank: string;
  beneficiary: string;
  amount: string;
  narration: string;
  category: string;
};

export const SendMoneyPanelComponent = ({ open, onClose }: SendMoneyPanelComponentProps) => {
  const { data: accounts } = useGetUserAccountsQuery();
  const {
    isValid: isAccountValid,
    isValidating: isValidatingAccount,
    message: validationMessage,
    validateAccountNumber,
    resetValidation,
  } = useValidateAccountNumber();
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    if (accounts?.data && accounts?.data?.docs.length) {
      setAccount(accounts?.data?.docs[0]?._id);
    }
  }, [accounts?.data]);

  const initialValues: InitialValues = {
    account: account || "",
    bank: "",
    beneficiary: "",
    amount: "",
    narration: "",
    category: "",
  };

  const MAX_NARRATION_COUNT = 150;
  const [descriptionCount, setDescriptionCount] = useState(MAX_NARRATION_COUNT);

  // Reset validation when modal closes
  useEffect(() => {
    if (!open) {
      resetValidation();
    }
  }, [open, resetValidation]);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-40">
      <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0" />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700">
              <div className="flex h-full flex-col bg-white shadow-xl">
                <div className="flex-1 px-4 py-6 sm:px-6">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-lg font-medium text-[#281d1d] capitalize">
                      send money
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={() => onClose()}
                        className="h-10 w-10 z-20 flex items-center justify-center absolute right-4 top-4 rounded-full bg-gray-100"
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-5" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>

                  <Formik initialValues={initialValues} onSubmit={() => {}}>
                    {({ setFieldValue, values }) => {
                      return (
                        <Form className="mt-4">
                          <fieldset className="mb-3">
                            <label
                              htmlFor="account"
                              className="text-sm capitalize mb-1.5 inline-block"
                            >
                              choose account
                            </label>
                            <select
                              name="account"
                              id="account"
                              // value={values.account}
                              onChange={(event) => {
                                const selected = accounts?.data?.docs?.find((doc: any) => {
                                  return doc._id === event.target.value;
                                });

                                setFieldValue("account", selected?._id);
                              }}
                              className="w-full block border rounded px-3 py-2 appearance-none text-sm"
                            >
                              <option value="--select-an-account-">---select-an-account---</option>
                              {React.Children.toArray(
                                accounts?.data?.docs.length &&
                                  accounts?.data?.docs.map((doc: any) => {
                                    return (
                                      <option value={doc?._id}>
                                        {doc?.type} Account -{" "}
                                        {formatMoney(
                                          doc?.wallet?.balance,
                                          doc?.wallet?.currency === "USD" ? "USD" : "NGN",
                                          doc?.wallet?.currency === "USD" ? "en-US" : "en-NG"
                                        )}
                                      </option>
                                    );
                                  })
                              )}
                            </select>
                            <ErrorMessage name="account">
                              {(msg) => (
                                <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
                                  {msg}
                                </CustomErrorMessage>
                              )}
                            </ErrorMessage>
                          </fieldset>

                          <fieldset className="mb-3">
                            <label
                              htmlFor="bank"
                              className="text-sm capitalize mb-1.5 inline-block"
                            >
                              select bank
                            </label>
                            <select
                              name="bank"
                              id="bank"
                              className="w-full block border rounded px-3 py-2 appearance-none text-sm"
                            >
                              <option value="--select-an-bank-">---select-an-account---</option>
                            </select>
                            <ErrorMessage name="bank">
                              {(msg) => (
                                <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
                                  {msg}
                                </CustomErrorMessage>
                              )}
                            </ErrorMessage>
                          </fieldset>

                          <fieldset className="mb-3">
                            <label
                              htmlFor="beneficiary"
                              className="text-sm capitalize mb-1.5 inline-block"
                            >
                              beneficiary account number
                            </label>
                            <div className="relative">
                              <Field
                                name="beneficiary"
                                className={classNames(
                                  "w-full block border rounded px-3 py-2 text-sm",
                                  isAccountValid === true ? "border-green-500" : "",
                                  isAccountValid === false ? "border-red-500" : ""
                                )}
                                onChange={(event: any) => {
                                  const value = event.target.value.replace(/\D/g, ""); // Only allow digits
                                  setFieldValue("beneficiary", value);

                                  // Validate as user types
                                  if (value.length >= 10) {
                                    validateAccountNumber(value);
                                  } else if (value.length === 0) {
                                    resetValidation();
                                  }
                                }}
                                maxLength={10}
                              />
                              {/* Validation indicator */}
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                {isValidatingAccount && (
                                  <div className="animate-spin h-4 w-4 border-2 border-[#A1E96F] border-t-transparent rounded-full"></div>
                                )}
                                {!isValidatingAccount && isAccountValid === true && (
                                  <CheckCircleIcon className="h-5 w-5 text-[#A1E96F]" />
                                )}
                                {!isValidatingAccount &&
                                  isAccountValid === false &&
                                  values.beneficiary.length >= 10 && (
                                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                                  )}
                              </div>
                            </div>
                            {/* Validation message */}
                            {validationMessage && (
                              <div
                                className={classNames(
                                  "text-sm mt-0.5 block",
                                  isAccountValid === true ? "text-[#A1E96F]" : "text-red-600"
                                )}
                              >
                                {validationMessage}
                              </div>
                            )}
                            <ErrorMessage name="beneficiary">
                              {(msg) => (
                                <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
                                  {msg}
                                </CustomErrorMessage>
                              )}
                            </ErrorMessage>
                          </fieldset>

                          <fieldset className="mb-3">
                            <label
                              htmlFor="amount"
                              className="text-sm capitalize mb-1.5 inline-block"
                            >
                              amount
                            </label>
                            <Field
                              name="amount"
                              className="w-full block border rounded px-3 py-2 text-sm"
                            />

                            <ErrorMessage name="amount">
                              {(msg) => (
                                <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
                                  {msg}
                                </CustomErrorMessage>
                              )}
                            </ErrorMessage>
                          </fieldset>

                          <fieldset className="mb-3">
                            <label
                              htmlFor="narration"
                              className="text-sm capitalize mb-1.5 inline-block"
                            >
                              narration
                            </label>
                            <div>
                              <Field
                                as="textarea"
                                name="narration"
                                rows={Math.ceil(values.narration.length / 31)}
                                className="w-full block border rounded p-3 text-xs"
                                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                                  const value = event.target.value;

                                  if (value.length <= MAX_NARRATION_COUNT) {
                                    setFieldValue("narration", value);
                                    setDescriptionCount(MAX_NARRATION_COUNT - value.length);
                                  } else {
                                    setFieldValue("narration", value.slice(0, MAX_NARRATION_COUNT));
                                    setDescriptionCount(0);
                                  }
                                }}
                              />
                              <span
                                className={classNames(
                                  "text-right block text-sm font-normal",
                                  descriptionCount === 0 ? "text-red-500" : ""
                                )}
                              >
                                ({descriptionCount} characters remaining)
                              </span>
                            </div>

                            <ErrorMessage name="narration">
                              {(msg) => (
                                <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
                                  {msg}
                                </CustomErrorMessage>
                              )}
                            </ErrorMessage>
                          </fieldset>

                          <fieldset className="mb-3">
                            <label
                              htmlFor="category"
                              className="text-sm capitalize mb-1.5 inline-block"
                            >
                              category
                            </label>

                            <select
                              name="category"
                              id="category"
                              className="w-full block border rounded px-3 py-2 appearance-none text-sm"
                            >
                              <option value="--select-an-account-">
                                choose category of transaction
                              </option>
                            </select>

                            <ErrorMessage name="account">
                              {(msg) => (
                                <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
                                  {msg}
                                </CustomErrorMessage>
                              )}
                            </ErrorMessage>
                          </fieldset>

                          <button
                            type="submit"
                            title="next"
                            className={classNames(
                              "capitalize font-medium text-sm w-full px-2 py-2.5 rounded mt-10 text-center bg-[#A1E96F] text-[#152F00]",
                              "flex items-center justify-center"
                            )}
                          >
                            next
                          </button>
                        </Form>
                      );
                    }}
                  </Formik>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
