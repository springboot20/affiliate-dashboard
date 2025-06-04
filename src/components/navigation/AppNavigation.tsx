import {
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react';
import { Bars3Icon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { Fragment, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { classNames } from '@/utils';
import { useAppDispatch, useAppSelector } from '@/app/hook';
import { logout } from '@/features/thunks/auth.thunk';
import { toast } from 'react-toastify';
import { RootState } from '@/app/store';
import { AppSwitcherButton } from '../app-switcher-button';
import app_logo from '@/assets/app-logo.svg';

type Routes = {
  title: string;
  url: string;
  current: boolean;
};

export const AppNavigation: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [hasScrolled, setHasScrolled] = useState(false);

  const { pathname } = useLocation();
  const title = pathname.split('/')[2];

  const navigations: Routes[] = [
    {
      title: 'overview',
      url: '/app/overview',
      current: true,
    },
    {
      title: 'accounts',
      url: '/app/accounts',
      current: true,
    },
    {
      title: 'transactions',
      url: '/app/transactions',
      current: true,
    },
    {
      title: 'cards',
      url: '/app/cards',
      current: true,
    },
    // {
    //   title: "invoice",
    //   url: "/app/invoice",
    //   current: true,
    // },
  ];
  const {
    data: { tokens, user },
  } = useAppSelector((state: RootState) => state.auth);

  const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  const handleLogout = async () => {
    const response = dispatch(logout({ token: tokens?.accessToken }));

    await response
      .unwrap()
      .then(async (res) => {
        await Promise.resolve(
          setTimeout(() => {
            // navigate('/auth/login');
          })
        );

        return res;
      })
      .catch((error) => {
        toast.error(error, {
          // position: 'top-center',
          className:"text-sm"
        });
      });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = scrollY;

      if (scrollPosition > 0) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={classNames(
          'fixed inset-x-0 top-0 h-20 z-20',
          hasScrolled
            ? 'bg-[#152F00] shadow-md'
            : title === 'transactions' ||
              title === 'cards' ||
              title === 'accounts' ||
              title === 'notifications'
            ? 'bg-[#152F00]'
            : 'bg-transparent'
        )}>
        <div className='mx-auto max-w-7xl h-full px-4 2xl:px-0'>
          <div className='flex h-full items-center justify-between'>
            <div className='flex-1 lg:flex-none lg:justify-start flex justiffy-center items-center'>
              <img src={app_logo} alt='app logo' />
            </div>

            <div className='hidden lg:block'>
              <div className='flex flex-row items-center gap-3.5'>
                {React.Children.toArray(
                  navigations.map(({ title, url, current }) => (
                    <NavLink
                      to={url}
                      aria-current={current ? 'page' : undefined}
                      className={({ isActive }) => {
                        return classNames(
                          isActive ? 'bg-[#A1E96F] text-[#152F00]' : 'bg-transparent text-gray-50',
                          'px-3.5 py-2.5 hover:bg-[#A1E96F] hover:!text-[#152F00] transition-all'
                        );
                      }}>
                      {({ isActive }) => {
                        return (
                          <span
                            className={classNames(
                              'capitalize',
                              isActive ? 'font-medium' : 'font-medium text-sm capitalize'
                            )}>
                            {title}
                          </span>
                        );
                      }}
                    </NavLink>
                  ))
                )}
              </div>
            </div>

            <div className='flex items-center space-x-3'>
              <button
                type='button'
                title='notification'
                className='hidden md:flex items-center justify-center lg:mr-3'>
                <svg
                  width='24'
                  height='25'
                  viewBox='0 0 24 25'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M12.0201 3.83008C8.71009 3.83008 6.02009 6.52008 6.02009 9.83008V12.7201C6.02009 13.3301 5.76009 14.2601 5.45009 14.7801L4.30009 16.6901C3.59009 17.8701 4.08009 19.1801 5.38009 19.6201C9.69009 21.0601 14.3401 21.0601 18.6501 19.6201C19.8601 19.2201 20.3901 17.7901 19.7301 16.6901L18.5801 14.7801C18.2801 14.2601 18.0201 13.3301 18.0201 12.7201V9.83008C18.0201 6.53008 15.3201 3.83008 12.0201 3.83008Z'
                    stroke='#F9F9F9'
                    strokeWidth='1.5'
                    strokeMiterlimit='10'
                    strokeLinecap='round'
                  />
                  <path
                    d='M13.8699 4.11999C13.5599 4.02999 13.2399 3.95999 12.9099 3.91999C11.9499 3.79999 11.0299 3.86999 10.1699 4.11999C10.4599 3.37999 11.1799 2.85999 12.0199 2.85999C12.8599 2.85999 13.5799 3.37999 13.8699 4.11999Z'
                    stroke='#F9F9F9'
                    strokeWidth='1.5'
                    strokeMiterlimit='10'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M15.02 19.9801C15.02 21.6301 13.67 22.9801 12.02 22.9801C11.2 22.9801 10.44 22.6401 9.90002 22.1001C9.36002 21.5601 9.02002 20.8001 9.02002 19.9801'
                    stroke='#F9F9F9'
                    strokeWidth='1.5'
                    strokeMiterlimit='10'
                  />
                </svg>
              </button>

              <Menu as='div' className='relative'>
                <div className='mr-3 lg:mr-0'>
                  <MenuButton className='flex items-center space-x-3 text-gray-900'>
                    <span className='sr-only'>Open auth menu</span>
                    <div className={'text-sm text-gray-50'}>Welcome, {user?.username}</div>
                    <span className='flex justify-center items-center border rounded-full overflow-hidden relative h-8 w-8'>
                      <UserIcon className='text-gray-800 h-6 w-6 top-2 absolute' />
                    </span>
                  </MenuButton>
                </div>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'>
                  <MenuItems className='absolute right-0 z-10 mt-4 w-52 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <MenuItem>
                      <AppSwitcherButton />
                    </MenuItem>

                    <MenuItem>
                      <button
                        type='button'
                        title='notification'
                        className='flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-800 font-medium md:hidden'>
                        <svg
                          width='24'
                          height='25'
                          viewBox='0 0 24 25'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'>
                          <path
                            d='M12.0201 3.83008C8.71009 3.83008 6.02009 6.52008 6.02009 9.83008V12.7201C6.02009 13.3301 5.76009 14.2601 5.45009 14.7801L4.30009 16.6901C3.59009 17.8701 4.08009 19.1801 5.38009 19.6201C9.69009 21.0601 14.3401 21.0601 18.6501 19.6201C19.8601 19.2201 20.3901 17.7901 19.7301 16.6901L18.5801 14.7801C18.2801 14.2601 18.0201 13.3301 18.0201 12.7201V9.83008C18.0201 6.53008 15.3201 3.83008 12.0201 3.83008Z'
                            stroke='#000000'
                            strokeWidth='1.5'
                            strokeMiterlimit='10'
                            strokeLinecap='round'
                          />
                          <path
                            d='M13.8699 4.11999C13.5599 4.02999 13.2399 3.95999 12.9099 3.91999C11.9499 3.79999 11.0299 3.86999 10.1699 4.11999C10.4599 3.37999 11.1799 2.85999 12.0199 2.85999C12.8599 2.85999 13.5799 3.37999 13.8699 4.11999Z'
                            stroke='#000000'
                            strokeWidth='1.5'
                            strokeMiterlimit='10'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M15.02 19.9801C15.02 21.6301 13.67 22.9801 12.02 22.9801C11.2 22.9801 10.44 22.6401 9.90002 22.1001C9.36002 21.5601 9.02002 20.8001 9.02002 19.9801'
                            stroke='#000000'
                            strokeWidth='1.5'
                            strokeMiterlimit='10'
                          />
                        </svg>
                        <span>notifications</span>
                      </button>
                    </MenuItem>

                    <MenuItem>
                      <button
                        title='logout'
                        type='button'
                        onClick={handleLogout}
                        className={classNames(
                          'flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-800 font-medium'
                        )}>
                        <svg
                          width='20'
                          height='20'
                          viewBox='0 0 20 20'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'>
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M10.0002 3.33325C9.63198 3.33325 9.33351 3.63173 9.33351 3.99992V8.66658C9.33351 9.03477 9.63198 9.33325 10.0002 9.33325C10.3684 9.33325 10.6668 9.03477 10.6668 8.66658V3.99992C10.6668 3.63173 10.3684 3.33325 10.0002 3.33325ZM7.75481 5.15601C7.57736 4.83362 7.17313 4.71436 6.85193 4.88963C6.30381 5.18873 5.79855 5.56625 5.3492 6.0156C2.7632 8.6016 2.77739 12.8085 5.38089 15.412C7.98438 18.0155 12.1913 18.0297 14.7773 15.4437C17.3633 12.8577 17.3491 8.65079 14.7456 6.0473C14.3186 5.62027 13.8421 5.25686 13.3271 4.96269C13.0076 4.78016 12.6023 4.89024 12.4219 5.20858C12.2415 5.52691 12.3543 5.93294 12.6739 6.11548C13.0855 6.35062 13.4667 6.64134 13.8091 6.98377C15.8919 9.06656 15.9033 12.4321 13.8345 14.5009C11.7657 16.5697 8.40015 16.5583 6.31736 14.4755C4.23456 12.3927 4.22321 9.02721 6.292 6.95841C6.65231 6.5981 7.05643 6.29616 7.49451 6.0571C7.81571 5.88183 7.93225 5.4784 7.75481 5.15601Z'
                            fill='black'
                          />
                          <mask
                            id='mask0_329_12040'
                            maskUnits='userSpaceOnUse'
                            x='3'
                            y='3'
                            width='14'
                            height='15'>
                            <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M10.0002 3.33325C9.63198 3.33325 9.33351 3.63173 9.33351 3.99992V8.66658C9.33351 9.03477 9.63198 9.33325 10.0002 9.33325C10.3684 9.33325 10.6668 9.03477 10.6668 8.66658V3.99992C10.6668 3.63173 10.3684 3.33325 10.0002 3.33325ZM7.75481 5.15601C7.57736 4.83362 7.17313 4.71436 6.85193 4.88963C6.30381 5.18873 5.79855 5.56625 5.3492 6.0156C2.7632 8.6016 2.77739 12.8085 5.38089 15.412C7.98438 18.0155 12.1913 18.0297 14.7773 15.4437C17.3633 12.8577 17.3491 8.65079 14.7456 6.0473C14.3186 5.62027 13.8421 5.25686 13.3271 4.96269C13.0076 4.78016 12.6023 4.89024 12.4219 5.20858C12.2415 5.52691 12.3543 5.93294 12.6739 6.11548C13.0855 6.35062 13.4667 6.64134 13.8091 6.98377C15.8919 9.06656 15.9033 12.4321 13.8345 14.5009C11.7657 16.5697 8.40015 16.5583 6.31736 14.4755C4.23456 12.3927 4.22321 9.02721 6.292 6.95841C6.65231 6.5981 7.05643 6.29616 7.49451 6.0571C7.81571 5.88183 7.93225 5.4784 7.75481 5.15601Z'
                              fill='white'
                            />
                          </mask>
                          <g mask='url(#mask0_329_12040)'>
                            <rect width='20' height='20' fill='#2C2738' />
                          </g>
                        </svg>
                        <span>Log Out</span>
                      </button>
                    </MenuItem>

                    <MenuItem>
                      <button
                        type='button'
                        title='settings'
                        className='flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-800 font-medium'>
                        <svg
                          width='24'
                          height='25'
                          viewBox='0 0 24 25'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'>
                          <path
                            d='M12 15.92C13.6569 15.92 15 14.5769 15 12.92C15 11.2632 13.6569 9.92004 12 9.92004C10.3431 9.92004 9 11.2632 9 12.92C9 14.5769 10.3431 15.92 12 15.92Z'
                            stroke='black'
                            strokeWidth='1.5'
                            strokeMiterlimit='10'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M2 13.8001V12.0401C2 11.0001 2.85 10.1401 3.9 10.1401C5.71 10.1401 6.45 8.8601 5.54 7.2901C5.02 6.3901 5.33 5.2201 6.24 4.7001L7.97 3.7101C8.76 3.2401 9.78 3.5201 10.25 4.3101L10.36 4.5001C11.26 6.0701 12.74 6.0701 13.65 4.5001L13.76 4.3101C14.23 3.5201 15.25 3.2401 16.04 3.7101L17.77 4.7001C18.68 5.2201 18.99 6.3901 18.47 7.2901C17.56 8.8601 18.3 10.1401 20.11 10.1401C21.15 10.1401 22.01 10.9901 22.01 12.0401V13.8001C22.01 14.8401 21.16 15.7001 20.11 15.7001C18.3 15.7001 17.56 16.9801 18.47 18.5501C18.99 19.4601 18.68 20.6201 17.77 21.1401L16.04 22.1301C15.25 22.6001 14.23 22.3201 13.76 21.5301L13.65 21.3401C12.75 19.7701 11.27 19.7701 10.36 21.3401L10.25 21.5301C9.78 22.3201 8.76 22.6001 7.97 22.1301L6.24 21.1401C5.33 20.6201 5.02 19.4501 5.54 18.5501C6.45 16.9801 5.71 15.7001 3.9 15.7001C2.85 15.7001 2 14.8401 2 13.8001Z'
                            stroke='black'
                            strokeWidth='1.5'
                            strokeMiterlimit='10'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                        <span>settings</span>
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Transition>
              </Menu>
            </div>

            <DisclosureButton className='flex items-center justify-center text-white lg:hidden'>
              {open ? <XMarkIcon className='h-7 w-7' /> : <Bars3Icon className='h-7 w-7' />}
            </DisclosureButton>
          </div>
        </div>
      </header>

      <DisclosurePanel className='lg:hidden fixed bg-black/40 left-0 right-0 w-full z-30 top-20 backdrop-blur-sm'>
        <div className='space-y-3 p-4 w-full flex flex-col items-start h-auto relative z-30'>
          {navigations.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className={({ isActive }) => {
                return classNames(
                  isActive ? 'bg-[#A1E96F] text-[#152F00]' : 'bg-transparent text-gray-50',
                  'px-3.5 py-2.5 w-full hover:bg-[#A1E96F] hover:text-[#152F00]'
                );
              }}
              onClick={() => {
                onClose();
              }}
              aria-current={item.current ? 'page' : undefined}>
              {({ isActive }) => {
                return (
                  <span
                    className={classNames(
                      'capitalize',
                      isActive ? 'font-medium' : 'font-medium text-sm capitalize'
                    )}>
                    {item.title}
                  </span>
                );
              }}
            </NavLink>
          ))}
        </div>
      </DisclosurePanel>
    </>
  );
};
