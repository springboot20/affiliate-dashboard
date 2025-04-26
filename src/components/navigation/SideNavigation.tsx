import React from "react";
import { NavLink } from "react-router-dom";
import { classNames } from "@/utils";
import {
  framerText,
  // framerSidebarPanel,
  framerIcon,
  framerNavItems,
} from "@/utils/configs/framer.config";
import Logo from "@/assets/Logo.png";
import {
  HomeIcon,
  TransactionIcon,
  UserIcon,
  InvestmentIcon,
  CreditCardIcon,
  LoanIcon,
  ServiceIcon,
  EconometricsIcon,
  SettingsIcon,
} from "@/components/icons/Icons";
import { AnimatePresence, motion } from "framer-motion";
import { DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export const SideNavigation: React.FC<{
  close: (
    focusableElement?: HTMLElement | React.MutableRefObject<HTMLElement | null>,
  ) => void;
  open: boolean;
}> = ({ open, close }) => {
  const routes = [
    { to: "/", name: "overview", current: true, Icon: HomeIcon },
    {
      to: "/transactions",
      name: "transactions",
      current: true,
      Icon: TransactionIcon,
    },
    { to: "/accounts", name: "accounts", current: true, Icon: UserIcon },
    {
      to: "/investments",
      name: "investments",
      current: true,
      Icon: InvestmentIcon,
    },
    {
      to: "/credit-cards",
      name: "credit cards",
      current: true,
      Icon: CreditCardIcon,
    },
    { to: "/loan", name: "loans", current: true, Icon: LoanIcon },
    { to: "/service", name: "services", current: true, Icon: ServiceIcon },
    {
      to: "/privileges",
      name: "my privileges",
      current: true,
      Icon: EconometricsIcon,
    },
    { to: "/settings", name: "settings", current: true, Icon: SettingsIcon },
  ];

  return (
    <nav className="z-20">
      <>
        <div
          className={`hidden lg:flex fixed left-0 top-0 min-h-screen bg-white w-[17rem] xl:w-[25rem] border-r-2 flex-col items-center`}
        >
          <div className="flex flex-col items-center h-full w-full">
            <div className="p-4 h-32 flex w-full items-center justify-start">
              <img src={Logo} alt="logo" />
            </div>
            <motion.ul className="w-full h-full">
              {routes.map(({ to, name, Icon }) => (
                <motion.li key={name} className="">
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      classNames(
                        "pl-10 flex flex-row space-x-5 py-4 px-3 hover:bg-gray-100 relative",
                        isActive
                          ? "bg-gray-100 text-[#2D60FF] before:bg-blue-500"
                          : "text-[#B1B1B1]",
                        "flex items-center relative transition ease delay-400",
                        "before:absolute before:content-[' '] before:h-full before:w-2 before:left-0 before:rounded-tr-2xl before:rounded-br-2xl",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <motion.div>
                          <Icon
                            className={classNames(
                              isActive ? "fill-[#2D60FF]" : "fill-gray-400",
                              "h-5 w-5",
                            )}
                          />
                        </motion.div>
                        <motion.span className="text-sm font-medium capitalize">
                          {name}
                        </motion.span>
                      </>
                    )}
                  </NavLink>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>

        <AnimatePresence initial={false} mode="wait">
          <DisclosurePanel
            as={motion.div}
            className={classNames(
              "lg:hidden fixed top-0 min-h-screen w-full sm:w-[30rem] bg-white",
              open ? "translate-x-0" : "-translate-x-full",
              "transform transition-transform duration-200 ",
            )}
          >
            <DisclosureButton className="absolute right-8 top-8">
              <span className="sr-only">Close Side menu</span>
              <XMarkIcon className="h-8 w-8 text-gray-800" />
            </DisclosureButton>

            <div className="p-2 h-20 flex items-center justify-start">
              <img src={Logo} alt="logo" />
            </div>

            <motion.ul className="space-y-4">
              {routes.map(({ to, name, Icon }, idx) => (
                <motion.li key={name} {...framerNavItems(idx, open)}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      classNames(
                        "pl-8 flex flex-row space-x-5 py-3.5 px-3 hover:bg-gray-100 relative hover:before:bg-blue-500",
                        isActive
                          ? "bg-white/20 text-[#2D60FF] before:bg-blue-500"
                          : "text-gray-400",
                        "flex items-center relative transition ease delay-400",
                        "before:absolute before:content-[' '] before:h-full before:w-1.5 before:left-0 before:rounded-tr-2xl before:rounded-br-2xl",
                      )
                    }
                    onClick={() => {
                      if (close) close();
                    }}
                  >
                    {({ isActive }) => (
                      <>
                        <motion.div {...framerIcon(open)}>
                          <Icon
                            className={classNames(
                              isActive ? "fill-[#2D60FF]" : "fill-gray-400",
                              "h-5 w-5",
                            )}
                          />
                        </motion.div>
                        <motion.span
                          {...framerText(idx, open)}
                          className="text-base font-semibold capitalize"
                        >
                          {name}
                        </motion.span>
                      </>
                    )}
                  </NavLink>
                </motion.li>
              ))}
            </motion.ul>
          </DisclosurePanel>
        </AnimatePresence>
      </>
    </nav>
  );
};
