import { createClient } from "@/lib/supabase/server";
import ReportsClient from "./reports-client";

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: settingsData } = await supabase.from('settings').select('currency').eq('id', user.id).maybeSingle();
  const settings = settingsData as { currency: string } | null;
  const currency = settings?.currency === 'XOF' ? 'FCFA' : (settings?.currency || 'FCFA');

  // Fetch transactions for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1); // Start of that month

  const { data: transactionsData } = await supabase
    .from('transactions')
    .select('amount, type, date')
    .eq('user_id', user.id)
    .gte('date', sixMonthsAgo.toISOString().split('T')[0]);

  const transactions = (transactionsData || []) as { amount: number, type: 'income' | 'expense', date: string }[];

  // Group by month
  const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
  const months = [];
  const revenueData = [];
  const expenseData = [];

  let totalRevenue = 0;
  let totalExpenses = 0;

  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(monthNames[d.getMonth()]);

    const mTrans = transactions.filter(t => {
      const td = new Date(t.date);
      return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear();
    });

    const rev = mTrans.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
    const exp = mTrans.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);

    revenueData.push(rev);
    expenseData.push(exp);

    totalRevenue += rev;
    totalExpenses += exp;
  }

  return (
    <ReportsClient 
      months={months} 
      revenueData={revenueData} 
      expenseData={expenseData} 
      totalRevenue={totalRevenue} 
      totalExpenses={totalExpenses} 
      currency={currency} 
    />
  );
}
