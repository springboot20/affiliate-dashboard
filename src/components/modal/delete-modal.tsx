import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Transition,
  TransitionChild,
  DialogTitle,
  Description,
} from '@headlessui/react';
import { XCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@material-tailwind/react';
import { Fragment } from 'react';

export const DeleteModalComponent: React.FC<{
  open: boolean;
  onClose: () => void;
  handleDelete: () => Promise<void>;
  deleteLoading: boolean;
  title: string;
  itemDeleted: boolean;
}> = ({ open, onClose, handleDelete, deleteLoading, itemDeleted, title }) => {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog open={open} onClose={onClose} className='w-full relative !z-30 ' as='div'>
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
              <div className='flex h-screen items-center justify-center'>
                <DialogPanel className='bg-white relative max-w-md w-full flex flex-col space-y-2 p-4'>
                  <button
                    title='close'
                    onClick={onClose}
                    className='h-12 w-12 flex items-center justify-center absolute top-0 right-0'>
                    <span className='sr-only'>Close modal</span>
                    <XCircleIcon className='h-5 text-[#758E95]' strokeWidth={2.5} />
                  </button>
                  <DialogTitle as='h1' className='text-base font-bold text-red-500'>
                    Delete {title}
                  </DialogTitle>

                  <div className='text-center'>
                    <DialogTitle as='h3' className='font-normal text-sm text-red-500'>
                      Are you sure you want to delete this {title}?
                    </DialogTitle>
                    <Description className='mt-3 text-[#413F3F] font-normal text-xs sm:text-sm'>
                      Deleting this {title} means it will be permanently removed from {title}s
                      collections and cannot be recovered
                    </Description>
                  </div>

                  <div className='flex items-center gap-4 !mt-4'>
                    <Button
                      variant='filled'
                      color='red'
                      disabled={deleteLoading}
                      onClick={async () => {
                        await handleDelete();
                        if (itemDeleted) {
                          setTimeout(() => onClose(), 2000);
                        }
                      }}
                      className='flex items-center gap-2 rounded px-2 w-full justify-center' 
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}>
                      {deleteLoading ? (
                        <span>deleting {title}...</span>
                      ) : (
                        <>
                          <TrashIcon className='h-5 w-5 text-white' />
                          <span className='text-xs font-normal'>delete {title}</span>
                        </>
                      )}
                    </Button>

                    <Button
                      variant='filled'
                      color='indigo'
                      onClick={onClose}
                      className='flex items-center gap-2 rounded px-2 w-full justify-center' 
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}>
                      <XCircleIcon className='h-5 w-5' />
                      <span className='!text-xs font-normal'>cancel delete</span>
                    </Button>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};
