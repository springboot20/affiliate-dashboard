import { classNames } from "@/utils";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Profile } from "./profile/Profile";
import { Preference } from "./preference/Preference";
import { Security } from "./security/Security";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Settings = () => {
  const [currentTab, setCurrentTab] = useState<"profile" | "preference" | "security">("profile");
  const navigate = useNavigate();

  console.log(window.history.state);

  const tabs = [
    <Profile key="profile" />,
    <Preference key="preference" />,
    <Security key="security" />,
  ];

  useEffect(() => {
    console.log(currentTab);

    navigate(`/settings?tab=${currentTab}`);
  }, [currentTab, navigate]);

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
        className="px-2 w-full overflow-x-hidden"
      >
        <div className="p-4 sm:p-8 rounded-3xl bg-white max-w-7xl mx-auto">
          <TabGroup>
            <TabList className="w-full flex flex-row border-b lg:items-start">
              <Tab as={"div"} className="w-full relative h-full lg:w-32">
                {({ selected }) => (
                  <>
                    <button
                      onClick={() => setCurrentTab("profile")}
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
                      onClick={() => setCurrentTab("preference")}
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
                      onClick={() => setCurrentTab("security")}
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
                {React.Children.toArray(
                  tabs.map((tab) => (
                    <TabPanel
                      as={motion.div}
                      initial={{
                        x: "-100%",
                      }}
                      animate={{
                        x: 0,
                      }}
                    >
                      {tab}
                    </TabPanel>
                  ))
                )}
              </AnimatePresence>
            </TabPanels>
          </TabGroup>
        </div>
      </motion.div>
    </section>
  );
};
