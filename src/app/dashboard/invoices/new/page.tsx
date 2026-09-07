import { getClients } from "@/lib/actions/clients";
import { getSettings } from "@/lib/actions/settings";
import NewInvoiceClient from "./new-invoice-client";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Nouvelle Facture | KEHENFacture",
  description: "Créez une nouvelle facture",
};

export default async function CreateInvoicePage() {
  const [clientsResult, settingsResult] = await Promise.all([
    getClients(),
    getSettings()
  ]);

  if (clientsResult.error === 'Not authenticated' || settingsResult.error === 'Not authenticated') {
    redirect('/login');
  }

  const clients = clientsResult.data || [];
  const settings = settingsResult.data || null;

  return <NewInvoiceClient clients={clients} settings={settings} />;
}
