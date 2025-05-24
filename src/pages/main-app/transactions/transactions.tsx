import { TableComponent } from "@/components/tables/table-component";
import { useGetAllTransactionsQuery } from "@/features/transactions/transaction.slice";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Transactions() {
  const { data } = useGetAllTransactionsQuery();

  const columns = [
    { header: "id", accessor: "_id" },
    { header: "amount", accessor: "amount" },
    { header: "currency", accessor: "currency" },
    {
      header: "user",
      accessor: "user_profile",
      // Since your implementation uses dot notation access, we need a different approach
      deepOneAccessor: ["firstname", "lastname"],
    },
    { header: "type", accessor: "type" },
    { header: "status", accessor: "status" },
    { header: "date created", accessor: "createdAt", type: "Date" },
    { header: "actions", accessor: "actions" },
  ];

  const transactions = data?.data?.docs;

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

        <div className="mt-4 overflow-x-scroll !w-full">
          <TableComponent columns={columns} datum={transactions} />
        </div>
      </div>
    </section>
  );
}
