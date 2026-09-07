"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  Calendar, 
  Trash2, 
  Plus, 
  Send, 
  Mail, 
  FileText,
  MapPin,
  Phone,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";
import { addInvoice, updateInvoice } from "@/lib/actions/invoices";
import toast from "react-hot-toast";

interface InvoiceItem {
  id: string;
  name: string;
  qty: number;
  tax: number;
  price: number;
}

type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
}

type Settings = {
  company_name: string;
  company_email: string | null;
  company_phone: string | null;
  company_address: string | null;
  currency: string;
  default_tax_rate: number;
}

export default function NewInvoiceClient({ clients, settings, initialInvoice }: { clients: Client[], settings: Settings | null, initialInvoice?: any }) {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [selectedClientId, setSelectedClientId] = useState<string>(initialInvoice?.client_id || "");
  const selectedClient = useMemo(() => clients.find(c => c.id === selectedClientId) || null, [clients, selectedClientId]);

  const [invoice, setInvoice] = useState({
    dateIssue: initialInvoice?.issue_date ? initialInvoice.issue_date.split('T')[0] : new Date().toISOString().split('T')[0],
    dueDate: initialInvoice?.due_date ? initialInvoice.due_date.split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    addDiscount: initialInvoice ? initialInvoice.discount > 0 : false,
    discountType: initialInvoice?.discount_type || "fixed", // 'fixed' or 'percentage'
    discountAmount: initialInvoice?.discount || 0,
    paymentMethod: initialInvoice?.payment_method || "Mobile Money",
    paymentDetails: initialInvoice?.payment_details || "",
    notes: initialInvoice?.notes || "Note: Tout retard de paiement entraînera des pénalités de retard.",
  });

  const [items, setItems] = useState<InvoiceItem[]>(
    initialInvoice?.invoice_items?.length > 0
      ? initialInvoice.invoice_items.map((i: any) => ({
          id: i.id,
          name: i.description,
          qty: i.quantity,
          tax: i.tax_rate,
          price: i.unit_price,
        }))
      : [{ id: "1", name: "", qty: 1, tax: settings?.default_tax_rate || 18, price: 0 }]
  );

  const handleInvoiceChange = (field: string, value: string | number | boolean) => {
    setInvoice(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!selectedClientId) {
      toast.error("Veuillez sélectionner un client.");
      return;
    }
    if (items.length === 0 || items.some(i => !i.name || i.qty <= 0 || i.price < 0)) {
      toast.error("Veuillez ajouter au moins un article valide.");
      return;
    }

    startTransition(async () => {
      const payload = {
        client_id: selectedClientId,
        issue_date: invoice.dateIssue,
        due_date: invoice.dueDate,
        subtotal: subtotal,
        tax_total: totalTax,
        discount_type: invoice.discountType,
        discount: invoice.addDiscount ? invoice.discountAmount : 0,
        total: grandTotal,
        notes: invoice.notes,
        payment_method: invoice.paymentMethod,
        payment_details: invoice.paymentDetails,
        items: items.map(i => ({
          description: i.name,
          quantity: i.qty,
          unit_price: i.price,
          tax_rate: i.tax,
        }))
      };

      if (initialInvoice) {
        const result = await updateInvoice(initialInvoice.id, payload);
        if (result.success) {
          toast.success("Facture mise à jour !");
          router.push('/dashboard/invoices?success=edit');
        } else {
          toast.error(result.error || "Erreur lors de la modification de la facture.");
        }
      } else {
        const result = await addInvoice(payload);
        if (result.success) {
          toast.success("Facture créée avec succès !");
          router.push(`/dashboard/invoices?success=create`);
        } else {
          toast.error(result.error || "Erreur de création de la facture");
        }
      }
    });
  };

  const handleItemChange = (id: string, field: string, value: string | number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      name: "",
      qty: 1,
      tax: settings?.default_tax_rate || 18,
      price: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Calculations
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  }, [items]);

  const totalTax = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.qty * item.price * (item.tax / 100)), 0);
  }, [items]);

  const grandTotal = useMemo(() => {
    const totalBeforeDiscount = subtotal + totalTax;
    if (!invoice.addDiscount) return totalBeforeDiscount;
    if (invoice.discountType === 'percentage') {
      return totalBeforeDiscount * (1 - invoice.discountAmount / 100);
    }
    return totalBeforeDiscount - invoice.discountAmount;
  }, [subtotal, totalTax, invoice.addDiscount, invoice.discountAmount, invoice.discountType]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val) + ` ${settings?.currency || 'FCFA'}`;
  };

  return (
    <div className="flex flex-col xl:flex-row h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left Pane: Form */}
      <div className={cn(
        "flex-1 overflow-y-auto border-r border-border bg-card p-4 md:p-8", 
        !showPreview && "max-w-3xl mx-auto border-r-0 w-full",
        showPreview && "hidden xl:block"
      )}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{initialInvoice ? "Modifier la Facture" : "Créer une facture"}</h1>
            <p className="text-muted-foreground text-sm mt-1">{initialInvoice ? "Modifiez les informations de votre facture." : "Créez une nouvelle facture et envoyez-la instantanément."}</p>
          </div>
          <div className="flex items-center gap-2 bg-secondary rounded-full px-3 py-1.5">
            <span className="text-sm font-medium">Aperçu</span>
            <button 
              onClick={() => setShowPreview(!showPreview)}
              className={cn("w-10 h-5 rounded-full relative transition-colors", showPreview ? "bg-primary" : "bg-muted-foreground")}
            >
              <div className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all", showPreview ? "left-5" : "left-1")} />
            </button>
          </div>
        </div>

        {/* Invoice Information */}
        <div className="mb-8 space-y-6">
          <div>
            <h2 className="text-sm font-bold mb-4">Informations du Client</h2>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Sélectionner un client <span className="text-red-500">*</span></label>
                <div className="flex items-center border border-border rounded-lg px-3 py-2 bg-card focus-within:border-primary transition-all">
                  <Building2 className="w-4 h-4 text-primary mr-2" />
                  <select 
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium appearance-none" 
                  >
                    <option value="" disabled>Choisir un client...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {selectedClient && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-secondary/30 rounded-lg border border-border mt-2">
                  {selectedClient.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-3.5 h-3.5" /> {selectedClient.email}
                    </div>
                  )}
                  {selectedClient.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-3.5 h-3.5" /> {selectedClient.phone}
                    </div>
                  )}
                  {selectedClient.address && (
                    <div className="col-span-1 md:col-span-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" /> {selectedClient.address}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Date d&apos;émission <span className="text-red-500">*</span></label>
              <div className="flex items-center border border-border rounded-lg px-3 py-2 bg-card focus-within:border-primary transition-all">
                <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
                <input 
                  type="date" 
                  value={invoice.dateIssue}
                  onChange={(e) => handleInvoiceChange('dateIssue', e.target.value)}
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm" 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Date d&apos;échéance <span className="text-red-500">*</span></label>
              <div className="flex items-center border border-border rounded-lg px-3 py-2 bg-card focus-within:border-primary transition-all">
                <Calendar className="w-4 h-4 text-muted-foreground mr-2" />
                <input 
                  type="date" 
                  value={invoice.dueDate}
                  onChange={(e) => handleInvoiceChange('dueDate', e.target.value)}
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items/Service */}
        <div>
          <h2 className="text-sm font-bold mb-4">Articles / Services</h2>
          
          <div className="space-y-1.5 mb-6">
            <label className="text-xs text-muted-foreground">Devise (paramétrée) <span className="text-red-500">*</span></label>
            <div className="flex items-center border border-border rounded-lg px-3 py-2 bg-card w-full">
              <span className="text-lg mr-2">🌍</span>
              <select disabled className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium appearance-none opacity-80">
                <option>{settings?.currency || 'FCFA'}</option>
              </select>
            </div>
          </div>

          {/* Items List */}
          {items.map((item, index) => (
            <div key={item.id} className="border border-border rounded-xl p-4 bg-secondary/20 mb-4 transition-all hover:border-primary/50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-muted-foreground">Article {index + 1}</span>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-muted-foreground hover:text-destructive hover:scale-110 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-muted-foreground">Description</label>
                  <div className="flex items-center border border-border rounded-lg px-3 py-2 bg-card focus-within:border-primary transition-all">
                    <span className="text-muted-foreground mr-2">✽</span>
                    <input 
                      type="text" 
                      value={item.name}
                      onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                      placeholder="Nom de l'article"
                      className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 md:grid-cols-12 gap-3">
                  <div className="col-span-1 md:col-span-3 space-y-1.5">
                    <label className="text-[10px] uppercase text-muted-foreground">Qté</label>
                    <div className="flex items-center border border-border rounded-lg px-3 py-2 bg-card focus-within:border-primary transition-all">
                      <input 
                        type="number" 
                        value={item.qty}
                        onChange={(e) => handleItemChange(item.id, 'qty', parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent border-none focus:outline-none text-sm font-medium text-center" 
                      />
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-4 space-y-1.5">
                    <label className="text-[10px] uppercase text-muted-foreground">TVA (%)</label>
                    <div className="flex items-center border border-border rounded-lg px-3 py-2 bg-card focus-within:border-primary transition-all">
                      <span className="text-muted-foreground mr-1">%</span>
                      <input 
                        type="number" 
                        value={item.tax}
                        onChange={(e) => handleItemChange(item.id, 'tax', parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent border-none focus:outline-none text-sm font-medium text-center" 
                      />
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-5 space-y-1.5">
                    <label className="text-[10px] uppercase text-muted-foreground">Prix Unitaire</label>
                    <div className="flex items-center border border-border rounded-lg px-3 py-2 bg-card focus-within:border-primary transition-all">
                      <input 
                        type="number" 
                        value={item.price}
                        onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent border-none focus:outline-none text-sm font-medium text-right" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button 
            onClick={addItem}
            className="w-full py-2.5 flex items-center justify-center gap-2 border border-dashed border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-primary transition-all mb-6 hover:border-primary/50 group"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" /> Ajouter un article
          </button>

          <div className="flex items-center justify-between pt-4 border-t border-border mb-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="addDiscount" 
                  checked={invoice.addDiscount}
                  onChange={(e) => handleInvoiceChange('addDiscount', e.target.checked)}
                  className="rounded text-primary border-border focus:ring-primary h-4 w-4 transition-all" 
                />
                <label htmlFor="addDiscount" className="text-sm font-medium">Ajouter une remise</label>
              </div>
              {invoice.addDiscount && (
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input type="radio" checked={invoice.discountType === 'fixed'} onChange={() => handleInvoiceChange('discountType', 'fixed')} />
                    Fixe
                  </label>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input type="radio" checked={invoice.discountType === 'percentage'} onChange={() => handleInvoiceChange('discountType', 'percentage')} />
                    Pourcentage
                  </label>
                </div>
              )}
            </div>
            {invoice.addDiscount && (
              <div className="flex items-center border border-border rounded-lg px-3 py-2 bg-card text-sm font-medium min-w-[140px] focus-within:border-primary transition-all">
                <input 
                  type="number" 
                  value={invoice.discountAmount}
                  onChange={(e) => handleInvoiceChange('discountAmount', parseFloat(e.target.value) || 0)}
                  className="w-full bg-transparent border-none focus:outline-none text-right"
                />
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-sm font-bold mb-4">Informations de Paiement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Mode de paiement <span className="text-red-500">*</span></label>
                <div className="flex items-center border border-border rounded-lg px-3 py-2 bg-card focus-within:border-primary transition-all">
                  <CreditCard className="w-4 h-4 text-muted-foreground mr-2" />
                  <select 
                    value={invoice.paymentMethod}
                    onChange={(e) => handleInvoiceChange('paymentMethod', e.target.value)}
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium appearance-none"
                  >
                    <option value="Mobile Money">Mobile Money (MTN/Moov)</option>
                    <option value="Carte Bancaire">Carte Bancaire</option>
                    <option value="Virement Bancaire">Virement Bancaire</option>
                    <option value="Chèque">Chèque</option>
                    <option value="Espèces">Espèces</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">Détails de paiement</label>
                <div className="flex items-center border border-border rounded-lg px-3 py-2 bg-card focus-within:border-primary transition-all">
                  <input 
                    type="text" 
                    value={invoice.paymentDetails}
                    onChange={(e) => handleInvoiceChange('paymentDetails', e.target.value)}
                    placeholder="Numéro, IBAN..."
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm" 
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-1.5 mb-8">
                <label className="text-xs text-muted-foreground">Notes (Conditions, retards, etc.)</label>
                <div className="flex items-start border border-border rounded-lg px-3 py-2 bg-card focus-within:border-primary transition-all">
                  <textarea 
                    value={invoice.notes}
                    onChange={(e) => handleInvoiceChange('notes', e.target.value)}
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm resize-none h-16" 
                  />
                </div>
            </div>

          </div>
        </div>
      </div>

      {/* Right Pane: Preview */}
      {showPreview && (
        <div className="flex-1 flex flex-col bg-gray-50 xl:border-l border-border relative">
          <div className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 shrink-0">
            <div className="flex items-center gap-6">
              <span className="font-bold text-lg">Aperçu</span>
              <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                <button className="flex items-center gap-1.5 hover:text-primary transition-colors"><Mail className="w-4 h-4" /> Email</button>
                <button className="flex items-center gap-1.5 hover:text-primary transition-colors"><FileText className="w-4 h-4" /> PDF</button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/dashboard/invoices')}
                disabled={isPending}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary hover:shadow-sm active:scale-95 transition-all duration-300 disabled:opacity-50"
              >
                Annuler
              </button>
              <button 
                onClick={handleSave}
                disabled={isPending}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary/90 hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300 group disabled:opacity-50"
              >
                {isPending ? "Enregistrement..." : initialInvoice ? "Mettre à jour" : "Créer la facture"}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            {/* Paper Invoice */}
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 min-h-[800px] relative transition-all">
              {/* Stack effect */}
              <div className="absolute -bottom-2 left-2 right-2 h-full bg-white/50 border border-gray-100 rounded-lg -z-10 mx-auto" />
              <div className="absolute -bottom-4 left-4 right-4 h-full bg-white/30 border border-gray-50 rounded-lg -z-20 mx-auto" />
              
              <div className="p-12">
                <div className="flex justify-between items-start mb-16">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">FACTURE</h1>
                    <p className="text-gray-500">Facture N° (Généré auto.)</p>
                  </div>
                  <div className="transform scale-[2] origin-top-right pointer-events-none">
                    <Logo collapsed />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12 text-sm">
                  <div>
                    <p className="text-gray-500 mb-2">Émis par :</p>
                    <p className="font-semibold text-gray-900">{settings?.company_name || "Soke Bahtera"}</p>
                    {settings?.company_email && <p className="text-gray-500">{settings.company_email}</p>}
                    {settings?.company_phone && <p className="text-gray-500">{settings.company_phone}</p>}
                    {settings?.company_address && <p className="text-gray-500">{settings.company_address}</p>}
                  </div>
                  <div>
                    <p className="text-gray-500 mb-2">Facturé à :</p>
                    <p className="font-semibold text-gray-900">{selectedClient?.name || "..."}</p>
                    {selectedClient?.email && <p className="text-gray-500">{selectedClient.email}</p>}
                    {selectedClient?.phone && <p className="text-gray-500">{selectedClient.phone}</p>}
                    {selectedClient?.address && <p className="text-gray-500">{selectedClient.address}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Date d&apos;émission :</p>
                    <p className="font-semibold text-gray-900">
                      {invoice.dateIssue ? new Date(invoice.dateIssue).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : "..."}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Date d&apos;échéance :</p>
                    <p className="font-semibold text-gray-900">
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : "..."}
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
                        {items.map((item) => (
                          <tr key={item.id} className="border-b border-gray-50 last:border-0">
                            <td className="py-4 font-medium">{item.name || "..."}</td>
                            <td className="py-4 text-center">{item.qty}</td>
                            <td className="py-4 text-right whitespace-nowrap">{formatCurrency(item.qty * item.price)}</td>
                            <td className="py-4 text-center whitespace-nowrap">{formatCurrency(item.qty * item.price * (item.tax / 100))}</td>
                            <td className="py-4 text-right font-semibold whitespace-nowrap">{formatCurrency(item.qty * item.price * (1 + item.tax / 100))}</td>
                          </tr>
                        ))}
                        {items.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-gray-400 italic">Aucun article ajouté.</td>
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
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span className="font-medium">TVA</span>
                      <span>{formatCurrency(totalTax)}</span>
                    </div>
                    {invoice.addDiscount && (
                      <div className="flex justify-between text-emerald-600">
                        <span className="font-medium">Remise</span>
                        <span>
                          -{invoice.discountType === 'percentage' 
                             ? `${invoice.discountAmount}%` 
                             : formatCurrency(invoice.discountAmount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-900 font-bold text-lg pt-4 border-t border-gray-100">
                      <span>Total (TTC)</span>
                      <span>{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-500 mb-16 whitespace-pre-wrap">
                  {invoice.notes}
                </div>

                <div className="flex justify-between items-end mt-auto">
                  <div className="text-sm max-w-[250px]">
                    <p className="font-bold text-gray-900 mb-1">Méthode de paiement</p>
                    <p className="text-gray-500 font-medium">{invoice.paymentMethod}</p>
                    {invoice.paymentDetails && (
                      <p className="text-gray-500 mt-1 break-words">{invoice.paymentDetails}</p>
                    )}
                  </div>
                  <div className="text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Signature_of_John_Hancock.png" alt="Signature" className="h-12 opacity-50 mx-auto mb-2" />
                    <p className="text-sm font-bold text-gray-900">{settings?.company_name || "La Direction"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-8" />
          </div>
        </div>
      )}
    </div>
  );
}
