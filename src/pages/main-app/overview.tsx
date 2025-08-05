import { AddMoneyPanelComponent } from "@/components/panels/add-money-panel";
import { SendMoneyPanelComponent } from "@/components/panels/send-money-panel";
import { TableComponent } from "@/components/tables/table-component";
import React, { Fragment, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import background from "@/assets/background.svg";
import {
  useGetAccountDetailsQuery,
  useGetUserAccountsQuery,
} from "@/features/account/account.slice";
import { classNames, formatMoney, LocalStorage } from "@/utils";
import { useUserTransactionsQuery } from "@/features/transactions/transaction.slice";
import { useSearchEngineOptimization } from "../../hooks/seo/useSearchEngineOptimization";

interface Column {
  header: string;
  accessor: string;
  deepOneAccessor?: string[];
  deepOneAccessorAlt?: string;
  type?: string;
}

const env = import.meta.env;

export default function Overview() {
  useSearchEngineOptimization({
    title: "BankDash | Overview",
    description: "",
    canonical:
      env.MODE === "production"
        ? "https://iran-opal.vercel.app/home"
        : "http://localhost:5173/app/overview",
    themeColor: "#000000",
    appleTouchIcon: "/app-logo.svg",
    lang: "en-NG",
    keywords: [],
    favicon: "/app-logo.svg",

    ogTitle: "Overview",
    ogDescription: "",
    ogImage: "/app-logo.svg",
    ogImageAlt: "Screenshot of my awesome page",
    ogType: "website",
    ogSiteName: "",
  });

  const [openSendPanel, setOpenSendPanel] = useState(false);
  const [openAddPanel, setOpenAddPanel] = useState(false);
  const {
    data,
    isLoading: transactionsLoading,
    refetch: refetchTransactions,
  } = useUserTransactionsQuery({
    limit: 10,
    page: 1,
  });

  const transactions = data?.data?.docs as any[];

  const { data: accounts, isFetching: isFetchingAccounts } = useGetUserAccountsQuery();
  const [account, setAccount] = useState<string>("");
  const [isAccountSwitching, setIsAccountSwitching] = useState(false);

  useEffect(() => {
    const storedAccount = LocalStorage.get("current-account");
    const availableAccounts = accounts?.data?.docs as any[];

    if (storedAccount && availableAccounts?.some((acc: any) => acc._id === storedAccount)) {
      setAccount(storedAccount);
    } else if (availableAccounts?.length > 0) {
      const firstAccount = availableAccounts[0]?._id;
      LocalStorage.set("current-account", firstAccount);
      setAccount(firstAccount);
    }
  }, [accounts?.data?.docs]);

  const {
    data: accountDetails,
    isLoading: isLoadingAccountDetails,
    isFetching: isFetchingAccountDetails,
    refetch: refetchAccount,
    error: accountError,
  } = useGetAccountDetailsQuery(
    { accountId: account },
    {
      skip: !account,
      // Force refetch when account changes
      refetchOnMountOrArgChange: true,
    }
  );

  const handleSelectAccount = useCallback(
    async (accountId: string) => {
      if (accountId === account) return;

      setIsAccountSwitching(true);

      try {
        setAccount(accountId);
        LocalStorage.set("current-account", accountId);
        // Force refetch account details
        // The query will automatically refetch due to the account parameter change
        await refetchAccount();

        // Optional: Also refetch transactions if they depend on account
        await refetchTransactions();
      } catch (error) {
        console.error("Failed to switch account:", error);

        const previousAccount = LocalStorage.get("current-account");
        if (previousAccount !== accountId) {
          setAccount(previousAccount);
        }
      } finally {
        setIsAccountSwitching(false);
      }
    },
    [account, refetchAccount, refetchTransactions]
  );

  console.log(accountDetails);

  const navigate = useNavigate();

  const columns: Column[] = [
    { header: "id", accessor: "_id" },
    { header: "amount", accessor: "amount" },
    { header: "currency", accessor: "currency" },
    { header: "description", accessor: "description" },
    {
      header: "user",
      accessor: "user",
      // Since your implementation uses dot notation access, we need a different approach
      deepOneAccessor: ["firstname", "lastname"],
    },
    { header: "type", accessor: "type" },
    { header: "status", accessor: "status" },
    { header: "date created", accessor: "createdAt", type: "Date" },
  ];

  // Determine loading states
  const isLoadingBalance =
    isLoadingAccountDetails || isFetchingAccountDetails || isAccountSwitching;
  const isLoadingAccounts = isFetchingAccounts;

  // Get current account data for display
  const currentAccountData = accounts?.data?.docs?.find((acc: any) => acc._id === account);

  return (
    <Fragment>
      <main className="relative bg-[#152F00] h-[55vh] sm:h-[45vh] lg:h-[55vh]">
        <div className="absolute inset-x-0 h-full w-full">
          <img src={background} alt="background" className="h-full w-full object-cover" />
        </div>

        <div className="relative pt-24 lg:pt-[8rem] max-w-7xl mx-auto px-4 2xl:px-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0">
            <div className="flex justify-between">
              <div className="text-white flex flex-col flex-start gap-y-2 sm:gap-y-4">
                <span className="font-normal text-xs sm:sm">TOTAL BALANCE</span>
                <span className="font-medium text-sm lg:text-xl xl:text-3xl">
                  {isLoadingBalance ? (
                    <span className="inline-flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Loading...
                    </span>
                  ) : accountError ? (
                    <span className="text-red-300">Error loading balance</span>
                  ) : (
                    formatMoney(
                      currentAccountData?.wallet?.balance || 0,
                      currentAccountData?.wallet?.currency === "USD" ? "USD" : "NGN",
                      currentAccountData?.wallet?.currency === "USD" ? "en-US" : "en-NG"
                    )
                  )}
                </span>
              </div>
              <div className="flex flex-col md:hidden gap-3">
                {isLoadingAccounts ? (
                  <span className="text-sm text-white">loading...</span>
                ) : !accounts?.data?.docs?.length ? (
                  <span className="text-white text-sm shrink-0">no accounts found</span>
                ) : (
                  <fieldset className="w-fit">
                    <label
                      className="text-xs mb-2 text-white block capitalize font-medium"
                      htmlFor="account"
                    >
                      switch account {isAccountSwitching && "(Switching...)"}
                    </label>
                    <div className="relative flex items-center h-full">
                      <select
                        id="account"
                        name="account"
                        value={account}
                        disabled={isAccountSwitching}
                        className={classNames(
                          "text-xs px-2 py-1.5 appearance-none outline-0 rounded w-full sm:w-auto capitalize font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 border-0 focus:ring-[#A1E96F]",
                          isAccountSwitching ? "opacity-50 cursor-not-allowed" : ""
                        )}
                        onChange={(event) => {
                          const value = event.target.value;

                          handleSelectAccount(value);
                        }}
                      >
                        {React.Children.toArray(
                          accounts?.data?.docs.length &&
                            accounts?.data?.docs.map((doc: any) => {
                              return (
                                // doc?.status !== "CLOSED" &&
                                // doc?.status !== "SUSPENDED" && (

                                // )

                                <option value={doc?._id}>
                                  {doc?.type} account -{" "}
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
                        {isAccountSwitching ? (
                          <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M5.293 7.293L9.293 11.293C9.683 11.683 10.317 11.683 10.707 11.293L14.707 7.293C15.098 6.902 14.855 6.268 14.293 6.268L5.707 6.268C5.145 6.268 4.902 6.902 5.293 7.293Z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </fieldset>
                )}
              </div>
            </div>

            <div className="flex flex-col items-start md:flex-row md:items-end w-full sm:w-auto gap-3">
              <div className="w-full hidden md:inline-block md:w-fit">
                {isLoadingAccounts ? (
                  <span className="text-sm text-white">loading...</span>
                ) : !accounts?.data?.docs?.length ? (
                  <span className="text-white text-sm shrink-0">no accounts found</span>
                ) : (
                  <fieldset className="w-fit">
                    <label
                      className="text-xs mb-2 text-white block capitalize font-medium"
                      htmlFor="account"
                    >
                      switch account {isAccountSwitching && "(Switching...)"}
                    </label>
                    <div className="relative flex items-center h-full">
                      <select
                        id="account"
                        name="account"
                        value={account}
                        disabled={isAccountSwitching}
                        className={classNames(
                          "text-xs px-2 py-1.5 appearance-none outline-0 rounded w-full sm:w-auto capitalize font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 border-0 focus:ring-[#A1E96F]",
                          isAccountSwitching ? "opacity-50 cursor-not-allowed" : ""
                        )}
                        onChange={(event) => {
                          const value = event.target.value;

                          handleSelectAccount(value);
                        }}
                      >
                        {React.Children.toArray(
                          accounts?.data?.docs.length &&
                            accounts?.data?.docs.map((doc: any) => {
                              return (
                                // doc?.status !== "CLOSED" &&
                                // doc?.status !== "SUSPENDED" && (

                                // )

                                <option value={doc?._id}>
                                  {doc?.type} account -{" "}
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
                        {isAccountSwitching ? (
                          <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M5.293 7.293L9.293 11.293C9.683 11.683 10.317 11.683 10.707 11.293L14.707 7.293C15.098 6.902 14.855 6.268 14.293 6.268L5.707 6.268C5.145 6.268 4.902 6.902 5.293 7.293Z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </fieldset>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                <button
                  type="button"
                  title="view analytics"
                  className="flex items-center justify-center gap-2 px-3 py-2 text-white"
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.7201 8.49995C11.7201 9.81995 10.6534 10.8866 9.33344 10.8866C8.01344 10.8866 6.94678 9.81995 6.94678 8.49995C6.94678 7.17995 8.01344 6.11328 9.33344 6.11328C10.6534 6.11328 11.7201 7.17995 11.7201 8.49995Z"
                      stroke="#F9F9F9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.33339 14.0133C11.6867 14.0133 13.8801 12.6266 15.4067 10.2266C16.0067 9.28665 16.0067 7.70665 15.4067 6.76665C13.8801 4.36665 11.6867 2.97998 9.33339 2.97998C6.98006 2.97998 4.78673 4.36665 3.26006 6.76665C2.66006 7.70665 2.66006 9.28665 3.26006 10.2266C4.78673 12.6266 6.98006 14.0133 9.33339 14.0133Z"
                      stroke="#F9F9F9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-white capitalize text-sm font-normal">view analytics</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    title="send money"
                    onClick={() => setOpenSendPanel(true)}
                    disabled={!account || isAccountSwitching}
                    className="bg-[#A1E96F] flex items-center justify-center gap-2 px-3 py-2 rounded"
                  >
                    <svg
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.3335 9.6667C6.3335 10.3134 6.83351 10.8334 7.44684 10.8334H8.70015C9.23349 10.8334 9.66683 10.380 9.66683 9.81336C9.66683 9.2067 9.40017 8.9867 9.00684 8.8467L7.00016 8.1467C6.60683 8.0067 6.34017 7.79337 6.34017 7.18003C6.34017 6.62003 6.77349 6.16003 7.30682 6.16003H8.56016C9.17349 6.16003 9.6735 6.68003 9.6735 7.3267"
                        stroke="#152F00"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 5.5V11.5"
                        stroke="#152F00"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.6668 8.50004C14.6668 12.18 11.6802 15.1667 8.00016 15.1667C4.32016 15.1667 1.3335 12.18 1.3335 8.50004C1.3335 4.82004 4.32016 1.83337 8.00016 1.83337"
                        stroke="#152F00"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.6667 4.50004V1.83337H12"
                        stroke="#152F00"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11.3335 5.16671L14.6668 1.83337"
                        stroke="#152F00"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="capitalize text-sm font-normal text-[#152F00]">send</span>
                  </button>

                  <button
                    type="button"
                    title="add money"
                    onClick={() => setOpenAddPanel(true)}
                    disabled={!account || isAccountSwitching}
                    className="bg-white/30 flex items-center justify-center gap-2 px-3 py-2 rounded"
                  >
                    <svg
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.3335 6.16663H9.00016"
                        stroke="#F9F9F9"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 11.5H5.33333"
                        stroke="#F9F9F9"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 11.5H9.66667"
                        stroke="#F9F9F9"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.6668 8.52004V11.24C14.6668 13.58 14.0735 14.1667 11.7068 14.1667H4.2935C1.92683 14.1667 1.3335 13.58 1.3335 11.24V5.76004C1.3335 3.42004 1.92683 2.83337 4.2935 2.83337H9.00016"
                        stroke="#F9F9F9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M11 4.66663H14.6667" stroke="#F9F9F9" strokeLinecap="round" />
                      <path d="M12.8335 6.50004V2.83337" stroke="#F9F9F9" strokeLinecap="round" />
                    </svg>
                    <span className="capitalize text-sm font-normal text-white">add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 lg:mt-12">
            <div className="space-x-2 flex items-center">
              <div className="flex items-center space-x-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.02 5.97C2.75 7.65 2 9.74 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2"
                    stroke="#F9F9F9"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 12C5 15.87 8.13 19 12 19C15.87 19 19 15.87 19 12C19 8.13 15.87 5 12 5"
                    stroke="#F9F9F9"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8"
                    stroke="#F9F9F9"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm lg:text-base font-medium text-white">Overview</span>
              </div>
              <span className="text-xs font-normal text-white">Last 30 days</span>
            </div>

            <div className="grid grid-cols-1 mt-5 gap-5 lg:grid-cols-3">
              <OverviewCardComponent
                title="Domestic Transfers"
                icon={
                  <svg
                    width="32"
                    height="33"
                    viewBox="0 0 32 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.6667 18.8333C12.6667 20.1266 13.6668 21.1666 14.8934 21.1666H17.4001C18.4667 21.1666 19.3334 20.2599 19.3334 19.1266C19.3334 17.9133 18.8001 17.4733 18.0134 17.1933L14.0001 15.7933C13.2134 15.5133 12.6801 15.0866 12.6801 13.8599C12.6801 12.7399 13.5467 11.8199 14.6134 11.8199H17.1201C18.3467 11.8199 19.3468 12.8599 19.3468 14.1533"
                      stroke="#16302B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 10.5V22.5"
                      stroke="#16302B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M29.3334 16.5C29.3334 23.86 23.3601 29.8333 16.0001 29.8333C8.64008 29.8333 2.66675 23.86 2.66675 16.5C2.66675 9.13996 8.64008 3.16663 16.0001 3.16663"
                      stroke="#16302B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M29 9V3H23"
                      stroke="#A1E96F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 11L29 3"
                      stroke="#A1E96F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                balance={"$302,2560.00"}
              />
              <OverviewCardComponent
                title="Tax Reserves"
                icon={
                  <svg
                    width="32"
                    height="33"
                    viewBox="0 0 32 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.6532 24.1666H23.5465C23.4265 24.2733 23.3065 24.3667 23.1865 24.4733L17.4932 28.74C15.6132 30.14 12.5465 30.14 10.6532 28.74L4.94651 24.4733C3.69318 23.54 2.6665 21.4733 2.6665 19.9133V10.0333C2.6665 8.40664 3.90651 6.60664 5.42651 6.03331L12.0665 3.53998C13.1598 3.12665 14.9732 3.12665 16.0665 3.53998L22.6932 6.03331C23.9598 6.51331 25.0398 7.84665 25.3732 9.20665H15.6398C15.3465 9.20665 15.0798 9.21999 14.8265 9.21999C12.3598 9.36666 11.7198 10.26 11.7198 13.0733V20.3133C11.7332 23.38 12.5198 24.1666 15.6532 24.1666Z"
                      stroke="#16302B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M29.3329 13.0601V20.46C29.3062 23.42 28.4929 24.1534 25.4129 24.1534H15.6529C12.5196 24.1534 11.7329 23.3667 11.7329 20.2867V13.0467C11.7329 10.2467 12.3729 9.35336 14.8396 9.19336C15.0929 9.19336 15.3596 9.18005 15.6529 9.18005H25.4129C28.5462 9.19339 29.3329 9.96673 29.3329 13.0601Z"
                      fill="#A1E96F"
                      stroke="#16302B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.0933 20.8467H16.8666"
                      stroke="#16302B"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19.6665 20.8467H24.0265"
                      stroke="#16302B"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.7329 15.46H29.3329"
                      stroke="#16302B"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                balance="$3,560.65"
                refreshIcon={
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.00016 0.833374C2.70016 0.833374 0.833496 2.70004 0.833496 5.00004C0.833496 7.30004 2.70016 9.16671 5.00016 9.16671C7.30016 9.16671 9.16683 7.30004 9.16683 5.00004"
                      stroke="#F9F9F9"
                      strokeWidth="0.8"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.4165 4.58329L8.83317 1.16663"
                      stroke="#F9F9F9"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.1668 2.84587V0.833374H7.1543"
                      stroke="#F9F9F9"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
              <OverviewCardComponent
                title="Business Savings"
                icon={
                  <svg
                    width="32"
                    height="33"
                    viewBox="0 0 32 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.8799 3.85747L16.8399 3.95081L12.9733 12.9241H9.17328C8.26661 12.9241 7.39995 13.1108 6.61328 13.4441L8.94661 7.87081L8.99995 7.73747L9.09328 7.52414C9.11995 7.44414 9.14662 7.36414 9.18662 7.29747C10.9333 3.25747 12.9066 2.33747 16.8799 3.85747Z"
                      fill="#A1E96F"
                      stroke="#16302B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M24.0665 13.1909C23.4665 13.0042 22.8265 12.9242 22.1865 12.9242H12.9731L16.8398 3.95088L16.8798 3.85754C17.0798 3.92421 17.2665 4.01754 17.4665 4.09754L20.4131 5.33754C22.0531 6.01754 23.1998 6.72421 23.8931 7.57754C24.0265 7.73754 24.1331 7.88421 24.2265 8.05754C24.3465 8.24421 24.4398 8.43088 24.4931 8.63088C24.5465 8.75088 24.5865 8.87088 24.6131 8.97754C24.9731 10.0975 24.7598 11.4709 24.0665 13.1909Z"
                      fill="#A1E96F"
                      stroke="#16302B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M28.6955 19.4311V22.0311C28.6955 22.2978 28.6821 22.5644 28.6688 22.8311C28.4155 27.4844 25.8155 29.8311 20.8821 29.8311H10.4821C10.1621 29.8311 9.84213 29.8044 9.53546 29.7644C5.29546 29.4844 3.0288 27.2178 2.7488 22.9778C2.7088 22.6711 2.68213 22.3511 2.68213 22.0311V19.4311C2.68213 16.7511 4.3088 14.4444 6.6288 13.4444C7.4288 13.1111 8.28213 12.9244 9.1888 12.9244H22.2021C22.8555 12.9244 23.4955 13.0178 24.0821 13.1911C26.7355 14.0044 28.6955 16.4844 28.6955 19.4311Z"
                      stroke="#16302B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.9465 7.87085L6.61317 13.4442C4.29317 14.4442 2.6665 16.7509 2.6665 19.4309V15.5242C2.6665 11.7375 5.35984 8.57752 8.9465 7.87085Z"
                      stroke="#16302B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M28.6915 15.5236V19.4302C28.6915 16.4969 26.7448 14.0036 24.0781 13.2036C24.7715 11.4702 24.9715 10.1102 24.6381 8.97692C24.6115 8.85692 24.5715 8.73692 24.5181 8.63025C26.9981 9.91025 28.6915 12.5369 28.6915 15.5236Z"
                      stroke="#16302B"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                balance="$89,560.00"
              />
            </div>
          </div>

          <div className="mt-8 lg:mt-12">
            <div className="flex justify-between items-center">
              <h1 className="lg:text-xl font-medium capitalize text-[#152F00]">
                recents transactions
              </h1>

              <button
                type="button"
                title="see all transactions"
                onClick={() => navigate("/app/transactions")}
                className="text-sm font-normal text-[#152F00] capitalize"
              >
                see all
              </button>
            </div>

            <div className="!w-full overflow-x-auto mt-4">
              <TableComponent
                columns={columns}
                datum={transactions}
                isLoading={transactionsLoading}
              />
            </div>
          </div>
        </div>
      </main>

      <SendMoneyPanelComponent
        refetch={refetchTransactions}
        open={openSendPanel}
        onClose={() => setOpenSendPanel(false)}
      />

      <AddMoneyPanelComponent
        refetch={refetchTransactions}
        open={openAddPanel}
        onClose={() => setOpenAddPanel(false)}
      />
    </Fragment>
  );
}

const OverviewCardComponent: React.FC<{
  icon: React.ReactNode;
  refreshIcon?: React.ReactNode;
  balance: string;
  title: string;
}> = ({ icon, refreshIcon, balance, title }) => {
  return (
    <div className="bg-white p-4 lg:p-6 min-h-52 flex justify-center flex-col border shadow-sm">
      <div className="mt-4 rounded-full size-16 flex items-center justify-center bg-[#DADEE8]">
        {icon}
      </div>

      <div className="mt-5 space-y-3">
        <h3 className="text-base font-medium uppercase">{title}</h3>
        <div className="flex items-center gap-3">
          <p className="text-xl font-medium">{balance}</p>
          {refreshIcon && <button className="rounded-xl px-3">{refreshIcon}</button>}
        </div>
      </div>
    </div>
  );
};
