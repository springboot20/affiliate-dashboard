import chip from "@/assets/Chip_Card.png";
import chipBlack from "@/assets/Chip_Card_b.png";

import { CardTypeBlackIcon, CardTypeIcon } from "@/components/icons/Icons";
import { CardForm } from "./card-form/CardForm";
import { useGetUserCardsQuery } from "@/features/cards/card.slice";
import React, { useMemo } from "react";
import { classNames } from "@/utils";

export const CreditCards = () => {
  const { data, refetch } = useGetUserCardsQuery();

  const formatCardNumber = (number: string) => {
    const value = number?.replace(/\s/, "");

    if (value?.length <= 16) {
      return value.match(/.{1,4}/g)?.join(" ");
    }
  };

  const formatCardExpiry = (number: string) => {
    const value = number?.replace(/\//, "");

    if (value?.length <= 4) {
      return value.length > 2 ? `${value?.slice(0, 2)}/${value.slice(2)}` : value;
    }
  };

  const cards = useMemo(() => data?.data?.cards, [data]);

  return (
    <section className="px-2 w-full mt-[9rem] lg:mt-[5.5rem] xl:max-w-7xl xl:mx-auto">
      <div className="flex flex-wrap gap-2.5">
        <div className="flex-grow shrink-0 md:max-w-full w-full">
          <nav className="flex justify-between items-center">
            <h3 className="text-base font-semibold text-affiliate-blue lg:text-lg">My Cards</h3>
          </nav>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 overflow-hidden w-full mt-2.5">
            {React.Children.toArray(
              (cards ?? [])?.slice(0, 3)?.map((card: any) => {
                return (
                  <div
                    className={classNames(
                      "border flex-grow shrink-0 relative p-3.5 font-lato before:absolute before:content-[' '] before:bottom-0 before:h-12 xl:before:h-14 before:left-0 before:right-0 rounded-2xl space-y-4 lg:space-y-2 xl:space-y-6 flex-grow w-full",

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
                        <img src={chipBlack} alt="chip icon" className="w-8" />
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
                        {formatCardNumber(card?.card_number)}{" "}
                      </p>
                      {card?.type?.includes("DEBIT") ? <CardTypeBlackIcon /> : <CardTypeIcon />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="w-full lg:max-w-xs">
          <h3 className="text-base font-semibold text-affiliate-blue lg:text-lg capitalize">
            card expense statistics
          </h3>
          <div className="bg-white rounded-2xl p-5"></div>
        </div>

        <div className="flex-grow w-full lg:w-fit shrink-0">
          <h3 className="text-base font-semibold text-affiliate-blue lg:text-lg capitalize">
            card lists
          </h3>

          <ul className="space-y-2">
            {React.Children.toArray(
              (cards ?? [])?.slice(0, 3)?.map((card: any) => (
                <li className="py-2.5 px-3 rounded-2xl bg-white flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="h-10 w-10 rounded-xl flex items-center justify-center bg-[#E7EDFF]">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_196_456)">
                          <path
                            d="M17.6621 5.5101V5.23651C17.6621 3.97881 16.6389 2.95557 15.3812 2.95557H2.28094C1.0232 2.95561 0 3.97881 0 5.23651V5.5101H17.6621Z"
                            fill="#396AFF"
                          />
                          <path
                            d="M10.4347 12.8473C10.4347 11.6642 10.8152 10.5396 11.5178 9.61279H0V12.7945C0 14.0522 1.0232 15.0754 2.28094 15.0754H10.9162C10.601 14.385 10.4347 13.629 10.4347 12.8473ZM8.83109 12.156H6.8625V10.9841H8.83109V12.156ZM2.62727 10.9841H5.69062V12.156H2.62727V10.9841Z"
                            fill="#396AFF"
                          />
                          <path
                            d="M12.7344 8.441C13.6281 7.81572 14.6898 7.47885 15.8033 7.47885C16.4478 7.47885 17.0748 7.59201 17.6621 7.8083V6.68213H0V8.441H12.7344Z"
                            fill="#396AFF"
                          />
                          <path
                            d="M20 12.8471C20 10.5293 18.1211 8.65039 15.8033 8.65039C13.4855 8.65039 11.6066 10.5293 11.6066 12.8471C11.6066 15.1648 13.4855 17.0438 15.8033 17.0438C18.1211 17.0438 20 15.1648 20 12.8471ZM16.369 15.0891V15.566H15.783H15.1971V15.0926C14.8429 14.9726 14.553 14.7616 14.27 14.5546L14.9618 13.6087C15.342 13.8868 15.5366 14.0205 15.8033 14.0205C15.9541 14.0205 16.0761 13.9487 16.1219 13.8332C16.1773 13.6934 16.099 13.5645 15.9124 13.4886C15.9124 13.4886 15.0748 13.2092 14.6876 12.8144C14.3627 12.4832 14.2594 12.0164 14.3628 11.5724C14.467 11.1254 14.7688 10.7758 15.1971 10.6012V10.1281H16.369V10.5816C16.6666 10.6643 16.9185 10.7864 17.0634 10.865L16.5043 11.8949C16.1336 11.6937 15.7925 11.6333 15.6598 11.6787C15.531 11.7227 15.5114 11.8067 15.5041 11.8383C15.4936 11.8831 15.488 11.9519 15.5597 12.0317C15.6286 12.1086 16.3542 12.4032 16.3542 12.4032C17.1371 12.7219 17.5055 13.5223 17.2113 14.2649C17.0585 14.6509 16.7508 14.9432 16.369 15.0891Z"
                            fill="#396AFF"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_196_456">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>

                    <div className="flex flex-col">
                      <h3 className="font-medium text-sm text-affiliate-black">Card Type</h3>
                      <span className="text-xs text-[#718EBF] font-normal">{card?.type}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start">
                    <h3 className="font-medium text-sm text-affiliate-black">Bank</h3>
                    <span className="text-xs text-[#718EBF] font-normal">DBL Bank</span>
                  </div>

                  <div className="flex-col md:flex hidden items-start">
                    <h3 className="font-medium text-sm text-affiliate-black">Card Number</h3>
                    <span className="text-xs text-[#718EBF] font-normal">
                      {formatCardNumber(card?.card_number)}
                    </span>
                  </div>

                  <div className="flex-col md:flex hidden items-start">
                    <h3 className="font-medium text-sm text-affiliate-black">Name on Card</h3>
                    <span className="text-xs text-[#718EBF] font-normal">{card?.card_name}</span>
                  </div>

                  <button
                    type="button"
                    title="view details"
                    className="cursor-pointer text-xs font-medium text-[#1814F3] capitalize"
                  >
                    view details
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="w-full lg:max-w-xl">
          <h3 className="text-base font-semibold text-affiliate-blue lg:text-lg capitalize">
            add new card
          </h3>

          <CardForm refetch={refetch} />
        </div>

        <div className="flex-grow w-full lg:w-fit shrink-0">
          <h3 className="text-base font-semibold text-affiliate-blue lg:text-lg capitalize">
            add new card
          </h3>
        </div>
      </div>
    </section>
  );
};
