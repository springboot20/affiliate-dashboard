import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Form, Formik, ErrorMessage, Field } from "formik";
import { CustomErrorMessage } from "@/components/Error";
import { classNames, formatMoney } from "@/utils";
import React, { useEffect, useState } from "react";
import { useGetUserAccountsQuery } from "@/features/account/account.slice";

type AddMoneyPanelComponentProps = {
  onClose: () => void;
  open: boolean;
};

type InitialValues = {
  from_account: string;
  to_account: string;
  amount: string;
  narration: string;
  category: string;
};

export const AddMoneyPanelComponent = ({ open, onClose }: AddMoneyPanelComponentProps) => {
  const { data: accounts } = useGetUserAccountsQuery();
  const [fromAccount, setFromAccount] = useState<string | null>(null);
  const [toAccount, setToAccount] = useState<string | null>(null);

  const initialValues: InitialValues = {
    from_account: fromAccount || "",
    to_account: toAccount || "",
    amount: "",
    narration: "",
    category: "",
  };

  const MAX_NARRATION_COUNT = 150;
  const [descriptionCount, setDescriptionCount] = useState(MAX_NARRATION_COUNT);

  useEffect(() => {
    if (accounts?.data && accounts?.data?.docs.length) {
      setFromAccount(accounts?.data?.docs[0]?._id);
      setToAccount(accounts?.data?.docs[2]?._id);
    }
  }, [accounts?.data]);

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
                    <DialogTitle className="text-lg font-medium text-[#222222] capitalize">
                      add money
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
                              htmlFor="from_account"
                              className="text-sm capitalize mb-1.5 inline-block"
                            >
                              from account
                            </label>
                            <select
                              name="from_account"
                              id="from_account"
                              className="w-full block border rounded px-3 py-2 appearance-none text-sm"
                              onChange={(event) => {
                                const selected = accounts?.data?.docs?.find((doc: any) => {
                                  return doc._id === event.target.value;
                                });

                                setFieldValue("from_account", selected?._id);
                              }}
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
                            <ErrorMessage name="from_account">
                              {(msg) => (
                                <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
                                  {msg}
                                </CustomErrorMessage>
                              )}
                            </ErrorMessage>
                          </fieldset>

                          <fieldset className="mb-3">
                            <label
                              htmlFor="to_account"
                              className="text-sm capitalize mb-1.5 inline-block"
                            >
                              to
                            </label>
                            <select
                              name="to_account"
                              id="to_account"
                              className="w-full block border rounded px-3 py-2 appearance-none text-sm"
                              onChange={(event) => {
                                const selected = accounts?.data?.docs?.find((doc: any) => {
                                  return doc._id === event.target.value;
                                });

                                setFieldValue("to_account", selected?._id);
                              }}
                            >
                              <option value="--select-an-bank-">---select-an-account---</option>
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
                            <ErrorMessage name="to_account">
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
                                row={6}
                                className="w-full block border rounded p-3"
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
                                disabled={
                                  descriptionCount === 0 &&
                                  values.narration.length === MAX_NARRATION_COUNT
                                }
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
                            type="button"
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
