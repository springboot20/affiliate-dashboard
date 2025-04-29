import { useAppDispatch } from "@/app/hook";
import { useGetUserAccountsQuery } from "@/features/account/account.slice";
import { CardApiSlice, useCreateNewCardMutation } from "@/features/cards/card.slice";
import { classNames } from "@/utils";
import { Field, Form, Formik, FormikErrors } from "formik";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

interface InitialValues {
  card_number: string;
  card_name: string;
  valid_thru: string;
  type: string;
  primary_account: string;
  cvv: string;
}

export const CardForm = () => {
  const [generatingCardDetails, setGeneratingCardDetails] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [formKey, setFormKey] = useState(0);
  const [cardNumberDetails, setCardNumberDetails] = useState<any>(null);
  const [createNewCard] = useCreateNewCardMutation();
  const { data } = useGetUserAccountsQuery();

  const userAccounts = useMemo(() => data?.data?.accounts, [data]);

  const cardTypes = [
    {
      type: "MASTER DEBIT",
      value: "MASTER DEBIT",
    },
    {
      type: "MASTER CREDIT",
      value: "MASTER CREDIT",
    },
    {
      type: "VERVE DEBIT",
      value: "VERVE DEBIT",
    },
    {
      type: "VERVE CREDIT",
      value: "VERVE CREDIT",
    },
  ];

  const handleGenerateCardNumberDetails = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setGeneratingCardDetails(true);

    try {
      const api = dispatch(CardApiSlice.endpoints.generateCardNumberDetails.initiate());
      const response = (await api).data;
      setFormKey((prev) => prev + 1);

      if (response?.success) {
        setTimeout(() => {
          setCardNumberDetails(response?.data);
          setGeneratingCardDetails(false);
        }, 2000);
      }
    } catch (error: any) {
      setGeneratingCardDetails(false);
    }
  };
  // Improved card number formatting function
  const formatCardNumber = (cardNumber?: string): string => {
    if (!cardNumber) return "";

    // Remove any non-digit characters
    const digitsOnly = cardNumber.replace(/\D/g, "");

    // Limit to maximum 16 digits
    const limitedDigits = digitsOnly.slice(0, cardNumber.length);

    // Format with spaces after every 4 digits
    const parts = [];
    for (let i = 0; i < limitedDigits.length; i += 4) {
      parts.push(limitedDigits.substring(i, i + 4));
    }

    return parts.join(" ");
  };

  // Improved expiry date formatting function
  const formatCardExpiry = (expiry?: string): string => {
    if (!expiry) return "";

    // Remove any non-digit characters
    const digitsOnly = expiry.replace(/\D/g, "");

    // Limit to maximum 4 digits
    const limitedDigits = digitsOnly.slice(0, 4);

    // Add / after the first 2 digits if there are more than 2 digits
    if (limitedDigits.length > 2) {
      return `${limitedDigits.slice(0, 2)}/${limitedDigits.slice(2)}`;
    }

    return limitedDigits;
  };

  const handleCardNumberFormat = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean
    ) => Promise<void | FormikErrors<InitialValues>>
  ) => {
    setFieldValue("card_number", formatCardNumber(event.target.value));
  };

  const initialValues: InitialValues = {
    card_number: formatCardNumber(cardNumberDetails?.card_number) || "",
    cvv: cardNumberDetails?.cvv || "",
    valid_thru: formatCardExpiry(cardNumberDetails?.valid_thru) || "",
    card_name: "",
    type: "",
    primary_account: "",
  };

  return (
    <div className="p-6 rounded-2xl bg-white">
      <div className="mb-2">
        <p className="text-xs font-normal text-[#718EBF]">
          Credit Card generally means a plastic card issued by Scheduled Commercial Banks assigned
          to a Cardholder, with a credit limit, that can be used to purchase goods and services on
          credit or obtain cash advances.
        </p>
      </div>
      <Formik
        key={formKey}
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={async (values, { resetForm }) => {
          console.log(values);
          try {
            const response = await createNewCard({ ...values }).unwrap();
            const { message } = response;

            toast(message, { type: "success" });
            resetForm();
          } catch (error: any) {
            const errorMessage = error?.data?.message || "Failed to create card";
            toast(errorMessage, { type: "error" });
          }
        }}
      >
        {({ setFieldValue, isSubmitting, values }) => {
          return (
            <Form>
              <div className="grid grid-cols-3 gap-2">
                <fieldset className="col-span-full md:col-span-2">
                  <label
                    htmlFor="card_name"
                    className="capitalize text-xs font-normal text-affiliate-black"
                  >
                    Card Name
                  </label>
                  <Field
                    type="text"
                    name="card_name"
                    className={classNames(
                      "block w-full px-3 rounded-lg text-[#718EBF] py-2 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-3 border border-[#DFEAF2]"
                    )}
                  />
                </fieldset>

                <fieldset className="col-span-full md:col-span-1">
                  <label
                    htmlFor="primary_account"
                    className="capitalize text-xs font-normal text-affiliate-black"
                  >
                    Primary account
                  </label>
                  <select
                    id="primary_account"
                    name="primary_account"
                    value={values?.primary_account}
                    onChange={(event) => {
                      setFieldValue("primary_account", event.target.value);
                    }}
                    className="block w-full px-3 rounded-lg text-[#718EBF] py-2 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-3 border border-[#DFEAF2]"
                  >
                    <option>select a default account to link to card</option>
                    {React.Children.toArray(
                      (userAccounts ?? [])?.map((type: any) => (
                        <option
                          value={type?.account?._id}
                        >{`${type?.account?.user?.firstname} ${type?.account?.user?.lastname}`}</option>
                      ))
                    )}
                  </select>
                </fieldset>
                <fieldset className="col-span-full md:col-span-1">
                  <label
                    htmlFor="type"
                    className="capitalize text-xs font-normal text-affiliate-black"
                  >
                    Card Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={values?.type}
                    onChange={(event) => {
                      setFieldValue("type", event.target.value);
                    }}
                    className="block w-full px-3 rounded-lg text-[#718EBF] py-2 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-3 border border-[#DFEAF2]"
                  >
                    <option>select a card to continue</option>
                    {React.Children.toArray(
                      cardTypes.map((type) => <option value={type.value}>{type.type}</option>)
                    )}
                  </select>
                </fieldset>

                <fieldset className="col-span-full lg:col-span-2">
                  <label
                    htmlFor="card_number"
                    className="capitalize text-xs font-normal text-affiliate-black"
                  >
                    Card Number
                  </label>
                  <div className="w-full flex items-center gap-3">
                    <input
                      type="text"
                      name="card_number"
                      value={values?.card_number}
                      // disabled={true}
                      maxLength={19}
                      onChange={(event) => {
                        console.log(event);
                        handleCardNumberFormat(event, setFieldValue);
                      }}
                      className={classNames(
                        "block flex-1 shrink-0 w-auto px-3 rounded-lg text-[#718EBF] py-2 focus:ring-2 placeholder:leading-[0] focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none disabled:bg-gray-50 disabled:border disabled:cursor-not-allowed"
                      )}
                    />

                    <button
                      type="button"
                      className={classNames(
                        "py-2 lg:py-3 w-full sm:w-auto px-4 text-white bg-affiliate-green rounded-md text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed",
                        generatingCardDetails
                          ? "flex items-center gap-3 justify-center"
                          : "text-center"
                      )}
                      onClick={handleGenerateCardNumberDetails}
                      disabled={generatingCardDetails}
                    >
                      {generatingCardDetails ? "generate..." : "generate"}
                      {generatingCardDetails && (
                        <svg className="h-5 w-5 animate-spin" viewBox="3 3 18 18">
                          <path
                            className="fill-white"
                            d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                          ></path>
                          <path
                            className="fill-gray-400"
                            d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
                          ></path>
                        </svg>
                      )}
                    </button>
                  </div>
                </fieldset>
                <div className="w-full col-span-full grid grid-cols-1 md:grid-cols-3 gap-2">
                  <fieldset>
                    <label
                      htmlFor="cvv"
                      className="uppercase text-xs font-normal text-affiliate-black"
                    >
                      cvv
                    </label>
                    <Field
                      type="text"
                      name="cvv"
                      disabled={true}
                      className={classNames(
                        "block w-full px-3 rounded-lg text-[#718EBF] py-2 focus:ring-2 placeholder:leading-[0] focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none disabled:bg-gray-50 disabled:border disabled:cursor-not-allowed"
                      )}
                    />
                  </fieldset>
                  <fieldset>
                    <label
                      htmlFor="valid_thru"
                      className="uppercase text-xs font-normal text-affiliate-black"
                    >
                      valid thru
                    </label>
                    <Field
                      type="text"
                      name="valid_thru"
                      disabled={true}
                      className={classNames(
                        "block w-full px-3 rounded-lg text-[#718EBF] py-2 focus:ring-2 placeholder:leading-[0] focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none disabled:bg-gray-50 disabled:border disabled:cursor-not-allowed"
                      )}
                    />
                  </fieldset>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={classNames(
                  "py-2 w-full sm:w-auto px-4 mt-3 text-white bg-affiliate-deep-blue rounded-md text-sm font-medium disabled:bg-gray-400",
                  isSubmitting ? "flex items-center gap-3 justify-center" : "text-center"
                )}
              >
                {isSubmitting ? "adding..." : "Add Card "}
                {isSubmitting && (
                  <svg className="h-5 w-5 animate-spin" viewBox="3 3 18 18">
                    <path
                      className="fill-white"
                      d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                    ></path>
                    <path
                      className="fill-gray-400"
                      d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
                    ></path>
                  </svg>
                )}
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
