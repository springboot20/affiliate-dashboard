import { AppPaginationComponent } from "@/components/paginations/AppPagination";
import { TableComponent } from "@/components/tables/table-component";
import { useUserTransactionsQuery } from "@/features/transactions/transaction.slice";
import { classNames } from "@/utils";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { MagnifyingGlassIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type InitialFilterState = Record<string, any>;

const filterOptions = [
  { value: "all", label: "All Transaction" },
  { value: "type-deposit", label: "Deposit" },
  { value: "type-transfer", label: "Transfer" },
  { value: "status-complete", label: "Status (Completed)" },
  { value: "status-in_progress", label: "Status (In Progress)" },
  { value: "status-failed", label: "Status (Failed)" },
] as const;

type Filter =
  | "type-deposit"
  | "type-transfer"
  | "status-complete"
  | "status-in_progress"
  | "status-failed"
  | "all";

export default function Transactions() {
  const navigate = useNavigate();
  const TRANSACTION_LIMIT = 10;

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const [initialFilterState, setInitialFilterState] = useState<InitialFilterState>({
    limit: TRANSACTION_LIMIT,
    page,
    search: "",
    type: transactionType !== "all" ? transactionType : undefined,
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    setSearchQuery(value);

    setInitialFilterState((prev) => ({
      ...prev,
      search: value,
    }));
  };

  const { data, refetch, isLoading } = useUserTransactionsQuery(initialFilterState);

  const totalPages = data?.data?.totalPages ?? 1;
  const hasNextPage = data?.data?.hasNextPage ?? false;

  const handleNextPage = () => {
    if (hasNextPage) {
      setPage((prevPage) => Math.min(prevPage + 1, totalPages));
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const columns = [
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

  const transactions = data?.data?.docs as any[];

  console.log(transactions);

  const filteredTransactions = useMemo(() => {
    if (!transactions || !transactions.length || filter === "all") return transactions;

    return transactions.filter((t) => {
      if (filter === "type-deposit") {
        return t.type === "DEPOSIT";
      }
      if (filter === "type-transfer") {
        return t.type === "TRANSFER";
      }
      if (filter === "status-complete") return t.status === "COMPLETED";
      if (filter === "status-in_progress") return t.status === "IN_PROGRESS";
      if (filter === "status-failed") return t.status === "FAILED";
      return true;
    });
  }, [filter, transactions]);

  const handleFilterChange = (value: Filter) => {
    setFilter(value);

    if (value === "type-deposit") setTransactionType("DEPOSIT");
    else if (value === "type-transfer") setTransactionType("TRANSFER");
    else setTransactionType("");
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setInitialFilterState((prev) => ({
        ...prev,
        search: searchQuery,
      }));
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Update page in filter state when page changes
  useEffect(() => {
    setInitialFilterState((prev) => ({
      ...prev,
      page,
    }));
  }, [page]);

  useEffect(() => {
    refetch();
  }, [refetch, initialFilterState]);

  const RenderAction = (row: any) => {
    const { data } = row;
    console.log(data);

    return (
      <div className="flex items-center space-x-3">
        <button
          title="view details"
          type="button"
          className="px-2 py-1.5 text-xs fomt-medium capitalize bg-green-500 text-white rounded-2xl"
          onClick={() => navigate(`/app/transactions/detail/${data._id}`)}
        >
          view details
        </button>
        <button type="button" title="delete transaction">
          <TrashIcon className="h-5 text-red-500" />
        </button>
      </div>
    );
  };

  return (
    <section className="py-24 lg:py-[8rem]">
      <div className="max-w-7xl mx-auto px-4 2xl:px-0">
        <header className="py-4 border-b">
          <div className="h-full flex items-center sm:justify-between gap-4 flex-col sm:flex-row sm:gap-0">
            <h1 className="lg:text-xl font-medium capitalize text-[#152F00]">transactions</h1>

            <div className="flex items-center gap-3">
              <fieldset>
                <label htmlFor="search" className="hidden">
                  search
                </label>
                <div className="relative flex rounded-3xl border h-10 overflow-hidden items-center">
                  <span className="flex items-center justify-center h-6 w-10 shrink-0">
                    <MagnifyingGlassIcon className="h-5" />
                  </span>
                  <input
                    type="text"
                    name="search"
                    placeholder="Search transactions"
                    onChange={handleSearch}
                    value={searchQuery}
                    className="flex-1 px-2 text-sm text-gray-700 border-0 outline-0 h-full"
                  />
                </div>
              </fieldset>

              <Menu as="div" className="relative">
                <div className="mr-3 lg:mr-0">
                  <MenuButton className="flex items-center gap-3 text-sm font-normal capitalize text-gray-900">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M3 7H21" stroke="#565656" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M6 12H18" stroke="#565656" strokeWidth="1.5" strokeLinecap="round" />
                      <path
                        d="M10 17H14"
                        stroke="#565656"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>

                    <span>filter</span>
                  </MenuButton>
                </div>

                <MenuItems className="absolute right-0 z-10 mt-4 w-56 origin-top-right rounded-md bg-white dark:bg-black/90 dark:backdrop-blur-sm shadow-lg ring-1 ring-black dark:ring-white/10 overflow-hidden ring-opacity-5 focus:outline-none">
                  {React.Children.toArray(
                    filterOptions.map((option) => {
                      return (
                        <MenuItem>
                          {({ active }) => {
                            return (
                              <button
                                onClick={() => handleFilterChange(option.value)}
                                className={classNames(
                                  filter === option.value
                                    ? "bg-blue-50 dark:bg-white/5 dark:!text-white text-blue-700 font-medium"
                                    : "",
                                  "group flex w-full items-center px-4 py-2 text-sm transition-colors",
                                  active
                                    ? "bg-gray-100 text-gray-900 dark:bg-white/5 dark:!text-white"
                                    : "dark:text-white/40 text-gray-700"
                                )}
                              >
                                {option.label}
                                {filter === option.value && (
                                  <span className="ml-auto text-blue-600">
                                    <CheckIcon className="h-4" />
                                  </span>
                                )}
                              </button>
                            );
                          }}
                        </MenuItem>
                      );
                    })
                  )}
                </MenuItems>
              </Menu>
            </div>
          </div>
        </header>

        <div>
          <div className="mt-4 overflow-x-auto !w-full">
            <TableComponent
              columns={columns}
              datum={filteredTransactions}
              actions={(row) => <RenderAction data={row} />}
              isLoading={isLoading}
            />
          </div>
          {!isLoading && (
            <AppPaginationComponent
              page={page}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              prev={handlePreviousPage}
              next={handleNextPage}
              setPage={setPage}
              totalItems={data?.data?.transactions}
            />
          )}
        </div>
      </div>
    </section>
  );
}
