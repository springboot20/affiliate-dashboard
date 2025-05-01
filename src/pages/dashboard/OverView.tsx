import React, { useState, useEffect, useRef, useMemo } from "react";
import chip from "@/assets/Chip_Card.png";
import chipBlack from "@/assets/Chip_Card_b.png";
import imgOne from "@/assets/img-01.jpg";
import imgTwo from "@/assets/img-02.jpg";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { CardTypeBlackIcon, CardTypeIcon, PaperIcon } from "@/components/icons/Icons";
import { Button } from "@material-tailwind/react";
import { useGetUserCardsQuery } from "@/features/cards/card.slice";
import { classNames, formatCardExpiry, formatCardNumber } from "@/utils";
import DashboardChart from "@/components/statistics/DashboardChart";
import { CreditCardLoader } from "@/components/loaders/credit-card.loader";

export const OverView = () => {
  const [width, setWidth] = useState<number>(0);
  const cardSlider = useRef<HTMLDivElement>(null);

  const options = useMemo(
    () => ({
      labels: ["Bill Expense", "Others", "Investment", "Entertainment"],
      colors: ["#FC7900", "#1814F3", "#FA00FF", "#343C6A"],
      legend: {
        show: true,
      },
      dataLabels: {
        enabled: true,
      },
    }),
    []
  );

  const bar_options = useMemo(
    () => ({
      // title: {
      //   text: "Order Counts",
      //   style: {
      //     fontFamily: "Inter, sans",
      //     fontSize: "20px",
      //   },
      // },
      colors: ["#28A745", "#FF5733"],
      chart: {
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      tooltip: {
        style: {
          fontFamily: "Poppins, sans-serif",
        },
      },
      dataLabels: {
        enabled: false,
      },
    }),
    []
  );

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

  return (
    <motion.section className="px-2 mt-[9rem] lg:mt-[5.5rem]">
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
        className="w-full grid grid-cols-1 lg:grid-cols-3 gap-2.5 xl:max-w-7xl xl:mx-auto"
      >
        {/* Card section */}
        <div className="col-span-full lg:col-span-2">
          <nav className="flex justify-between items-center">
            <h3 className="text-base font-semibold text-affiliate-blue lg:text-lg">My Cards</h3>
            <Button
              variant="text"
              className="text-sm px-2 py-1.5 font-semibold text-affiliate-blue capitalize !bg-transparent"
              ripple={false}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              See All
            </Button>
          </nav>
          <motion.div ref={cardSlider} className="overflow-hidden w-full mt-2.5 pb-2">
            <motion.div
              drag={"x"}
              dragConstraints={{ right: 0, left: -width }}
              className="flex items-start gap-3 lg:w-full flex-1 font-lato"
            >
              {isLoading || cards?.length === 0 || !data ? (
                <CreditCardLoader classname="flex-grow shrink-0 w-full md:w-1/2 h-full lg:h-40 xl:h-48" />
              ) : (
                React.Children.toArray(
                  (cards ?? [])?.slice(0, 2)?.map((card: any) => {
                    return (
                      <div
                        className={classNames(
                          "border flex-grow shrink-0 relative p-3.5 font-lato before:absolute before:content-[' '] before:bottom-0 before:h-12 xl:before:h-14 before:left-0 before:right-0 rounded-3xl space-y-4 lg:space-y-2 xl:space-y-6 w-full md:w-1/2",
                          card?.type?.includes("DEBIT")
                            ? "bg-white text-affiliate-black before:border-t"
                            : "before:bg-white/20 bg-gradient-to-br from-[#2D60FF] to-[#539BFF] text-white"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col items-start">
                            <span className="text-xs font-normal">Balance</span>
                            <span className="text-sm font-semibold">$5,764</span>
                          </div>
                          {card?.type?.includes("DEBIT") ? (
                            <img src={chipBlack} alt="chip icon" className="w-8" />
                          ) : (
                            <img src={chip} alt="chip icon" className="w-8" />
                          )}
                        </div>

                        <div className="flex items-center justify-between py-3.5">
                          <div>
                            <h2 className="text-xs font-normal uppercase">card holder</h2>
                            <p className="font-semibold text-sm">{card?.card_name}</p>
                          </div>

                          <div>
                            <h2 className="text-xs font-normal uppercase">valid thru</h2>
                            <p className="font-semibold text-sm">
                              {formatCardExpiry(card?.valid_thru)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold uppercase">
                            {formatCardNumber(card?.card_number)}{" "}
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

        {/* Transaction section */}
        <div className="col-span-1">
          <div className="flex items-center">
            <h3 className="text-base lg:text-xl font-semibold text-affiliate-blue capitalize">
              recent transactions
            </h3>
          </div>

          <ul className="space-y-3 lg:space-y-2 xs:bg-white p-3 xs:rounded-xl lg:border lg:shadow-sm mt-3.5 h-auto">
            <li className="xl:py-1.5 xl:px-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center h-12 w-12 lg:h-10 lg:w-10 rounded-full bg-[#FFF5D9]">
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 lg:w-4"
                  >
                    <path
                      d="M16.6475 21.9727H5.07129C4.4517 21.972 3.85767 21.7256 3.41955 21.2875C2.98144 20.8494 2.73502 20.2553 2.73438 19.6357V12.7271C2.73502 12.1075 2.98144 11.5134 3.41955 11.0753C3.85767 10.6372 4.4517 10.3908 5.07129 10.3901H16.6475C17.2671 10.3908 17.8611 10.6372 18.2992 11.0753C18.7373 11.5134 18.9837 12.1075 18.9844 12.7271V19.6357C18.9837 20.2553 18.7373 20.8494 18.2992 21.2875C17.8611 21.7256 17.2671 21.972 16.6475 21.9727ZM5.07129 11.855C4.84008 11.8552 4.61842 11.9472 4.45493 12.1107C4.29144 12.2742 4.19948 12.4958 4.19922 12.7271V19.6357C4.19948 19.867 4.29144 20.0886 4.45493 20.2521C4.61842 20.4156 4.84008 20.5076 5.07129 20.5078H16.6475C16.8787 20.5076 17.1003 20.4156 17.2638 20.2521C17.4273 20.0886 17.5193 19.867 17.5195 19.6357V12.7271C17.5193 12.4958 17.4273 12.2742 17.2638 12.1107C17.1003 11.9472 16.8787 11.8552 16.6475 11.855H5.07129Z"
                      fill="#FFBB38"
                    />
                    <path
                      d="M19.9297 18.0283H18.252C18.0577 18.0283 17.8714 17.9512 17.7341 17.8138C17.5967 17.6764 17.5195 17.4901 17.5195 17.2959C17.5195 17.1016 17.5967 16.9154 17.7341 16.778C17.8714 16.6406 18.0577 16.5635 18.252 16.5635H19.9297C20.1607 16.563 20.3821 16.4709 20.5454 16.3074C20.7087 16.144 20.8005 15.9224 20.8008 15.6914V8.78271C20.8007 8.55159 20.7089 8.32995 20.5456 8.16638C20.3823 8.00282 20.1608 7.91067 19.9297 7.91016H8.35352C8.12231 7.91041 7.90064 8.00238 7.73715 8.16587C7.57367 8.32935 7.4817 8.55102 7.48145 8.78223V11.1221C7.48145 11.3163 7.40428 11.5026 7.26692 11.64C7.12957 11.7773 6.94327 11.8545 6.74902 11.8545C6.55477 11.8545 6.36848 11.7773 6.23112 11.64C6.09377 11.5026 6.0166 11.3163 6.0166 11.1221V8.78271C6.01712 8.16304 6.26348 7.56889 6.70161 7.13067C7.13974 6.69244 7.73384 6.44596 8.35352 6.44531H19.9297C20.5492 6.44622 21.143 6.69282 21.581 7.13101C22.0189 7.5692 22.2651 8.16321 22.2656 8.78271V15.6914C22.265 16.3108 22.0187 16.9047 21.5808 17.3428C21.1429 17.7809 20.5491 18.0274 19.9297 18.0283Z"
                      fill="#FFBB38"
                    />
                    <path
                      d="M18.252 16.7378H3.4668C3.27255 16.7378 3.08625 16.6606 2.9489 16.5233C2.81154 16.3859 2.73438 16.1996 2.73438 16.0054V13.5454C2.73438 13.3512 2.81154 13.1649 2.9489 13.0275C3.08625 12.8902 3.27255 12.813 3.4668 12.813H18.252C18.4462 12.813 18.6325 12.8902 18.7699 13.0275C18.9072 13.1649 18.9844 13.3512 18.9844 13.5454V16.0054C18.9844 16.1996 18.9072 16.3859 18.7699 16.5233C18.6325 16.6606 18.4462 16.7378 18.252 16.7378ZM4.19922 15.273H17.5195V14.2778H4.19922V15.273Z"
                      fill="#FFBB38"
                    />
                  </svg>
                </span>
                <div className="flex flex-col items-start">
                  <p className="text-gray-700 text-sm font-medium">Deposit from my</p>
                  <span className="text-xs font-normal text-[#718EBF] capitalize">
                    28 january 2024
                  </span>
                </div>
              </div>
              <p className="text-affiliate-red text-xs font-medium">-$54.09</p>
            </li>

            <li className="xl:py-1.5 xl:px-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center h-12 w-12 lg:h-10 lg:w-10 rounded-full bg-[#E7EDFF]">
                  <svg
                    width="15"
                    height="18"
                    viewBox="0 0 15 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 lg:w-4"
                  >
                    <path
                      d="M13.385 4.98755C13.4151 3.8945 12.9744 2.84948 12.1985 2.07947C11.4227 1.30946 10.3743 0.876653 9.28123 0.875052H3.24998C3.10018 0.873124 2.95466 0.925072 2.83995 1.02143C2.72523 1.1178 2.64894 1.25216 2.62498 1.40005L0.487484 14.8063C0.474129 14.8951 0.480056 14.9857 0.504862 15.072C0.529667 15.1582 0.572769 15.2382 0.631234 15.3063C0.689322 15.376 0.761904 15.4323 0.843933 15.4712C0.925962 15.51 1.01547 15.5305 1.10623 15.5313H3.68748L3.54998 16.4001C3.53538 16.4901 3.54067 16.5822 3.56547 16.67C3.59027 16.7578 3.63398 16.8391 3.69354 16.9082C3.7531 16.9773 3.82707 17.0325 3.91024 17.07C3.99341 17.1074 4.08377 17.1262 4.17498 17.1251H7.08123C7.23013 17.1272 7.3749 17.0761 7.48949 16.981C7.60407 16.8859 7.68093 16.753 7.70623 16.6063L8.33123 12.7876H10.3C11.5322 12.7826 12.7124 12.29 13.5826 11.4175C14.4527 10.545 14.9421 9.36355 14.9437 8.1313V7.9563C14.9431 7.37667 14.8051 6.80543 14.5411 6.2894C14.2772 5.77337 13.8947 5.32724 13.385 4.98755ZM3.78123 2.12505H9.28123C9.93695 2.12706 10.5726 2.35124 11.0846 2.76101C11.5965 3.17077 11.9544 3.74194 12.1 4.3813C11.8296 4.31789 11.5527 4.28642 11.275 4.28755H6.06248C5.91268 4.28562 5.76716 4.33757 5.65244 4.43393C5.53773 4.5303 5.46144 4.66466 5.43748 4.81255L5.06873 7.12505C5.04221 7.29081 5.08262 7.46032 5.18108 7.59628C5.27954 7.73225 5.42797 7.82353 5.59373 7.85005C5.75949 7.87657 5.929 7.83616 6.06496 7.7377C6.20093 7.63925 6.29221 7.49081 6.31873 7.32505L6.60623 5.52505H11.2875C11.5871 5.52662 11.8838 5.58385 12.1625 5.6938C12.0437 6.67221 11.5716 7.57354 10.835 8.2284C10.0985 8.88327 9.14807 9.24658 8.16248 9.25005H5.26248C5.11359 9.24789 4.96881 9.29895 4.85423 9.39406C4.73965 9.48916 4.66278 9.62206 4.63748 9.7688L3.87498 14.2813H1.83748L3.78123 2.12505ZM13.6937 8.1313C13.6921 9.03203 13.3344 9.89558 12.6987 10.5337C12.0629 11.1717 11.2007 11.5326 10.3 11.5376H7.79998C7.65109 11.5354 7.50631 11.5865 7.39173 11.6816C7.27714 11.7767 7.20028 11.9096 7.17498 12.0563L6.54998 15.8751H4.89998L5.03748 15.0063L5.78748 10.5126H8.14998C9.31677 10.5091 10.4497 10.1198 11.3721 9.40539C12.2946 8.69092 12.9548 7.6914 13.25 6.56255C13.5401 6.96927 13.6953 7.45673 13.6937 7.9563V8.1313Z"
                      fill="#396AFF"
                    />
                  </svg>
                </span>
                <div className="flex flex-col items-start space-y-1">
                  <p className="text-gray-700 text-sm font-medium">Deposit Paypal</p>
                  <span className="text-xs font-normal text-[#718EBF] capitalize">
                    23 april 2024
                  </span>
                </div>
              </div>

              <p className="text-affiliate-green text-xs font-medium">+$2,500</p>
            </li>

            <li className="xl:py-1.5 xl:px-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center h-12 w-12 lg:h-10 lg:w-10 rounded-full bg-[#DCFAF8]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 lg:w-4"
                  >
                    <path
                      d="M10.0001 8.1281C10.3545 8.1281 10.6438 8.41674 10.6438 8.77109C10.6438 9.09443 10.9067 9.3565 11.23 9.3565C11.5526 9.3565 11.8154 9.09443 11.8154 8.77109C11.8154 7.97676 11.2979 7.30645 10.5855 7.06136V6.72916C10.5855 6.40656 10.3235 6.14301 10.0001 6.14301C9.67603 6.14301 9.41396 6.40656 9.41396 6.72916V7.06136C8.70158 7.30645 8.18556 7.97676 8.18556 8.77109C8.18556 9.77286 8.99908 10.5864 10.0001 10.5864C10.3545 10.5864 10.6438 10.8758 10.6438 11.2301C10.6438 11.5852 10.3545 11.8739 10.0001 11.8739C9.64577 11.8739 9.35712 11.5852 9.35712 11.2301C9.35712 10.9068 9.09431 10.644 8.77097 10.644C8.44689 10.644 8.18556 10.9068 8.18556 11.2301C8.18556 12.0244 8.70158 12.694 9.41396 12.9391V13.2713C9.41396 13.5954 9.67603 13.8582 10.0001 13.8582C10.3235 13.8582 10.5855 13.5954 10.5855 13.2713V12.9391C11.2979 12.694 11.8154 12.0244 11.8154 11.2301C11.8154 10.2291 11.0011 9.41482 10.0001 9.41482C9.64577 9.41482 9.35712 9.12618 9.35712 8.77109C9.35712 8.41674 9.64577 8.1281 10.0001 8.1281ZM14.9086 13.2536C15.1957 13.4049 15.5494 13.2949 15.7 13.01C16.1872 12.0894 16.4441 11.0485 16.4441 10.0002C16.4441 6.4479 13.5525 3.55701 10.0001 3.55701C6.44704 3.55701 3.55615 6.4479 3.55615 10.0002C3.55615 13.5533 6.44704 16.4442 10.0001 16.4442C11.0329 16.4442 12.059 16.1947 12.9678 15.7215C13.255 15.5731 13.3664 15.218 13.2173 14.9316C13.0682 14.6459 12.7146 14.5322 12.4267 14.6821C11.6744 15.0748 10.8572 15.2734 10.0001 15.2734C7.09298 15.2734 4.72697 12.9081 4.72697 10.0002C4.72697 7.09384 7.09298 4.72783 10.0001 4.72783C12.9072 4.72783 15.2733 7.09384 15.2733 10.0002C15.2733 10.8588 15.0621 11.71 14.665 12.4615C14.5129 12.7479 14.6221 13.1023 14.9086 13.2536ZM10.0001 1.2124C8.30294 1.2124 6.65522 1.69815 5.23561 2.61577C4.9632 2.79147 4.88569 3.15393 5.06139 3.4256C5.23782 3.69727 5.59882 3.77404 5.87196 3.59982C7.10037 2.80549 8.52957 2.3847 10.0001 2.3847C14.1999 2.3847 17.6156 5.80121 17.6156 10.0002C17.6156 14.2 14.1999 17.6165 10.0001 17.6165C5.80035 17.6165 2.38384 14.2 2.38384 10.0002C2.38384 8.54372 2.79651 7.12706 3.57829 5.9053C3.75251 5.63216 3.67279 5.26969 3.39964 5.09547C3.12724 4.92125 2.76477 5.00097 2.59129 5.27338C1.68917 6.68413 1.21228 8.32004 1.21228 10.0002C1.21228 14.8467 5.15367 18.7881 10.0001 18.7881C14.8458 18.7881 18.788 14.8467 18.788 10.0002C18.788 5.15526 14.8458 1.2124 10.0001 1.2124Z"
                      fill="#16DBCC"
                    />
                  </svg>
                </span>
                <div className="flex flex-col items-start space-y-1">
                  <p className="text-gray-700 text-sm font-medium">Jemi Willson</p>
                  <span className="text-xs font-normal text-[#718EBF] capitalize">
                    29 march 2024
                  </span>
                </div>
              </div>
              <p className="text-affiliate-green text-xs font-medium">+$5,385</p>
            </li>
          </ul>
        </div>

        {/* weekly section */}
        <div className="col-span-1 lg:col-span-2">
          <h3 className="text-base lg:text-xl font-bold text-affiliate-blue capitalize">
            weekly activity
          </h3>
          <div
            className="relative bg-white p-2 rounded-3xl min-h-52 md:min-h-80 mt-3"
            style={{
              height: "inherit",
            }}
          >
            <DashboardChart
              type="bar"
              options={{
                ...bar_options,
                xaxis: {
                  categories: [],
                },
                legend: {
                  show: false,
                },
                chart: {
                  ...bar_options.chart,
                  animations: {
                    animateGradually: {
                      delay: 300,
                    },
                  },
                },
              }}
              series={[
                {
                  name: "",
                  data: [100, 200, 400, 600],
                },
                {
                  name: "",
                  data: [50, 20, 45, 60],
                },
              ]}
              height={"100%"}
            />
          </div>
        </div>

        {/* Expense section */}
        <div className="col-span-1 h-full">
          <h3 className="text-base lg:text-xl font-bold text-affiliate-blue capitalize">
            expense statics
          </h3>

          <div className="bg-white rounded-3xl p-5 mt-3 min-h-52 md:min-h-80">
            <DashboardChart
              type="pie"
              series={[15, 35, 20, 30]}
              options={{
                ...options,
                tooltip: {
                  style: {
                    fontFamily: "Inter, sans",
                    fontSize: "14px",
                  },
                },
                legend: {
                  ...options.legend,
                  fontFamily: "Inter, sans",
                  fontWeight: 600,
                  fontSize: "12px",
                  position: "bottom",
                  horizontalAlign: "center",
                },
                dataLabels: {
                  ...options.dataLabels,
                  style: {
                    fontFamily: "Inter, sans",
                    fontWeight: 700,
                    fontSize: "14px",
                  },
                  formatter: (val) => {
                    return `${val}%`;
                  },
                },
              }}
              height={"100%"}
            />
          </div>
        </div>

        {/* Quick section */}
        <div className="space-y-4 col-span-1">
          <h3 className="text-base lg:text-xl font-bold text-affiliate-blue capitalize">
            quick transfer
          </h3>
          <div className="relative xs:bg-white xs:p-4 rounded-3xl lg:shadow-sm min-h-48 md:min-h-52 xl:min-h-72 flex flex-col justify-between">
            <div className="place-items-center grid grid-cols-3 max-w-[17rem] lg:max-w-[15rem] w-full">
              <div className="flex items-center flex-col gap-1 w-max">
                <div className="h-12 w-12 xs:h-20 xs:w-20 lg:!w-12 lg:!h-12 rounded-full border overflow-hidden relative">
                  <img
                    src={imgOne}
                    alt="transaction-figure"
                    className="absolute object-cover object-center"
                  />
                </div>

                <p className="text-center flex flex-col">
                  <span className="text-xs font-normal capitalize text-affiliate-black">
                    randy press
                  </span>
                  <span className="text-xs font-normal uppercase text-[#718EBF]">ceo</span>
                </p>
              </div>

              <div className="flex items-center flex-col gap-1 w-max">
                <div className="h-12 w-12 xs:h-20 xs:w-20 lg:!w-12 lg:!h-12 rounded-full border overflow-hidden relative">
                  <img
                    src={imgTwo}
                    alt="transaction-figure"
                    className="absolute object-cover object-center"
                  />
                </div>
                <p className="text-center flex flex-col">
                  <span className="text-xs font-normal capitalize text-affiliate-black">
                    livia bator
                  </span>
                  <span className="text-xs font-normal capitalize text-[#718EBF]">director</span>
                </p>
              </div>

              <div className="flex items-center flex-col gap-1 w-max">
                <div className="h-12 w-12 xs:h-20 xs:w-20 lg:!w-12 lg:!h-12 rounded-full border overflow-hidden relative">
                  <img
                    src={imgTwo}
                    alt="transaction-figure"
                    className="absolute object-cover h-full object-center"
                  />
                </div>
                <p className="text-center flex flex-col">
                  <span className="text-xs font-normal capitalize text-affiliate-black">
                    workman
                  </span>
                  <span className="text-xs font-normal capitalize text-[#718EBF]">designer</span>
                </p>
              </div>

              <button className="h-10 w-10 rounded-full flex items-center justify-center absolute -right-1 xs:right-8 xs:top-1/2 xs:-translate-y-1/2 top-14 shadow-sm border bg-white">
                <span className="sr-only">next button</span>
                <ChevronRightIcon className="h-6 text-[#718EBF]" strokeWidth={2} />
              </button>
            </div>

            <div className="flex flex-col gap-3 xl:gap-0 items-start xl:flex-row xl:items-center xl:justify-between ">
              <button className="text-sm lg:text-xs font-medium text-[#718EBF] capitalize shrink-0">
                write amount
              </button>
              <div className="w-full xl:w-44 h-9 shrink-0 rounded-[5rem] bg-[#EDF1F7] flex items-center justify-between sm:justify-normal relative p-3">
                <span className="text-[#718EBF] ml-2 text-sm lg:text-xs font-medium">525.05</span>
                <button className="py-1.5 h-full flex items-center space-x-3 px-5 lg:px-3.5 rounded-[5rem] bg-affiliate-deep-blue text-white absolute right-0">
                  <span className="capitalize text-sm lg:text-xs font-semibold">send</span>
                  <PaperIcon className="h-10 xs:w-7 lg:w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick section */}
        <div className="space-y-4 col-span-1 lg:col-span-2">
          <h3 className="text-base lg:text-xl font-bold text-affiliate-blue capitalize">
            balance history
          </h3>

          {/* <BalanceHistory className="w-full lg:hidden" /> */}

          <div className="rounded-3xl bg-white min-h-48 md:min-h-52 xl:min-h-72">
            <DashboardChart
              type="area"
              options={{
                tooltip: {
                  style: {
                    fontFamily: "Inter, sans",
                    fontSize: "12px",
                  },
                },
                dataLabels: {
                  enabled: false,
                },
                xaxis: {
                  categories: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                },
                stroke: {
                  curve: "smooth",
                  width: [2],
                },
                colors: ["#1814F3"],
                fill: {
                  type: "gradient",
                  gradient: {
                    type: "vertical",
                  },
                },
                chart: {
                  toolbar: {
                    show: false,
                  },
                  zoom: {
                    enabled: false,
                  },
                },
              }}
              height={"100%"}
              series={[
                {
                  data: [0, 80, 340, 205, 415, 390, 780, 200, 560, 210, 600],
                },
              ]}
            />
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};
