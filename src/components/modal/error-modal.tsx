import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Transition,
  TransitionChild,
  DialogTitle,
} from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';

type ErrorModalComponentProps = {
  message: string | null;
  open: boolean;
  close: () => void;
};

export const ErrorModalComponent: React.FC<ErrorModalComponentProps> = ({
  open,
  message,
  close,
}) => {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog open={open} onClose={close} className='relative z-30'>
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <DialogBackdrop className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0' />
        </TransitionChild>

        <div className='fixed inset-0 overflow-hidden'>
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'>
            <div className='absolute inset-0 overflow-hidden'>
              <DialogPanel className='pointer-events-auto grid place-items-center h-screen transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700'>
                <div className='p-4 bg-white rounded-md max-w-md w-full relative min-h-52'>
                  <div className='flex h-7 items-center justify-between'>
                    <DialogTitle as='h1' className='text-base font-bold text-red-500'>
                      Error Notification
                    </DialogTitle>
                    <button
                      type='button'
                      onClick={() => close()}
                      className='h-10 w-10 z-20 flex items-center justify-center rounded-full'>
                      <span className='sr-only'>Close panel</span>
                      <XCircleIcon className='h-5 text-red-500' strokeWidth={2.5} />
                    </button>
                  </div>

                  <div className='flex flex-col items-center justify-center space-y-8'>
                    <div className='h-16 w-16 flex items-center justify-center'>
                      <XCircleIcon className='h-full w-full text-red-500' strokeWidth={2.5} />
                    </div>

                    <p className='text-red-500 text-sm font-medium'>{message}</p>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
