import { getBudgets } from "@/lib/actions/budgets";
import BudgetsClient from "./budgets-client";

export default async function BudgetingPage() {
  const { data: budgets, error } = await getBudgets();

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-200 mx-4 md:mx-8 max-w-7xl">
          Impossible de charger vos budgets. ({error})
        </div>
      )}
      <BudgetsClient initialBudgets={budgets || []} />
    </div>
  );
}
