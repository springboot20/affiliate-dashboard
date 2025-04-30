import { motion } from "framer-motion";

export const Services = () => {
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
        className="w-full lg:max-w-6xl xl:max-w-7xl lg:mx-auto"
      >
        <div className="flex items-center overflow-x-auto gap-3 max-w-full flex-grow">
          <div className="bg-white rounded-3xl border h-24 p-8 flex items-center lg:h-28 gap-4 w-full max-w-64 md:max-w-[23.86rem] shrink-0">
            <span className="flex items-center justify-center h-14 w-14 lg:h-10 lg:w-10 xl:h-14 xl:w-14 flex-shrink-0 rounded-full bg-[#e7edff]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_163_357)">
                  <path
                    d="M18.2112 2.72841C15.6138 2.72841 13.6258 2.07743 12.4154 1.53132C11.0997 0.937663 10.3902 0.335245 10.3843 0.330201L10.001 0L9.61716 0.329224C9.61016 0.335245 8.90061 0.937702 7.58493 1.53132C6.37462 2.07743 4.38661 2.72841 1.78914 2.72841H1.20264V10.7793L10.0002 20L18.7977 10.7874V2.72841H18.2112ZM16.4517 8.20503C16.4517 9.11454 16.0983 9.9697 15.4564 10.6137L10.0002 16.2817L4.54395 10.6137C3.90204 9.96966 3.54865 9.1145 3.54865 8.20499V7.90008C3.54865 6.01862 5.07935 4.48788 6.96085 4.48788C7.80522 4.48788 8.61588 4.79897 9.24348 5.36381L9.97892 6.0257L10.5173 5.48729C11.1618 4.8428 12.0187 4.48785 12.9301 4.48785H13.0395C14.921 4.48785 16.4517 6.01854 16.4517 7.90004V8.20503H16.4517Z"
                    fill="#396AFF"
                  />
                  <path
                    d="M13.0395 5.66093H12.9302C12.3321 5.66093 11.7698 5.89385 11.3468 6.31676L10.0215 7.6421L8.45884 6.2357C8.04696 5.86503 7.515 5.66089 6.96087 5.66089C5.72616 5.66089 4.72168 6.66537 4.72168 7.90008V8.20498C4.72168 8.8031 4.9546 9.36544 5.37751 9.78835L5.38533 9.79628L10.0002 14.5902L14.6229 9.78831C15.0458 9.3654 15.2787 8.80306 15.2787 8.20494V7.90004C15.2787 6.66545 14.2742 5.66093 13.0395 5.66093ZM11.7597 10.9395H10.5867V12.1125H9.41371V10.9395H8.2407V9.76645H9.41371V8.59344H10.5867V9.76645H11.7597V10.9395Z"
                    fill="#396AFF"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_163_357">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>

            <div className="flex flex-col w-full">
              <h5 className="text-base xl:text-lg text-affiliate-black font-medium capitalize">
                life insuarance
              </h5>
              <small className="text-xs xl:!text-sm text-[#8BA3CB] font-normal">
                Unlimited protection
              </small>
            </div>
          </div>

          <div className="bg-white rounded-3xl border h-24 p-8 flex items-center lg:h-28 gap-4 w-full max-w-64 md:max-w-[23.86rem] shrink-0">
            <span className="flex items-center justify-center h-14 w-14 lg:h-10 lg:w-10 xl:h-14 xl:w-14 flex-shrink-0 rounded-full bg-[#FFF5D9]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.3125 17.275L16.2463 5.56875C16.2175 5.24625 15.9475 5 15.6238 5H13.7488V3.75C13.7488 2.745 13.3588 1.8025 12.6525 1.09625C11.9575 0.4 10.99 0 9.99877 0C7.93127 0 6.24877 1.6825 6.24877 3.75V5H4.37377C4.05002 5 3.78002 5.24625 3.75127 5.56875L2.68752 17.2738C2.62377 17.9725 2.85877 18.6688 3.33127 19.1863C3.80377 19.7038 4.47627 20 5.17752 20H14.8213C15.5213 20 16.1938 19.7038 16.6663 19.1875C17.14 18.67 17.3738 17.9725 17.3125 17.275ZM12.4988 5H7.49877V3.75C7.49877 2.37125 8.62002 1.25 9.99877 1.25C10.6613 1.25 11.3063 1.515 11.7688 1.97875C12.24 2.45 12.4988 3.07875 12.4988 3.75V5Z"
                  fill="#FFBB38"
                />
              </svg>
            </span>

            <div className="flex flex-col w-full">
              <h5 className="text-base xl:text-lg text-affiliate-black font-medium capitalize">
                shopping
              </h5>
              <small className="text-xs xl:!text-sm text-[#8BA3CB] font-normal">
                Buy. Think. Grow
              </small>
            </div>
          </div>

          <div className="bg-white rounded-3xl border h-24 p-8 flex items-center lg:h-28 gap-4 w-full max-w-64 md:max-w-[23.86rem] shrink-0">
            <span className="flex items-center justify-center h-14 w-14 lg:h-10 lg:w-10 xl:h-14 xl:w-14 flex-shrink-0 rounded-full bg-[#DCFAF8]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_163_392)">
                  <path
                    d="M17.6553 13.3559C17.1178 14.8128 16.3048 16.0796 15.2387 17.1207C14.0251 18.3057 12.4361 19.2473 10.5156 19.919C10.4526 19.941 10.3868 19.959 10.3207 19.9722C10.2335 19.9895 10.1447 19.9988 10.0566 20H10.0394C9.94553 20 9.85123 19.9905 9.75769 19.9722C9.69162 19.959 9.62677 19.941 9.56406 19.9194C7.6413 19.2488 6.05026 18.3077 4.83551 17.1227C3.76892 16.0815 2.95608 14.8155 2.41928 13.3586C1.44317 10.7097 1.49871 7.79159 1.54342 5.44662L1.54418 5.41061C1.55319 5.21697 1.55898 5.01357 1.56219 4.78896C1.57852 3.68621 2.45529 2.77389 3.55819 2.71239C5.85769 2.58407 7.63657 1.8341 9.1565 0.35262L9.16977 0.340413C9.42215 0.108937 9.74014 -0.00458834 10.0566 0.00014191C10.3618 0.00410921 10.6657 0.117482 10.9091 0.340413L10.9221 0.35262C12.4423 1.8341 14.2212 2.58407 16.5207 2.71239C17.6236 2.77389 18.5004 3.68621 18.5167 4.78896C18.5199 5.0151 18.5257 5.21819 18.5347 5.41061L18.5352 5.42587C18.5797 7.77526 18.635 10.6992 17.6553 13.3559Z"
                    fill="#16DBCC"
                  />
                  <path
                    d="M17.6554 13.356C17.1178 14.8129 16.3048 16.0797 15.2387 17.1208C14.0251 18.3058 12.4361 19.2474 10.5156 19.9191C10.4526 19.9411 10.3868 19.9591 10.3208 19.9723C10.2335 19.9896 10.1447 19.9989 10.0566 20.0001V0.000244141C10.3618 0.00421144 10.6658 0.117584 10.9091 0.340515L10.9221 0.352722C12.4424 1.8342 14.2212 2.58417 16.5207 2.7125C17.6236 2.77399 18.5004 3.68631 18.5167 4.78907C18.5199 5.0152 18.5257 5.2183 18.5347 5.41071L18.5352 5.42597C18.5797 7.77537 18.635 10.6993 17.6554 13.356Z"
                    fill="#16DBCC"
                  />
                  <path
                    d="M15.0237 10.0001C15.0237 12.7425 12.797 14.9749 10.0568 14.9847H10.0393C7.29101 14.9847 5.05469 12.7485 5.05469 10.0001C5.05469 7.2518 7.29101 5.01562 10.0393 5.01562H10.0568C12.797 5.02539 15.0237 7.25775 15.0237 10.0001Z"
                    fill="white"
                  />
                  <path
                    d="M13.1015 9.19753L10.0762 11.8814L9.42252 12.4613C9.26809 12.5983 9.06554 12.6667 8.86319 12.6667C8.66064 12.6667 8.4583 12.5983 8.30366 12.4613L6.89815 11.214C6.58929 10.94 6.58929 10.4962 6.89815 10.2221C7.2066 9.94812 7.70753 9.94812 8.01639 10.2221L8.86319 10.9732L11.9833 8.20561C12.2921 7.93146 12.7931 7.93146 13.1015 8.20561C13.4104 8.47959 13.4104 8.92392 13.1015 9.19753Z"
                    fill="#16DBCC"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_163_392">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>

            <div className="flex flex-col w-full">
              <h5 className="text-base xl:text-lg text-affiliate-black font-medium capitalize">
                safety
              </h5>
              <small className="text-xs xl:!text-sm text-[#8BA3CB] font-normal">
                We are your allies.
              </small>
            </div>
          </div>
        </div>

        <div className="w-full mt-4">
          <h3 className="text-base font-semibold text-affiliate-blue lg:text-lg">
            Bank Services List
          </h3>

          <ul className="space-y-2 mt-2">
            <li className="py-3.5 px-3 rounded-2xl bg-white flex justify-between items-center">
              <div className="flex items-center gap-3.5">
                <span className="h-11 w-11 md:w-14 md:h-14 rounded-2xl flex items-center justify-center bg-[#FFE0EB]">
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 60 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="60" height="60" rx="20" fill="#FFE0EB" />
                    <g clipPath="url(#clip0_112_1199)">
                      <path
                        d="M32.4916 33.3372C36.6866 33.3372 40.0994 29.8971 40.0994 25.6686C40.0994 21.4402 36.6866 18 32.4916 18C28.2966 18 24.8838 21.4401 24.8838 25.6686C24.8838 29.897 28.2966 33.3372 32.4916 33.3372ZM30.047 28.0616C30.2683 27.7233 30.722 27.6283 31.0602 27.8497C31.5532 28.1722 31.7391 28.2019 32.3896 28.1973C33.0244 28.1931 33.3928 27.7199 33.4664 27.282C33.5022 27.069 33.516 26.5489 32.8713 26.321C32.1152 26.0536 31.3413 25.7481 30.803 25.3259C30.2646 24.9036 30.0181 24.1746 30.1597 23.4236C30.3131 22.6094 30.8811 21.9612 31.642 21.7321C31.6489 21.73 31.6556 21.7283 31.6625 21.7263V21.4488C31.6625 21.0446 31.9902 20.7168 32.3945 20.7168C32.7987 20.7168 33.1264 21.0446 33.1264 21.4488V21.6802C33.6236 21.7989 33.9708 22.0263 34.1118 22.1317C34.4356 22.3738 34.5018 22.8324 34.2598 23.1563C34.0178 23.4801 33.5591 23.5464 33.2353 23.3042C33.0853 23.1921 32.6707 22.951 32.0642 23.1338C31.7099 23.2405 31.618 23.5901 31.5982 23.6947C31.5595 23.9002 31.603 24.0928 31.7064 24.1739C32.0796 24.4666 32.7514 24.7258 33.3592 24.9406C34.4801 25.3368 35.1033 26.3753 34.9101 27.5247C34.8153 28.0887 34.5316 28.6119 34.1112 28.9981C33.8249 29.2613 33.4916 29.4488 33.1264 29.556V29.8883C33.1264 30.2926 32.7987 30.6203 32.3945 30.6203C31.9902 30.6203 31.6625 30.2926 31.6625 29.8883V29.629C31.1892 29.5716 30.7918 29.4236 30.2588 29.0748C29.9205 28.8535 29.8257 28.3999 30.047 28.0616Z"
                        fill="#FF82AC"
                      />
                      <path
                        d="M20.7741 35.7968H19.105C18.7008 35.7968 18.373 36.1245 18.373 36.5287V42.267C18.373 42.6713 18.7008 42.999 19.105 42.999H20.7741V35.7968H20.7741Z"
                        fill="#FF82AC"
                      />
                      <path
                        d="M42.4118 35.7457C41.0399 34.3737 38.8075 34.3736 37.4356 35.7457L35.2428 37.9384L34.3441 38.8371C33.9809 39.2003 33.4882 39.4044 32.9746 39.4044H28.6044C28.2097 39.4044 27.8701 39.101 27.8515 38.7068C27.8317 38.2859 28.1671 37.9384 28.5837 37.9384H33.0257C33.9188 37.9384 34.6934 37.3025 34.8469 36.4227C34.8822 36.2207 34.9006 36.0129 34.9006 35.801C34.9007 35.396 34.5725 35.0674 34.1676 35.0674H31.7337C30.9382 35.0674 30.1744 34.7065 29.3656 34.3244C28.5174 33.9238 27.6402 33.5094 26.6146 33.4412C25.7176 33.3814 24.8185 33.4796 23.9422 33.7327C23.004 34.0036 22.3295 34.8372 22.2477 35.7996C22.2446 35.7993 22.2415 35.7993 22.2383 35.7991V42.9965L34.8493 43C35.7163 43 36.5316 42.6623 37.1448 42.0491L42.4117 36.7823C42.6981 36.4961 42.6981 36.0319 42.4118 35.7457Z"
                        fill="#FF82AC"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_112_1199">
                        <rect width="25" height="25" fill="white" transform="translate(18 18)" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>

                <div className="flex flex-col">
                  <h3 className="font-medium text-sm text-affiliate-black">Business loans</h3>
                  <span className="text-xs text-[#718EBF] font-normal">
                    It is a long established{" "}
                  </span>
                </div>
              </div>

              <div className="hidden md:flex flex-col items-start">
                <h3 className="font-medium text-sm text-affiliate-black">Lorem Ipsum</h3>
                <span className="text-xs text-[#718EBF] font-normal">Many publishing</span>
              </div>

              <div className="hidden md:flex flex-col items-start">
                <h3 className="font-medium text-sm text-affiliate-black">Lorem Ipsum</h3>
                <span className="text-xs text-[#718EBF] font-normal">Many publishing</span>
              </div>

              <div className="hidden md:flex flex-col items-start">
                <h3 className="font-medium text-sm text-affiliate-black">Lorem Ipsum</h3>
                <span className="text-xs text-[#718EBF] font-normal">Many publishing</span>
              </div>

              <button
                type="button"
                title="view details"
                className="cursor-pointer text-xs font-medium text-[#1814F3] ring-1 px-5 py-2.5 rounded-3xl ring-[#1814f3]"
              >
                View details
              </button>
            </li>

            <li className="py-3.5 px-3 rounded-2xl bg-white flex justify-between items-center">
              <div className="flex items-center gap-3.5">
                <span className="h-11 w-11 md:w-14 md:h-14 rounded-2xl flex items-center justify-center bg-[#FFF5D9]">
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_112_1334)">
                      <path
                        d="M22.9167 5.20831H17.7083V4.1666C17.7083 3.01763 16.774 2.08325 15.625 2.08325H9.375C8.22603 2.08325 7.29165 3.01758 7.29165 4.1666V5.20826H2.08335C0.934326 5.20831 0 6.14263 0 7.29161V10.4166C0 11.5656 0.934326 12.5 2.08335 12.5H10.4167V11.9791C10.4167 11.6912 10.6497 11.4583 10.9375 11.4583H14.0625C14.3504 11.4583 14.5834 11.6912 14.5834 11.9791V12.5H22.9167C24.0657 12.5 25 11.5656 25 10.4166V7.29161C25 6.14263 24.0657 5.20831 22.9167 5.20831ZM15.625 5.20831H9.375V4.1666H15.625V5.20831Z"
                        fill="#FFBB38"
                      />
                      <path
                        d="M24.7111 13.062C24.5336 12.974 24.3215 12.9943 24.1648 13.1133C23.7945 13.3936 23.3632 13.5416 22.9166 13.5416H14.5833V15.1041C14.5833 15.392 14.3504 15.625 14.0625 15.625H10.9375C10.6496 15.625 10.4166 15.392 10.4166 15.1041V13.5416H2.08335C1.63677 13.5416 1.20547 13.3936 0.835156 13.1133C0.677979 12.9933 0.466406 12.9729 0.288867 13.062C0.111914 13.15 0 13.3305 0 13.5284V20.8333C0 21.9823 0.934326 22.9167 2.08335 22.9167H22.9167C24.0657 22.9167 25 21.9823 25 20.8333V13.5284C25 13.3305 24.8881 13.15 24.7111 13.062Z"
                        fill="#FFBB38"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_112_1334">
                        <rect width="25" height="25" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>

                <div className="flex flex-col">
                  <h3 className="font-medium text-sm text-affiliate-black">Checking accounts</h3>
                  <span className="text-xs text-[#718EBF] font-normal">
                    It is a long established
                  </span>
                </div>
              </div>

              <div className="hidden md:flex flex-col items-start">
                <h3 className="font-medium text-sm text-affiliate-black">Lorem Ipsum</h3>
                <span className="text-xs text-[#718EBF] font-normal">Many publishing</span>
              </div>

              <div className="hidden md:flex flex-col items-start">
                <h3 className="font-medium text-sm text-affiliate-black">Lorem Ipsum</h3>
                <span className="text-xs text-[#718EBF] font-normal">Many publishing</span>
              </div>

              <div className="hidden md:flex flex-col items-start">
                <h3 className="font-medium text-sm text-affiliate-black">Lorem Ipsum</h3>
                <span className="text-xs text-[#718EBF] font-normal">Many publishing</span>
              </div>

              <button
                type="button"
                title="view details"
                className="cursor-pointer text-xs font-medium text-[#1814F3] ring-1 px-5 py-2.5 rounded-3xl ring-[#1814f3]"
              >
                View details
              </button>
            </li>

            <li className="py-3.5 px-3 rounded-2xl bg-white flex justify-between items-center">
              <div className="flex items-center gap-3.5">
                <span className="h-11 w-11 md:w-14 md:h-14 rounded-2xl flex items-center justify-center bg-[#FFE0EB]">
                  <svg
                    width="23"
                    height="25"
                    viewBox="0 0 23 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.1328 25H9.17969C8.2104 25 7.42188 24.2115 7.42188 23.2422V11.1328C7.42188 10.1635 8.2104 9.375 9.17969 9.375H11.1328C12.1021 9.375 12.8906 10.1635 12.8906 11.1328V23.2422C12.8906 24.2115 12.102 25 11.1328 25Z"
                      fill="#FF82AC"
                    />
                    <path
                      d="M3.71094 25H1.75782C0.788527 25 0 24.2115 0 23.2422V15.0391C0 14.0698 0.788527 13.2812 1.75782 13.2812H3.71094C4.68023 13.2812 5.46876 14.0698 5.46876 15.0391V23.2422C5.46876 24.2115 4.68018 25 3.71094 25Z"
                      fill="#FF82AC"
                    />
                    <path
                      d="M18.5549 25H16.6018C15.6325 25 14.844 24.2115 14.844 23.2422V7.03125H13.7707C13.269 7.03125 12.827 6.74805 12.6173 6.29219C12.4077 5.83633 12.4803 5.3165 12.8068 4.9355C12.8105 4.93115 12.8143 4.92681 12.8181 4.92256L16.9965 0.259863C17.1447 0.0944824 17.3563 0 17.5784 0C17.8004 0 18.012 0.0944824 18.1602 0.259863L22.3386 4.92256C22.3424 4.92681 22.3462 4.93115 22.3499 4.9355C22.6765 5.31646 22.7491 5.83633 22.5394 6.29219C22.3297 6.74805 21.8877 7.03125 21.386 7.03125H20.3127V23.2422C20.3127 24.2115 19.5242 25 18.5549 25V25Z"
                      fill="#FF82AC"
                    />
                  </svg>
                </span>

                <div className="flex flex-col">
                  <h3 className="font-medium text-sm text-affiliate-black">Savings accounts</h3>
                  <span className="text-xs text-[#718EBF] font-normal">
                    It is a long established
                  </span>
                </div>
              </div>

              <div className="hidden md:flex flex-col items-start">
                <h3 className="font-medium text-sm text-affiliate-black">Lorem Ipsum</h3>
                <span className="text-xs text-[#718EBF] font-normal">Many publishing</span>
              </div>

              <div className="hidden md:flex flex-col items-start">
                <h3 className="font-medium text-sm text-affiliate-black">Lorem Ipsum</h3>
                <span className="text-xs text-[#718EBF] font-normal">Many publishing</span>
              </div>

              <div className="hidden md:flex flex-col items-start">
                <h3 className="font-medium text-sm text-affiliate-black">Lorem Ipsum</h3>
                <span className="text-xs text-[#718EBF] font-normal">Many publishing</span>
              </div>

              <button
                type="button"
                title="view details"
                className="cursor-pointer text-xs font-medium text-[#1814F3] ring-1 px-5 py-2.5 rounded-3xl ring-[#1814f3]"
              >
                View details
              </button>
            </li>

            <li className="py-3.5 px-3 rounded-2xl bg-white flex justify-between items-center">
              <div className="flex items-center gap-3.5">
                <span className="h-11 w-11 md:w-14 md:h-14 rounded-2xl flex items-center justify-center bg-[#E7EDFF]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_163_738)">
                      <path
                        d="M9.85722 9.63406C11.1808 9.63406 12.3268 9.15936 13.2633 8.22278C14.1997 7.28635 14.6744 6.14057 14.6744 4.81688C14.6744 3.49364 14.1997 2.34771 13.2631 1.41097C12.3265 0.474699 11.1806 0 9.85722 0C8.53352 0 7.38775 0.474699 6.45132 1.41113C5.51489 2.34756 5.04004 3.49349 5.04004 4.81688C5.04004 6.14057 5.51489 7.2865 6.45147 8.22293C7.38805 9.1592 8.53398 9.63406 9.85722 9.63406Z"
                        fill="#396AFF"
                      />
                      <path
                        d="M18.2862 15.3789C18.2592 14.9891 18.2046 14.564 18.1242 14.1151C18.043 13.6629 17.9385 13.2353 17.8134 12.8445C17.6841 12.4406 17.5083 12.0418 17.291 11.6595C17.0655 11.2628 16.8006 10.9174 16.5034 10.6331C16.1926 10.3357 15.812 10.0966 15.372 9.92218C14.9334 9.74869 14.4474 9.6608 13.9276 9.6608C13.7234 9.6608 13.526 9.74457 13.1446 9.99283C12.91 10.1459 12.6355 10.3229 12.3291 10.5186C12.0671 10.6856 11.7121 10.842 11.2738 10.9836C10.8461 11.122 10.4118 11.1922 9.98318 11.1922C9.55456 11.1922 9.12045 11.122 8.69229 10.9836C8.25437 10.8421 7.89945 10.6857 7.63776 10.5188C7.33427 10.3249 7.05961 10.1479 6.82142 9.99267C6.44056 9.74441 6.24296 9.66064 6.0388 9.66064C5.51878 9.66064 5.03295 9.74869 4.59456 9.92233C4.15481 10.0964 3.7741 10.3355 3.46297 10.6332C3.16589 10.9177 2.90084 11.263 2.67562 11.6595C2.45849 12.0418 2.28271 12.4405 2.15332 12.8447C2.02835 13.2355 1.92383 13.6629 1.84265 14.1151C1.76224 14.5634 1.70761 14.9887 1.6806 15.3793C1.65405 15.762 1.64062 16.1592 1.64062 16.5603C1.64062 17.6043 1.9725 18.4495 2.62695 19.0728C3.27331 19.6879 4.12856 20 5.1686 20H14.7987C15.8387 20 16.6937 19.6881 17.3402 19.0728C17.9948 18.45 18.3267 17.6046 18.3267 16.5602C18.3265 16.1572 18.3129 15.7597 18.2862 15.3789Z"
                        fill="#396AFF"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_163_738">
                        <rect width="19.9999" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>

                <div className="flex flex-col">
                  <h3 className="font-medium text-sm text-affiliate-black">
                    Debit and credit cards
                  </h3>
                  <span className="text-xs text-[#718EBF] font-normal">
                    It is a long established
                  </span>
                </div>
              </div>

              <div className="hidden md:flex flex-col items-start">
                <h3 className="font-medium text-sm text-affiliate-black">Lorem Ipsum</h3>
                <span className="text-xs text-[#718EBF] font-normal">Many publishing</span>
              </div>

              <div className="hidden md:flex flex-col items-start">
                <h3 className="font-medium text-sm text-affiliate-black">Lorem Ipsum</h3>
                <span className="text-xs text-[#718EBF] font-normal">Many publishing</span>
              </div>

              <div className="hidden md:flex flex-col items-start">
                <h3 className="font-medium text-sm text-affiliate-black">Lorem Ipsum</h3>
                <span className="text-xs text-[#718EBF] font-normal">Many publishing</span>
              </div>

              <button
                type="button"
                title="view details"
                className="cursor-pointer text-xs font-medium text-[#1814F3] ring-1 px-5 py-2.5 rounded-3xl ring-[#1814f3]"
              >
                View details
              </button>
            </li>

            <li className="py-3.5 px-3 rounded-2xl bg-white flex justify-between items-center">
              <div className="flex items-center gap-3.5">
                <span className="h-11 w-11 md:w-14 md:h-14 rounded-2xl flex items-center justify-center bg-[#DCFAF8]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_163_741)">
                      <path
                        d="M17.6553 13.3559C17.1178 14.8128 16.3048 16.0796 15.2387 17.1207C14.0251 18.3057 12.4361 19.2473 10.5156 19.919C10.4526 19.941 10.3868 19.959 10.3207 19.9722C10.2335 19.9895 10.1447 19.9988 10.0566 20H10.0394C9.94553 20 9.85123 19.9905 9.75769 19.9722C9.69162 19.959 9.62677 19.941 9.56406 19.9194C7.6413 19.2488 6.05026 18.3077 4.83551 17.1227C3.76892 16.0815 2.95608 14.8155 2.41928 13.3586C1.44317 10.7097 1.49871 7.79159 1.54342 5.44662L1.54418 5.41061C1.55319 5.21697 1.55898 5.01357 1.56219 4.78896C1.57852 3.68621 2.45529 2.77389 3.55819 2.71239C5.85769 2.58407 7.63657 1.8341 9.1565 0.35262L9.16977 0.340413C9.42215 0.108937 9.74014 -0.00458834 10.0566 0.00014191C10.3618 0.00410921 10.6657 0.117482 10.9091 0.340413L10.9221 0.35262C12.4423 1.8341 14.2212 2.58407 16.5207 2.71239C17.6236 2.77389 18.5004 3.68621 18.5167 4.78896C18.5199 5.0151 18.5257 5.21819 18.5347 5.41061L18.5352 5.42587C18.5797 7.77526 18.635 10.6992 17.6553 13.3559Z"
                        fill="#16DBCC"
                      />
                      <path
                        d="M17.6554 13.3557C17.1178 14.8126 16.3048 16.0794 15.2387 17.1205C14.0251 18.3055 12.4361 19.2471 10.5156 19.9188C10.4526 19.9408 10.3868 19.9588 10.3208 19.9721C10.2335 19.9893 10.1447 19.9986 10.0566 19.9999V0C10.3618 0.0039673 10.6658 0.11734 10.9091 0.340271L10.9221 0.352478C12.4424 1.83396 14.2212 2.58393 16.5207 2.71225C17.6236 2.77374 18.5004 3.68607 18.5167 4.78882C18.5199 5.01496 18.5257 5.21805 18.5347 5.41047L18.5352 5.42572C18.5797 7.77512 18.635 10.699 17.6554 13.3557Z"
                        fill="#16DBCC"
                      />
                      <path
                        d="M15.0237 10.0001C15.0237 12.7425 12.797 14.9749 10.0568 14.9847H10.0393C7.29101 14.9847 5.05469 12.7485 5.05469 10.0001C5.05469 7.2518 7.29101 5.01562 10.0393 5.01562H10.0568C12.797 5.02539 15.0237 7.25775 15.0237 10.0001Z"
                        fill="white"
                      />
                      <path
                        d="M13.1015 9.19753L10.0762 11.8814L9.42252 12.4613C9.26809 12.5983 9.06554 12.6667 8.86319 12.6667C8.66064 12.6667 8.4583 12.5983 8.30366 12.4613L6.89815 11.214C6.58929 10.94 6.58929 10.4962 6.89815 10.2221C7.2066 9.94812 7.70753 9.94812 8.01639 10.2221L8.86319 10.9732L11.9833 8.20561C12.2921 7.93146 12.7931 7.93146 13.1015 8.20561C13.4104 8.47959 13.4104 8.92392 13.1015 9.19753Z"
                        fill="#16DBCC"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_163_741">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>

                <div className="flex flex-col">
                  <h3 className="font-medium text-sm text-affiliate-black">Life insuarance</h3>
                  <span className="text-xs text-[#718EBF] font-normal">
                    It is a long established
                  </span>
                </div>
              </div>

              <div className="hidden md:flex flex-col items-start">
                <h3 className="font-medium text-sm text-affiliate-black">Lorem Ipsum</h3>
                <span className="text-xs text-[#718EBF] font-normal">Many publishing</span>
              </div>

              <div className="hidden md:flex flex-col items-start">
                <h3 className="font-medium text-sm text-affiliate-black">Lorem Ipsum</h3>
                <span className="text-xs text-[#718EBF] font-normal">Many publishing</span>
              </div>

              <div className="hidden md:flex flex-col items-start">
                <h3 className="font-medium text-sm text-affiliate-black">Lorem Ipsum</h3>
                <span className="text-xs text-[#718EBF] font-normal">Many publishing</span>
              </div>

              <button
                type="button"
                title="view details"
                className="cursor-pointer text-xs font-medium text-[#1814F3] ring-1 px-5 py-2.5 rounded-3xl ring-[#1814f3]"
              >
                View details
              </button>
            </li>
            <li className="py-3.5 px-3 rounded-2xl bg-white flex justify-between items-center">
              <div className="flex items-center gap-3.5">
                <span className="h-11 w-11 md:w-14 md:h-14 rounded-2xl flex items-center justify-center bg-[#FFE0EB]">
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 60 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="60" height="60" rx="20" fill="#FFE0EB" />
                    <g clipPath="url(#clip0_112_1199)">
                      <path
                        d="M32.4916 33.3372C36.6866 33.3372 40.0994 29.8971 40.0994 25.6686C40.0994 21.4402 36.6866 18 32.4916 18C28.2966 18 24.8838 21.4401 24.8838 25.6686C24.8838 29.897 28.2966 33.3372 32.4916 33.3372ZM30.047 28.0616C30.2683 27.7233 30.722 27.6283 31.0602 27.8497C31.5532 28.1722 31.7391 28.2019 32.3896 28.1973C33.0244 28.1931 33.3928 27.7199 33.4664 27.282C33.5022 27.069 33.516 26.5489 32.8713 26.321C32.1152 26.0536 31.3413 25.7481 30.803 25.3259C30.2646 24.9036 30.0181 24.1746 30.1597 23.4236C30.3131 22.6094 30.8811 21.9612 31.642 21.7321C31.6489 21.73 31.6556 21.7283 31.6625 21.7263V21.4488C31.6625 21.0446 31.9902 20.7168 32.3945 20.7168C32.7987 20.7168 33.1264 21.0446 33.1264 21.4488V21.6802C33.6236 21.7989 33.9708 22.0263 34.1118 22.1317C34.4356 22.3738 34.5018 22.8324 34.2598 23.1563C34.0178 23.4801 33.5591 23.5464 33.2353 23.3042C33.0853 23.1921 32.6707 22.951 32.0642 23.1338C31.7099 23.2405 31.618 23.5901 31.5982 23.6947C31.5595 23.9002 31.603 24.0928 31.7064 24.1739C32.0796 24.4666 32.7514 24.7258 33.3592 24.9406C34.4801 25.3368 35.1033 26.3753 34.9101 27.5247C34.8153 28.0887 34.5316 28.6119 34.1112 28.9981C33.8249 29.2613 33.4916 29.4488 33.1264 29.556V29.8883C33.1264 30.2926 32.7987 30.6203 32.3945 30.6203C31.9902 30.6203 31.6625 30.2926 31.6625 29.8883V29.629C31.1892 29.5716 30.7918 29.4236 30.2588 29.0748C29.9205 28.8535 29.8257 28.3999 30.047 28.0616Z"
                        fill="#FF82AC"
                      />
                      <path
                        d="M20.7741 35.7968H19.105C18.7008 35.7968 18.373 36.1245 18.373 36.5287V42.267C18.373 42.6713 18.7008 42.999 19.105 42.999H20.7741V35.7968H20.7741Z"
                        fill="#FF82AC"
                      />
                      <path
                        d="M42.4118 35.7457C41.0399 34.3737 38.8075 34.3736 37.4356 35.7457L35.2428 37.9384L34.3441 38.8371C33.9809 39.2003 33.4882 39.4044 32.9746 39.4044H28.6044C28.2097 39.4044 27.8701 39.101 27.8515 38.7068C27.8317 38.2859 28.1671 37.9384 28.5837 37.9384H33.0257C33.9188 37.9384 34.6934 37.3025 34.8469 36.4227C34.8822 36.2207 34.9006 36.0129 34.9006 35.801C34.9007 35.396 34.5725 35.0674 34.1676 35.0674H31.7337C30.9382 35.0674 30.1744 34.7065 29.3656 34.3244C28.5174 33.9238 27.6402 33.5094 26.6146 33.4412C25.7176 33.3814 24.8185 33.4796 23.9422 33.7327C23.004 34.0036 22.3295 34.8372 22.2477 35.7996C22.2446 35.7993 22.2415 35.7993 22.2383 35.7991V42.9965L34.8493 43C35.7163 43 36.5316 42.6623 37.1448 42.0491L42.4117 36.7823C42.6981 36.4961 42.6981 36.0319 42.4118 35.7457Z"
                        fill="#FF82AC"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_112_1199">
                        <rect width="25" height="25" fill="white" transform="translate(18 18)" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>

                <div className="flex flex-col">
                  <h3 className="font-medium text-sm text-affiliate-black">Business loans</h3>
                  <span className="text-xs text-[#718EBF] font-normal">
                    It is a long established{" "}
                  </span>
                </div>
              </div>

              <div className="hidden md:flex flex-col items-start">
                <h3 className="font-medium text-sm text-affiliate-black">Lorem Ipsum</h3>
                <span className="text-xs text-[#718EBF] font-normal">Many publishing</span>
              </div>

              <div className="hidden md:flex flex-col items-start">
                <h3 className="font-medium text-sm text-affiliate-black">Lorem Ipsum</h3>
                <span className="text-xs text-[#718EBF] font-normal">Many publishing</span>
              </div>

              <div className="hidden md:flex flex-col items-start">
                <h3 className="font-medium text-sm text-affiliate-black">Lorem Ipsum</h3>
                <span className="text-xs text-[#718EBF] font-normal">Many publishing</span>
              </div>

              <button
                type="button"
                title="view details"
                className="cursor-pointer text-xs font-medium text-[#1814F3] ring-1 px-5 py-2.5 rounded-3xl ring-[#1814f3]"
              >
                View details
              </button>
            </li>
          </ul>
        </div>
      </motion.div>
    </section>
  );
};
