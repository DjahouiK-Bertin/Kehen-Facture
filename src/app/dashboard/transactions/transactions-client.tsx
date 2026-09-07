"use client";

import { useState, useActionState, useEffect, useTransition } from "react";
import { Plus, Search, Filter, ArrowDownRight, ArrowUpRight, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { addTransaction, deleteTransaction } from "@/lib/actions/transactions";
import toast from "react-hot-toast";
import { Database } from "@/lib/types/database.types";

type TransactionRow = Database['public']['Tables']['transactions']['Row'];

const initialState = {
  error: undefined as string | undefined,
  details: undefined as any,
  success: false
};

const statusMap: Record<string, string> = {
  'completed': 'Complété',
  'pending': 'En attente',
  'failed': 'Échoué',
  'cancelled': 'Annulé',
};

export default function TransactionsClient({ initialTransactions }: { initialTransactions: TransactionRow[] }) {
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  const [state, formAction, pending] = useActionState(addTransaction as any, initialState);
  const [isDeleting, startTransition] = useTransition();

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterIncome, setFilterIncome] = useState(true);
  const [filterExpense, setFilterExpense] = useState(true);
  const [filterCompleted, setFilterCompleted] = useState(true);
  const [filterPending, setFilterPending] = useState(true);

  useEffect(() => {
    if (state.success) {
      toast.success("Transaction ajoutée");
      setIsNewTransactionModalOpen(false);
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette transaction ?")) {
      startTransition(async () => {
        const result = await deleteTransaction(id);
        if (result.success) {
          toast.success("Transaction supprimée");
        } else {
          toast.error(result.error || "Erreur");
        }
      });
    }
  };

  const filteredTransactions = initialTransactions.filter(trx => {
    // 1. Search term (matches ID or description)
    const matchesSearch = trx.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          trx.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Type filter
    const matchesType = (trx.type === "income" && filterIncome) || 
                        (trx.type === "expense" && filterExpense);
    
    // 3. Status filter
    const matchesStatus = (trx.status === "completed" && filterCompleted) || 
                          (trx.status === "pending" && filterPending);

    // If there are other statuses, maybe we show them if pending/completed is checked?
    // Let's keep it simple: if it doesn't match the simple logic, we show it if no filters apply, but here we just restrict.
    const isOtherStatus = trx.status !== "completed" && trx.status !== "pending";

    return matchesSearch && matchesType && (matchesStatus || isOtherStatus);
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-1">Suivez toutes vos entrées et sorties d&apos;argent.</p>
        </div>
        <button 
          onClick={() => setIsNewTransactionModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 hover:scale-105 hover:shadow-md active:scale-95 transition-all duration-300 group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" /> Nouvelle Transaction
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Rechercher une transaction (ID, description)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
          >
            <Filter className="w-4 h-4" /> Filtres
          </button>
          
          {/* Dropdown Filtres */}
          {isFilterModalOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg z-20 p-2 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</div>
              <label className="flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg cursor-pointer text-sm">
                <input 
                  type="checkbox" 
                  checked={filterIncome}
                  onChange={(e) => setFilterIncome(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary" 
                /> Entrées
              </label>
              <label className="flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg cursor-pointer text-sm">
                <input 
                  type="checkbox" 
                  checked={filterExpense}
                  onChange={(e) => setFilterExpense(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary" 
                /> Sorties
              </label>
              <div className="border-t border-border my-1"></div>
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Statut</div>
              <label className="flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg cursor-pointer text-sm">
                <input 
                  type="checkbox" 
                  checked={filterCompleted}
                  onChange={(e) => setFilterCompleted(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary" 
                /> Complété
              </label>
              <label className="flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg cursor-pointer text-sm">
                <input 
                  type="checkbox" 
                  checked={filterPending}
                  onChange={(e) => setFilterPending(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary" 
                /> En attente
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">ID Transaction</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Montant</th>
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-secondary/30 transition-colors group">
                  <td className="px-6 py-4 font-medium text-xs font-mono">{trx.id.split('-')[0]}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(trx.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        trx.type === "income" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
                      )}>
                        {trx.type === "income" ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <span className="font-medium text-foreground">{trx.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    <span className={trx.type === "income" ? "text-green-600 dark:text-green-400" : ""}>
                      {trx.type === "income" ? "+" : "-"}{Number(trx.amount).toLocaleString()} FCFA
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium",
                      trx.status === "completed" ? "bg-primary/10 text-primary" : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                    )}>
                      {statusMap[trx.status] || trx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(trx.id)}
                      disabled={isDeleting}
                      className="p-2 text-muted-foreground hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Aucune transaction ne correspond à vos filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nouvelle Transaction */}
      {isNewTransactionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Nouvelle Transaction</h2>
              <button 
                onClick={() => setIsNewTransactionModalOpen(false)}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            <form className="space-y-4" action={formAction}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <input 
                  type="text" 
                  name="description"
                  placeholder="Ex: Facture #1234, Abonnement..." 
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Montant (FCFA)</label>
                <input 
                  type="number" 
                  name="amount"
                  placeholder="0.00" 
                  step="0.01"
                  min="0.01"
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select name="type" className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none">
                  <option value="income">Entrée (+)</option>
                  <option value="expense">Sortie (-)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <input 
                  type="date" 
                  name="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button 
                type="submit" 
                disabled={pending}
                className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors mt-6 disabled:opacity-50"
              >
                {pending ? "Enregistrement..." : "Enregistrer la transaction"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
