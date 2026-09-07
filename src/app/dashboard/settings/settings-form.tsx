'use client';

import { Save } from "lucide-react";
import { useActionState, useEffect } from "react";
import { updateSettings } from "@/lib/actions/settings";
import toast from "react-hot-toast";
import { Database } from "@/lib/types/database.types";

type SettingsRow = Database['public']['Tables']['settings']['Row'];

const initialState = {
  error: undefined as string | undefined,
  details: undefined as any,
  success: false
};

export default function SettingsForm({ settings }: { settings: SettingsRow | null }) {
  const [state, formAction, pending] = useActionState(updateSettings as any, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success("Paramètres enregistrés avec succès");
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground mt-1">Gérez les préférences de votre entreprise.</p>
        </div>
        <button 
          disabled={pending}
          type="submit" 
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 hover:scale-105 hover:shadow-md active:scale-95 transition-all duration-300 group disabled:opacity-50 disabled:pointer-events-none"
        >
          <Save className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" /> 
          {pending ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Profil de l&apos;entreprise</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom de l&apos;entreprise</label>
              <input 
                name="company_name" 
                defaultValue={settings?.company_name || ""} 
                required
                type="text" 
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email de contact</label>
              <input 
                name="company_email" 
                defaultValue={settings?.company_email || ""} 
                required
                type="email" 
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Adresse</label>
            <input 
              name="company_address" 
              defaultValue={settings?.company_address || ""} 
              type="text" 
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Téléphone</label>
            <input 
              name="company_phone" 
              defaultValue={settings?.company_phone || ""} 
              type="text" 
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
            />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Préférences de Facturation</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Devise par défaut</label>
              <select 
                name="currency" 
                defaultValue={settings?.currency || "XOF"} 
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
              >
                <option value="XOF">FCFA - Franc CFA</option>
                <option value="EUR">EUR - Euro</option>
                <option value="USD">USD - US Dollar</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Taux de TVA par défaut (%)</label>
              <input 
                name="default_tax_rate" 
                defaultValue={settings?.default_tax_rate ?? 18} 
                type="number" 
                step="0.01"
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Conditions de paiement par défaut</label>
            <textarea 
              name="default_payment_terms" 
              defaultValue={settings?.default_payment_terms || ""} 
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary h-24 resize-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
