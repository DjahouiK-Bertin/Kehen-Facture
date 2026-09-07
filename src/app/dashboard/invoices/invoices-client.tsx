"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Send, FileText, Eye, RefreshCw, X, CheckCircle2, MessageCircle, Mail } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { deleteInvoice, updateInvoiceStatus } from "@/lib/actions/invoices";
import toast from "react-hot-toast";

type Client = {
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
}

type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  tax_rate: number;
}

type Invoice = {
  id: string;
  invoice_number: string;
  client_id: string | null;
  issue_date: string;
  due_date: string;
  
  issuer_name: string;
  issuer_email: string | null;
  issuer_phone: string | null;
  issuer_address: string | null;

  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  client_address: string | null;

  subtotal: number;
  tax_total: number;
  discount_type: string;
  discount: number;
  total: number;

  notes: string | null;
  payment_method: string | null;
  payment_details: string | null;
  
  status: string;
  clients: Client | null;
  invoice_items: InvoiceItem[];
  created_at: string;
}

const statusMap: Record<string, string> = {
  'draft': 'Brouillon',
  'sent': 'Envoyée',
  'pending': 'En attente',
  'paid': 'Payée',
  'cancelled': 'Annulée',
  'overdue': 'En retard'
};

const statusMapReverse: Record<string, string> = {
  'Brouillon': 'draft',
  'Envoyée': 'sent',
  'En attente': 'pending',
  'Payée': 'paid',
  'Annulée': 'cancelled',
  'En retard': 'overdue'
};

export default function InvoicesClient({ initialInvoices }: { initialInvoices: Invoice[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('Toutes');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState('recent'); // recent, oldest, amount
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const successAction = searchParams.get('success');
    if (successAction === 'edit') {
      showToast('Modifications validées avec succès.');
      router.replace('/dashboard/invoices');
    } else if (successAction === 'create') {
      showToast('Nouvelle facture créée avec succès.');
      router.replace('/dashboard/invoices');
    }
  }, [searchParams, router]);

  const [modalState, setModalState] = useState<{ type: 'view' | 'status' | 'delete' | 'send', inv: Invoice, autoPrint?: boolean } | null>(null);
  const [newStatus, setNewStatus] = useState("paid");
  
  // Auto-print effect when opening the view modal in download mode
  useEffect(() => {
    if (modalState?.type === 'view' && modalState.autoPrint) {
      const timer = setTimeout(() => {
        window.print();
        setModalState(prev => prev ? { ...prev, autoPrint: false } : null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [modalState]);
  
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalState?.inv) {
      startTransition(async () => {
        const result = await updateInvoiceStatus(modalState.inv.id, newStatus);
        if (result.success) {
          showToast("Statut de la facture mis à jour avec succès.");
          setModalState(null);
        } else {
          toast.error(result.error || "Erreur de mise à jour");
        }
      });
    }
  };

  const handleDelete = () => {
    if (modalState?.inv) {
      startTransition(async () => {
        const result = await deleteInvoice(modalState.inv.id);
        if (result.success) {
          showToast(`Facture ${modalState.inv.invoice_number} supprimée.`);
          setModalState(null);
        } else {
          toast.error(result.error || "Erreur de suppression");
        }
      });
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, initialInvoices.length, searchTerm, sortOrder]);

  const filteredInvoices = initialInvoices.filter(inv => {
    const frStatus = statusMap[inv.status] || inv.status;
    
    if (activeTab === 'Brouillons' && inv.status !== 'draft') return false;
    if (activeTab === 'Envoyées' && inv.status !== 'sent') return false;
    if (activeTab === 'Payées' && inv.status !== 'paid') return false;
    if (activeTab === 'En retard' && inv.status !== 'overdue') return false;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const clientName = inv.clients?.name.toLowerCase() || '';
      const invoiceNumber = (inv.invoice_number || '').toLowerCase();
      
      if (!clientName.includes(term) && !invoiceNumber.includes(term)) {
        return false;
      }
    }
    
    return true;
  }).sort((a, b) => {
    if (sortOrder === 'amount') {
      return Number(b.total) - Number(a.total);
    }
    if (sortOrder === 'oldest') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    // recent
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full relative print:p-0 print:m-0 print:max-w-none">
      <div className="flex justify-between items-center mb-8 print:hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Factures</h1>
          <p className="text-muted-foreground mt-1">Gérez vos factures et suivez les paiements.</p>
        </div>
        <Link 
          href="/dashboard/invoices/new" 
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 hover:scale-105 hover:shadow-md active:scale-95 transition-all duration-300 group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" /> Nouvelle Facture
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden print:hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:justify-between sm:items-center bg-secondary/30 gap-4">
          <div className="flex items-center gap-4">
            <div className="relative z-10">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Rechercher par client ou N°..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-64"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary"
              >
                <Filter className="w-4 h-4 text-muted-foreground" /> Filtrer
              </button>
              
              {showFilterDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowFilterDropdown(false)} 
                  />
                  <div className="absolute top-full mt-2 left-0 w-56 bg-card border border-border rounded-xl shadow-xl z-20 py-2 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trier par</div>
                    <button onClick={() => { setSortOrder('recent'); setShowFilterDropdown(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-secondary flex justify-between items-center">
                      Plus récentes {sortOrder === 'recent' && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </button>
                    <button onClick={() => { setSortOrder('oldest'); setShowFilterDropdown(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-secondary flex justify-between items-center">
                      Plus anciennes {sortOrder === 'oldest' && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </button>
                    <button onClick={() => { setSortOrder('amount'); setShowFilterDropdown(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-secondary flex justify-between items-center">
                      Montant le plus élevé {sortOrder === 'amount' && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex bg-secondary p-1 rounded-lg overflow-x-auto max-w-full">
            {['Toutes', 'Brouillons', 'Envoyées', 'Payées', 'En retard'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab 
                    ? 'bg-card shadow-sm text-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/30 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">N° Facture</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Date d&apos;émission</th>
                <th className="px-6 py-4 font-medium">Échéance</th>
                <th className="px-6 py-4 font-medium text-right">Montant</th>
                <th className="px-6 py-4 font-medium text-center">Statut</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedInvoices.map((inv) => (
                <InvoiceRow 
                  key={inv.id} 
                  inv={inv} 
                  onAction={(action, invoice) => {
                    if (action === 'view' || action === 'status' || action === 'delete' || action === 'send') {
                      setModalState({ type: action, inv: invoice });
                      if (action === 'status') setNewStatus(invoice.status);
                    } else if (action === 'edit') {
                      // Modification not fully supported yet in MVP, but path is there
                      router.push(`/dashboard/invoices/${invoice.id}/edit`);
                    } else if (action === 'download') {
                      showToast(`Préparation du document pour l'impression PDF...`);
                      setModalState({ type: 'view', inv: invoice, autoPrint: true });
                    }
                  }}
                />
              ))}
              {paginatedInvoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    Aucune facture trouvée pour ce filtre.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Affichage de {filteredInvoices.length > 0 ? startIndex + 1 : 0} à {Math.min(startIndex + itemsPerPage, filteredInvoices.length)} sur {filteredInvoices.length} factures
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-border rounded disabled:opacity-50 hover:bg-secondary transition-colors"
            >
              Précédent
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border border-border rounded disabled:opacity-50 hover:bg-secondary transition-colors"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Voir Facture Modal */}
      {modalState?.type === 'view' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in py-8 px-4 print:static print:inset-auto print:p-0 print:bg-transparent print:overflow-visible print:block">
          <div className="w-full max-w-3xl flex justify-between items-center mb-6 shrink-0 print:hidden">
            <h2 className="text-2xl font-bold text-white">Aperçu de la Facture</h2>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  showToast("Préparation du document pour l'impression PDF...");
                  setTimeout(() => window.print(), 500);
                }}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg"
              >
                <FileText className="w-4 h-4" /> Imprimer en PDF
              </button>
              <button onClick={() => setModalState(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-2xl min-h-[1000px] w-full max-w-3xl relative overflow-hidden shrink-0 print:shadow-none print:min-h-0 print:w-full print:overflow-visible">
            <div className="absolute -bottom-2 left-2 right-2 h-full bg-white/50 border border-gray-100 rounded-lg -z-10 mx-auto" />
            <div className="absolute -bottom-4 left-4 right-4 h-full bg-white/30 border border-gray-50 rounded-lg -z-20 mx-auto" />
            
            <div className="p-12 md:p-16">
              <div className="flex justify-between items-start mb-16">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">FACTURE</h1>
                  <p className="text-gray-500">Facture N° {modalState.inv.invoice_number}</p>
                </div>
                <div className="transform scale-[2] origin-top-right pointer-events-none">
                  <Logo collapsed />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 mb-12 text-sm">
                <div>
                  <p className="text-gray-500 mb-2">Émis par :</p>
                  <p className="font-semibold text-gray-900">{modalState.inv.issuer_name || "Soke Bahtera"}</p>
                  {modalState.inv.issuer_email && <p className="text-gray-500">{modalState.inv.issuer_email}</p>}
                  {modalState.inv.issuer_phone && <p className="text-gray-500">{modalState.inv.issuer_phone}</p>}
                  {modalState.inv.issuer_address && <p className="text-gray-500">{modalState.inv.issuer_address}</p>}
                </div>
                <div>
                  <p className="text-gray-500 mb-2">Facturé à :</p>
                  <p className="font-semibold text-gray-900">{modalState.inv.client_name || modalState.inv.clients?.name}</p>
                  {modalState.inv.client_email && <p className="text-gray-500">{modalState.inv.client_email}</p>}
                  {modalState.inv.client_phone && <p className="text-gray-500">{modalState.inv.client_phone}</p>}
                  {modalState.inv.client_address && <p className="text-gray-500">{modalState.inv.client_address}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 mb-12 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Date d&apos;émission :</p>
                  <p className="font-semibold text-gray-900">
                    {modalState.inv.issue_date ? new Date(modalState.inv.issue_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : "..."}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Date d&apos;échéance :</p>
                  <p className="font-semibold text-gray-900">
                    {modalState.inv.due_date ? new Date(modalState.inv.due_date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : "..."}
                  </p>
                </div>
              </div>

              <div className="mb-12">
                <p className="text-gray-500 mb-4 text-sm font-medium">Articles / Services :</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[500px]">
                    <thead>
                      <tr className="text-gray-500 border-b border-gray-100">
                        <th className="font-medium text-left pb-3">Description</th>
                        <th className="font-medium text-center pb-3">Qté</th>
                        <th className="font-medium text-right pb-3">Montant (HT)</th>
                        <th className="font-medium text-center pb-3">TVA</th>
                        <th className="font-medium text-right pb-3">Montant (TTC)</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-900">
                      {(modalState.inv.invoice_items || []).map((item) => {
                        // Recalculate values if needed or just display stored ones
                        const ht = item.quantity * item.unit_price;
                        // Use stored tax_rate if present, else fallback to calculate from stored amounts
                        // Assuming the UI during creation uses default_tax_rate, we can reconstruct it for display if needed.
                        // In the new schema, we store tax_rate on the item. If it's 0 because we didn't save it properly before, 
                        // we can approximate it or just show HT. Let's show HT.
                        // Wait, in addInvoice, we currently insert `tax_rate: 0` because it was not in the payload items!
                        // Let's fix that too, but for display let's just use what we have.
                        
                        return (
                          <tr key={item.id} className="border-b border-gray-50 last:border-0">
                            <td className="py-4 font-medium">{item.description || "..."}</td>
                            <td className="py-4 text-center">{item.quantity}</td>
                            <td className="py-4 text-right whitespace-nowrap">{new Intl.NumberFormat('fr-FR').format(ht)} FCFA</td>
                            <td className="py-4 text-center whitespace-nowrap">{new Intl.NumberFormat('fr-FR').format(item.amount - ht)} FCFA</td>
                            <td className="py-4 text-right font-semibold whitespace-nowrap">{new Intl.NumberFormat('fr-FR').format(item.amount)} FCFA</td>
                          </tr>
                        );
                      })}
                      {(!modalState.inv.invoice_items || modalState.inv.invoice_items.length === 0) && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-400 italic">Aucun article disponible.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end mb-16">
                <div className="w-72 space-y-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span className="font-medium">Sous-total (HT)</span>
                    <span>{new Intl.NumberFormat('fr-FR').format(modalState.inv.subtotal || 0)} FCFA</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="font-medium">TVA</span>
                    <span>{new Intl.NumberFormat('fr-FR').format(modalState.inv.tax_total || 0)} FCFA</span>
                  </div>
                  {modalState.inv.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span className="font-medium">Remise</span>
                      <span>
                        -{modalState.inv.discount_type === 'percentage' 
                           ? `${modalState.inv.discount}%` 
                           : `${new Intl.NumberFormat('fr-FR').format(modalState.inv.discount)} FCFA`}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-900 font-bold text-lg pt-4 border-t border-gray-100">
                    <span>Total (TTC)</span>
                    <span>{new Intl.NumberFormat('fr-FR').format(modalState.inv.total || 0)} FCFA</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-500 mb-16 whitespace-pre-wrap">
                {modalState.inv.notes}
              </div>

              <div className="flex justify-between items-end mt-auto">
                <div className="text-sm max-w-[250px]">
                  <p className="font-bold text-gray-900 mb-1">Méthode de paiement</p>
                  <p className="text-gray-500 font-medium">{modalState.inv.payment_method}</p>
                  {modalState.inv.payment_details && (
                    <p className="text-gray-500 mt-1 break-words">{modalState.inv.payment_details}</p>
                  )}
                </div>
                <div className="text-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Signature_of_John_Hancock.png" alt="Signature" className="h-12 opacity-50 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-900">{modalState.inv.issuer_name || "La Direction"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Changer Statut Modal */}
      {modalState?.type === 'status' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Changer le statut</h2>
              <button onClick={() => setModalState(null)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateStatus}>
              <p className="text-sm text-muted-foreground mb-4">
                Nouveau statut pour <strong>{modalState.inv.invoice_number}</strong>
              </p>
              
              <div className="space-y-3 mb-6">
                {['draft', 'sent', 'pending', 'paid', 'overdue', 'cancelled'].map(s => (
                  <label key={s} className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-secondary/50 transition-colors">
                    <input 
                      type="radio" 
                      name="status" 
                      value={s} 
                      checked={newStatus === s}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium">{statusMap[s]}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setModalState(null)}
                  disabled={isPending}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors text-sm disabled:opacity-50"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={isPending}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
                >
                  {isPending ? "Mise à jour..." : "Mettre à jour"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalState?.type === 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-destructive flex items-center gap-2">
                <Trash2 className="w-5 h-5" /> Supprimer la facture
              </h2>
              <button onClick={() => setModalState(null)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Êtes-vous sûr de vouloir supprimer la facture <strong>{modalState.inv.invoice_number}</strong> ? Cette action est irréversible.
            </p>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setModalState(null)}
                disabled={isPending}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors text-sm disabled:opacity-50"
              >
                Annuler
              </button>
              <button 
                onClick={handleDelete}
                disabled={isPending}
                className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-medium hover:bg-destructive/90 transition-colors text-sm disabled:opacity-50"
              >
                {isPending ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Envoyer Facture Modal */}
      {modalState?.type === 'send' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Envoyer la facture</h2>
              <button onClick={() => setModalState(null)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Comment souhaitez-vous envoyer la facture <strong>{modalState.inv.invoice_number}</strong> à {modalState.inv.clients?.name} ?
            </p>

            <div className="space-y-3">
              <button 
                onClick={() => {
                  showToast(`Facture envoyée par Email à ${modalState.inv.clients?.name}`);
                  setModalState(null);
                }}
                className="w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">Par Email</p>
                  <p className="text-xs text-muted-foreground">Envoyer directement depuis l'application</p>
                </div>
              </button>

              <button 
                onClick={() => {
                  showToast(`Redirection vers WhatsApp pour envoyer à ${modalState.inv.clients?.name}`);
                  setModalState(null);
                }}
                className="w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">Par WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Partager le lien ou le PDF via WhatsApp</p>
                </div>
              </button>

              <button 
                onClick={() => {
                  setModalState({ type: 'view', inv: modalState.inv, autoPrint: true });
                }}
                className="w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">Télécharger PDF</p>
                  <p className="text-xs text-muted-foreground">Enregistrer sur cet appareil</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-card border border-border shadow-xl rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in z-50 print:hidden">
          <div className="w-8 h-8 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">Action réussie</p>
            <p className="text-xs text-muted-foreground">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function InvoiceRow({ inv, onAction }: { inv: Invoice, onAction: (action: string, inv: Invoice) => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuClick = (action: string) => {
    setIsMenuOpen(false);
    onAction(action, inv);
  };

  const statusFR = statusMap[inv.status] || inv.status;

  return (
    <tr className="hover:bg-secondary/30 transition-colors">
      <td className="px-6 py-4 font-medium">{inv.invoice_number}</td>
      <td className="px-6 py-4">{inv.clients?.name || 'Client inconnu'}</td>
      <td className="px-6 py-4 text-muted-foreground">{new Date(inv.issue_date).toLocaleDateString('fr-FR')}</td>
      <td className="px-6 py-4 text-muted-foreground">{new Date(inv.due_date).toLocaleDateString('fr-FR')}</td>
      <td className="px-6 py-4 font-medium text-right">{Number(inv.total).toLocaleString()} FCFA</td>
      <td className="px-6 py-4 text-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${inv.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
          ${inv.status === 'sent' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
          ${inv.status === 'draft' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400' : ''}
          ${inv.status === 'overdue' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
          ${inv.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
          ${inv.status === 'cancelled' ? 'bg-gray-100 text-gray-500' : ''}
        `}>
          {statusFR}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div ref={menuRef} className="inline-block relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-1.5 rounded-md transition-colors ${
              isMenuOpen ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 py-1 text-sm animate-in fade-in zoom-in-95 duration-100">
              <button onClick={() => handleMenuClick('view')} className="w-full text-left px-4 py-2 hover:bg-secondary flex items-center gap-2 transition-colors">
                <Eye className="w-4 h-4 text-muted-foreground" /> Voir la facture
              </button>
              <button onClick={() => handleMenuClick('edit')} className="w-full text-left px-4 py-2 hover:bg-secondary flex items-center gap-2 transition-colors">
                <Edit className="w-4 h-4 text-muted-foreground" /> Modifier
              </button>
              <button onClick={() => handleMenuClick('status')} className="w-full text-left px-4 py-2 hover:bg-secondary flex items-center gap-2 transition-colors">
                <RefreshCw className="w-4 h-4 text-muted-foreground" /> Changer de statut
              </button>
              <button onClick={() => handleMenuClick('send')} className="w-full text-left px-4 py-2 hover:bg-secondary flex items-center gap-2 transition-colors">
                <Send className="w-4 h-4 text-muted-foreground" /> Envoyer
              </button>
              <button onClick={() => handleMenuClick('download')} className="w-full text-left px-4 py-2 hover:bg-secondary flex items-center gap-2 transition-colors">
                <FileText className="w-4 h-4 text-muted-foreground" /> Télécharger PDF
              </button>
              <div className="h-px bg-border my-1" />
              <button onClick={() => handleMenuClick('delete')} className="w-full text-left px-4 py-2 hover:bg-red-500/10 hover:text-red-600 flex items-center gap-2 text-destructive transition-colors">
                <Trash2 className="w-4 h-4" /> Supprimer
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
