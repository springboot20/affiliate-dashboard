import { AppNavigation } from "@/components/navigation/AppNavigation";
import { Disclosure } from "@headlessui/react";
import { Outlet } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

export default function MainLayout() {
  return (
    <Disclosure as="div" className="bg-white h-screen">
      {({ open }) => (
        <Fragment>
          <AppNavigation open={open} />
          <Outlet />
        </Fragment>
      )}
    </Disclosure>
  );
}
