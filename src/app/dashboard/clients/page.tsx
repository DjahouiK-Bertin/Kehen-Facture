import { getClients } from "@/lib/actions/clients";
import ClientsClient from "./clients-client";

export default async function ClientsPage() {
  const { data: clients, error } = await getClients();

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-200 mx-4 md:mx-8 max-w-7xl">
          Impossible de charger vos clients. ({error})
        </div>
      )}
      <ClientsClient initialClients={clients || []} />
    </div>
  );
}
