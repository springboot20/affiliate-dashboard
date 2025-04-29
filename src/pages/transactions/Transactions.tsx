import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import chip from "@/assets/Chip_Card.png";
import chipGray from "@/assets/Chip_Card-gray.png";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CardTypeBlackIcon,
  CardTypeIcon,
  MyExpense,
} from "@/components/icons/Icons";
import { PlusIcon } from "@heroicons/react/24/outline";
import { classNames, formatCardExpiry, formatCardNumber } from "@/utils";
import { Pagination } from "@/components/Pagination";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useGetUserCardsQuery } from "@/features/cards/card.slice";

export const Transactions = () => {
  const [width, setWidth] = useState<number>(0);
  const cardSlider = useRef<HTMLDivElement>(null);

  const { data } = useGetUserCardsQuery();
  const cards = useMemo(() => data?.data?.cards, [data]);

  useEffect(() => {
    if (cardSlider.current !== null) {
      setWidth(cardSlider.current?.scrollWidth - cardSlider.current?.offsetWidth);
    }
  }, []);
  return (
    <section className="px-2 mt-[9rem] lg:mt-[5.5rem] w-full max-w-full xl:max-w-7xl xl:mx-auto">
      <div className="w-full flex flex-wrap gap-2.5">
        {/* Card section */}
        <div className="shrink-0 flex-grow md:max-w-full lg:!max-w-[30rem] xl:!max-w-2xl 2xl:!max-w-3xl w-full">
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
          <motion.div ref={cardSlider} className="overflow-hidden max-w-full mt-2.5">
            <motion.div
              drag={"x"}
              dragConstraints={{ right: 0, left: -width }}
              className="flex items-start gap-3 max-w-full flex-1 font-lato"
            >
              {React.Children.toArray(
                (cards ?? [])?.slice(0, 2)?.map((card: any) => {
                  return (
                    <div
                      className={classNames(
                        "border flex-grow shrink-0 relative p-3.5 font-lato before:absolute before:content-[' '] before:bottom-0 before:h-12 xl:before:h-14 before:left-0 before:right-0 rounded-2xl space-y-4 lg:space-y-2 xl:space-y-6 flex-grow w-full md:w-1/2 ",
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
              )}
            </motion.div>
          </motion.div>
        </div>

        {/*  */}
        <div className="lg:mt-0 xl:mt-1.5 flex-grow shrink-0 lg:w-0 2xl:w-fit">
          <h3 className="text-base lg:text-xl font-semibold text-affiliate-blue capitalize">
            my expense
          </h3>

          <div className="bg-white p-3.5 rounded-2xl shadow mt-4 lg:hidden">
            <MyExpense className="w-full" />
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="245"
            height="170"
            viewBox="0 0 245 170"
            fill="none"
            className="mt-4 hidden xl:hidden lg:block"
          >
            <rect width="245" height="170" rx="20" fill="white" />
            <path
              d="M146.933 30.0909H147.836L147.84 29.1151C149.668 28.983 150.717 27.9773 150.721 26.5497C150.717 25.0369 149.468 24.3466 148.156 24.0355L147.874 23.9631L147.891 21.5298C148.573 21.6491 149.012 22.0582 149.08 22.6719H150.602C150.576 21.3168 149.511 20.3281 147.9 20.1747L147.904 19.1818H147.001L146.996 20.1747C145.398 20.3366 144.248 21.3168 144.252 22.7273C144.252 23.9801 145.143 24.7003 146.579 25.071L146.962 25.169L146.945 27.7472C146.183 27.6278 145.633 27.1932 145.577 26.4219H144.022C144.082 28.0199 145.181 28.9702 146.937 29.1151L146.933 30.0909ZM147.849 27.7472L147.866 25.4077C148.641 25.6335 149.136 25.9318 149.14 26.5369C149.136 27.1676 148.629 27.6193 147.849 27.7472ZM146.971 23.733C146.383 23.5455 145.846 23.2344 145.854 22.6293C145.859 22.0795 146.272 21.6534 146.988 21.5298L146.971 23.733ZM155.595 20.2727H154.091L151.922 21.6662V23.1151L153.963 21.8111H154.014V29H155.595V20.2727ZM157.811 29H163.794V27.679H159.993V27.6193L161.497 26.0895C163.193 24.4616 163.662 23.669 163.662 22.6847C163.662 21.223 162.473 20.1534 160.717 20.1534C158.987 20.1534 157.76 21.2273 157.76 22.8849H159.264C159.264 21.9943 159.826 21.4361 160.696 21.4361C161.527 21.4361 162.145 21.9432 162.145 22.7656C162.145 23.4943 161.701 24.0142 160.841 24.8878L157.811 27.858V29ZM167.092 27.8068H165.728L165.699 28.2841C165.626 29.4389 165.324 30.6151 165.2 31.1307H166.24C166.444 30.5938 166.917 29.3494 167.037 28.2756L167.092 27.8068ZM171.732 29.1193C173.577 29.1193 174.864 27.8665 174.864 26.1321C174.864 24.4531 173.696 23.2429 172.111 23.2429C171.403 23.2429 170.777 23.5241 170.453 23.9077H170.402L170.653 21.5938H174.408V20.2727H169.345L168.889 24.7727L170.317 25.0071C170.611 24.6832 171.165 24.4659 171.689 24.4702C172.648 24.4744 173.338 25.1818 173.334 26.1705C173.338 27.1463 172.665 27.8409 171.732 27.8409C170.943 27.8409 170.308 27.3423 170.253 26.6264H168.719C168.761 28.0753 170.027 29.1193 171.732 29.1193ZM179.517 29.1662C181.622 29.1705 182.879 27.5085 182.879 24.6449C182.879 21.7983 181.614 20.1534 179.517 20.1534C177.42 20.1534 176.159 21.794 176.155 24.6449C176.155 27.5043 177.412 29.1662 179.517 29.1662ZM179.517 27.8324C178.43 27.8324 177.749 26.7415 177.753 24.6449C177.757 22.5653 178.435 21.4702 179.517 21.4702C180.604 21.4702 181.281 22.5653 181.286 24.6449C181.286 26.7415 180.608 27.8324 179.517 27.8324ZM187.521 29.1662C189.626 29.1705 190.883 27.5085 190.883 24.6449C190.883 21.7983 189.618 20.1534 187.521 20.1534C185.424 20.1534 184.163 21.794 184.159 24.6449C184.159 27.5043 185.416 29.1662 187.521 29.1662ZM187.521 27.8324C186.434 27.8324 185.752 26.7415 185.757 24.6449C185.761 22.5653 186.439 21.4702 187.521 21.4702C188.608 21.4702 189.285 22.5653 189.289 24.6449C189.289 26.7415 188.612 27.8324 187.521 27.8324Z"
              fill="#343C6A"
            />
            <path
              d="M19.7175 152L20.5953 149.528H24.1238L25.0016 152H26.1096L22.905 143.273H21.8141L18.6096 152H19.7175ZM20.9277 148.591L22.3255 144.653H22.3936L23.7914 148.591H20.9277ZM31.4576 149.324C31.4576 150.551 30.5201 151.114 29.7701 151.114C28.9348 151.114 28.3382 150.5 28.3382 149.545V145.455H27.3326V149.614C27.3326 151.284 28.2189 152.085 29.4462 152.085C30.4348 152.085 31.0826 151.557 31.3894 150.892H31.4576V152H32.4632V145.455H31.4576V149.324ZM36.9473 154.591C38.5154 154.591 39.7768 153.875 39.7768 152.188V145.455H38.8052V146.494H38.7029C38.4814 146.153 38.0723 145.369 36.7939 145.369C35.1404 145.369 33.9984 146.682 33.9984 148.693C33.9984 150.739 35.1916 151.898 36.7768 151.898C38.0552 151.898 38.4643 151.148 38.6859 150.79H38.7711V152.119C38.7711 153.21 38.0041 153.705 36.9473 153.705C35.7583 153.705 35.3407 153.078 35.0723 152.716L34.2711 153.278C34.6802 153.964 35.4856 154.591 36.9473 154.591ZM36.9132 150.994C35.6518 150.994 35.0041 150.04 35.0041 148.676C35.0041 147.347 35.6348 146.273 36.9132 146.273C38.1404 146.273 38.7882 147.261 38.7882 148.676C38.7882 150.125 38.1234 150.994 36.9132 150.994Z"
              fill="#718EBF"
            />
            <rect x="19" y="65" width="22" height="69" rx="7" fill="#EDF0F7" />
            <path
              d="M58.8549 145.455H59.8777C59.8308 144.138 58.6163 143.153 56.9288 143.153C55.2583 143.153 53.9458 144.125 53.9458 145.591C53.9458 146.767 54.7981 147.466 56.1618 147.858L57.2356 148.165C58.1561 148.42 58.9743 148.744 58.9743 149.614C58.9743 150.568 58.0538 151.199 56.8436 151.199C55.8038 151.199 54.8833 150.739 54.7981 149.75H53.7072C53.8095 151.182 54.9686 152.153 56.8436 152.153C58.8549 152.153 59.997 151.045 59.997 149.631C59.997 147.994 58.4458 147.466 57.5424 147.227L56.6561 146.989C56.0083 146.818 54.9686 146.477 54.9686 145.54C54.9686 144.705 55.7356 144.091 56.8947 144.091C57.9515 144.091 58.7527 144.594 58.8549 145.455ZM64.3425 152.136C65.6721 152.136 66.6436 151.472 66.9505 150.483L65.9789 150.21C65.7232 150.892 65.1309 151.233 64.3425 151.233C63.1621 151.233 62.3482 150.47 62.3013 149.068H67.0527V148.642C67.0527 146.205 65.6039 145.369 64.2402 145.369C62.4675 145.369 61.2914 146.767 61.2914 148.778C61.2914 150.79 62.4505 152.136 64.3425 152.136ZM62.3013 148.199C62.3695 147.18 63.0897 146.273 64.2402 146.273C65.3311 146.273 66.03 147.091 66.03 148.199H62.3013ZM68.5826 154.455H69.5882V150.994H69.6735C69.8951 151.352 70.3212 152.136 71.5826 152.136C73.2189 152.136 74.361 150.824 74.361 148.744C74.361 146.682 73.2189 145.369 71.5655 145.369C70.2871 145.369 69.8951 146.153 69.6735 146.494H69.5542V145.455H68.5826V154.455ZM69.5712 148.727C69.5712 147.261 70.2189 146.273 71.4462 146.273C72.7246 146.273 73.3553 147.347 73.3553 148.727C73.3553 150.125 72.7076 151.233 71.4462 151.233C70.236 151.233 69.5712 150.21 69.5712 148.727Z"
              fill="#718EBF"
            />
            <rect x="53" y="23" width="22" height="111" rx="7" fill="#EDF0F7" />
            <path
              d="M96.8189 147.636C96.8189 144.875 95.1996 143.153 92.9666 143.153C90.7337 143.153 89.1143 144.875 89.1143 147.636C89.1143 150.398 90.7337 152.119 92.9666 152.119C95.1996 152.119 96.8189 150.398 96.8189 147.636ZM95.7962 147.636C95.7962 149.903 94.5518 151.131 92.9666 151.131C91.3814 151.131 90.1371 149.903 90.1371 147.636C90.1371 145.369 91.3814 144.142 92.9666 144.142C94.5518 144.142 95.7962 145.369 95.7962 147.636ZM101.119 152.136C102.567 152.136 103.522 151.25 103.692 150.091H102.687C102.499 150.807 101.903 151.233 101.119 151.233C99.9254 151.233 99.1584 150.244 99.1584 148.727C99.1584 147.244 99.9425 146.273 101.119 146.273C102.005 146.273 102.533 146.818 102.687 147.415H103.692C103.522 146.188 102.482 145.369 101.102 145.369C99.3288 145.369 98.1527 146.767 98.1527 148.761C98.1527 150.722 99.2777 152.136 101.119 152.136ZM108.009 145.455H106.612V143.886H105.606V145.455H104.617V146.307H105.606V150.398C105.606 151.54 106.526 152.085 107.379 152.085C107.754 152.085 107.992 152.017 108.129 151.966L107.924 151.062C107.839 151.08 107.702 151.114 107.481 151.114C107.038 151.114 106.612 150.977 106.612 150.125V146.307H108.009V145.455Z"
              fill="#718EBF"
            />
            <rect x="87" y="60" width="22" height="74" rx="7" fill="#EDF0F7" />
            <path
              d="M129.157 144.273H128.117V151.142H128.032L123.259 144.273H122.237V153H123.293V146.148H123.379L128.134 153H129.157V144.273ZM133.794 153.136C135.567 153.136 136.76 151.79 136.76 149.761C136.76 147.716 135.567 146.369 133.794 146.369C132.022 146.369 130.828 147.716 130.828 149.761C130.828 151.79 132.022 153.136 133.794 153.136ZM133.794 152.233C132.448 152.233 131.834 151.074 131.834 149.761C131.834 148.449 132.448 147.273 133.794 147.273C135.141 147.273 135.755 148.449 135.755 149.761C135.755 151.074 135.141 152.233 133.794 152.233ZM143.413 146.455H142.322L140.516 151.67H140.447L138.641 146.455H137.55L139.97 153H140.993L143.413 146.455Z"
              fill="#718EBF"
            />
            <rect x="122" y="95" width="22" height="39" rx="7" fill="#EDF0F7" />
            <path
              d="M160.094 152C162.753 152 164.253 150.347 164.253 147.619C164.253 144.909 162.753 143.273 160.213 143.273H157.401V152H160.094ZM158.457 151.062V144.21H160.145C162.19 144.21 163.23 145.506 163.23 147.619C163.23 149.75 162.19 151.062 160.026 151.062H158.457ZM168.634 152.136C169.963 152.136 170.935 151.472 171.241 150.483L170.27 150.21C170.014 150.892 169.422 151.233 168.634 151.233C167.453 151.233 166.639 150.47 166.592 149.068H171.344V148.642C171.344 146.205 169.895 145.369 168.531 145.369C166.759 145.369 165.582 146.767 165.582 148.778C165.582 150.79 166.741 152.136 168.634 152.136ZM166.592 148.199C166.661 147.18 167.381 146.273 168.531 146.273C169.622 146.273 170.321 147.091 170.321 148.199H166.592ZM175.533 152.136C176.982 152.136 177.936 151.25 178.107 150.091H177.101C176.913 150.807 176.317 151.233 175.533 151.233C174.339 151.233 173.572 150.244 173.572 148.727C173.572 147.244 174.357 146.273 175.533 146.273C176.419 146.273 176.947 146.818 177.101 147.415H178.107C177.936 146.188 176.896 145.369 175.516 145.369C173.743 145.369 172.567 146.767 172.567 148.761C172.567 150.722 173.692 152.136 175.533 152.136Z"
              fill="#718EBF"
            />
            <g filter="url(#filter0_d_150_515)">
              <rect x="157" y="35" width="22" height="99" rx="7" fill="#16DBCC" />
            </g>
            <path
              d="M196.749 143.273V149.511C196.749 150.598 196.229 151.182 195.317 151.182C194.487 151.182 193.886 150.696 193.886 149.955H192.846C192.846 151.297 193.886 152.119 195.317 152.119C196.835 152.119 197.806 151.186 197.806 149.511V143.273H196.749ZM201.714 152.153C202.856 152.153 203.452 151.54 203.657 151.114H203.708V152H204.714V147.688C204.714 145.608 203.129 145.369 202.293 145.369C201.305 145.369 200.18 145.71 199.668 146.903L200.623 147.244C200.844 146.767 201.369 146.256 202.327 146.256C203.252 146.256 203.708 146.746 203.708 147.585V147.619C203.708 148.105 203.214 148.062 202.021 148.216C200.806 148.374 199.481 148.642 199.481 150.142C199.481 151.42 200.469 152.153 201.714 152.153ZM201.867 151.25C201.066 151.25 200.487 150.892 200.487 150.193C200.487 149.426 201.185 149.188 201.969 149.085C202.396 149.034 203.538 148.915 203.708 148.71V149.631C203.708 150.449 203.06 151.25 201.867 151.25ZM207.555 148.062C207.555 146.92 208.262 146.273 209.225 146.273C210.159 146.273 210.725 146.882 210.725 147.909V152H211.731V147.841C211.731 146.17 210.841 145.369 209.515 145.369C208.527 145.369 207.913 145.812 207.606 146.477H207.521V145.455H206.549V152H207.555V148.062Z"
              fill="#718EBF"
            />
            <rect x="191" y="69" width="22" height="65" rx="7" fill="#EDF0F7" />
            <defs>
              <filter
                id="filter0_d_150_515"
                x="122"
                y="0"
                width="92"
                height="169"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="17.5" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.0705882 0 0 0 0 0.533333 0 0 0 0 0.494771 0 0 0 0.2 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_150_515"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_150_515"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>

          <div className="p-3.5 rounded-2xl w-auto mt-2.5 flex-grow shrink-0 bg-white h-[12.5rem] hidden xl:!flex"></div>
        </div>

        {/*  */}
        <div className="mt-4 lg:w-full lg:flex-grow w-full">
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
                          "text-xs xl:text-base px-0 h-10 capitalize outline-none focus:outline-none"
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
                          "text-xs xl:text-base px-0 h-10 capitalize outline-none focus:outline-none"
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
                          "text-xs xl:text-base px-0 h-10 capitalize outline-none focus:outline-none"
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
                          "text-xs xl:text-base px-0 h-10 capitalize outline-none focus:outline-none"
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
                          "text-xs xl:text-base px-0 h-10 capitalize outline-none focus:outline-none"
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
                          "text-xs xl:text-base px-0 h-10 capitalize outline-none focus:outline-none"
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
                  <div className="overflow-x-scroll bg-white p-5 rounded-2xl">
                    <table className="!w-full">
                      <thead>
                        <tr>
                          <th className="px-3 py-4 text-[#718EBF] text-left whitespace-nowrap font-medium text-xs xl:text-base capitalize min-w-auto tracking-wider">
                            Description
                          </th>
                          <th className="px-3 py-4 text-[#718EBF] text-left whitespace-nowrap font-medium text-xs xl:text-base capitalize min-w-auto tracking-wider">
                            Transaction ID
                          </th>
                          <th className="px-3 py-4 text-[#718EBF] text-left whitespace-nowrap font-medium text-xs xl:text-base capitalize min-w-auto tracking-wider">
                            Type
                          </th>
                          <th className="px-3 py-4 text-[#718EBF] text-left whitespace-nowrap font-medium text-xs xl:text-base capitalize min-w-auto tracking-wider">
                            Card
                          </th>
                          <th className="px-3 py-4 text-[#718EBF] text-left whitespace-nowrap font-medium text-xs xl:text-base capitalize min-w-auto tracking-wider">
                            Date
                          </th>
                          <th className="px-3 py-4 text-[#718EBF] text-left whitespace-nowrap font-medium text-xs xl:text-base capitalize min-w-auto tracking-wider">
                            Amount
                          </th>
                          <th className="px-3 py-4 text-[#718EBF] text-left whitespace-nowrap font-medium text-xs xl:text-base capitalize min-w-auto tracking-wider">
                            Reciept
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <span className="border border-[#718EBF] h-7 w-7 xl:w-9 xl:h-9 xl:border-2 flex items-center justify-center rounded-full">
                                <ArrowUpIcon />
                              </span>

                              <p className="text-xs xl:text-base capitalize font-normal text-affiliate-black shrink-0 flex-grow">
                                spotify subscription
                              </p>
                            </div>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-normal text-affiliate-black">
                              #12548796
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-normal text-affiliate-black">
                              Shopping
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-normal text-affiliate-black">
                              1234 ****
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-normal text-affiliate-black">
                              28 Jan, 12.30 AM
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-medium text-affiliate-red">
                              -$2,500
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <button className="px-3 py-1.5 rounded-3xl ring-2 ring-affiliate-blue text-affiliate-blue text-xs xl:text-sm font-normal">
                              Download
                            </button>
                          </td>
                        </tr>

                        <tr>
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <span className="border border-[#718EBF] h-7 w-7 xl:w-9 xl:h-9 xl:border-2 flex items-center justify-center rounded-full">
                                <ArrowDownIcon />
                              </span>

                              <p className="text-xs xl:text-base capitalize font-normal text-affiliate-black shrink-0 flex-grow">
                                Freepik Sales
                              </p>
                            </div>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-normal text-affiliate-black">
                              #12548796
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-normal text-affiliate-black">
                              Transfer
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-normal text-affiliate-black">
                              1234 ****
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-normal text-affiliate-black">
                              25 Jan, 10.40 PM
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-medium text-affiliate-green">
                              +$750
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <button className="px-3 py-1.5 rounded-3xl ring-2 ring-affiliate-blue text-affiliate-blue text-xs xl:text-sm font-normal">
                              Download
                            </button>
                          </td>
                        </tr>

                        <tr>
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <span className="border border-[#718EBF] h-7 w-7 xl:w-9 xl:h-9 xl:border-2 flex items-center justify-center rounded-full">
                                <ArrowUpIcon />
                              </span>

                              <p className="text-xs xl:text-base capitalize font-normal text-affiliate-black shrink-0 flex-grow">
                                Mobile Service
                              </p>
                            </div>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-normal text-affiliate-black">
                              #12548796
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-normal text-affiliate-black">
                              Service
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-normal text-affiliate-black">
                              1234 ****
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-normal text-affiliate-black">
                              20 Jan, 10.40 PM
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-medium text-affiliate-red">
                              -150
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <button className="px-3 py-1.5 rounded-3xl ring-2 ring-affiliate-blue text-affiliate-blue text-xs xl:text-sm font-normal">
                              Download
                            </button>
                          </td>
                        </tr>

                        <tr>
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <span className="border border-[#718EBF] h-7 w-7 xl:w-9 xl:h-9 xl:border-2 flex items-center justify-center rounded-full">
                                <ArrowUpIcon />
                              </span>

                              <p className="text-xs xl:text-base capitalize font-normal text-affiliate-black shrink-0 flex-grow">
                                Wilson
                              </p>
                            </div>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-normal text-affiliate-black">
                              #12548796
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-normal text-affiliate-black">
                              Transfer
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-normal text-affiliate-black">
                              1234 ****
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-normal text-affiliate-black">
                              15 Jan, 03.29 PM
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-medium text-affiliate-red">
                              -1050
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <button className="px-3 py-1.5 rounded-3xl ring-2 ring-affiliate-blue text-affiliate-blue text-xs xl:text-sm font-normal">
                              Download
                            </button>
                          </td>
                        </tr>

                        <tr>
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <span className="border border-[#718EBF] h-7 w-7 xl:w-9 xl:h-9 xl:border-2 flex items-center justify-center rounded-full">
                                <ArrowDownIcon />
                              </span>

                              <p className="text-xs xl:text-base capitalize font-normal text-affiliate-black shrink-0 flex-grow">
                                Emilly
                              </p>
                            </div>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-normal text-affiliate-black">
                              #12548796
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-normal text-affiliate-black">
                              Transfer
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-normal text-affiliate-black">
                              1234 ****
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-normal text-affiliate-black">
                              14 Jan, 10.40 PM
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <p className="text-xs xl:text-base font-medium text-affiliate-green">
                              +840
                            </p>
                          </td>

                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <button className="px-3 py-1.5 rounded-3xl ring-2 ring-affiliate-blue text-affiliate-blue text-xs xl:text-sm font-normal">
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
            <Pagination />
          </div>
        </div>
      </div>
    </section>
  );
};
