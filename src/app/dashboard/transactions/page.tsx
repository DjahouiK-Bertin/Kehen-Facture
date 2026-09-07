import { getTransactions } from "@/lib/actions/transactions";
import TransactionsClient from "./transactions-client";

export default async function TransactionsPage() {
  const { data: transactions, error } = await getTransactions();

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-200 mx-4 md:mx-8 max-w-7xl">
          Impossible de charger vos transactions. ({error})
        </div>
      )}
      <TransactionsClient initialTransactions={transactions || []} />
    </div>
  );
}
