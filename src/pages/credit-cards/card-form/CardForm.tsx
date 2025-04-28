import { useAppDispatch } from "@/app/hook";
import { useGetUserAccountsQuery } from "@/features/account/account.slice";
import { CardApiSlice } from "@/features/cards/card.slice";
import { classNames } from "@/utils";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";

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

  const { data } = useGetUserAccountsQuery();

  const userAccounts = data?.data?.accounts;

  console.log(data);

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
          setGeneratingCardDetails(false);
        }, 2000);
        setCardNumberDetails(response?.data);
      }
    } catch (error: any) {
      setGeneratingCardDetails(false);
    }
  };

  const initialValues: InitialValues = {
    card_number: cardNumberDetails?.card_number || "",
    cvv: cardNumberDetails?.cvv || "",
    valid_thru: cardNumberDetails?.valid_thru || "",
    card_name: "",
    type: "",
    primary_account: "",
  };

  useEffect(() => {
    console.log(cardNumberDetails);
  }, [cardNumberDetails, handleGenerateCardNumberDetails]);

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
        onSubmit={async () => {
          console.log();
        }}
      >
        {({ setFieldValue }) => {
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

                <fieldset className="lg:col-span-2">
                  <label
                    htmlFor="card_number"
                    className="capitalize text-xs font-normal text-affiliate-black"
                  >
                    Card Number
                  </label>
                  <div className="flex items-center gap-3">
                    <Field
                      type="text"
                      name="card_number"
                      className={classNames(
                        "block w-full px-3 rounded-lg text-[#718EBF] py-2 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-3 border border-[#DFEAF2]"
                      )}
                    />

                    <button
                      type="button"
                      className={classNames(
                        "py-2 lg:py-3 w-full sm:w-auto px-4 flex items-center gap-3 text-white bg-affiliate-green rounded-md text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                      className={classNames(
                        "block w-full px-3 rounded-lg text-[#718EBF] py-2 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-3 border border-[#DFEAF2]"
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
                      className={classNames(
                        "block w-full px-3 rounded-lg text-[#718EBF] py-2 focus:ring-2 focus:ring-inset text-xs placeholder:text-[#718EBF] sm:leading-6 outline-none lg:py-3 border border-[#DFEAF2]"
                      )}
                    />
                  </fieldset>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
