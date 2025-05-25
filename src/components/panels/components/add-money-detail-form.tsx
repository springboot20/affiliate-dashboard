import { CustomErrorMessage } from "@/components/Error";
import { classNames, formatMoney } from "@/utils";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { ErrorMessage, Field, FormikProps } from "formik";
import React, { useState } from "react";

type InitialValues = {
  from_account?: string;
  to_account?: string;
  amount: number;
  narration: string;
  category: string;
  pin: string[];
};

export const AddMoneyDetailForm = ({
  formik,
  accounts,
}: {
  formik: FormikProps<InitialValues>;
  accounts: any;
}) => {
  const { values, setFieldValue, errors, touched } = formik;

  const MAX_NARRATION_COUNT = 150;
  const [descriptionCount, setDescriptionCount] = useState(MAX_NARRATION_COUNT);

  return (
    <div className="mt-4">
      <fieldset className="mb-3">
        <label htmlFor="from_account" className="text-sm capitalize mb-1.5 inline-block">
          from account
        </label>
        <select
          name="from_account"
          id="from_account"
          className={classNames(
            "w-full block focus:outline-none rounded px-3 py-2 appearance-none text-sm",
            touched.from_account && errors.from_account
              ? "border-red-500 border"
              : "border focus:ring-2 focus:ring-[#A1E96F]"
          )}
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
        <label htmlFor="to_account" className="text-sm capitalize mb-1.5 inline-block">
          to
        </label>
        <select
          name="to_account"
          id="to_account"
          className={classNames(
            "w-full block focus:outline-none rounded px-3 py-2 appearance-none text-sm",
            touched.to_account && errors.to_account
              ? "border-red-500 border"
              : "border focus:ring-2 focus:ring-[#A1E96F]"
          )}
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
