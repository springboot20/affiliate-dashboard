import { useNavigate } from "react-router-dom";
import { TableComponent } from "@/components/tables/table-component";
import {
  useCloseUserAccountMutation,
  useGetUserAccountsQuery,
} from "@/features/account/account.slice";
import { ExclamationCircleIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { DeleteModalComponent } from "@/components/modal/delete-modal";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { SendMessageModal } from "@/components/modal/message";
import { useSearchEngineOptimization } from "@/hooks/seo/useSearchEngineOptimization";

export default function Accounts() {
  const env = import.meta.env;

  useSearchEngineOptimization({
    title: "BankDash | Accounts",
    description: "",
    canonical:
      env.MODE === "production"
        ? "https://iran-opal.vercel.app/home"
        : "http://localhost:5173/app/accounts",
    themeColor: "#000000",
    appleTouchIcon: "/app-logo.svg",
    lang: "en-NG",
    keywords: [],
    favicon: "/app-logo.svg",

    ogTitle: "Accounts",
    ogDescription: "",
    ogImage: "/app-logo.svg",
    ogImageAlt: "Screenshot of my awesome page",
    ogType: "website",
    ogSiteName: "",
  });

  const { data, refetch, isLoading: accountsLoading } = useGetUserAccountsQuery();
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const [openMessage, setOpenMessage] = useState<{ [key: string]: boolean }>({});
  const [accountDeleted, setAccountDeleted] = useState(false);
  const [closeUserAccount, { isLoading }] = useCloseUserAccountMutation();

  const accounts = data?.data;

  const columns = [
    { header: "id", accessor: "_id" },
    {
      header: "user",
      accessor: "profile",
      // Since your implementation uses dot notation access, we need a different approach
      deepOneAccessor: ["firstname", "lastname"],
    },
    {
      header: "balance",
      accessor: "wallet",
      // Since your implementation uses dot notation access, we need a different approach
      deepOneAccessor: ["balance"],
    },
    {
      header: "currency",
      accessor: "wallet",
      // Since your implementation uses dot notation access, we need a different approach
      deepOneAccessor: ["currency"],
    },
    { header: "account number", accessor: "account_number" },
    { header: "type", accessor: "type" },
    { header: "status", accessor: "status" },
    { header: "date created", accessor: "createdAt", type: "Date" },
  ];

  const navigate = useNavigate();

  const onOpen = (id: string) => setOpen((prev) => ({ ...prev, [id]: true }));
  const onClose = (id: string) => setOpen((prev) => ({ ...prev, [id]: false }));

  const onOpenMessage = (id: string) => setOpenMessage((prev) => ({ ...prev, [id]: true }));
  const onCloseMessage = (id: string) => setOpenMessage((prev) => ({ ...prev, [id]: false }));

  const handleCloseUserAccount = async (accountId: string) => {
    try {
      const response = await closeUserAccount({ accountId }).unwrap();

      setAccountDeleted(true);

      const { message } = response;
      toast(message, { type: "success", className: "text-xs" });

      setTimeout(() => {
        setAccountDeleted(false);
        onClose(accountId);
      }, 1000);

      refetch();
    } catch (error: any) {
      const message = error?.data?.message;
      toast(message, { type: "error", className: "text-xs" });
      onClose(accountId!);
    }
  };

  const RenderActions = ({ data }: { data: any }) => {
    return (
      <>
        <DeleteModalComponent
          open={!!open[data?._id as string]}
          itemDeleted={accountDeleted}
          deleteLoading={isLoading}
          handleDelete={() => handleCloseUserAccount(data?._id as string)}
          onClose={() => {
            onClose(data?._id as string);
            refetch();
          }}
          title="account"
        />

        <SendMessageModal
          open={!!openMessage[data?._id as string]}
          close={() => onCloseMessage(data?._id as string)}
        />

        {data?.status !== "CLOSED" && data?.status !== "SUSPENDED" ? (
          <div className="flex items-center space-x-4">
            <button
              type="button"
              title="delete account"
              onClick={() => onOpen(data?._id as string)}
            >
              <TrashIcon className="h-5 text-red-500" />
            </button>
            <button
              type="button"
              title="edit account"
              onClick={() => {
                navigate(`/app/accounts/edit-account/${data?._id}`);
              }}
            >
              <PencilSquareIcon className="h-5 text-[#152F00]" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            title={`account ${
              data?.status === "CLOSED" ? "closed" : data?.status === "SUSPENDED" ? "suspended" : ""
            }`}
            onClick={() => onOpenMessage(data?._id as string)}
          >
            <ExclamationCircleIcon className="h-5 text-red-500" />
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
      <section className="mt-24 lg:mt-[8rem]">
        <div className="max-w-7xl mx-auto px-4 2xl:px-0">
          <header className="flex items-center justify-between">
            <h1 className="lg:text-xl font-medium capitalize text-[#152F00]">account list</h1>

            <button
              title="create account"
              className="px-3 py-2.5 text-[#152F00] bg-[#A1E96F] text-sm font-semibold transition focus:outline-none focus:ring-0 capitalize"
              onClick={() => navigate("/app/accounts/new-account")}
            >
              new account
            </button>
          </header>

          <div className="mt-4 overflow-x-auto !w-full">
            <TableComponent
              columns={columns}
              datum={accounts?.docs}
              actions={(row) => <RenderActions data={row} />}
              isLoading={accountsLoading}
            />
          </div>
        </div>
      </section>
    </>
  );
}
