import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Form, Formik, FormikHelpers } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useGetUserAccountsQuery } from "@/features/account/account.slice";
import { useValidateAccountNumber } from "@/hooks/useValidateAccountNumber";
import {
  useGetAllAccountsQuery,
  useSendTransactionMutation,
} from "@/features/transactions/transaction.slice";
import * as yup from "yup";
import { classNames } from "@/utils";
import { useNavigate } from "react-router-dom";
import { SendMoneyDetailForm } from "./components/send-money-detail-form";
import { PinPadFormComponent } from "./components/pinpad-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useValidateTransactionPin } from "@/hooks/useValidateTransactionPin";
import { ConfirmationDetails } from "./components/confirmation-detail";
import { TransactionDetailReminderModalComponent } from "../modal/reminder-modal";
import { TransactionConfirmed } from "./components/transaction-confirmed";

type SendMoneyPanelComponentProps = {
  onClose: () => void;
  refetch: () => any;
  open: boolean;
};

type InitialValues = {
  account?: string;
  bank?: string;
  beneficiary?: string;
  amount: number;
  narration: string;
  category: string;
  pin: string[];
};

interface TransactionSubDetail {
  gateway: string;
  receiverAccountNumber: string;
  senderAccountNumber: string;
  _id: string;
}

interface TransactionDetail {
  authorizationUrl: string;
  transaction: {
    amount: number;
    currency: string;
    description: string;
    reference: string;
    status: string;
    type: string;
    detail: TransactionSubDetail;
    createdAt: string;
  };
}

type InitialFilterState = Record<string, any>;

export const SendMoneyPanelComponent = ({
  open,
  onClose,
  refetch,
}: SendMoneyPanelComponentProps) => {
  const navigate = useNavigate();
  const { data: accounts } = useGetUserAccountsQuery();
  const [sendTransaction, { isLoading: sendingTransaction }] = useSendTransactionMutation();

  const TRANSACTION_LIMIT = 20;

  const [page] = useState(1);

  const [initialFilterState, setInitialFilterState] = useState<InitialFilterState>({
    limit: TRANSACTION_LIMIT,
    page,
  });

  const { data, isLoading } = useGetAllAccountsQuery(initialFilterState);

  const all_accounts = data?.data?.docs as never[];

  const [openReminder, setOpenReminder] = useState(false);
  const [transactionDetails, setTransactionsDetails] = useState<TransactionDetail | null>(null);

  const initialValues: InitialValues = {
    account: "",
    bank: "",
    beneficiary: "",
    amount: 0,
    narration: "",
    category: "",
    pin: Array(4).fill(""),
  };

  const variants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  };

  const { resetValidation } = useValidateAccountNumber();
  const { resetValidation: resetTransactionPinValidation } = useValidateTransactionPin();

  // Reset validation when modal closes
  useEffect(() => {
    if (!open) {
      resetValidation();
      resetTransactionPinValidation();
    }
  }, [open, resetValidation, resetTransactionPinValidation]);

  const MAX_NARRATION_COUNT = 150;

  const getInitialStepFromUrl = (): number => {
    const urlParams = new URLSearchParams(location.search);
    const stepParam = urlParams.get("step");
    // Convert to number, validate between 1-3, default to 1 if invalid
    const step = parseInt(stepParam || "1", 10);
    return isNaN(step) || step < 1 || step > 3 ? 0 : step - 1; // Convert to 0-based index
  };

  const getInitialTabFromUrl = (): string => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get("tab");
    // Validate tab value, default to "address" if invalid
    return ["transaction-details", "confirmation-details", "transaction-pin"].includes(
      tabParam || ""
    )
      ? tabParam!
      : "transaction-details";
  };

  const [step, setStep] = useState(getInitialStepFromUrl() || 0);
  const [tab, setTab] = useState(getInitialTabFromUrl() || "transaction-details");

  // Helper function to update URL
  const updateUrl = useCallback(
    (stepValue: number, tabValue: string): void => {
      // Convert from 0-based index to 1-based for URL
      const stepForUrl = Math.min(Math.max(1, stepValue + 1), 3);
      navigate(`/app/overview/?step=${stepForUrl}&tab=${tabValue}`, { replace: true });
    },
    [navigate]
  );

  // Update URL when step or tabView changes - with extra safety checks
  useEffect(() => {
    if (open) {
      updateUrl(step, tab);
    }
  }, [step, tab, updateUrl, open]);

  useEffect(() => {
    setInitialFilterState((prev) => ({
      ...prev,
      page,
    }));
  }, [page]);

  const handleSendTransaction = async (
    values: InitialValues,
    { resetForm }: FormikHelpers<InitialValues>
  ) => {
    try {
      const response = await sendTransaction({
        amount: values?.amount,
        description: values?.narration,
        to_account: values?.beneficiary,
        from_account: values?.account,
      }).unwrap();

      const { message } = response;
      toast.success(message, { className: "text-xs" });

      console.log("Transaction successful:", response);

      setTransactionsDetails(response.data);

      refetch();
      resetForm();
    } catch (error: any) {
      const message = error?.data?.message;
      toast.error(message, { className: "text-xs" });

      setTimeout(() => {
        setStep((prev) => prev - 1);
        setTab("transaction-pin");
        refetch();
      }, 1000);
    }
  };

  const handleClose = () => {
    onClose();
    setStep(0);
    setTab("transaction-details");
    navigate("/app/transactions");
    setTransactionsDetails(null);
    setOpenReminder(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          onClose();
          setTab("transaction-details");
          navigate("/app/overview");
          setTransactionsDetails(null);
          setOpenReminder(false);
          setStep(0);
        }}
        className="relative z-40"
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <DialogPanel className="pointer-events-auto w-screen max-w-md transform overflow-x-hidden transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700">
                <div className="flex h-full flex-col bg-white shadow-xl overflow-y-auto">
                  <div className="flex-1 px-4 py-6 sm:px-6">
                    <div className="flex items-center justify-between">
                      <DialogTitle className="text-lg font-medium text-[#281d1d] capitalize">
                        send money
                      </DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            setStep(0);
                            setTab("transaction-details");
                            navigate("/app/overview");
                          }}
                          className="h-10 w-10 z-20 flex items-center justify-center absolute right-4 top-4 rounded-full bg-gray-100"
                        >
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="h-5" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                    {transactionDetails !== null ? (
                      <TransactionConfirmed {...transactionDetails} handleClose={handleClose} />
                    ) : (
                      <Formik
                        initialValues={initialValues}
                        onSubmit={handleSendTransaction}
                        validationSchema={yup.object({
                          account: yup.string().required("Account is required"),
                          bank: yup.string().required("Bank is required"),
                          beneficiary: yup.string().required("Beneficiary is required"),
                          amount: yup
                            .number()
                            .positive("Amount must be a positive number")
                            .required("Amount is required"),
                          narration: yup
                            .string()
                            .max(
                              MAX_NARRATION_COUNT,
                              `Description cannot exceed ${MAX_NARRATION_COUNT} characters`
                            )
                            .required("Description is required"),
                          category: yup.string().required("Category is required"),
                          pin: yup
                            .array()
                            .of(yup.string().required())
                            .test("pin-complete", "PIN must be 4 digits", function (value) {
                              if (!value) return false;
                              // Check if all 4 PIN fields are filled and contain only digits
                              return (
                                value.length === 4 &&
                                value.every((digit) => digit && /^\d$/.test(digit))
                              );
                            })
                            .required("PIN is required"),
                        })}
                      >
                        {(formik) => {
                          const buttonType = step === 0 || step === 1 ? "button" : "submit";
                          const buttonText =
                            step === 0 ? "next" : step === 1 ? "continue" : "send money";

                          const handleButtonClick = async (
                            event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                          ) => {
                            event.preventDefault();
                            if (step === 0) {
                              const errors = await formik.validateForm();

                              formik.setTouched({
                                account: true,
                                bank: true,
                                beneficiary: true,
                                amount: true,
                                narration: true,
                                category: true,
                              });

                              const step0Fields = [
                                "account",
                                "bank",
                                "beneficiary",
                                "amount",
                                "narration",
                                "category",
                              ];
                              const step0Errors = Object.keys(errors).filter((key) =>
                                step0Fields.includes(key)
                              );

                              if (step0Errors.length === 0) {
                                setStep(1);
                                setTab("confirmation-details");
                              } else {
                                toast("Input fields cannot be empty.", { type: "error" });
                                formik.setErrors(errors);
                              }
                            } else if (step === 1) {
                              setOpenReminder(true);
                            } else {
                              const errors = await formik.validateForm();
                              formik.setTouched({
                                ...formik.touched,
                                pin: true,
                              });

                              if (Object.keys(errors).length === 0) {
                                formik.handleSubmit();
                                onClose();
                              } else {
                                toast("Please enter a valid 4-digit PIN.", { type: "error" });
                                formik.setErrors(errors);
                              }
                            }
                          };

                          const handleBackButtonClick = (
                            event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                          ) => {
                            event.preventDefault();
                            if (step === 1) {
                              setStep(0);
                              setTab("transaction-details");
                            } else if (step === 2) {
                              setStep(1);
                              setTab("confirmation-details");
                            } else {
                              onClose();
                              navigate("/app/overview");
                            }
                          };
                          return (
                            <>
                              <TransactionDetailReminderModalComponent
                                open={openReminder}
                                close={() => {
                                  setOpenReminder(false);
                                }}
                                setStep={setStep}
                                setTab={setTab}
                                values={formik.values}
                              />

                              <Form>
                                <motion.div
                                  key={step}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  variants={variants}
                                  transition={{ duration: 0.5 }}
                                  className="w-full"
                                >
                                  {step === 0 ? (
                                    <SendMoneyDetailForm
                                      beneficiaryOptions={all_accounts}
                                      isBeneficiaryLoading={isLoading}
                                      formik={formik}
                                      accounts={accounts}
                                    />
                                  ) : step === 2 ? (
                                    <PinPadFormComponent formik={formik} />
                                  ) : null}
                                </motion.div>

                                {step === 1 && (
                                  <motion.div
                                    initial={{
                                      opacity: 0,
                                      y: 200,
                                    }}
                                    animate={{
                                      opacity: 1,
                                      y: 10,
                                    }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full"
                                  >
                                    <ConfirmationDetails values={formik.values} />
                                  </motion.div>
                                )}

                                <div className="mt-6 flex items-center space-x-3">
                                  <button
                                    type="button"
                                    onClick={handleBackButtonClick}
                                    className="text-sm font-medium text-[#A1E96F] capitalize shrink-0 w-auto flex-grow px-2 py-2.5 rounded text-center bg-[#F7F7F7] border border-[#A1E96F] hover:bg-[#A1E96F] hover:text-white"
                                  >
                                    {step === 0 ? "cancel" : "back"}
                                  </button>
                                  <button
                                    type={buttonType}
                                    title={buttonType}
                                    onClick={
                                      buttonType === "button" ? handleButtonClick : undefined
                                    }
                                    disabled={formik.isSubmitting || sendingTransaction}
                                    className={classNames(
                                      "capitalize font-medium text-sm w-auto flex-grow px-2 py-2.5 rounded text-center bg-[#A1E96F] text-[#152F00]",
                                      "flex items-center justify-center"
                                    )}
                                  >
                                    {formik.isSubmitting || sendingTransaction ? (
                                      <div
                                        className={classNames(
                                          "p-2 rounded-3xl bg-secondary w-fit inline-flex gap-1.5 bg-black/30"
                                        )}
                                      >
                                        <span className="animation1 mx-[0.5px] h-1 w-1 bg-white rounded-full"></span>
                                        <span className="animation2 mx-[0.5px] h-1 w-1 bg-white rounded-full"></span>
                                        <span className="animation3 mx-[0.5px] h-1 w-1 bg-white rounded-full"></span>
                                      </div>
                                    ) : (
                                      <span className="text-white text-sm font-medium uppercase tracking-wider">
                                        {buttonText}
                                      </span>
                                    )}
                                  </button>
                                </div>
                              </Form>
                            </>
                          );
                        }}
                      </Formik>
                    )}
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};
