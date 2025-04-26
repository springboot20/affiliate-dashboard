import { classNames } from "@/utils";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Profile } from "./profile/Profile";
import { Preference } from "./preference/Preference";
import { Security } from "./security/Security";
import { motion, AnimatePresence } from "framer-motion";

export const Settings = () => {
  return (
    <div className="mt-[11rem] lg:mt-28 px-2 w-full">
      <div className="p-4 sm:p-8 rounded-3xl bg-white max-w-7xl mx-auto">
        <TabGroup>
          <TabList className="w-full flex flex-row border-b lg:items-start">
            <Tab as={"div"} className="w-full relative h-full lg:w-32">
              {({ selected }) => (
                <>
                  <button
                    className={classNames(
                      "text-[#718EBF] select-none w-full focus:ouline-none focus:outline-none border-0 text-xs capitalize font-medium py-2 px-2"
                    )}
                  >
                    edit profile
                  </button>
                  {selected && (
                    <span className="select-none cursor-pointer bg-affiliate-deep-blue w-full rounded-t-3xl block  h-0.5 absolute bottom-0 shadow-none"></span>
                  )}
                </>
              )}
            </Tab>
            <Tab as={"div"} className="relative w-full lg:w-32">
              {({ selected }) => (
                <>
                  <button
                    className={classNames(
                      "text-[#718EBF] select-none w-full focus:ouline-none focus:outline-none border-0 text-xs capitalize font-medium py-2 px-2"
                    )}
                  >
                    preference
                  </button>
                  {selected && (
                    <span className="select-none cursor-pointer bg-affiliate-deep-blue w-full rounded-t-3xl block  h-0.5 absolute bottom-0 shadow-none"></span>
                  )}
                </>
              )}
            </Tab>
            <Tab as={"div"} className="relative w-full lg:w-32">
              {({ selected }) => (
                <>
                  <button
                    className={classNames(
                      "text-[#718EBF] select-none w-full focus:ouline-none focus:outline-none border-0 text-xs capitalize font-medium py-2 px-2"
                    )}
                  >
                    security
                  </button>
                  {selected && (
                    <span className="select-none cursor-pointer bg-affiliate-deep-blue w-full rounded-t-3xl block  h-0.5 absolute bottom-0 shadow-none"></span>
                  )}
                </>
              )}
            </Tab>
          </TabList>
          <TabPanels>
            <AnimatePresence initial={false}>
              <TabPanel
                as={motion.div}
                initial={{
                  left: 0,
                }}
                animate={{
                  left: "-100%",
                }}
              >
                <Profile />
              </TabPanel>
              <TabPanel
                as={motion.div}
                initial={{
                  left: 0,
                }}
                animate={{
                  left: "-100%",
                }}
              >
                <Preference />
              </TabPanel>
              <TabPanel
                as={motion.div}
                initial={{
                  left: 0,
                }}
                animate={{
                  left: "-100%",
                }}
              >
                <Security />
              </TabPanel>
            </AnimatePresence>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};
