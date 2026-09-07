"use client";

import { useState, useActionState, useEffect, useTransition } from "react";
import { Plus, Search, Mail, Phone, MapPin, X, Trash2, FileText, Edit2 } from "lucide-react";
import { addClient, deleteClient, updateClient } from "@/lib/actions/clients";
import toast from "react-hot-toast";
import { Database } from "@/lib/types/database.types";

type ClientRow = Database['public']['Tables']['clients']['Row'];

const initialState = {
  error: undefined as string | undefined,
  details: undefined as any,
  success: false
};

export default function ClientsClient({ initialClients }: { initialClients: ClientRow[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [state, formAction, pending] = useActionState(addClient as any, initialState);
  const [editingClient, setEditingClient] = useState<ClientRow | null>(null);
  const [updateState, updateFormAction, isUpdating] = useActionState(updateClient as any, initialState);
  const [isDeleting, startTransition] = useTransition();

  useEffect(() => {
    if (state.success) {
      toast.success("Client ajouté avec succès");
      setIsModalOpen(false);
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  useEffect(() => {
    if (updateState.success) {
      toast.success("Client mis à jour avec succès");
      setEditingClient(null);
    }
    if (updateState.error) {
      toast.error(updateState.error);
    }
  }, [updateState]);

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      startTransition(async () => {
        const result = await deleteClient(id);
        if (result.success) {
          toast.success("Client supprimé");
        } else {
          toast.error(result.error || "Erreur de suppression");
        }
      });
    }
  };

  const filteredClients = initialClients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.phone && client.phone.includes(searchTerm))
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground mt-1">Gérez votre base de clients.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 hover:scale-105 hover:shadow-md active:scale-95 transition-all duration-300 group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" /> Nouveau Client
        </button>
      </div>

      <div className="mb-6 relative w-96 max-w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Rechercher un client (nom, email, téléphone)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative">
            
            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
              <button 
                onClick={(e) => { e.stopPropagation(); setEditingClient(client); }}
                className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDelete(client.id); }}
                disabled={isDeleting}
                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4 pr-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                {client.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{client.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Client depuis {new Date(client.created_at).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{client.email || 'Non renseigné'}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{client.phone || 'Non renseigné'}</span>
              </div>
              {client.ifu && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>IFU: {client.ifu}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{client.address || 'Non renseigné'}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredClients.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card border border-border rounded-xl border-dashed">
            Aucun client ne correspond à votre recherche.
          </div>
        )}
      </div>

      {/* Modal Nouveau Client */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Nouveau Client</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            <form className="space-y-4" action={formAction}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Nom de l&apos;entreprise ou du client</label>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Ex: Cansaas Agency" 
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Adresse Email</label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="contact@exemple.com" 
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Numéro de téléphone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="+225 00 00 00 00" 
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">IFU (Identifiant Fiscal Unique)</label>
                  <input 
                    type="text" 
                    name="ifu"
                    placeholder="Ex: 1234567890" 
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Adresse physique</label>
                  <input 
                    type="text" 
                    name="address"
                    placeholder="Ex: 123 Rue de la Paix, Abidjan" 
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={pending}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={pending}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {pending ? 'Création...' : 'Créer le client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal Édition Client */}
      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Modifier le Client</h2>
              <button onClick={() => setEditingClient(null)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            <form className="space-y-4" action={updateFormAction}>
              <input type="hidden" name="id" value={editingClient.id} />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Nom de l'entreprise ou du client</label>
                  <input 
                    type="text" 
                    name="name"
                    defaultValue={editingClient.name}
                    placeholder="Ex: Cansaas Agency" 
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Adresse Email</label>
                  <input 
                    type="email" 
                    name="email"
                    defaultValue={editingClient.email || ""}
                    placeholder="contact@exemple.com" 
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Numéro de téléphone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    defaultValue={editingClient.phone || ""}
                    placeholder="+225 00 00 00 00" 
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">IFU (Identifiant Fiscal Unique)</label>
                  <input 
                    type="text" 
                    name="ifu"
                    defaultValue={editingClient.ifu || ""}
                    placeholder="Ex: 1234567890" 
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Adresse physique</label>
                  <input 
                    type="text" 
                    name="address"
                    defaultValue={editingClient.address || ""}
                    placeholder="Ex: 123 Rue de la Paix, Abidjan" 
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                <button 
                  type="button"
                  onClick={() => setEditingClient(null)}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Mise à jour...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
