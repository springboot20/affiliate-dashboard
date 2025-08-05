import { CustomErrorMessage } from "@/components/Error";
import { SelectionComponent } from "@/components/selecltion/AccountSelection";
import { useValidateAccountNumber } from "@/hooks/useValidateAccountNumber";
import { AccountType } from "@/types/account";
import { classNames, formatMoney } from "@/utils";
import {
  CheckCircleIcon,
  CurrencyDollarIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ErrorMessage, Field, FormikProps } from "formik";
import React, { useState } from "react";

type InitialValues = {
  account?: string;
  bank?: string;
  beneficiary?: string;
  amount: number;
  narration: string;
  category: string;
  pin: string[];
};

export const SendMoneyDetailForm = ({
  formik,
  accounts,
  beneficiaryOptions = [], // Add beneficiary options prop
  isBeneficiaryLoading = false, // Add loading state prop
}: {
  formik: FormikProps<InitialValues>;
  accounts: any;
  beneficiaryOptions?: AccountType[]; // Optional beneficiary options
  isBeneficiaryLoading?: boolean; // Optional loading state
}) => {
  const { values, setFieldValue, errors, touched } = formik;

  const MAX_NARRATION_COUNT = 150;
  const [descriptionCount, setDescriptionCount] = useState(MAX_NARRATION_COUNT);

  const [selectedBeneficiary, setSelectedBeneficiary] = useState<AccountType>({} as AccountType);

  const [query, setQuery] = useState("");

  const {
    isValid: isAccountValid,
    isValidating: isValidatingAccount,
    message: validationMessage,
    validateAccountNumber,
    resetValidation,
  } = useValidateAccountNumber();

  // Handle beneficiary selection from SelectionComponent
  const handleBeneficiaryChange = (selectedAccount: AccountType) => {
    setSelectedBeneficiary(selectedAccount);
    setFieldValue("beneficiary", selectedAccount?._id);

    // Validate the selected account number
    if (selectedAccount.account_number) {
      setQuery(selectedAccount.account_number);
      validateAccountNumber(selectedAccount.account_number.toString());
    }
  };

  const handleSetQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, "");

    setQuery(value);

    // Validate as user types
    if (value.length >= 10) {
      validateAccountNumber(value);
    } else if (value.length === 0) {
      resetValidation();
    }
  };

  return (
    <div className="mt-4">
      <fieldset className="mb-3">
        <label htmlFor="account" className="text-sm capitalize mb-1.5 inline-block">
          choose account
        </label>
        <div className="relative flex items-center h-full">
          <select
            name="account"
            id="account"
            value={values.account}
            onChange={(event) => {
              const selected = accounts?.data?.docs?.find((doc: any) => {
                return doc._id === event.target.value;
              });

              setFieldValue("account", selected?._id);
            }}
            className={classNames(
              "w-full block focus:outline-none rounded px-3 py-2 appearance-none text-sm",
              touched.account && errors.account
                ? "border-red-500 border"
                : "border focus:ring-2 focus:ring-[#A1E96F]"
            )}
          >
            <option value="--select-an-account-">---select-an-account---</option>
            {React.Children.toArray(
              accounts?.data?.docs.length &&
                accounts?.data?.docs.map((doc: any) => {
                  return (
                    <option value={doc?._id}>
                      {doc?.type} Account -{" "}
                      {formatMoney(
                        doc?.wallet?.balance || 0,
                        doc?.wallet?.currency === "USD" ? "USD" : "NGN",
                        doc?.wallet?.currency === "USD" ? "en-US" : "en-NG"
                      )}
                    </option>
                  );
                })
            )}
          </select>
          <div className="pointer-events-none absolute right-0 pr-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293L9.293 11.293C9.683 11.683 10.317 11.683 10.707 11.293L14.707 7.293C15.098 6.902 14.855 6.268 14.293 6.268L5.707 6.268C5.145 6.268 4.902 6.902 5.293 7.293Z" />
            </svg>
          </div>
        </div>

        <ErrorMessage name="account">
          {(msg) => (
            <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
              {msg}
            </CustomErrorMessage>
          )}
        </ErrorMessage>
      </fieldset>

      <fieldset className="mb-3">
        <label htmlFor="bank" className="text-sm capitalize mb-1.5 inline-block">
          select bank
        </label>

        <div className="relative flex items-center h-full">
          <select
            name="bank"
            id="bank"
            value={values.bank}
            onChange={(event) => {
              setFieldValue("bank", event.target.value);
            }}
            className={classNames(
              "w-full block border rounded px-3 py-2 appearance-none text-sm focus:outline-none",
              errors.bank && touched.bank
                ? "border-red-500 focus:ring-1 focus:ring-red-500"
                : "border focus:ring-2 focus:ring-[#A1E96F]"
            )}
          >
            <option value="--select-an-bank-">---select-an-account---</option>
            <option value="UBA">UBA</option>
            <option value="ZENITH">Zenith</option>
          </select>

          <div className="pointer-events-none absolute right-0 pr-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293L9.293 11.293C9.683 11.683 10.317 11.683 10.707 11.293L14.707 7.293C15.098 6.902 14.855 6.268 14.293 6.268L5.707 6.268C5.145 6.268 4.902 6.902 5.293 7.293Z" />
            </svg>
          </div>
        </div>

        <ErrorMessage name="bank">
          {(msg) => (
            <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
              {msg}
            </CustomErrorMessage>
          )}
        </ErrorMessage>
      </fieldset>
      <fieldset className="mb-3">
        <label htmlFor="beneficiary" className="text-sm capitalize mb-1.5 inline-block">
          select beneficiary
        </label>
        <div className="relative w-full">
          <SelectionComponent
            options={beneficiaryOptions.filter((opt) => opt._id !== values.account)}
            isLoading={isBeneficiaryLoading}
            onChange={handleBeneficiaryChange}
            placeholder="Search for beneficiary..."
            selectedId={selectedBeneficiary?._id}
            selectedUser={selectedBeneficiary}
            query={query}
            handleSetQuery={handleSetQuery}
          />

          {/* Validation indicator */}
          <div className="absolute inset-y-0 right-2 flex items-center pr-3 pointer-events-none">
            {isValidatingAccount && (
              <div className="animate-spin h-4 w-4 border-2 border-[#A1E96F] border-t-transparent rounded-full"></div>
            )}
            {!isValidatingAccount && isAccountValid === true && values?.beneficiary && (
              <CheckCircleIcon className="h-5 w-5 text-[#A1E96F]" />
            )}
            {!isValidatingAccount && isAccountValid === false && values?.beneficiary && (
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            )}
          </div>
        </div>

        {/* Validation message */}
        {validationMessage && values?.beneficiary && (
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
        <label htmlFor="amount" className="text-sm capitalize mb-1.5 inline-block">
          amount
        </label>

        <div
          className={classNames(
            "flex w-full items-center bg-white rounded min-h-10 border",
            errors.amount && touched.amount
              ? "focus-within:ring-red-500 focus-within:ring-1 border-red-500 border"
              : "!border focus-within:ring-2 focus-within:ring-[#A1E96F]"
          )}
        >
          <span className="h-10 w-10 flex items-center justify-center border-r">
            <CurrencyDollarIcon className="h-5" />
          </span>
          <Field
            name="amount"
            className={classNames(
              "w-full flex-1 text-sm bg-transparent outline-none !h-full px-3 peer"
            )}
          />
        </div>

        <ErrorMessage name="amount">
          {(msg) => (
            <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
              {msg}
            </CustomErrorMessage>
          )}
        </ErrorMessage>
      </fieldset>

      <fieldset className="mb-3">
        <label htmlFor="narration" className="text-sm capitalize mb-1.5 inline-block">
          narration
        </label>
        <div>
          <Field
            as="textarea"
            name="narration"
            rows={Math.ceil(values.narration.length / 31)}
            className={classNames(
              "w-full block focus:outline-none rounded p-3 text-xs",
              errors.narration && touched.narration
                ? "border-red-500 focus:ring-red-500 focus:ring-1 border"
                : "!border focus:ring-2 focus:ring-[#A1E96F]"
            )}
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
        <label htmlFor="category" className="text-sm capitalize mb-1.5 inline-block">
          category
        </label>
        <div className="relative flex items-center h-full">
          <select
            name="category"
            id="category"
            onChange={(event) => {
              setFieldValue("category", event.target.value);
            }}
            className={classNames(
              "w-full block border focus:outline-none rounded px-3 py-2 appearance-none text-sm",
              touched.category && errors.category
                ? "border-red-500 border focus:ring-1 focus:ring-red-500"
                : "border focus:ring-2 focus:ring-[#A1E96F]"
            )}
          >
            <option value="--select-an-category-">choose category of transaction</option>
            <option value="school">School</option>
            <option value="shopping">Shopping</option>
          </select>
          <div className="pointer-events-none absolute right-0 pr-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293L9.293 11.293C9.683 11.683 10.317 11.683 10.707 11.293L14.707 7.293C15.098 6.902 14.855 6.268 14.293 6.268L5.707 6.268C5.145 6.268 4.902 6.902 5.293 7.293Z" />
            </svg>
          </div>
        </div>

        <ErrorMessage name="category">
          {(msg) => (
            <CustomErrorMessage className="text-sm mt-0.5 block text-red-600">
              {msg}
            </CustomErrorMessage>
          )}
        </ErrorMessage>
      </fieldset>
    </div>
  );
};
