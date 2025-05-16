import { useGetUserAccountsQuery } from '@/features/account/account.slice';
import { AccountForms } from './components/account-forms';
import { AccountType } from '@/types/account';
import { AccountTableListComponent } from '@/components/tables/account-tablelist-component';

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

  return (
    <section className='py-24 lg:py-[8rem]'>
      <div className='max-w-7xl mx-auto px-4 2xl:px-0'>
        <div>
          <header>
            <h1 className='lg:text-xl font-medium capitalize text-[#152F00]'>account list</h1>
          </header>

          <div className='mt-4 overflow-x-scroll !w-full'>
            <AccountTableListComponent columns={columns} datum={accounts} />
          </div>
        </div>

        <AccountForms />
      </div>
    </section>
  );
}
