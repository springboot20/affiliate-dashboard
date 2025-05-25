import { useGetTransactionDetailsQuery } from "@/features/transactions/transaction.slice";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router-dom";

export default function TransactionDetails() {
  const navigate = useNavigate();
  const { transactionId } = useParams<{ transactionId: string }>();

  const { data } = useGetTransactionDetailsQuery(transactionId!, {
    skip: !transactionId,
  });

  console.log(data);

  return (
    <section className="py-24 lg:py-[8rem]">
      <div className="max-w-3xl mx-auto px-4 2xl:px-0">
        <button
          title="back"
          type="button"
          className="flex items-center gap-3 hover:underline active:underline text-sm font-medium mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="size-4 shrink-0" />
          back
        </button>

        <div className="max-w-full">
          <div className="border p-4 rounded-sm bg-white mb-5"></div>
          <div className="border p-4 rounded-sm bg-white mb-5"></div>
          <div className="border p-4 rounded-sm bg-white"></div>
        </div>
      </div>
    </section>
  );
}
