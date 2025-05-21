import { useNavigate } from 'react-router-dom';
import { TableComponent } from '@/components/tables/table-component';
import {
  useDeleteUserAccountMutation,
  useGetUserAccountsQuery,
} from '@/features/account/account.slice';
import { ExclamationCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { DeleteModalComponent } from '@/components/modal/delete-modal';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function Accounts() {
  const { data, refetch } = useGetUserAccountsQuery();
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const [accountDeleted, setAccountDeleted] = useState(false);
  const [deleteUserAccount, { isLoading }] = useDeleteUserAccountMutation();

  const accounts = data?.data;

  const columns = [
    { header: 'id', accessor: '_id' },
    {
      header: 'user',
      accessor: 'profile',
      // Since your implementation uses dot notation access, we need a different approach
      deepOneAccessor: ['firstname', 'lastname'],
    },
    { header: 'account number', accessor: 'account_number' },
    { header: 'type', accessor: 'type' },
    { header: 'status', accessor: 'status' },
    { header: 'date created', accessor: 'createdAt', type: 'Date' },
  ];

  const navigate = useNavigate();

  const onOpen = (id: string) => setOpen((prev) => ({ ...prev, [id]: true }));
  const onClose = (id: string) => setOpen((prev) => ({ ...prev, [id]: false }));

  const handleDeleteUserAccount = async (accountId: string) => {
    try {
      const response = await deleteUserAccount({ accountId }).unwrap();

      setAccountDeleted(true);

      const { message } = response;
      toast(message, { type: 'success', className: 'text-xs' });
    } catch (error: any) {
      const message = error?.data?.message;
      toast(message, { type: 'error', className: 'text-xs' });
      onClose(accountId!);
    }
  };

  const RenderActions = ({ data }: { data: any }) => {
    console.log(data);
    return (
      <>
        <DeleteModalComponent
          open={!!open[data?._id as string]}
          itemDeleted={accountDeleted}
          deleteLoading={isLoading}
          handleDelete={() => handleDeleteUserAccount(data?._id as string)}
          onClose={() => onClose(data?._id as string)}
          title='account'
        />
        {data?.status !== 'CLOSED' && data?.status !== 'SUSPENDED' ? (
          <div className='flex items-center space-x-4'>
            <button
              type='button'
              title='delete account'
              onClick={() => onOpen(data?._id as string)}>
              <TrashIcon className='h-5 text-red-500' />
            </button>
            <button
              type='button'
              title='edit account'
              onClick={() => {
                navigate(`/app/accounts/edit-account/${data?._id}`);
              }}>
              <PencilSquareIcon className='h-5 text-[#152F00]' />
            </button>
          </div>
        ) : (
          <button
            type='button'
            title={`${
              data?.status === 'CLOSED' ? 'closed' : data?.status === 'SUSPENDED' ? 'suspended' : ''
            } account`}>
            <ExclamationCircleIcon className='h-5 text-red-500' />
          </button>
        )}
      </>
    );
  };

  useEffect(() => {
    if (accountDeleted) {
      refetch();
    }
    refetch();
  }, [accountDeleted, refetch]);

  return (
    <>
      <section className='mt-24 lg:mt-[8rem]'>
        <div className='max-w-7xl mx-auto px-4 2xl:px-0'>
          <header className='flex items-center justify-between'>
            <h1 className='lg:text-xl font-medium capitalize text-[#152F00]'>account list</h1>

            <button
              title='create account'
              className='px-3 py-2.5 text-[#152F00] bg-[#A1E96F] text-sm font-semibold transition focus:outline-none focus:ring-0 capitalize'
              onClick={() => navigate('/app/accounts/new-account')}>
              new account
            </button>
          </header>

          <div className='mt-4 overflow-x-auto !w-full'>
            <TableComponent
              columns={columns}
              datum={accounts?.docs}
              actions={(row) => <RenderActions data={row} />}
            />
          </div>
        </div>
      </section>
    </>
  );
}
