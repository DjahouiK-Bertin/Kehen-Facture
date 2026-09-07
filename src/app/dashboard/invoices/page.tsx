import { getInvoices } from "@/lib/actions/invoices";
import InvoicesClient from "./invoices-client";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Factures | KEHENFacture",
  description: "Gérez vos factures et suivez les paiements",
};

export default async function InvoicesPage() {
  const result = await getInvoices();

  if (result.error) {
    if (result.error === 'Not authenticated') {
      redirect('/login');
    }
    // We could show an error state here, but for now we'll pass empty data
  }

  const invoices = result.data || [];

  return <InvoicesClient initialInvoices={invoices} />;
}
