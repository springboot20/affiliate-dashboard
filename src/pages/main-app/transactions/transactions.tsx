import { AppPaginationComponent } from "@/components/paginations/AppPagination";
import { TableComponent } from "@/components/tables/table-component";
import { useUserTransactionsQuery } from "@/features/transactions/transaction.slice";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

type InitialFilterState = Record<string, any>;

export default function Transactions() {
  const TRASNACTION_LIMIT = 10;

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [initialFilterState, setInitialFilterState] = useState<InitialFilterState>({
    limit: TRASNACTION_LIMIT,
    page,
    search: "",
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value: string = event.target.value;
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

  useEffect(() => {
    refetch();
  }, [refetch, initialFilterState]);

  // Update page in filter state when page changes
  useEffect(() => {
    setInitialFilterState((prev) => ({
      ...prev,
      page,
    }));
  }, [page]);

  const RenderAction = (data: any) => {
    console.log(data);
    return (
      <div className="flex items-center space-x-3">
        <button
          title="view details"
          type="button"
          className="px-2 py-1.5 text-xs fomt-medium capitalize bg-green-500 text-white rounded-2xl"
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

                <MenuItems></MenuItems>
              </Menu>
            </div>
          </div>
        </header>

        <div>
          <div className="mt-4 overflow-x-auto !w-full">
            <TableComponent
              columns={columns}
              datum={transactions}
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
