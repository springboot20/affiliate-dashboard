import { Fragment } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SideNavigation } from '@/components/navigation/SideNavigation';
import {
  Disclosure,
  DisclosureButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react';
import {
  XMarkIcon,
  Bars3Icon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  BellAlertIcon,
  UserIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { NavLink, useLocation } from 'react-router-dom';
import { classNames } from '@/utils';
import { useAppSelector, useAppDispatch } from '@/app/hook';
import { logout } from '@/features/thunks/auth.thunk';
import { toast } from 'react-toastify';
import { AppSwitcherButton } from '@/components/app-switcher-button';

const AppLayout = () => {
  const { pathname } = useLocation();
  const title = pathname.split('/')[1];
  const {
    isAuthenticated,
    data: { tokens, user },
  } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = dispatch(logout({ token: tokens?.accessToken }));

    await response
      .unwrap()
      .then(async (res) => {
        await Promise.resolve(
          setTimeout(() => {
            navigate('/');
          })
        );

        return res;
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  //  lg:w-[calc(100%-17rem)] lg:left-[17rem] xl:w-[calc(100%-25rem)] xl:left-[25rem]

  return (
    <Disclosure as='div'>
      {({ open, close }) => (
        <div className='relative z-10 w-full flex lg:justify-between items-stretch shrink-0 h-screen'>
          <SideNavigation open={open} close={close} />
          <main
            className={classNames(
              'w-full sticky min-h-screen right-0 overflow-x--hidden transition-all',
              'lg:left-[17rem] lg:w-[calc(100%-17rem)] xl:left-[25rem] xl:w-[calc(100%-25rem)]'
            )}>
            <div className='w-full relative flex flex-col justify-between h-full'>
              <nav className='top-0 left-0 right-0 fixed bg-white lg:left-[17rem] xl:left-[25rem] border-b z-10'>
                <div className='mx-auto px-4 sm:px-2 md:px-4 flex flex-col items-center'>
                  <div className='flex items-center justify-between w-full h-20'>
                    <div className='flex items-center lg:hidden'>
                      <DisclosureButton className='inline-flex items-center justify-center rounded-md p-2 text-gray-900 bg-gray-50 hover:dark:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black/20'>
                        <span className='sr-only'>Open main menu</span>
                        {open ? (
                          <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
                        ) : (
                          <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
                        )}
                      </DisclosureButton>
                    </div>

                    <div className='flex flex-1 lg:flex-none items-center justify-center lg:justify-start'>
                      <h1 className='text-affiliate-blue text-lg lg:text-2xl font-semibold capitalize'>
                        {pathname === '/'
                          ? 'overview'
                          : pathname === '/transactions'
                          ? title
                          : pathname === '/accounts'
                          ? title
                          : pathname === '/investments'
                          ? title
                          : pathname === '/loans'
                          ? title
                          : pathname === '/services'
                          ? title
                          : pathname === '/credit-cards'
                          ? title.split('-').join(' ')
                          : pathname === '/settings'
                          ? title
                          : ''}
                      </h1>
                    </div>

                    <div className='flex items-center space-x-4'>
                      <div className='hidden lg:block flex-1'>
                        <div className='relative w-[30rem]'>
                          <span className='block p-4 absolute left-0 top-1/2 -translate-y-1/2'>
                            <MagnifyingGlassIcon
                              className='z-10 text-[#718EBF] h-8'
                              aria-hidden={true}
                            />
                          </span>
                          <div className=''>
                            <label htmlFor='search' className='hidden'>
                              search
                            </label>
                            <input
                              type='text'
                              id='search'
                              placeholder='Search for something'
                              className='text-sm rounded-[2rem] py-3 px-2 pl-14 block w-full bg-[#F5F7FA] text-[#8BA3CB] outline-0 border'
                            />
                          </div>
                        </div>
                      </div>

                      <div className='hidden xl:flex items-center gap-2'>
                        <DisclosureButton className='h-12 w-12 rounded-full bg-[#F5F7FA] flex items-center justify-center border'>
                          <span className='sr-only'>Settings</span>
                          <Cog6ToothIcon className='h-7 text-[#718EBF]' />
                        </DisclosureButton>

                        <DisclosureButton className='h-12 w-12 rounded-full bg-[#F5F7FA] flex items-center justify-center border'>
                          <span className='sr-only'>Notification</span>
                          <BellAlertIcon className='h-7 text-affiliate-red' />
                        </DisclosureButton>
                      </div>

                      <Menu as='div' className='relative self-center'>
                        <MenuButton className='flex items-center space-x-3 text-gray-900'>
                          <span className='sr-only'>Open auth menu</span>
                          <div
        className={"text-sm text-gray-700"}>
        Welcome, {user?.username}
      </div>
      <span className='flex justify-center items-center border rounded-full overflow-hidden relative h-12 w-12'>
                          <UserCircleIcon className='h-8 text-gray-400' aria-hidden={true} />
                          </span>
                        </MenuButton>
                        <Transition
                          as={Fragment}
                          enter='transition ease-out duration-100'
                          enterFrom='transform opacity-0 scale-95'
                          enterTo='transform opacity-100 scale-100'
                          leave='transition ease-in duration-75'
                          leaveFrom='transform opacity-100 scale-100'
                          leaveTo='transform opacity-0 scale-95'>
                          <MenuItems className='absolute right-0 z-40 mt-4 w-52 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                            {isAuthenticated ? (
                              <>
                                <MenuItem>
                                  <AppSwitcherButton />
                                </MenuItem>

                                <MenuItem>
                                  {({ active }) => (
                                    <NavLink
                                      to='/settings?tab=profile'
                                      className={classNames(
                                        active ? 'bg-gray-100' : '',
                                        'flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-800 font-medium'
                                      )}>
                                      <svg
                                        width='20'
                                        height='20'
                                        viewBox='0 0 20 20'
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-4 w-4 mr-2'>
                                        <g clipPath='url(#clip0_147_29)'>
                                          <path d='M18.1588 7.53125H17.7342C17.5963 7.09961 17.4223 6.68031 17.2138 6.27746L17.5145 5.97676C18.2436 5.24844 18.2241 4.08125 17.5147 3.37266L16.6276 2.48555C15.9194 1.77645 14.752 1.7559 14.0235 2.48527L13.7225 2.78621C13.3197 2.57777 12.9004 2.40371 12.4688 2.26578V1.84113C12.4688 0.825937 11.6428 0 10.6276 0H9.37238C8.35719 0 7.53125 0.825937 7.53125 1.84113V2.26578C7.09965 2.40367 6.68031 2.57773 6.27746 2.78621L5.9768 2.48555C5.24973 1.75762 4.08234 1.77469 3.37273 2.48531L2.48551 3.37246C1.77645 4.08074 1.75594 5.24801 2.48527 5.97656L2.78621 6.2775C2.57773 6.68035 2.40371 7.09961 2.26578 7.53129H1.84117C0.825976 7.53125 0 8.35719 0 9.37238V10.6276C0 11.6428 0.825976 12.4688 1.84117 12.4688H2.26578C2.40371 12.9004 2.57773 13.3197 2.78621 13.7225L2.48551 14.0232C1.75641 14.7516 1.77594 15.9187 2.48527 16.6273L3.37242 17.5145C4.08059 18.2236 5.24801 18.2441 5.97652 17.5147L6.27746 17.2138C6.68031 17.4222 7.09965 17.5963 7.53125 17.7342V18.1589C7.53125 19.1741 8.35723 20 9.37242 20H10.6276C11.6428 20 12.4688 19.1741 12.4688 18.1589V17.7342C12.9004 17.5963 13.3197 17.4223 13.7226 17.2138L14.0232 17.5145C14.7503 18.2424 15.9177 18.2253 16.6273 17.5147L17.5145 16.6275C18.2236 15.9192 18.2441 14.752 17.5148 14.0234L17.2138 13.7225C17.4223 13.3196 17.5963 12.9004 17.7343 12.4687H18.1589C19.1741 12.4687 20 11.6427 20 10.6275V9.3723C20 8.35719 19.174 7.53125 18.1588 7.53125ZM10 14.3516C7.60051 14.3516 5.64844 12.3995 5.64844 10C5.64844 7.60055 7.60051 5.64844 10 5.64844C12.3995 5.64844 14.3516 7.60055 14.3516 10C14.3516 12.3995 12.3995 14.3516 10 14.3516Z' />
                                        </g>
                                        <defs>
                                          <clipPath id='clip0_147_29'>
                                            <rect width='20' height='20' fill='white' />
                                          </clipPath>
                                        </defs>
                                      </svg>
                                      <span>settings</span>
                                    </NavLink>
                                  )}
                                </MenuItem>

                                <MenuItem>
                                  {({ active }) => (
                                    <button
                                      type='button'
                                      onClick={handleLogout}
                                      className={classNames(
                                        active ? 'bg-gray-100' : '',
                                        'flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-800 font-medium'
                                      )}>
                                      <svg
                                        width='33'
                                        height='32'
                                        viewBox='0 0 33 32'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-4 w-4 mr-2 fill-gray-900'>
                                        <path d='M15.5 27C15.5 27.2652 15.3946 27.5196 15.2071 27.7071C15.0196 27.8946 14.7652 28 14.5 28H6.5C6.23478 28 5.98043 27.8946 5.79289 27.7071C5.60536 27.5196 5.5 27.2652 5.5 27V5C5.5 4.73478 5.60536 4.48043 5.79289 4.29289C5.98043 4.10536 6.23478 4 6.5 4H14.5C14.7652 4 15.0196 4.10536 15.2071 4.29289C15.3946 4.48043 15.5 4.73478 15.5 5C15.5 5.26522 15.3946 5.51957 15.2071 5.70711C15.0196 5.89464 14.7652 6 14.5 6H7.5V26H14.5C14.7652 26 15.0196 26.1054 15.2071 26.2929C15.3946 26.4804 15.5 26.7348 15.5 27ZM29.2075 15.2925L24.2075 10.2925C24.0199 10.1049 23.7654 9.99944 23.5 9.99944C23.2346 9.99944 22.9801 10.1049 22.7925 10.2925C22.6049 10.4801 22.4994 10.7346 22.4994 11C22.4994 11.2654 22.6049 11.5199 22.7925 11.7075L26.0863 15H14.5C14.2348 15 13.9804 15.1054 13.7929 15.2929C13.6054 15.4804 13.5 15.7348 13.5 16C13.5 16.2652 13.6054 16.5196 13.7929 16.7071C13.9804 16.8946 14.2348 17 14.5 17H26.0863L22.7925 20.2925C22.6049 20.4801 22.4994 20.7346 22.4994 21C22.4994 21.2654 22.6049 21.5199 22.7925 21.7075C22.9801 21.8951 23.2346 22.0006 23.5 22.0006C23.7654 22.0006 24.0199 21.8951 24.2075 21.7075L29.2075 16.7075C29.3005 16.6146 29.3742 16.5043 29.4246 16.3829C29.4749 16.2615 29.5008 16.1314 29.5008 16C29.5008 15.8686 29.4749 15.7385 29.4246 15.6171C29.3742 15.4957 29.3005 15.3854 29.2075 15.2925Z' />
                                      </svg>
                                      <span>Logout</span>
                                    </button>
                                  )}
                                </MenuItem>
                              </>
                            ) : (
                              <>
                                <MenuItem>
                                  {({ active }) => (
                                    <NavLink
                                      to='/auth/register'
                                      className={classNames(
                                        active ? 'bg-gray-100' : '',
                                        'flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-800 font-medium'
                                      )}>
                                      <UserIcon className='h-4 w-4 mr-2' />
                                      <span>Register</span>
                                    </NavLink>
                                  )}
                                </MenuItem>
                                <MenuItem>
                                  {({ active }) => (
                                    <NavLink
                                      to='/auth/login'
                                      className={classNames(
                                        active ? 'bg-gray-100' : '',
                                        'flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-800 font-medium'
                                      )}>
                                      <ArrowLeftIcon className='h-4 w-4 mr-2' />
                                      <span>Signin</span>
                                    </NavLink>
                                  )}
                                </MenuItem>
                              </>
                            )}
                          </MenuItems>
                        </Transition>
                      </Menu>
                    </div>
                  </div>

                  <div className='lg:hidden h-14'>
                    <div className='relative w-[19rem] sm:w-[32rem] md:w-[45rem]'>
                      <span className='block p-4 absolute left-0 top-1/2 -translate-y-1/2'>
                        <MagnifyingGlassIcon
                          className='z-10 text-[#718EBF] h-5'
                          aria-hidden={true}
                        />
                      </span>
                      <div className=''>
                        <label htmlFor='mobile-search' className='hidden'>
                          search
                        </label>
                        <input
                          type='text'
                          id='mobile-search'
                          placeholder='Search for something'
                          className='text-sm rounded-[2rem] py-2 px-2 pl-11 block w-full bg-[#F5F7FA] text-[#8BA3CB] outline-0 border'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
              <Outlet />
            </div>
          </main>
        </div>
      )}
    </Disclosure>
  );
};

export default AppLayout;
