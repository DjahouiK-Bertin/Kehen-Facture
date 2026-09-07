import { getClients } from "@/lib/actions/clients";
import { getSettings } from "@/lib/actions/settings";
import { getInvoiceById } from "@/lib/actions/invoices";
import NewInvoiceClient from "../../new/new-invoice-client";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Modifier la Facture | KEHENFacture",
  description: "Modifiez votre facture existante",
};

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [clientsResult, settingsResult, invoiceResult] = await Promise.all([
    getClients(),
    getSettings(),
    getInvoiceById(id)
  ]);

  if (clientsResult.error === 'Not authenticated' || settingsResult.error === 'Not authenticated' || invoiceResult.error === 'Not authenticated') {
    redirect('/login');
  }

  const clients = clientsResult.data || [];
  const settings = settingsResult.data || null;
  const initialInvoice = invoiceResult.data || null;

  if (!initialInvoice) {
    redirect('/dashboard/invoices');
  }

  return <NewInvoiceClient clients={clients} settings={settings} initialInvoice={initialInvoice} />;
}
