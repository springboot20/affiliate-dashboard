import { AppNavigation } from '@/components/navigation/AppNavigation';
import { Disclosure } from '@headlessui/react';
import { Outlet } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';

export default function MainLayout() {
  return (
      <Disclosure as='div'>
        {({ open, close }) => (
          <Fragment>
            <AppNavigation open={open} onClose={() => close()} />
            <Outlet />
          </Fragment>
        )}
      </Disclosure>
  );
}
