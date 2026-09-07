import { ArrowUpRight, ArrowDownRight, CreditCard, Users, FileText, Activity } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    const diffInMins = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffInMins === 0) return "À l'instant";
    return `Il y a ${diffInMins} minute${diffInMins > 1 ? 's' : ''}`;
  }
  if (diffInHours < 24) {
    return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: settingsData } = await supabase.from('settings').select('currency').eq('id', user.id).maybeSingle();
  const settings = settingsData as { currency: string } | null;
  const currency = settings?.currency === 'XOF' ? 'FCFA' : (settings?.currency || 'FCFA');

  const { data: invoicesData } = await supabase
    .from('invoices')
    .select('invoice_number, total, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  const invoices = invoicesData as { invoice_number: string, total: number, status: string, created_at: string }[] | null;

  const totalInvoices = invoices?.length || 0;
  const billedAmount = invoices?.reduce((acc, inv) => acc + Number(inv.total || 0), 0) || 0;
  const paidAmount = invoices?.filter(i => i.status === 'paid').reduce((acc, inv) => acc + Number(inv.total || 0), 0) || 0;
  const pendingAmount = invoices?.filter(i => ['pending', 'sent', 'overdue'].includes(i.status)).reduce((acc, inv) => acc + Number(inv.total || 0), 0) || 0;

  const recentInvoices = invoices?.slice(0, 4) || [];
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vue d&apos;ensemble</h1>
          <p className="text-muted-foreground mt-1">Bienvenue sur votre espace KEHENFacture.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Factures" 
          value={totalInvoices.toString()} 
          icon={<FileText className="w-4 h-4 text-primary" />} 
          trend="À jour" 
          trendUp={true} 
        />
        <StatCard 
          title="Montant Facturé" 
          value={`${new Intl.NumberFormat('fr-FR').format(billedAmount)} ${currency}`} 
          icon={<Activity className="w-4 h-4 text-primary" />} 
          trend="Global" 
          trendUp={true} 
        />
        <StatCard 
          title="Montant Payé" 
          value={`${new Intl.NumberFormat('fr-FR').format(paidAmount)} ${currency}`} 
          icon={<CreditCard className="w-4 h-4 text-primary" />} 
          trend="Global" 
          trendUp={true} 
        />
        <StatCard 
          title="En Attente" 
          value={`${new Intl.NumberFormat('fr-FR').format(pendingAmount)} ${currency}`} 
          icon={<Users className="w-4 h-4 text-primary" />} 
          trend={pendingAmount > 0 ? "À recouvrer" : "Aucun impayé"} 
          trendUp={pendingAmount === 0} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart placeholder */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Évolution des revenus</h3>
          <div className="h-[300px] flex items-center justify-center border border-dashed border-border rounded-lg bg-secondary/20">
            <p className="text-muted-foreground">Graphique (Chart.js ou Recharts) ici</p>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Activité Récente</h3>
          <div className="space-y-6">
            {recentInvoices.length > 0 ? recentInvoices.map((inv) => (
              <div key={inv.invoice_number} className="flex gap-4 group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-secondary/50 transition-all">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all" />
                <div>
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">Facture {inv.invoice_number} créée</p>
                  <p className="text-xs text-muted-foreground mt-1">{getRelativeTime(inv.created_at)}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">Aucune activité récente.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendUp }: { title: string, value: string, icon: React.ReactNode, trend: string, trendUp: boolean }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default group">
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{title}</p>
        <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{value}</h3>
      <div className="flex items-center text-xs">
        <span className={`flex items-center ${trendUp ? 'text-green-600' : 'text-red-600'} font-medium`}>
          {trendUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {trend}
        </span>
      </div>
    </div>
  );
}
