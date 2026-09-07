"use client";

import { useState, useActionState, useEffect, useTransition } from "react";
import { Plus, Target, TrendingDown, AlertCircle, X, Trash2 } from "lucide-react";
import { addBudget, deleteBudget } from "@/lib/actions/budgets";
import toast from "react-hot-toast";
import { Database } from "@/lib/types/database.types";

type BudgetRow = Database['public']['Tables']['budgets']['Row'];

const initialState = {
  error: undefined as string | undefined,
  details: undefined as any,
  success: false
};

const COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-yellow-500',
  'bg-orange-500',
  'bg-red-500',
  'bg-pink-500',
  'bg-teal-500'
];

export default function BudgetsClient({ initialBudgets }: { initialBudgets: BudgetRow[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  
  const [state, formAction, pending] = useActionState(addBudget as any, initialState);
  const [isDeleting, startTransition] = useTransition();

  useEffect(() => {
    if (state.success) {
      toast.success("Budget créé avec succès");
      setIsModalOpen(false);
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce budget ?")) {
      startTransition(async () => {
        const result = await deleteBudget(id);
        if (result.success) {
          toast.success("Budget supprimé");
        } else {
          toast.error(result.error || "Erreur de suppression");
        }
      });
    }
  };

  const totalAllocated = initialBudgets.reduce((acc, curr) => acc + Number(curr.total_limit), 0);
  const totalSpent = initialBudgets.reduce((acc, curr) => acc + Number((curr as any).amount_spent || 0), 0);
  const remaining = totalAllocated - totalSpent;
  const spentPercentage = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Budget & Planification</h1>
          <p className="text-muted-foreground mt-1">Gérez vos budgets et surveillez vos dépenses.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 hover:scale-105 hover:shadow-md active:scale-95 transition-all duration-300 group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" /> Créer un Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-medium">Budget Global</h3>
          </div>
          <p className="text-3xl font-bold mt-4">{totalAllocated.toLocaleString()} FCFA</p>
          <p className="text-sm text-muted-foreground mt-1">Total alloué</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500/10 text-yellow-600 rounded-lg">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h3 className="font-medium">Dépenses Totales</h3>
          </div>
          <p className="text-3xl font-bold mt-4">{totalSpent.toLocaleString()} FCFA</p>
          <p className="text-sm text-muted-foreground mt-1">{spentPercentage}% du budget utilisé</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/10 text-green-600 rounded-lg">
              <Plus className="w-5 h-5" />
            </div>
            <h3 className="font-medium">Restant à allouer</h3>
          </div>
          <p className="text-3xl font-bold mt-4 text-primary">{Math.max(0, remaining).toLocaleString()} FCFA</p>
          <p className="text-sm text-muted-foreground mt-1">Disponible pour ce mois</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Budgets par Catégorie</h2>
        <div className="space-y-8">
          {initialBudgets.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Aucun budget défini. Créez-en un pour commencer.</p>
          )}
          {initialBudgets.map((budget) => {
            const spent = Number((budget as any).amount_spent || 0);
            const total = Number(budget.total_limit);
            const percentage = total > 0 ? Math.min(Math.round((spent / total) * 100), 100) : 0;
            const over = spent > total;
            
            return (
              <div key={budget.id} className="relative group">
                <button 
                  onClick={() => handleDelete(budget.id)}
                  disabled={isDeleting}
                  className="absolute right-0 top-0 p-1 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all -mt-1 -mr-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex justify-between items-end mb-2 pr-6">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{budget.name}</h4>
                    {over && <AlertCircle className="w-4 h-4 text-red-500" />}
                  </div>
                  <div className="text-sm">
                    <span className={`font-semibold ${over ? 'text-red-500' : ''}`}>{spent.toLocaleString()} FCFA</span>
                    <span className="text-muted-foreground"> / {total.toLocaleString()} FCFA</span>
                  </div>
                </div>
                
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${over ? 'bg-red-500' : (budget.color || 'bg-blue-500')}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <p className={`text-xs mt-2 text-right ${over ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                  {over ? 'Budget dépassé !' : `${percentage}% utilisé`}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Créer Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Nouveau Budget</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <form className="space-y-4" action={formAction}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom de la catégorie</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Ex: Équipements, Licences..." 
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Montant Alloué (FCFA)</label>
                <input 
                  type="number" 
                  name="total_limit"
                  placeholder="0.00" 
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Couleur d&apos;identification</label>
                <input type="hidden" name="color" value={selectedColor} />
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((c) => (
                    <div 
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`w-8 h-8 rounded-full ${c} cursor-pointer hover:scale-110 transition-transform ${selectedColor === c ? `ring-2 ring-offset-2 ring-offset-background ${c.replace('bg-', 'ring-')}` : ''}`}
                    />
                  ))}
                </div>
              </div>
              <button disabled={pending} type="submit" className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors mt-6 disabled:opacity-50">
                {pending ? 'Création...' : 'Créer la catégorie'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
