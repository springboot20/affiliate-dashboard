import {
  AppleOutlineIcon,
  CardTypeIcon,
  PlayStationIcon,
  UserOutlineIcon,
} from "@/components/icons/Icons";
import chip from "@/assets/Chip_Card.png";
import { motion } from "framer-motion";

export const Accounts = () => {
  return (
    <section className="mt-[9rem] lg:mt-[5.5rem]">
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
        className="px-2 w-full gap-3 lg:gap-y-2 flex flex-wrap lg:max-w-6xl xl:max-w-7xl lg:mx-auto"
      >
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:!grid-cols-4 gap-3 max-w-full flex-grow">
          <div className="bg-white rounded-2xl border h-24 p-3 flex items-center lg:h-[5.5rem] xl:h-24 sm:col-span-1 gap-2 w-full">
            <span className="flex items-center justify-center h-14 w-14 lg:h-10 lg:w-10 xl:h-14 xl:w-14 flex-shrink-0 rounded-full bg-[#FFF5D9]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 20 20"
                fill="none"
                className="lg:h-10"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_185_218)">
                  <path
                    d="M6.66002 3.75H13.34L14.7817 2.59667C15.2725 2.205 15.4559 1.56917 15.2484 0.975833C15.0409 0.3825 14.5017 0 13.875 0H6.12502C5.49836 0 4.95919 0.383333 4.75169 0.975833C4.54419 1.56833 4.72752 2.205 5.21752 2.59583L6.66002 3.75Z"
                    fill="#FFBB38"
                  />
                  <path
                    d="M13.4542 5H6.54583C4.27 7.23417 2.5 11.1542 2.5 14.375C2.5 17.1742 3.98167 20 7.29167 20H12.9167C15.7442 20 17.5 17.8442 17.5 14.375C17.5 11.1542 15.73 7.23417 13.4542 5ZM9.68333 11.875H10.3167C11.2908 11.875 12.0833 12.6675 12.0833 13.6417C12.0833 14.5175 11.4517 15.2383 10.625 15.385V16.0408C10.625 16.3858 10.345 16.6658 10 16.6658C9.655 16.6658 9.375 16.3858 9.375 16.0408V15.4167H8.54167C8.19667 15.4167 7.91667 15.1367 7.91667 14.7917C7.91667 14.4467 8.19667 14.1667 8.54167 14.1667H10.3167C10.6017 14.1667 10.8333 13.935 10.8333 13.65C10.8333 13.3567 10.6017 13.125 10.3167 13.125H9.68333C8.70917 13.125 7.91667 12.3325 7.91667 11.3583C7.91667 10.4825 8.54833 9.76167 9.375 9.615V8.95833C9.375 8.61333 9.655 8.33333 10 8.33333C10.345 8.33333 10.625 8.61333 10.625 8.95833V9.58333H11.4583C11.8033 9.58333 12.0833 9.86333 12.0833 10.2083C12.0833 10.5533 11.8033 10.8333 11.4583 10.8333H9.68333C9.39833 10.8333 9.16667 11.065 9.16667 11.35C9.16667 11.6433 9.39833 11.875 9.68333 11.875Z"
                    fill="#FFBB38"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_185_218">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>

            <div className="flex flex-col w-full">
              <h5 className="text-xs xl:!text-sm text-[#8BA3CB] font-normal capitalize">
                my balance
              </h5>
              <small className="text-base xl:text-lg text-affiliate-black font-medium">
                $12,750
              </small>
            </div>
          </div>

          <div className="bg-white rounded-2xl border h-24 p-3 flex items-center lg:h-[5.5rem] xl:h-24 sm:col-span-1 gap-2 w-full">
            <span className="flex items-center justify-center h-14 w-14 lg:h-10 lg:w-10 xl:h-14 xl:w-14 flex-shrink-0 rounded-full bg-[#E7EDFF]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 20 20"
                fill="none"
                className="lg:h-10"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.7919 9.8956C14.5201 9.8956 16.7393 7.676 16.7393 4.9478C16.7393 2.2196 14.5201 0 11.7919 0C9.06365 0 6.84406 2.2196 6.84406 4.9478C6.84406 7.676 9.06365 9.8956 11.7919 9.8956ZM11.2059 2.03951V1.90513C11.2059 1.5813 11.468 1.31918 11.7919 1.31918C12.1153 1.31918 12.3778 1.5813 12.3778 1.90513V2.04029C13.0751 2.18991 13.5997 2.81102 13.5997 3.55245C13.5997 3.87589 13.3372 4.1384 13.0138 4.1384C12.6899 4.1384 12.4278 3.87589 12.4278 3.55245C12.4278 3.3458 12.2594 3.17744 12.0528 3.17744H11.5274C11.3207 3.17744 11.1524 3.3458 11.1524 3.55245C11.1524 3.67081 11.209 3.78331 11.3043 3.85363L11.7919 4.21458L12.9763 5.09116C13.3653 5.37906 13.5997 5.83962 13.6028 6.32401V6.32948C13.6056 6.74277 13.4474 7.13263 13.1567 7.42678C12.9411 7.64514 12.6716 7.79163 12.3778 7.85335V7.99047C12.3778 8.3143 12.1153 8.57642 11.7919 8.57642C11.468 8.57642 11.2059 8.3143 11.2059 7.99047V7.85531C10.92 7.79437 10.6571 7.65374 10.4446 7.44358C10.1504 7.15333 9.98712 6.76582 9.98477 6.35253C9.98282 6.02908 10.2434 5.76501 10.5668 5.76306H10.5707C10.8926 5.76306 11.1547 6.02322 11.1567 6.3455C11.1575 6.54773 11.3202 6.71816 11.5336 6.71816C11.8574 6.71621 11.7368 6.71691 12.0583 6.71504C12.2662 6.7134 12.4325 6.5446 12.4309 6.33729V6.33182C12.4302 6.21463 12.3735 6.10291 12.279 6.03299L11.7919 5.67243L10.6071 4.79584C10.2149 4.50521 9.98047 4.04035 9.98047 3.55245C9.98047 2.80946 10.5067 2.18795 11.2059 2.03951Z"
                  fill="#396AFF"
                />
                <path
                  d="M3.7751 12.7106C3.6249 12.4502 3.29126 12.3596 3.02926 12.5107L0.273008 14.1018C0.0120243 14.2529 -0.0775095 14.5867 0.0731589 14.848L2.89019 19.7271C3.04098 19.988 3.37458 20.0776 3.63604 19.927L6.39229 18.3355C6.65366 18.1848 6.74284 17.851 6.59214 17.5897L3.7751 12.7106Z"
                  fill="#396AFF"
                />
                <path
                  d="M19.5681 11.7368C19.3029 11.3684 18.7896 11.2852 18.4216 11.5504C17.3052 12.3547 15.1614 13.8993 14.991 14.0224C14.9125 14.0892 14.8301 14.1497 14.7442 14.2032C14.407 14.4153 14.016 14.5286 13.6078 14.5286H10.8011C10.4776 14.5286 10.2151 14.2665 10.2151 13.9427C10.2151 13.6184 10.478 13.3567 10.8011 13.3567H13.8027C14.2438 13.3567 14.5969 12.9895 14.5785 12.5477C14.5613 12.1286 14.2035 11.8035 13.784 11.8035H11.4991C11.3445 11.6399 11.1749 11.4899 10.9933 11.3559C10.3686 10.8953 9.59675 10.623 8.76118 10.623C7.27559 10.623 5.79742 11.559 5.18451 12.8083L7.58145 16.9596H12.0777C12.9605 16.9596 13.8301 16.7338 14.5953 16.2935C14.8606 16.1412 15.1446 15.958 15.4524 15.7369C16.7423 14.8103 19.3795 12.8852 19.3814 12.884C19.7502 12.6192 19.8338 12.1051 19.5681 11.7368Z"
                  fill="#396AFF"
                />
              </svg>
            </span>

            <div className="flex flex-col gap-1 w-full">
              <h5 className="text-xs xs:text-sm xl:!text-sm text-[#8BA3CB] font-normal capitalize">
                income
              </h5>
              <small className="text-base xl:text-lg text-affiliate-black font-medium">
                $5,600
              </small>
            </div>
          </div>

          <div className="bg-white rounded-2xl border h-24 p-3 flex items-center lg:h-[5.5rem] xl:h-24 sm:col-span-1 gap-2 w-full">
            <span className="flex items-center justify-center h-14 w-14 lg:h-10 lg:w-10 xl:h-14 xl:w-14 flex-shrink-0 rounded-full bg-[#FFE0EB]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 20 20"
                fill="none"
                className="lg:h-10"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.7547 0C15.6108 0 14.6834 0.927344 14.6834 2.07129V8.25156H18.2401C18.5637 8.25156 18.826 7.98922 18.826 7.66563V2.07129C18.826 0.927344 17.8987 0 16.7547 0V0Z"
                  fill="#FF82AC"
                />
                <path
                  d="M7.08435 14.7266C7.08435 11.187 9.96369 8.27176 13.5506 8.28152V2.32367C13.5506 1.43238 13.8861 0.618086 14.4372 0H4.10267C2.48783 0 1.17377 1.31406 1.17377 2.92891V19.4035C1.17377 19.9306 1.81857 20.1896 2.18314 19.8086L2.93275 19.0258L3.72455 19.818C3.95306 20.0465 4.32416 20.0465 4.55306 19.818L5.30345 19.068L6.06127 19.8195C6.28978 20.0461 6.65814 20.0461 6.88666 19.8195L7.65658 19.0562L8.42689 19.8195C8.65502 20.0461 9.02298 20.0461 9.2515 19.8199L9.40072 19.6723C7.94791 18.4576 7.08435 16.6616 7.08435 14.7266ZM5.91384 4.72656H7.07025V3.57016C7.07025 3.24656 7.33259 2.98422 7.65619 2.98422C7.97978 2.98422 8.24213 3.24656 8.24213 3.57016V4.72656H9.39853C9.72213 4.72656 9.98447 4.98891 9.98447 5.3125C9.98447 5.63609 9.72213 5.89844 9.39853 5.89844H8.24213V7.05484C8.24213 7.37844 7.97978 7.64078 7.65619 7.64078C7.33259 7.64078 7.07025 7.37844 7.07025 7.05484V5.89844H5.91384C5.59025 5.89844 5.32791 5.63609 5.32791 5.3125C5.32791 4.98891 5.59025 4.72656 5.91384 4.72656ZM4.14052 8.83008H8.08588C8.40947 8.83008 8.67181 9.09242 8.67181 9.41602C8.67181 9.73961 8.40947 10.002 8.08588 10.002H4.14052C3.81693 10.002 3.55459 9.73961 3.55459 9.41602C3.55459 9.09242 3.81693 8.83008 4.14052 8.83008ZM6.0956 14.6855H4.13662C3.81302 14.6855 3.55068 14.4232 3.55068 14.0996C3.55068 13.776 3.81302 13.5137 4.13662 13.5137H6.0956C6.4192 13.5137 6.68154 13.776 6.68154 14.0996C6.68154 14.4232 6.4192 14.6855 6.0956 14.6855ZM6.48627 12.3457H4.13853C3.81494 12.3457 3.55259 12.0834 3.55259 11.7598C3.55259 11.4362 3.81494 11.1738 4.13853 11.1738H6.48627C6.80986 11.1738 7.0722 11.4362 7.0722 11.7598C7.0722 12.0834 6.80986 12.3457 6.48627 12.3457Z"
                  fill="#FF82AC"
                />
                <path
                  d="M13.5297 9.45312C10.6219 9.45312 8.25623 11.8188 8.25623 14.7266C8.25623 17.6343 10.6219 20 13.5297 20C16.4374 20 18.8031 17.6343 18.8031 14.7266C18.8031 11.8188 16.4374 9.45312 13.5297 9.45312ZM14.1174 16.9832V17.0389C14.1174 17.3625 13.8551 17.6248 13.5315 17.6248C13.2079 17.6248 12.9456 17.3625 12.9456 17.0389V17.0289C12.6831 16.9664 12.4396 16.863 12.2465 16.7367C11.9757 16.5595 11.8998 16.1964 12.0769 15.9255C12.2541 15.6547 12.6172 15.5788 12.8881 15.756C13.1279 15.9129 13.5232 15.9725 13.7175 15.8811C13.8434 15.8218 13.9408 15.6954 13.9544 15.5736C13.9834 15.3141 13.5769 15.1694 13.3342 15.0735C12.9669 14.9285 12.5098 14.7479 12.2445 14.2689C11.8662 13.5861 12.1975 12.6858 12.9456 12.3779V12.3484C12.9456 12.0248 13.2079 11.7625 13.5315 11.7625C13.8519 11.7625 14.1119 12.0198 14.117 12.3389C14.3279 12.4048 14.5222 12.5103 14.6777 12.6538C14.9156 12.8732 14.9306 13.2439 14.7111 13.4818C14.4917 13.7197 14.121 13.7346 13.8832 13.5152C13.7868 13.4263 13.4897 13.3904 13.3606 13.4771C13.2738 13.5354 13.2398 13.6473 13.2695 13.7009C13.3933 13.9243 14.0413 14.0009 14.5318 14.3831C15.5336 15.1638 15.1851 16.5736 14.1174 16.9832Z"
                  fill="#FF82AC"
                />
              </svg>
            </span>

            <div className="flex flex-col gap-1 w-full">
              <h5 className="text-xs xs:text-sm xl:!text-sm text-[#8BA3CB] font-normal capitalize">
                expense
              </h5>
              <small className="text-base xl:text-lg text-affiliate-black font-medium">
                $3,460
              </small>
            </div>
          </div>

          <div className="bg-white rounded-2xl border h-24 p-3 flex items-center lg:h-[5.5rem] xl:h-24 sm:col-span-1 gap-2 w-full">
            <span className="flex items-center justify-center h-14 w-14 lg:h-10 lg:w-10 xl:h-14 xl:w-14 flex-shrink-0 rounded-full bg-[#DCFAF8]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 20 20"
                fill="none"
                className="lg:h-10"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_185_314)">
                  <path
                    d="M18.6544 9.57672H17.4649C17.1941 8.81922 16.7578 8.14101 16.1993 7.58659L18.0338 6.77675C18.2959 6.66104 18.4395 6.3719 18.3649 6.09534C18.1437 5.27436 17.3969 4.67041 16.5098 4.67041H14.9967C14.1266 4.67041 13.3919 5.25154 13.1552 6.04846H11.5572C10.957 8.26554 8.92961 9.90129 6.52742 9.90129C5.06104 9.90129 3.73444 9.29164 2.78674 8.31253C2.51982 8.69336 2.30119 9.11078 2.14006 9.55598C1.66142 9.45125 1.26786 9.07265 1.15783 8.5796C1.08736 8.26374 0.773957 8.06464 0.458331 8.13538C0.142509 8.20589 -0.056398 8.51906 0.0141101 8.83488C0.133954 9.37187 0.435557 9.85945 0.863332 10.2077C1.15611 10.4461 1.50037 10.612 1.86513 10.6952C1.83673 10.9185 1.82205 11.1461 1.82205 11.3772V11.9453C1.82205 14.0986 3.09338 15.9533 4.92296 16.7938V18.0851C4.92296 18.7878 5.49269 19.3576 6.19546 19.3576C6.89824 19.3576 7.46797 18.7878 7.46797 18.0851V17.274H12.2349V18.0851C12.2349 18.7878 12.8046 19.3576 13.5074 19.3576C14.2101 19.3576 14.7799 18.7878 14.7799 18.0851V16.7442C16.1176 16.0934 17.1421 14.8948 17.5644 13.4383H18.6543C19.3975 13.4383 20 12.833 20 12.0863V10.9286C20 10.182 19.3976 9.57672 18.6544 9.57672ZM14.3308 9.915C14.0084 9.915 13.747 9.65363 13.747 9.33117C13.747 9.00871 14.0084 8.74734 14.3308 8.74734C14.6533 8.74734 14.9147 9.00871 14.9147 9.33117C14.9147 9.65363 14.6533 9.915 14.3308 9.915Z"
                    fill="#16DBCC"
                  />
                  <path
                    d="M6.52759 0.64209C4.30059 0.64209 2.48886 2.45608 2.48886 4.68574C2.48886 6.91544 4.30063 8.72943 6.52759 8.72943C8.75455 8.72943 10.5663 6.91544 10.5663 4.68574C10.5663 2.456 8.75447 0.64209 6.52759 0.64209ZM6.15255 4.06788H6.90263C7.74873 4.06788 8.43705 4.75672 8.43705 5.6034C8.43705 6.3784 7.86014 7.02079 7.11353 7.12399V7.34407C7.11353 7.66767 6.85119 7.93001 6.52759 7.93001C6.20399 7.93001 5.94165 7.66767 5.94165 7.34407V7.13883H5.79216C5.14481 7.13883 4.61809 6.61188 4.61809 5.96414C4.61809 5.64055 4.88043 5.3782 5.20403 5.3782C5.52762 5.3782 5.78997 5.64055 5.78997 5.96414L6.90259 5.96696C7.10251 5.96696 7.26513 5.80383 7.26513 5.60336C7.26513 5.40289 7.10251 5.23976 6.90259 5.23976H6.15251C5.30641 5.23976 4.61809 4.55097 4.61809 3.70429C4.61809 2.92925 5.19501 2.28686 5.94165 2.18366V2.02745C5.94165 1.70385 6.20399 1.44151 6.52759 1.44151C6.85119 1.44151 7.11353 1.70385 7.11353 2.02745V2.16878H7.26298C7.91033 2.16878 8.43705 2.69577 8.43705 3.34351C8.43705 3.6671 8.17471 3.92945 7.85111 3.92945C7.52752 3.92945 7.26517 3.6671 7.26517 3.34351C7.26517 3.34257 7.26509 3.34218 7.26509 3.34218L6.15255 3.34066C5.95263 3.34066 5.79001 3.50378 5.79001 3.70429C5.79001 3.90476 5.95263 4.06788 6.15255 4.06788Z"
                    fill="#16DBCC"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_185_314">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>

            <div className="flex flex-col gap-1 w-full">
              <h5 className="text-xs xs:text-sm xl:!text-sm text-[#8BA3CB] font-normal capitalize">
                total saving
              </h5>
              <small className="text-base xl:text-lg text-affiliate-black font-medium">
                $3,460
              </small>
            </div>
          </div>
        </div>

        {/* last transaction */}
        <div className="mt-4 sm:mt-0 md:max-w-full lg:max-w-[30rem] xl:!max-w-2xl 2xl:!max-w-3xl w-full">
          <h3 className="text-base font-semibold text-affiliate-blue lg:text-lg capitalize">
            last transactions
          </h3>

          <div className="bg-white rounded-2xl p-1 !overflow-x-auto">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="py-2.5 px-2 xl:p-3.5 whitespace-nowrap w-fit inline-flex gap-2 items-center">
                    <span className="bg-[#DCFAF8] h-10 w-10 flex items-center justify-center rounded-2xl">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_185_336)">
                          <path
                            d="M18.7938 10.4423C18.4726 10.4038 18.181 10.6333 18.1426 10.9546C17.661 14.9893 14.2248 18.032 10.1497 18.032C6.48442 18.032 3.33673 15.5707 2.38994 12.1402L3.09092 12.5252C3.37457 12.681 3.73086 12.5772 3.8865 12.2937C4.04229 12.0101 3.93868 11.6538 3.65503 11.498L1.85696 10.5105C1.57361 10.3548 1.21762 10.4581 1.06168 10.7413L0.0727752 12.5371C-0.0833198 12.8206 0.0199806 13.1769 0.303332 13.333C0.595991 13.4699 0.930459 13.4026 1.09922 13.1024L1.3284 12.6863C2.48943 16.4949 6.0349 19.2039 10.1497 19.2039C14.8179 19.2039 18.7543 15.7171 19.306 11.0935C19.3445 10.7721 19.115 10.4806 18.7938 10.4423Z"
                            fill="#16DBCC"
                          />
                          <path
                            d="M19.6455 5.78517C19.3486 5.65715 19.0037 5.79402 18.8755 6.09126L18.6909 6.51911C18.114 5.10845 17.1881 3.84611 15.9955 2.8688C14.3535 1.52285 12.2774 0.781738 10.1496 0.781738C8.02183 0.781738 5.94575 1.52285 4.30362 2.8688C2.68423 4.19599 1.55571 6.04838 1.12603 8.08448C1.05919 8.4011 1.26183 8.71192 1.57844 8.77875C1.8946 8.84558 2.20587 8.6431 2.27255 8.32648C2.64746 6.55024 3.63255 4.9339 5.04641 3.77501C6.47949 2.60041 8.2919 1.9536 10.1496 1.9536C12.0072 1.9536 13.8196 2.60041 15.2527 3.77501C16.3542 4.67771 17.1953 5.85826 17.6906 7.17568L16.9487 6.85663C16.6515 6.72891 16.3068 6.86609 16.1789 7.16332C16.051 7.46056 16.1884 7.8051 16.4856 7.93297L18.3703 8.74365C18.6911 8.87625 19.0034 8.74075 19.14 8.43741L19.9516 6.55512C20.0797 6.25803 19.9427 5.91334 19.6455 5.78517Z"
                            fill="#16DBCC"
                          />
                          <path
                            d="M13.7609 5.68234C13.929 5.34314 13.9548 4.95863 13.8338 4.5999C13.7128 4.24117 13.4594 3.95111 13.1202 3.78296C12.4198 3.43598 11.5679 3.72345 11.2208 4.42366C11.1449 4.57686 11.0983 4.73921 11.0809 4.90431C10.6283 4.86265 10.1682 4.90477 9.72239 5.03309C8.83495 5.28821 8.08011 5.86224 7.59702 6.64912L6.01487 9.22599C5.80353 9.18815 5.58503 9.20386 5.37599 9.27436C5.049 9.38468 4.78457 9.61569 4.63153 9.92468L4.52716 10.1351C4.211 10.7732 4.47284 11.5497 5.1111 11.8659L8.53604 13.5629C8.19882 14.2645 8.34988 15.0529 9.22511 15.4933C9.99246 15.8085 10.8466 15.4997 11.1784 14.8723L11.5404 15.0516C11.7214 15.1413 11.9164 15.1866 12.1126 15.1866C12.2516 15.1866 12.3913 15.1639 12.5268 15.1181C12.8536 15.0079 13.118 14.7769 13.2712 14.4678L13.3754 14.2573C13.5286 13.9482 13.5523 13.598 13.442 13.271C13.3715 13.062 13.2515 12.8786 13.0935 12.7333L14.1854 9.91369C14.5188 9.0525 14.5181 8.10418 14.1837 7.2436C14.0157 6.81117 13.7705 6.41964 13.4633 6.08471C13.584 5.97088 13.685 5.83554 13.7609 5.68234ZM12.4898 4.80528C12.6258 4.80528 12.736 4.91545 12.736 5.05125C12.736 5.1872 12.6258 5.29722 12.4898 5.29722C12.354 5.29722 12.2439 5.18705 12.2439 5.05125C12.2439 4.91545 12.354 4.80528 12.4898 4.80528ZM9.97751 14.4589C9.90061 14.485 9.81821 14.4794 9.74543 14.4433C9.67264 14.4073 9.61832 14.3451 9.59238 14.2682C9.57209 14.2081 9.57133 14.1444 9.58918 14.0849L10.1254 14.3506C10.0886 14.4008 10.0376 14.4388 9.97751 14.4589ZM13.0925 9.49057L11.9031 12.5618C11.7358 12.9413 11.8958 13.3905 12.271 13.5767H12.2712C12.3324 13.6093 12.3548 13.6765 12.3255 13.7372L12.2211 13.9476C12.1862 14.0086 12.1239 14.0286 12.0608 14.0016L5.63142 10.8159C5.57221 10.7866 5.5478 10.7146 5.5771 10.6556L5.68147 10.4451C5.70969 10.3931 5.76447 10.3562 5.84199 10.391C6.0289 10.4836 6.24069 10.4978 6.43844 10.4313C6.62505 10.3682 6.7781 10.2402 6.87255 10.0689L8.59554 7.26237C8.92528 6.72526 9.44056 6.33342 10.0463 6.15917C10.6519 5.98492 11.2966 6.04305 11.8612 6.3229C11.8613 6.3229 11.8613 6.3229 11.8615 6.32305C11.8616 6.32305 11.8616 6.32305 11.8618 6.3232C12.4265 6.60304 12.8632 7.08064 13.0915 7.66809C13.3197 8.25555 13.32 8.90281 13.0925 9.49057Z"
                            fill="#16DBCC"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_185_336">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>

                    <div className="space-y-1 inline-flex flex-col">
                      <h3 className="text-sm capitalize font-medium text-affiliate-blue ">
                        sportify subscription
                      </h3>
                      <p className="text-xs font-normal text-[#718EBF]">25 jan 2021</p>
                    </div>
                  </td>

                  <td className="py-2.5 px-2 xl:p-3.5 whitespace-nowrapktmon">
                    <p className="text-xs font-normal text-[#718EBF]">Shopping</p>
                  </td>

                  <td className="py-2.5 px-2 xl:p-3.5 whitespace-nowrapktmon">
                    <p className="text-xs font-normal text-[#718EBF]">1234 ****</p>
                  </td>

                  <td className="py-2.5 px-2 xl:p-3.5 whitespace-nowrapktmon">
                    <p className="text-xs font-normal text-[#718EBF]">completed</p>
                  </td>

                  <td className="py-2.5 px-2 xl:p-3.5 whitespace-nowrap">
                    <p className="text-xs font-medium text-affiliate-red">+$150</p>
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-2 xl:p-3.5 whitespace-nowrap w-fit inline-flex gap-2 items-center">
                    <span className="bg-[#E7EDFF] h-10 w-10 flex items-center justify-center rounded-2xl">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_192_2)">
                          <path
                            d="M3.36713 17.2183C3.69073 17.2183 3.95306 16.9559 3.95306 16.6323C3.95306 16.3087 3.69073 16.0464 3.36713 16.0464C3.04352 16.0464 2.78119 16.3087 2.78119 16.6323C2.78119 16.9559 3.04352 17.2183 3.36713 17.2183Z"
                            fill="#396AFF"
                          />
                          <path
                            d="M15.8669 9.62938C16.9016 9.47716 17.8405 9.00478 18.582 8.26329C19.2879 7.55743 19.7525 6.66634 19.9256 5.68637C20.0946 4.72919 19.9757 3.75563 19.5818 2.87094C19.4147 2.49571 18.9224 2.40469 18.6322 2.69497L16.2319 5.0952C16.1328 5.19426 15.9716 5.19426 15.8725 5.0952L14.9047 4.12743C14.8058 4.02852 14.8058 3.86758 14.9047 3.76868L17.3053 1.36813C17.5958 1.07766 17.5043 0.585552 17.1293 0.418598C16.2446 0.0246138 15.271 -0.0942925 14.3138 0.0747701C13.3338 0.247817 12.4427 0.712427 11.7368 1.41833C10.9953 2.15977 10.5229 3.0986 10.3707 4.13329C10.245 4.98719 10.3453 5.84153 10.6604 6.63083L8.9027 8.07462L4.97758 4.14966L5.66813 3.45915C5.91559 3.21172 5.89223 2.80305 5.61762 2.58555L2.9609 0.481333C2.72773 0.296684 2.39313 0.315981 2.18277 0.526333L0.525508 2.18352C0.315156 2.39383 0.295781 2.7284 0.480508 2.96161L2.58481 5.61821C2.8023 5.89278 3.2107 5.91645 3.45844 5.66872L4.14895 4.97821L7.99285 8.82196L0.777578 14.7488C-0.183008 15.5085 -0.265899 16.9379 0.599922 17.8037L2.19602 19.3997C3.06172 20.2654 4.49109 20.1828 5.25109 19.2221L11.1781 12.0071L11.7735 12.6025L10.9171 13.4588C10.697 13.6789 10.6874 14.0327 10.8952 14.2643L15.3602 19.2422C16.2384 20.2169 17.7532 20.2574 18.6817 19.3288L19.3286 18.682C20.2591 17.7515 20.215 16.2258 19.2315 15.3508C19.2311 15.3504 19.2307 15.3501 19.2303 15.3497L14.2294 10.9247C13.9975 10.7195 13.6459 10.7302 13.4268 10.9492L12.6021 11.7739L11.9254 11.0973L13.3693 9.33966C14.1586 9.65478 15.013 9.75501 15.8669 9.62938ZM3.09496 4.37497L1.72313 2.64309L2.64234 1.72391L4.3743 3.09567L3.09496 4.37497ZM13.8657 12.1676L18.453 16.2265C18.6853 16.4334 18.8182 16.7185 18.8273 17.0295C18.8364 17.3406 18.7202 17.6332 18.5 17.8534L17.8532 18.5002C17.634 18.7194 17.3427 18.8359 17.0331 18.8276C16.7233 18.8195 16.4385 18.6882 16.2318 18.4588L12.1381 13.895L13.8657 12.1676ZM12.7497 8.24778L10.6814 10.7656C10.6811 10.7659 10.6809 10.7662 10.6806 10.7665L4.34188 18.4828C4.33918 18.4861 4.33648 18.4894 4.33383 18.4928C4.00902 18.9064 3.39738 18.9438 3.02465 18.5711L1.42855 16.9751C1.05668 16.6033 1.09238 15.9915 1.50695 15.666C1.51031 15.6634 1.51363 15.6607 1.51695 15.6579L9.23355 9.31935C9.23379 9.31915 9.23398 9.31899 9.23422 9.3188L11.7523 7.2504C11.9661 7.07481 12.0279 6.7736 11.9005 6.52802C11.1621 5.10348 11.4293 3.38305 12.5654 2.24692C13.2651 1.54727 14.2123 1.17547 15.1702 1.17547C15.3765 1.17547 15.5834 1.19274 15.7884 1.2277L14.076 2.94005C13.5203 3.49583 13.5203 4.40016 14.0761 4.95598L15.0439 5.92376C15.5998 6.4797 16.5045 6.47977 17.0605 5.92376L18.7726 4.21176C18.9698 5.36809 18.6038 6.5843 17.7534 7.4347C16.6171 8.57079 14.8967 8.83794 13.4721 8.09954C13.2266 7.9722 12.9253 8.03399 12.7497 8.24778Z"
                            fill="#396AFF"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_192_2">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>

                    <div className="space-y-1">
                      <h3 className="text-sm capitalize font-medium text-affiliate-blue">
                        mobile service
                      </h3>
                      <p className="text-xs font-normal text-[#718EBF]">25 jan 2021</p>
                    </div>
                  </td>

                  <td className="py-2.5 px-2 xl:p-3.5 whitespace-nowrapktmon">
                    <p className="text-xs font-normal text-[#718EBF]">Service</p>
                  </td>

                  <td className="py-2.5 px-2 xl:p-3.5 whitespace-nowrapktmon">
                    <p className="text-xs font-normal text-[#718EBF]">1234 ****</p>
                  </td>

                  <td className="py-2.5 px-2 xl:p-3.5 whitespace-nowrapktmon">
                    <p className="text-xs font-normal text-[#718EBF]">completed</p>
                  </td>

                  <td className="py-2.5 px-2 xl:p-3.5 whitespace-nowrap">
                    <p className="text-xs font-medium text-affiliate-red">+$340</p>
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-2 xl:p-3.5 whitespace-nowrap w-fit inline-flex gap-2 items-center">
                    <span className="bg-[#FFE0EB] h-10 w-10 flex items-center justify-center rounded-2xl">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_192_6)">
                          <path
                            d="M17.0711 12.9289C15.9819 11.8398 14.6855 11.0335 13.2711 10.5454C14.786 9.50199 15.7812 7.75578 15.7812 5.78125C15.7812 2.59348 13.1878 0 10 0C6.81223 0 4.21875 2.59348 4.21875 5.78125C4.21875 7.75578 5.21402 9.50199 6.72898 10.5454C5.31453 11.0335 4.01813 11.8398 2.92895 12.9289C1.0402 14.8177 0 17.3289 0 20H1.5625C1.5625 15.3475 5.34754 11.5625 10 11.5625C14.6525 11.5625 18.4375 15.3475 18.4375 20H20C20 17.3289 18.9598 14.8177 17.0711 12.9289ZM10 10C7.67379 10 5.78125 8.1075 5.78125 5.78125C5.78125 3.455 7.67379 1.5625 10 1.5625C12.3262 1.5625 14.2188 3.455 14.2188 5.78125C14.2188 8.1075 12.3262 10 10 10Z"
                            fill="#FF82AC"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_192_6">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>

                    <div className="space-y-1">
                      <h3 className="text-sm capitalize font-medium text-affiliate-blue">
                        emilly willson
                      </h3>
                      <p className="text-xs font-normal text-[#718EBF]">25 jan 2021</p>
                    </div>
                  </td>

                  <td className="py-2.5 px-2 xl:p-3.5 whitespace-nowrapktmon">
                    <p className="text-xs font-normal text-[#718EBF]">Transfer</p>
                  </td>
                  <td className="py-2.5 px-2 xl:p-3.5 whitespace-nowrapktmon">
                    <p className="text-xs font-normal text-[#718EBF]">1234 ****</p>
                  </td>
                  <td className="py-2.5 px-2 xl:p-3.5 whitespace-nowrapktmon">
                    <p className="text-xs font-normal text-[#718EBF]">completed</p>
                  </td>
                  <td className="py-2.5 px-2 xl:p-3.5 whitespace-nowrap">
                    <p className="text-xs font-medium text-affiliate-green">+$780</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* card */}
        <div className="mt-4 sm:mt-0 w-fit flex-grow">
          <nav className="flex justify-between items-center">
            <h3 className="text-base font-semibold text-affiliate-blue lg:text-lg">My Cards</h3>
            <button className="text-sm px-2 py-1.5 font-semibold text-affiliate-blue capitalize !bg-transparent">
              See All
            </button>
          </nav>
          <div className="overflow-hidden mt-3 sm:mt-0 w-full">
            <div className="before:bg-white/20 border flex-grow shrink-0 relative p-3.5 font-lato before:absolute before:content-[' '] before:bottom-0 before:h-12 xl:before:h-14 before:left-0 before:right-0 rounded-2xl space-y-4 lg:space-y-2 xl:space-y-6 flex-grow w-full bg-gradient-to-br from-[#4C49ED] to-[#0A06F4] text-white">
              <div className="flex items-start justify-between">
                <div className="flex flex-col items-start">
                  <span className="text-xs font-normal">Balance</span>
                  <span className="text-sm font-semibold">$5,764</span>
                </div>
                <img src={chip} alt="chip icon" className="w-8" />
              </div>

              <div className="flex items-center justify-between py-3.5">
                <div>
                  <h2 className="text-xs font-normal uppercase">card holder</h2>
                  <p className="font-semibold text-base">Eddy Cusuma</p>
                </div>

                <div>
                  <h2 className="text-xs font-normal uppercase">valid thru</h2>
                  <p className="font-semibold text-sm">12/12</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-base font-bold uppercase">3778 **** **** 1234 </p>
                <CardTypeIcon />
              </div>
            </div>
          </div>
        </div>

        {/* card overview */}
        <div className="mt-4 sm:mt-0 lg:col-span-2 lg:max-w-[30rem] w-full">
          <h3 className="text-base font-semibold text-affiliate-blue lg:text-lg capitalize">
            debit & credit overview
          </h3>
          <div className="mt-2 w-full bg-white rounded-xl p-8 h-44 md:h-[16.5rem]"></div>
        </div>

        {/* invoice sent */}
        <div className="mt-4 sm:mt-0 w-fit flex-grow">
          <h3 className="text-base font-semibold text-affiliate-blue lg:text-lg capitalize">
            invoice sent
          </h3>

          <div className="bg-white rounded-2xl p-2 space-y-2 mt-2">
            <div className="flex items-center justify-between px-2 py-1.5">
              <div className="flex items-center gap-3">
                <span className="bg-[#DCFAF8] h-11 w-11 flex items-center justify-center rounded-2xl">
                  <AppleOutlineIcon />
                </span>

                <div className="space-y-1">
                  <h3 className="text-sm capitalize font-medium text-affiliate-blue">
                    apple store
                  </h3>
                  <p className="text-xs font-normal text-[#718EBF]">5h ago</p>
                </div>
              </div>
              <p className="text-sm font-normal text-[#718EBF]">$450</p>
            </div>
            <div className="flex items-center justify-between px-2 py-1.5">
              <div className="flex items-center gap-3">
                <span className="bg-[#FFF5D9] h-11 w-11 flex items-center justify-center rounded-2xl">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_192_143)">
                      <path
                        d="M17.0711 12.9289C15.9819 11.8398 14.6855 11.0335 13.2711 10.5454C14.786 9.50199 15.7812 7.75578 15.7812 5.78125C15.7812 2.59348 13.1878 0 10 0C6.81223 0 4.21875 2.59348 4.21875 5.78125C4.21875 7.75578 5.21402 9.50199 6.72898 10.5454C5.31453 11.0335 4.01813 11.8398 2.92895 12.9289C1.0402 14.8177 0 17.3289 0 20H1.5625C1.5625 15.3475 5.34754 11.5625 10 11.5625C14.6525 11.5625 18.4375 15.3475 18.4375 20H20C20 17.3289 18.9598 14.8177 17.0711 12.9289ZM10 10C7.67379 10 5.78125 8.1075 5.78125 5.78125C5.78125 3.455 7.67379 1.5625 10 1.5625C12.3262 1.5625 14.2188 3.455 14.2188 5.78125C14.2188 8.1075 12.3262 10 10 10Z"
                        fill="#FFBB38"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_192_143">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>

                <div className="space-y-1">
                  <h3 className="text-sm capitalize font-medium text-affiliate-blue">micheal</h3>
                  <p className="text-xs font-normal text-[#718EBF]">2 days ago</p>
                </div>
              </div>
              <p className="text-sm font-normal text-[#718EBF]">$160</p>
            </div>

            <div className="flex items-center justify-between px-2 py-1.5">
              <div className="flex items-center gap-3">
                <span className="bg-[#E7EDFF] h-11 w-11 flex items-center justify-center rounded-2xl">
                  <PlayStationIcon />
                </span>

                <div className="space-y-1">
                  <h3 className="text-sm capitalize font-medium text-affiliate-blue">
                    playstation
                  </h3>
                  <p className="text-xs font-normal text-[#718EBF]">5 days ago</p>
                </div>
              </div>
              <p className="text-sm font-normal text-[#718EBF]">$1085</p>
            </div>

            <div className="flex items-center justify-between px-2 py-1.5">
              <div className="flex items-center gap-3">
                <span className="bg-[#FFE0EB] h-11 w-11 flex items-center justify-center rounded-2xl">
                  <UserOutlineIcon />
                </span>

                <div className="space-y-1">
                  <h3 className="text-sm capitalize font-medium text-affiliate-blue">william</h3>
                  <p className="text-xs font-normal text-[#718EBF]">10 days ago</p>
                </div>
              </div>
              <p className="text-sm font-normal text-[#718EBF]">$90</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
