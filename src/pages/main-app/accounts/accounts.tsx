import { useGetUserAccountsQuery } from '@/features/account/account.slice';
import { AccountType } from '@/types/account';
import { AccountTableListComponent } from '@/components/tables/account-tablelist-component';
import { useNavigate } from 'react-router-dom';

export default function Accounts() {
  const { data } = useGetUserAccountsQuery();

  console.log(data);

  const accounts = data?.data?.accounts as AccountType[];

  const columns = [
    { header: 'id', accessor: '_id' },
    { header: 'type', accessor: 'type' },
    { header: 'status', accessor: 'status' },
    { header: 'date created', accessor: 'createdAt', type: 'Date' },
    { header: 'actions', accessor: 'actions' },
  ];

  const navigate = useNavigate();

  return (
    <section className='py-24 lg:py-[8rem]'>
      <div className='max-w-7xl mx-auto px-4 2xl:px-0'>
        <header className='flex items-center justify-between'>
          <h1 className='lg:text-xl font-medium capitalize text-[#152F00]'>account list</h1>

          <button
            title='create account'
            className='px-3 py-2.5 text-[#152F00] bg-[#A1E96F] text-sm font-semibold rounded-md transition focus:outline-none focus:ring-0'
            onClick={() => navigate('/app/accounts/new-account')}>
            new account
          </button>
        </header>

        <div className='mt-4 overflow-x-scroll !w-full'>
          <AccountTableListComponent columns={columns} datum={accounts} />
        </div>
      </div>
    </section>
  );
}
