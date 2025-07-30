import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import chip from "@/assets/Chip_Card.png";
import chipGray from "@/assets/Chip_Card-gray.png";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CardTypeBlackIcon,
  CardTypeIcon,
} from "@/components/icons/Icons";
import { PlusIcon } from "@heroicons/react/24/outline";
import { classNames, formatCardExpiry, formatCardNumber } from "@/utils";
import { Pagination } from "@/components/paginations/Pagination";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useGetUserCardsQuery } from "@/features/cards/card.slice";
import { CreditCardLoader } from "@/components/loaders/credit-card.loader";
import DashboardChart from "@/components/statistics/DashboardChart";

export const Transactions = () => {
  const [width, setWidth] = useState<number>(0);
  const cardSlider = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState<number>(1);

  const { data, isLoading } = useGetUserCardsQuery();
  const cards = useMemo(() => data?.data?.cards ?? [], [data]);

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

  const handleGoToPage = (pageNumber: number) => {
    setPage(Math.max(1, Math.min(pageNumber, totalPages)));
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
            <TabGroup className="lg:hidden">
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
                  <ul className="bg-white p-5 rounded-2xl shadow mt-4 w-full">
                    <li className="flex items-center justify-between border-b py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowUpIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">spotify subscription</h3>
                          <p className="text-xs font-normal text-[#718EBF]">28 jan, 12.30 am</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-red">-$2,500</p>
                    </li>
                    <li className="flex items-center justify-between py-3.5 border-b">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowDownIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">freepik sales</h3>
                          <p className="text-xs font-normal text-[#718EBF]">25 jan, 10.40 pm</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-green">+$750</p>
                    </li>

                    <li className="flex items-center justify-between py-3.5 border-b">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowUpIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">mobile service</h3>
                          <p className="text-xs font-normal text-[#718EBF]">20 jan, 10.40 pm</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-red">-$150</p>
                    </li>

                    <li className="flex items-center justify-between py-3.5 border-b">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowUpIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">wilson</h3>
                          <p className="text-xs font-normal text-[#718EBF]">15 jan, 03.29 pm</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-red">-$1050</p>
                    </li>

                    <li className="flex items-center justify-between py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowDownIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">emilly</h3>
                          <p className="text-xs font-normal text-[#718EBF]">14 jan, 10.40 pm</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-green">+$840</p>
                    </li>
                  </ul>
                </TabPanel>

                <TabPanel className="p-0 bg-transparent font-inter">
                  <ul className="bg-white p-5 rounded-2xl shadow mt-4 w-full">
                    <li className="flex items-center justify-between border-b py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowUpIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">spotify subscription</h3>
                          <p className="text-xs font-normal text-[#718EBF]">28 jan, 12.30 am</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-red">-$2,500</p>
                    </li>
                    <li className="flex items-center justify-between py-3.5 border-b">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowDownIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">freepik sales</h3>
                          <p className="text-xs font-normal text-[#718EBF]">25 jan, 10.40 pm</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-green">+$750</p>
                    </li>

                    <li className="flex items-center justify-between py-3.5 border-b">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowUpIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">mobile service</h3>
                          <p className="text-xs font-normal text-[#718EBF]">20 jan, 10.40 pm</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-red">-$150</p>
                    </li>

                    <li className="flex items-center justify-between py-3.5 border-b">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowUpIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">wilson</h3>
                          <p className="text-xs font-normal text-[#718EBF]">15 jan, 03.29 pm</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-red">-$1050</p>
                    </li>

                    <li className="flex items-center justify-between py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowDownIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">emilly</h3>
                          <p className="text-xs font-normal text-[#718EBF]">14 jan, 10.40 pm</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-green">+$840</p>
                    </li>
                  </ul>
                </TabPanel>

                <TabPanel className="p-0 bg-transparent font-inter">
                  <ul className="bg-white p-5 rounded-2xl shadow mt-4 w-full">
                    <li className="flex items-center justify-between border-b py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowUpIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">spotify subscription</h3>
                          <p className="text-xs font-normal text-[#718EBF]">28 jan, 12.30 am</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-red">-$2,500</p>
                    </li>
                    <li className="flex items-center justify-between py-3.5 border-b">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowDownIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">freepik sales</h3>
                          <p className="text-xs font-normal text-[#718EBF]">25 jan, 10.40 pm</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-green">+$750</p>
                    </li>

                    <li className="flex items-center justify-between py-3.5 border-b">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowUpIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">mobile service</h3>
                          <p className="text-xs font-normal text-[#718EBF]">20 jan, 10.40 pm</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-red">-$150</p>
                    </li>

                    <li className="flex items-center justify-between py-3.5 border-b">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowUpIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">wilson</h3>
                          <p className="text-xs font-normal text-[#718EBF]">15 jan, 03.29 pm</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-red">-$1050</p>
                    </li>

                    <li className="flex items-center justify-between py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowDownIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">emilly</h3>
                          <p className="text-xs font-normal text-[#718EBF]">14 jan, 10.40 pm</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-green">+$840</p>
                    </li>
                  </ul>
                </TabPanel>
              </TabPanels>
            </TabGroup>

            <TabGroup className="hidden lg:block">
              <TabList className="rounded-none bg-transparent border-b border-gray-200 flex items-center justify-center lg:justify-start gap-12">
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
                  <div className="overflow-x-auto bg-white p-5 rounded-2xl">
                    <table className="!w-full">
                      <thead>
                        <tr>
                          <th className="px-3 py-4 text-[#718EBF] text-left whitespace-nowrap font-medium text-xs capitalize min-w-auto tracking-wider">
                            Description
                          </th>
                          <th className="px-3 py-4 text-[#718EBF] text-left whitespace-nowrap font-medium text-xs capitalize min-w-auto tracking-wider">
                            Transaction ID
                          </th>
                          <th className="px-3 py-4 text-[#718EBF] text-left whitespace-nowrap font-medium text-xs capitalize min-w-auto tracking-wider">
                            Type
                          </th>
                          <th className="px-3 py-4 text-[#718EBF] text-left whitespace-nowrap font-medium text-xs capitalize min-w-auto tracking-wider">
                            Card
                          </th>
                          <th className="px-3 py-4 text-[#718EBF] text-left whitespace-nowrap font-medium text-xs capitalize min-w-auto tracking-wider">
                            Date
                          </th>
                          <th className="px-3 py-4 text-[#718EBF] text-left whitespace-nowrap font-medium text-xs capitalize min-w-auto tracking-wider">
                            Amount
                          </th>
                          <th className="px-3 py-4 text-[#718EBF] text-left whitespace-nowrap font-medium text-xs capitalize min-w-auto tracking-wider">
                            Reciept
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <span className="border border-[#718EBF] h-7 w-7 xl:w-9 xl:h-9 xl:border-2 flex items-center justify-center rounded-full">
                                <ArrowUpIcon />
                              </span>

                              <p className="text-xs capitalize font-normal text-affiliate-black shrink-0 flex-grow">
                                spotify subscription
                              </p>
                            </div>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-normal text-affiliate-black">#12548796</p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-normal text-affiliate-black">Shopping</p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-normal text-affiliate-black">1234 ****</p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-normal text-affiliate-black">
                              28 Jan, 12.30 AM
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-medium text-affiliate-red">-$2,500</p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <button className="px-3 py-1.5 rounded-3xl ring-2 ring-[#1814F3] text-[#1814F3] text-xs xl:text-sm font-normal">
                              Download
                            </button>
                          </td>
                        </tr>

                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <span className="border border-[#718EBF] h-7 w-7 xl:w-9 xl:h-9 xl:border-2 flex items-center justify-center rounded-full">
                                <ArrowDownIcon />
                              </span>

                              <p className="text-xs capitalize font-normal text-affiliate-black shrink-0 flex-grow">
                                Freepik Sales
                              </p>
                            </div>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-normal text-affiliate-black">#12548796</p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-normal text-affiliate-black">Transfer</p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-normal text-affiliate-black">1234 ****</p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-normal text-affiliate-black">
                              25 Jan, 10.40 PM
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-medium text-affiliate-green">+$750</p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <button className="px-3 py-1.5 rounded-3xl ring-2 ring-[#1814F3] text-[#1814F3] text-xs xl:text-sm font-normal">
                              Download
                            </button>
                          </td>
                        </tr>

                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <span className="border border-[#718EBF] h-7 w-7 xl:w-9 xl:h-9 xl:border-2 flex items-center justify-center rounded-full">
                                <ArrowUpIcon />
                              </span>

                              <p className="text-xs capitalize font-normal text-affiliate-black shrink-0 flex-grow">
                                Mobile Service
                              </p>
                            </div>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-normal text-affiliate-black">#12548796</p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-normal text-affiliate-black">Service</p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-normal text-affiliate-black">1234 ****</p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-normal text-affiliate-black">
                              20 Jan, 10.40 PM
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-medium text-affiliate-red">-150</p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <button className="px-3 py-1.5 rounded-3xl ring-2 ring-[#1814F3] text-[#1814F3] text-xs xl:text-sm font-normal">
                              Download
                            </button>
                          </td>
                        </tr>

                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <span className="border border-[#718EBF] h-7 w-7 xl:w-9 xl:h-9 xl:border-2 flex items-center justify-center rounded-full">
                                <ArrowUpIcon />
                              </span>

                              <p className="text-xs capitalize font-normal text-affiliate-black shrink-0 flex-grow">
                                Wilson
                              </p>
                            </div>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-normal text-affiliate-black">#12548796</p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-normal text-affiliate-black">Transfer</p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-normal text-affiliate-black">1234 ****</p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-normal text-affiliate-black">
                              15 Jan, 03.29 PM
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-medium text-affiliate-red">-1050</p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <button className="px-3 py-1.5 rounded-3xl ring-2 ring-[#1814F3] text-[#1814F3] text-xs xl:text-sm font-normal">
                              Download
                            </button>
                          </td>
                        </tr>

                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <span className="border border-[#718EBF] h-7 w-7 xl:w-9 xl:h-9 xl:border-2 flex items-center justify-center rounded-full">
                                <ArrowDownIcon />
                              </span>

                              <p className="text-xs capitalize font-normal text-affiliate-black shrink-0 flex-grow">
                                Emilly
                              </p>
                            </div>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-normal text-affiliate-black">#12548796</p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-normal text-affiliate-black">Transfer</p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-normal text-affiliate-black">1234 ****</p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-normal text-affiliate-black">
                              14 Jan, 10.40 PM
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs font-medium text-affiliate-green">+840</p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <button className="px-3 py-1.5 rounded-3xl ring-2 ring-[#1814F3] text-[#1814F3] text-xs xl:text-sm font-normal">
                              Download
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TabPanel>

                <TabPanel className="p-0 bg-transparent font-inter">
                  <ul className="bg-white p-5 rounded-2xl shadow mt-4 w-full">
                    <li className="flex items-center justify-between border-b py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowUpIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">spotify subscription</h3>
                          <p className="text-xs font-normal text-[#718EBF]">28 jan, 12.30 am</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-red">-$2,500</p>
                    </li>
                    <li className="flex items-center justify-between py-3.5 border-b">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowDownIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">freepik sales</h3>
                          <p className="text-xs font-normal text-[#718EBF]">25 jan, 10.40 pm</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-green">+$750</p>
                    </li>

                    <li className="flex items-center justify-between py-3.5 border-b">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowUpIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">mobile service</h3>
                          <p className="text-xs font-normal text-[#718EBF]">20 jan, 10.40 pm</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-red">-$150</p>
                    </li>

                    <li className="flex items-center justify-between py-3.5 border-b">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowUpIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">wilson</h3>
                          <p className="text-xs font-normal text-[#718EBF]">15 jan, 03.29 pm</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-red">-$1050</p>
                    </li>

                    <li className="flex items-center justify-between py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowDownIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">emilly</h3>
                          <p className="text-xs font-normal text-[#718EBF]">14 jan, 10.40 pm</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-green">+$840</p>
                    </li>
                  </ul>
                </TabPanel>

                <TabPanel className="p-0 bg-transparent font-inter">
                  <ul className="bg-white p-5 rounded-2xl shadow mt-4 w-full">
                    <li className="flex items-center justify-between border-b py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowUpIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">spotify subscription</h3>
                          <p className="text-xs font-normal text-[#718EBF]">28 jan, 12.30 am</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-red">-$2,500</p>
                    </li>
                    <li className="flex items-center justify-between py-3.5 border-b">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowDownIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">freepik sales</h3>
                          <p className="text-xs font-normal text-[#718EBF]">25 jan, 10.40 pm</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-green">+$750</p>
                    </li>

                    <li className="flex items-center justify-between py-3.5 border-b">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowUpIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">mobile service</h3>
                          <p className="text-xs font-normal text-[#718EBF]">20 jan, 10.40 pm</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-red">-$150</p>
                    </li>

                    <li className="flex items-center justify-between py-3.5 border-b">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowUpIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">wilson</h3>
                          <p className="text-xs font-normal text-[#718EBF]">15 jan, 03.29 pm</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-red">-$1050</p>
                    </li>

                    <li className="flex items-center justify-between py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                          <ArrowDownIcon />
                        </span>

                        <div>
                          <h3 className="text-xs capitalize font-medium">emilly</h3>
                          <p className="text-xs font-normal text-[#718EBF]">14 jan, 10.40 pm</p>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-affiliate-green">+$840</p>
                    </li>
                  </ul>
                </TabPanel>
              </TabPanels>
            </TabGroup>
            <Pagination
              page={page}
              next={handleNextPage}
              prev={handlePreviousPage}
              hasNextPage={false}
              totalPages={10}
              goToPage={handleGoToPage}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};
