import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import chip from "@/assets/Chip_Card.png";
import chipGray from "@/assets/Chip_Card-gray.png";
import { CardTypeBlackIcon, CardTypeIcon } from "@/components/icons/Icons";
import { ArrowDownTrayIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { classNames, formatCardExpiry, formatCardNumber } from "@/utils";
import { Pagination } from "@/components/paginations/Pagination";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useGetUserCardsQuery } from "@/features/cards/card.slice";
import { CreditCardLoader } from "@/components/loaders/credit-card.loader";
import DashboardChart from "@/components/statistics/DashboardChart";
import {
  useDeleteTransactionMutation,
  useDownloadReceiptMutation,
  useUserTransactionsQuery,
} from "@/features/transactions/transaction.slice";
import { DashboardTransactionTable } from "@/components/tables/dashboard-transactions-table";
import { DeleteModalComponent } from "@/components/modal/delete-modal";
import { toast } from "react-toastify";

export const Transactions = () => {
  const [width, setWidth] = useState<number>(0);
  const cardSlider = useRef<HTMLDivElement>(null);

  const LIMIT = 10;
  const [page, setPage] = useState<number>(1);
  const [transactionDeleted, setTransactionDeleted] = useState(false);
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});

  const columns = [
    { header: "description", accessor: "description" },
    { header: "transaction ID", accessor: "_id" },
    { header: "type", accessor: "type" },
    { header: "amount", accessor: "amount" },
    { header: "status", accessor: "status" },
    { header: "date", accessor: "createdAt", type: "Date" },
  ];

  const { data, isLoading } = useGetUserCardsQuery();
  const [deleteTransaction, { isLoading: isDeletingTransaction }] = useDeleteTransactionMutation();
  const [downloadTransactionMutation, { isLoading: isDownloading }] = useDownloadReceiptMutation();

  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    refetch,
  } = useUserTransactionsQuery({
    limit: LIMIT,
    page,
  });

  console.log(isTransactionsLoading);

  const cards = useMemo(() => data?.data?.cards ?? [], [data]);
  const transactions = useMemo(() => transactionsData?.data?.docs ?? [], [transactionsData]);

  console.log(transactions);

  useEffect(() => {
    if (cardSlider.current !== null) {
      setWidth(cardSlider.current?.scrollWidth - cardSlider.current?.offsetWidth);
    }

    // Update width calculation on window resize
    const handleResize = () => {
      if (cardSlider.current !== null) {
        setWidth(cardSlider.current?.scrollWidth - cardSlider.current?.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = transactionsData?.data?.totalPages ?? 1;
  const hasNextPage = transactionsData?.data?.hasNextPage ?? false;

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

  const handleGoToPage = (pageNumber: number) => {
    setPage(Math.max(1, Math.min(pageNumber, totalPages)));
  };

  const onOpen = (id: string) => setOpen((prev) => ({ ...prev, [id]: true }));
  const onClose = (id: string) => setOpen((prev) => ({ ...prev, [id]: false }));

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      const response = await deleteTransaction(transactionId).unwrap();

      setTransactionDeleted(true);

      const { message } = response;
      toast(message, { type: "success", className: "text-xs" });

      setTimeout(() => {
        setTransactionDeleted(false);
        onClose(transactionId);
      }, 1000);

      refetch();
    } catch (error: any) {
      const message = error?.data?.message;
      toast(message, { type: "error", className: "text-xs" });
      onClose(transactionId!);
    }
  };

  const downloadReceiptFile = async (transactionId: string, transactionRef: string) => {
    try {
      const result = await downloadTransactionMutation(transactionId).unwrap();

      console.log(result);

      // Create blob URL and trigger download
      const blob = new Blob([result as BlobPart], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `receipt-${transactionRef}.pdf`;
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error("Download failed:", error);
      return { success: false, error };
    }
  };

  const RenderAction = (row: any) => {
    const transactionData = row;
    const transactionId = row?._id;

    console.log(row);

    const handleDownloadReceipt = async () => {
      if (!transactionId || !transactionData?.reference) return;
      try {
        const result = await downloadReceiptFile(transactionId, transactionData.reference);

        console.log(result);

        if (!result.success) {
          alert("Failed to download receipt. Please try again.");
        }
      } catch (error) {
        console.error("Download error:", error);
        alert("Failed to download receipt. Please try again.");
      }
    };

    return (
      <Fragment>
        <DeleteModalComponent
          open={!!open[row?._id as string]}
          itemDeleted={transactionDeleted}
          deleteLoading={isDeletingTransaction}
          handleDelete={() => handleDeleteTransaction(row?._id as string)}
          onClose={() => {
            onClose(row?._id as string);
            refetch();
          }}
          title="transaction"
        />

        <div className="flex items-center space-x-3">
          <button
            title="view details"
            type="button"
            onClick={handleDownloadReceipt}
            className="flex items-center gap-3 px-3 py-1.5 rounded-3xl ring-2 ring-[#1814F3] text-[#1814F3] text-xs xl:text-sm font-normal"
          >
            <span className="font-medium">{isDownloading ? "Downloading..." : "Download"}</span>
            <ArrowDownTrayIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => onOpen(row?._id as string)}
            title="delete transaction"
          >
            <TrashIcon className="h-5 text-red-500" />
          </button>
        </div>
      </Fragment>
    );
  };

  return (
    <section className="px-2 mt-[9rem] lg:mt-[5.5rem]">
      <motion.div
        initial={{
          scale: 0,
          opacity: 0.3,
        }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: {
            type: "tween",
          },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-w-full xl:max-w-7xl xl:mx-auto overflow-x-hidden"
      >
        {/* Card section */}
        <div className="col-span-full lg:col-span-2">
          <nav className="flex justify-between items-center">
            <h3 className="text-base font-semibold text-affiliate-blue lg:text-lg">My Cards</h3>
            <h3
              role="button"
              className="text-sm px-2 py-1.5 flex items-center font-semibold text-affiliate-blue capitalize !bg-transparent"
            >
              <PlusIcon className="h-4 text-affiliate-blue" aria-hidden={true} strokeWidth={2.5} />
              add card
            </h3>
          </nav>
          <motion.div ref={cardSlider} className="overflow-hidden max-w-full mt-3 pb-2">
            <motion.div
              drag={"x"}
              dragConstraints={{ right: 0, left: -width }}
              className="flex items-start gap-3 max-w-full flex-1 font-lato"
            >
              {isLoading || cards?.length === 0 || !data ? (
                <CreditCardLoader classname="flex-grow shrink-0 w-full md:w-1/2 h-44 lg:h-40 xl:h-48" />
              ) : (
                React.Children.toArray(
                  (cards ?? [])?.slice(0, 2)?.map((card: any) => {
                    return (
                      <div
                        className={classNames(
                          "border flex-grow shrink-0 relative p-3.5 font-lato before:absolute before:content-[' '] before:bottom-0 before:h-12 xl:before:h-14 before:left-0 before:right-0 rounded-3xl space-y-4 lg:space-y-2 xl:space-y-6 flex-grow w-full md:w-1/2 ",
                          card?.type?.includes("DEBIT")
                            ? "bg-white text-affiliate-black before:border-t"
                            : "before:bg-white/20 bg-gradient-to-br from-[#2D60FF] to-[#539BFF] text-white"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col items-start">
                            <span className="text-xs font-normal">Balance</span>
                            <span className="text-sm lg:text-base font-semibold">$5,764</span>
                          </div>
                          {card?.type?.includes("DEBIT") ? (
                            <img src={chipGray} alt="chip icon" className="w-8" />
                          ) : (
                            <img src={chip} alt="chip icon" className="w-8" />
                          )}
                        </div>

                        <div className="flex items-center justify-between py-3.5">
                          <div>
                            <h2 className="text-xs font-normal uppercase">card holder</h2>
                            <p className="font-semibold text-base">{card?.card_name}</p>
                          </div>

                          <div>
                            <h2 className="text-xs font-normal uppercase">valid thru</h2>
                            <p className="font-semibold text-sm">
                              {formatCardExpiry(card?.valid_thru)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-base font-bold uppercase">
                            {formatCardNumber(card?.card_number)}
                          </p>
                          {card?.type?.includes("DEBIT") ? <CardTypeBlackIcon /> : <CardTypeIcon />}
                        </div>
                      </div>
                    );
                  })
                )
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Expense */}
        <div className="col-span-full lg:col-span-1">
          <h3 className="text-base lg:text-xl font-semibold text-affiliate-blue capitalize">
            my expense
          </h3>

          <div className="bg-white shadow p-2 rounded-3xl min-h-64 md:min-h-64 lg:min-h-44 xl:min-h-52 mt-3">
            <DashboardChart
              type="bar"
              options={{
                xaxis: {
                  categories: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
                },
                plotOptions: {
                  bar: {
                    borderRadius: 15,
                    distributed: true,
                  },
                },
                grid: {
                  show: true,
                  borderColor: "#E5E7EB",
                  strokeDashArray: 4,
                  xaxis: {
                    lines: {
                      show: true,
                    },
                  },
                  yaxis: {
                    lines: {
                      show: true,
                    },
                  },
                  padding: {
                    top: 0,
                    right: 10,
                    bottom: 0,
                    left: 10,
                  },
                },
                legend: {
                  show: false,
                },
                colors: ["#EDF0F7", "#EDF0F7", "#EDF0F7", "#EDF0F7", "#16DBCC", "#EDF0F7"],
              }}
              series={[
                {
                  name: "",
                  data: [500, 900, 600, 700, 900, 600],
                },
              ]}
              height="100%"
            />
          </div>
        </div>

        {/* transactions */}
        <div className="col-span-full">
          <h3 className="text-base lg:text-xl font-semibold text-affiliate-blue capitalize">
            recent transactions
          </h3>

          <div className="mt-4">
            <TabGroup>
              <TabList className="rounded-none bg-transparent border-b border-gray-200 flex items-center justify-start gap-12">
                <Tab as={"div"} className="relative focus:outline-none">
                  {({ selected }) => (
                    <>
                      <button
                        className={classNames(
                          selected ? "text-affiliate-deep-blue" : "text-[#8BA3CB] border-none",
                          "text-xs px-0 h-10 capitalize outline-none focus:outline-none"
                        )}
                      >
                        all transactions
                      </button>
                      {selected && (
                        <span className="absolute inline-block left-0 right-0 bottom-0 w-full h-1 rounded-t bg-affiliate-deep-blue"></span>
                      )}
                    </>
                  )}
                </Tab>

                <Tab as={"div"} className="relative focus:outline-none">
                  {({ selected }) => (
                    <>
                      <button
                        className={classNames(
                          selected ? "text-affiliate-deep-blue" : "text-[#8BA3CB] border-none",
                          "text-xs px-0 h-10 capitalize outline-none focus:outline-none"
                        )}
                      >
                        income
                      </button>
                      {selected && (
                        <span className="absolute inline-block left-0 right-0 bottom-0 w-full h-1 rounded-t bg-affiliate-deep-blue"></span>
                      )}
                    </>
                  )}
                </Tab>

                <Tab as={"div"} className="relative focus:outline-none">
                  {({ selected }) => (
                    <>
                      <button
                        className={classNames(
                          selected ? "text-affiliate-deep-blue" : "text-[#8BA3CB] border-none",
                          "text-xs px-0 h-10 capitalize outline-none focus:outline-none"
                        )}
                      >
                        expense
                      </button>
                      {selected && (
                        <span className="absolute inline-block left-0 right-0 bottom-0 w-full h-1 rounded-t bg-affiliate-deep-blue"></span>
                      )}
                    </>
                  )}
                </Tab>
              </TabList>

              <TabPanels className="mt-4">
                <TabPanel className="p-0 bg-transparent font-inter">
                  <DashboardTransactionTable
                    datum={transactions}
                    isLoading={isTransactionsLoading}
                    columns={columns}
                    actions={RenderAction}
                  />
                </TabPanel>

                <TabPanel className="p-0 bg-transparent font-inter"></TabPanel>

                <TabPanel className="p-0 bg-transparent font-inter"></TabPanel>
              </TabPanels>
            </TabGroup>
            <Pagination
              page={page}
              next={handleNextPage}
              prev={handlePreviousPage}
              hasNextPage={false}
              totalPages={totalPages}
              goToPage={handleGoToPage}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};
