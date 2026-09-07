"use client";

import { useState } from "react";
import { Download, BarChart, TrendingUp, DollarSign, Calendar, ChevronDown, CheckCircle2 } from "lucide-react";

interface ReportsClientProps {
  months: string[];
  revenueData: number[];
  expenseData: number[];
  totalRevenue: number;
  totalExpenses: number;
  currency: string;
}

export default function ReportsClient({ months, revenueData, expenseData, totalRevenue, totalExpenses, currency }: ReportsClientProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("6 Derniers Mois");
  const [showToast, setShowToast] = useState(false);

  const maxVal = Math.max(...revenueData, ...expenseData, 1);
  const netProfit = totalRevenue - totalExpenses;

  const handleExport = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const formatCurrency = (val: number) => {
    return `${new Intl.NumberFormat('fr-FR').format(val)} ${currency}`;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rapports Financiers</h1>
          <p className="text-muted-foreground mt-1">Analysez vos performances sur les 6 derniers mois.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-secondary/80 transition-colors"
            >
              <Calendar className="w-4 h-4" /> {selectedPeriod} <ChevronDown className="w-4 h-4" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg z-20 p-2 animate-in fade-in slide-in-from-top-2">
                {["6 Derniers Mois"].map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setSelectedPeriod(period);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-secondary rounded-lg transition-colors"
                  >
                    {period}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button 
            onClick={handleExport}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Download className="w-4 h-4" /> Exporter PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/10 text-green-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-muted-foreground">Revenu Total</h3>
          </div>
          <p className="text-3xl font-bold mt-2">{formatCurrency(totalRevenue)}</p>
          <p className="text-sm text-green-600 font-medium mt-2 flex items-center gap-1">
            À jour
          </p>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/10 text-red-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-muted-foreground">Dépenses Totales</h3>
          </div>
          <p className="text-3xl font-bold mt-2">{formatCurrency(totalExpenses)}</p>
          <p className="text-sm text-red-600 font-medium mt-2 flex items-center gap-1">
            À jour
          </p>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <BarChart className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-muted-foreground">Bénéfice Net</h3>
          </div>
          <p className="text-3xl font-bold mt-2 text-primary">{formatCurrency(netProfit)}</p>
          <p className="text-sm text-primary font-medium mt-2 flex items-center gap-1">
            À jour
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-8">Revenus vs Dépenses ({selectedPeriod})</h2>
        
        {/* CSS Bar Chart */}
        <div className="h-64 flex items-end justify-between gap-2 md:gap-4 mt-8 pt-4 border-b border-border">
          {months.map((month, idx) => {
            const revHeight = (revenueData[idx] / maxVal) * 100;
            const expHeight = (expenseData[idx] / maxVal) * 100;
            
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Tooltip on hover */}
                <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black text-xs p-2 rounded shadow-lg pointer-events-none whitespace-nowrap z-10 flex flex-col items-center">
                  <span className="font-semibold">{month}</span>
                  <span className="text-green-400 dark:text-green-600">Rev: {formatCurrency(revenueData[idx])}</span>
                  <span className="text-red-400 dark:text-red-600">Dép: {formatCurrency(expenseData[idx])}</span>
                </div>

                <div className="flex items-end justify-center gap-1 w-full h-full relative">
                  <div 
                    className="w-1/3 max-w-[40px] bg-primary/80 hover:bg-primary rounded-t-sm transition-all duration-500 ease-out"
                    style={{ height: `${revHeight}%` }}
                  />
                  <div 
                    className="w-1/3 max-w-[40px] bg-red-400/80 hover:bg-red-500 rounded-t-sm transition-all duration-500 ease-out"
                    style={{ height: `${expHeight}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground mt-2">{month}</span>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary/80"></div>
            <span className="text-sm text-muted-foreground">Revenus</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
            <span className="text-sm text-muted-foreground">Dépenses</span>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-card border border-border shadow-xl rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in z-50">
          <div className="w-8 h-8 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">Exportation réussie</p>
            <p className="text-xs text-muted-foreground">Votre rapport PDF a été généré.</p>
          </div>
        </div>
      )}
    </div>
  );
}
