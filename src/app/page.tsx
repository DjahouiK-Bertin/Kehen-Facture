"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Receipt, ArrowRight, PlayCircle, CheckCircle2, 
  MessageCircle, FileText, Zap, FileSpreadsheet, 
  Calculator, History, Check, Bell, Star, Send, Building, 
  X, Linkedin, Twitter, Facebook, Shield 
} from "lucide-react";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white text-slate-900 font-sans antialiased selection:bg-brand-primary selection:text-white">
      {/* BEGIN: MainHeader */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-[#0a071b]/90 backdrop-blur-md border-b border-white/10 shadow-lg py-2" 
            : "bg-[#0a071b]/50 backdrop-blur-sm border-b border-transparent py-4"
        }`} 
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary via-brand-glow to-brand-pink flex items-center justify-center shadow-lg shadow-brand-primary/30 group-hover:scale-105 transition-transform duration-300">
              <Receipt className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight text-white">
              KEHEN<span className="text-brand-glow">Facture</span>
            </span>
          </Link>
          
          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#fonctionnalites" className="hover:text-white transition-colors relative group">
              Fonctionnalités
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-glow transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#comment-ca-marche" className="hover:text-white transition-colors relative group">
              Comment ça marche
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-glow transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#tarifs" className="hover:text-white transition-colors relative group">
              Tarifs
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-glow transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#temoignages" className="hover:text-white transition-colors relative group">
              Témoignages
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-glow transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:inline-block text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 transition-colors">
              Connexion
            </Link>
            <Link href="/signup" className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-brand-primary to-brand-accent hover:from-purple-600 hover:to-brand-primary shadow-lg shadow-brand-primary/40 hover:shadow-brand-glow/50 transform hover:-translate-y-0.5 transition-all duration-200">
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* BEGIN: HeroSection */}
        <section className="relative bg-brand-dark min-h-[92vh] pt-32 pb-20 overflow-hidden hero-glow">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/3 -right-48 w-96 h-96 bg-brand-pink/15 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Copy & Actions */}
              <div className="lg:col-span-7 space-y-8 text-center lg:text-left animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 badge-shimmer text-xs sm:text-sm font-medium text-brand-glow shadow-inner">
                  <span>✦ La facturation nouvelle génération en Afrique de l'Ouest &amp; Centrale</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] font-display">
                  Fini le casse-tête des factures sur <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">Word et Excel.</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-light leading-relaxed">
                  Créez des factures professionnelles conformes aux normes locales en <span className="text-white font-medium">2 clics</span>, calculez la TVA à <span className="text-white font-medium">18%</span> instantanément et soyez payé <span className="text-brand-glow font-medium">3x plus vite</span>.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link href="/signup" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-brand-primary to-brand-pink hover:opacity-95 shadow-xl shadow-brand-primary/40 hover:shadow-brand-primary/60 transform hover:-translate-y-0.5 transition-all duration-200">
                    Commencer gratuitement
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                  <a href="#demo" className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-full text-base font-semibold text-slate-200 hover:text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-200">
                    <PlayCircle className="text-brand-glow mr-2.5 w-5 h-5" />
                    Voir la démo (1 min)
                  </a>
                </div>
                
                {/* Trust Bar */}
                <div className="pt-8 border-t border-white/10">
                  <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-4">
                    Encaissez sans effort avec les moyens de paiement locaux
                  </p>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 sm:gap-7 opacity-85">
                    <span className="flex items-center gap-1.5 text-slate-300 text-sm font-semibold tracking-wide bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Wave
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300 text-sm font-semibold tracking-wide bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Orange Money
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300 text-sm font-semibold tracking-wide bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span> MTN MoMo
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300 text-sm font-semibold tracking-wide bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Moov Money
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300 text-sm font-semibold tracking-wide bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Ecobank &amp; Visa
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Mockup */}
              <div className="lg:col-span-5 relative animate-in fade-in zoom-in duration-1000 delay-200">
                <div className="relative mx-auto max-w-md w-full group">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-primary via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-100 transition duration-1000"></div>
                  <div className="relative rounded-2xl bg-[#140e2e]/90 border border-purple-500/30 p-6 shadow-2xl text-slate-200">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-brand-primary/30 text-brand-glow border border-brand-primary/40 mb-1">
                          Facture #KF-2024-089
                        </span>
                        <h3 className="text-sm font-medium text-slate-300">Client : <strong className="text-white">Koffi &amp; Partners SARL</strong></h3>
                        <p className="text-[11px] text-slate-400">Abidjan, Côte d'Ivoire • N° CC 204921</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Payé via Wave
                        </span>
                      </div>
                    </div>
                    
                    <div className="py-4 space-y-3">
                      <div className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-white/5">
                        <div>
                          <p className="font-medium text-white">Refonte Application Web B2B</p>
                          <p className="text-[10px] text-slate-400">Phase 1 : Design &amp; Intégration</p>
                        </div>
                        <span className="font-semibold text-slate-100">750 000 FCFA</span>
                      </div>
                      <div className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-white/5">
                        <div>
                          <p className="font-medium text-white">Maintenance Cloud &amp; Infogérance</p>
                          <p className="text-[10px] text-slate-400">Contrat mensuel garanti SLA</p>
                        </div>
                        <span className="font-semibold text-slate-100">150 000 FCFA</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-white/10 pt-3 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Sous-total HT :</span>
                        <span className="text-slate-200">900 000 FCFA</span>
                      </div>
                      <div className="flex justify-between text-brand-glow font-medium">
                        <span>TVA légale (18%) :</span>
                        <span>+ 162 000 FCFA</span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                        <span>Total TTC :</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                          1 062 000 FCFA
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-3">
                      <button className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors">
                        <MessageCircle className="w-4 h-4" /> Envoyer reçu client
                      </button>
                      <button className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors">
                        <FileText className="w-4 h-4" /> PDF
                      </button>
                    </div>
                    
                    <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-semibold py-1.5 px-3.5 rounded-full shadow-lg border border-purple-300/30 flex items-center gap-1.5">
                      <Zap className="text-amber-300 w-3 h-3 fill-current" /> Téléchargé en 0.8s
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BEGIN: KeyMetricsSection */}
        <section className="py-16 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 items-center justify-center">
              <div className="text-center relative">
                <p className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
                  +15 000
                </p>
                <p className="text-sm text-slate-600 mt-2 font-medium">Factures générées par mois</p>
              </div>
              <div className="text-center relative">
                <p className="text-4xl lg:text-5xl font-extrabold text-brand-primary tracking-tight font-display">
                  4,8 Mds
                </p>
                <p className="text-sm text-slate-600 mt-2 font-medium">FCFA Encaissés en sérénité</p>
              </div>
              <div className="text-center relative">
                <p className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
                  18% TVA
                </p>
                <p className="text-sm text-slate-600 mt-2 font-medium">Calculée sans erreur</p>
              </div>
              <div className="text-center">
                <p className="text-4xl lg:text-5xl font-extrabold text-emerald-600 tracking-tight font-display">
                  98%
                </p>
                <p className="text-sm text-slate-600 mt-2 font-medium">Taux de satisfaction clients</p>
              </div>
            </div>
          </div>
        </section>

        {/* BEGIN: ProblemSection */}
        <section className="py-24 bg-slate-50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-purple-100 px-3 py-1 rounded-full">
                Le constat en entreprise
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-display">
                Pourquoi perdre des heures sur des outils non adaptés ?
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600">
                Word et Excel ont été conçus pour le traitement de texte, pas pour piloter votre trésorerie dans l’écosystème africain.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform">
                  <FileSpreadsheet />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Factures artisanales et non professionnelles
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Les devis et factures bricolés sur Word décrédibilisent immédiatement votre entreprise face aux directeurs financiers et aux grands comptes institutionnels.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform">
                  <Calculator />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Calculs manuels de TVA 18% et erreurs coûteuses
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Une formule Excel brisée, une retenue à la source mal appliquée, et vous risquez des redressements fiscaux et des maux de tête interminables en fin de mois.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform">
                  <History />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Suivi impossible et impayés oubliés
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Sans tableau de bord centralisé, vous ne savez plus qui vous doit quoi. Relancer vos clients en retard devient gênant et chronophage.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BEGIN: FeaturesSection */}
        <section id="fonctionnalites" className="py-24 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-200">
                Fonctionnalités Clés
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-display">
                Tout est pensé pour accélérer vos encaissements
              </h2>
              <p className="mt-4 text-slate-600 text-base sm:text-lg">
                Une interface intuitive qui répond scrupuleusement aux spécificités fiscales et commerciales des marchés africains.
              </p>
            </div>
            
            <div className="space-y-16 lg:space-y-24">
              {/* Feature 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-6 order-2 lg:order-1">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 text-brand-primary flex items-center justify-center text-lg font-bold mb-4">
                    01
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
                    Factures professionnelles créées en 2 clics
                  </h3>
                  <p className="mt-4 text-slate-600 leading-relaxed">
                    Appliquez l'identité de votre entreprise : logo en haute définition, couleurs de marque, mentions légales (RCCM, NIF/NCC), coordonnées bancaires et Mobile Money intégrés en pied de page.
                  </p>
                  <ul className="mt-6 space-y-2 text-sm text-slate-700 font-medium">
                    <li className="flex items-center gap-2.5"><Check className="text-brand-primary w-4 h-4" /> Modèles bilingues Français / Anglais</li>
                    <li className="flex items-center gap-2.5"><Check className="text-brand-primary w-4 h-4" /> Export PDF ultra-léger prêt pour WhatsApp</li>
                    <li className="flex items-center gap-2.5"><Check className="text-brand-primary w-4 h-4" /> Signature numérique et cachet d'entreprise</li>
                  </ul>
                </div>
                <div className="lg:col-span-6 order-1 lg:order-2">
                  <div className="bg-gradient-to-tr from-purple-50 to-indigo-50/50 p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-sm">
                    <div className="bg-white rounded-xl shadow-md p-5 border border-slate-100">
                      <div className="flex items-center justify-between border-b pb-3 mb-4">
                        <span className="text-xs font-bold uppercase text-slate-400">Éditeur de facture</span>
                        <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded font-semibold">Sauvegarde automatique</span>
                      </div>
                      <div className="h-4 bg-slate-100 rounded w-1/3 mb-3"></div>
                      <div className="h-3 bg-slate-100 rounded w-2/3 mb-6"></div>
                      <div className="space-y-2">
                        <div className="h-10 bg-purple-50/50 rounded-lg border border-dashed border-purple-200 flex items-center px-4 justify-between text-xs text-purple-700">
                          <span>Article 1 : Prestation de conseil stratégique</span>
                          <strong className="text-slate-800">500 000 FCFA</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-6">
                  <div className="bg-gradient-to-tr from-purple-900 to-[#190f38] p-6 sm:p-8 rounded-3xl shadow-xl text-white card-glow-hover">
                    <div className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/10">
                      <p className="text-xs font-semibold text-brand-glow uppercase">Moteur fiscal intelligent</p>
                      <div className="mt-4 flex justify-between items-center text-sm border-b border-white/10 pb-2">
                        <span className="text-slate-300">Base imposable HT</span>
                        <span className="font-bold">1 500 000 FCFA</span>
                      </div>
                      <div className="mt-3 flex justify-between items-center text-sm border-b border-white/10 pb-2">
                        <span className="text-brand-glow">TVA légale (18.00%)</span>
                        <span className="font-bold text-brand-glow">+ 270 000 FCFA</span>
                      </div>
                      <div className="mt-3 flex justify-between items-center text-base pt-1 font-extrabold text-emerald-400">
                        <span>Total Net à régler</span>
                        <span>1 770 000 FCFA</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 text-brand-primary flex items-center justify-center text-lg font-bold mb-4">
                    02
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
                    Calcul automatique de la TVA à 18% &amp; devises
                  </h3>
                  <p className="mt-4 text-slate-600 leading-relaxed">
                    Plus jamais d'erreur arithmétique ! Notre moteur gère automatiquement la TVA standard à 18% en vigueur dans les zones UEMOA et CEMAC, tout en vous permettant d'émettre en FCFA (XOF/XAF), Dollars ou Euros pour vos clients à l'international.
                  </p>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-6 order-2 lg:order-1">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 text-brand-primary flex items-center justify-center text-lg font-bold mb-4">
                    03
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
                    Suivi des paiements &amp; relances en 1 clic sur WhatsApp
                  </h3>
                  <p className="mt-4 text-slate-600 leading-relaxed">
                    En Afrique, le business se fait sur WhatsApp. Envoyez vos factures et rappels de paiement directement sur le canal favori de vos clients en un clin d'œil, avec un lien de paiement Wave / MoMo direct.
                  </p>
                  <div className="mt-6 flex gap-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
                      <MessageCircle className="w-5 h-5" /> Relances automatisées
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg">
                      <Bell className="w-5 h-5" /> Notification temps réel
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-6 order-1 lg:order-2">
                  <div className="bg-gradient-to-tr from-slate-100 to-purple-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
                    <div className="space-y-3">
                      <div className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">OK</div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">Société Ivoirienne de Négoce</p>
                            <p className="text-[11px] text-slate-500">Payé via Orange Money</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600">820 000 FCFA</span>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-rose-100 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs">J-3</div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">Cabinet Juridique Dakar</p>
                            <p className="text-[11px] text-rose-500">En retard de paiement</p>
                          </div>
                        </div>
                        <button className="text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1 rounded-md transition-colors flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" /> Relancer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BEGIN: HowItWorksSection */}
        <section id="comment-ca-marche" className="py-24 bg-slate-50 border-y border-slate-200/60 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-purple-100 px-3 py-1 rounded-full">
                Simplicité Radicale
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 font-display">
                Comment ça marche ?
              </h2>
              <p className="mt-3 text-slate-600">
                Passez de l'inscription à votre premier encaissement en moins de 3 minutes.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="relative bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-md shadow-purple-600/30">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Inscrivez-vous en 30 secondes</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Renseignez votre nom d'entreprise et vos coordonnées. Aucune carte bancaire n'est exigée.
                </p>
              </div>
              <div className="relative bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-md shadow-purple-600/30">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Générez votre facture</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Ajoutez vos articles et laissez la TVA à 18% se calculer instantanément avec conversion de devise.
                </p>
              </div>
              <div className="relative bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-md shadow-purple-600/30">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Envoyez &amp; Encaisser</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Transmettez le PDF par WhatsApp ou email et recevez vos fonds directement sur votre compte.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BEGIN: TestimonialsSection */}
        <section id="temoignages" className="py-24 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-200">
                Témoignages Clients
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 font-display">
                Adopté par les entrepreneurs qui font bouger l'Afrique
              </h2>
              <p className="mt-3 text-slate-600">
                Découvrez pourquoi ils ont abandonné leurs anciens tableurs pour KEHENFacture.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 flex flex-col justify-between card-glow-hover">
                <div>
                  <div className="flex text-amber-400 gap-1 text-sm mb-4">
                    <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed italic">
                    « Nous avons dit adieu à nos tableaux Excel. La gestion de la TVA à 18% et les relances WhatsApp ont réduit nos délais de paiement de 18 jours ! »
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                    AD
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Amadou Diallo</h4>
                    <p className="text-xs text-slate-500">Dakar, Directeur Agence Digitale</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 flex flex-col justify-between card-glow-hover">
                <div>
                  <div className="flex text-amber-400 gap-1 text-sm mb-4">
                    <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed italic">
                    « Mes clients prennent mes devis et factures beaucoup plus au sérieux. Les coordonnées Wave et Orange Money intégrées directement changent absolument tout. »
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-sm">
                    CK
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Chantal Konan</h4>
                    <p className="text-xs text-slate-500">Abidjan, Consultante RH &amp; Formatrice</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 flex flex-col justify-between card-glow-hover">
                <div>
                  <div className="flex text-amber-400 gap-1 text-sm mb-4">
                    <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed italic">
                    « Simple, rapide et calibré pour notre réalité économique. Je génère mes factures d'acompte depuis mon smartphone directement en clientèle. »
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                    RM
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Rodrigue Mbarga</h4>
                    <p className="text-xs text-slate-500">Douala, Fondateur Studio Créatif</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BEGIN: PricingSection */}
        <section id="tarifs" className="py-24 bg-brand-light relative scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3.5 py-1.5 rounded-full">
                Tarifs Transparents
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900 font-display">
                Des tarifs clairs qui évoluent avec vous
              </h2>
              <p className="mt-3 text-slate-600">
                Testez gratuitement pendant 14 jours. Sans carte bancaire ni engagement.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
              {/* Plan Gratuit */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all duration-200">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 text-lg mb-4">
                    <Send className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Plan Gratuit</h3>
                  <p className="text-xs text-slate-500 mt-1">Idéal pour démarrer son activité freelance</p>
                  <div className="my-6">
                    <span className="text-4xl font-extrabold text-slate-900">0</span>
                    <span className="text-sm font-medium text-slate-500">FCFA / mois</span>
                  </div>
                  <ul className="space-y-3.5 text-sm text-slate-600">
                    <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500" /> 5 factures par mois</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500" /> 1 utilisateur unique</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500" /> Modèles de factures standards</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500" /> Export PDF avec filigrane discret</li>
                    <li className="flex items-center gap-2.5 text-slate-400"><X className="w-4 h-4" /> Pas de relance WhatsApp automatique</li>
                  </ul>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <Link href="/signup" className="block w-full text-center py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors">
                    Démarrer sans frais
                  </Link>
                </div>
              </div>
              
              {/* Plan Pro */}
              <div className="bg-gradient-to-b from-brand-primary via-purple-700 to-brand-primary rounded-3xl p-8 text-white shadow-2xl shadow-purple-600/30 flex flex-col justify-between relative transform lg:-translate-y-2 border border-purple-400/40">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-pink-500 text-slate-900 text-xs font-extrabold uppercase px-4 py-1 rounded-full shadow-md tracking-wider">
                  ✦ Plus Populaire ✦
                </div>
                <div>
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white text-lg mb-4">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Plan Pro</h3>
                  <p className="text-xs text-purple-200 mt-1">Pour indépendants et PME en croissance</p>
                  <div className="my-6">
                    <span className="text-4xl font-extrabold text-white">5 000</span>
                    <span className="text-sm font-medium text-purple-200">FCFA / mois</span>
                  </div>
                  <ul className="space-y-3.5 text-sm text-purple-100">
                    <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Factures &amp; devis <strong>illimités</strong></li>
                    <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Relances WhatsApp automatiques</li>
                    <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Calcul TVA 18% &amp; taxes locales</li>
                    <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Personnalisation marque (logo + charte)</li>
                    <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-amber-300" /> Support prioritaire 7j/7</li>
                  </ul>
                </div>
                <div className="mt-8 pt-6 border-t border-white/20">
                  <Link href="/signup" className="block w-full text-center py-3.5 rounded-xl bg-white hover:bg-slate-100 text-brand-primary font-bold text-sm shadow-md transition-colors">
                    Essayer 14 jours gratuit
                  </Link>
                </div>
              </div>
              
              {/* Plan Business */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all duration-200">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 text-lg mb-4">
                    <Building className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Plan Business</h3>
                  <p className="text-xs text-slate-500 mt-1">Pour cabinets, agences et équipes</p>
                  <div className="my-6">
                    <span className="text-4xl font-extrabold text-slate-900">15 000</span>
                    <span className="text-sm font-medium text-slate-500">FCFA / mois</span>
                  </div>
                  <ul className="space-y-3.5 text-sm text-slate-600">
                    <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500" /> Multi-utilisateurs (jusqu'à 10)</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500" /> Multi-entreprises &amp; filiales</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500" /> Multi-devises (FCFA, EUR, USD)</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500" /> Export comptable vers Sage/Syscohada</li>
                    <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500" /> Gestionnaire de compte dédié</li>
                  </ul>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <a href="#contact" className="block w-full text-center py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors">
                    Contacter un expert
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BEGIN: TrustLogosSection */}
        <section className="py-16 bg-white border-t border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 mb-8">
              +2 500 PME et indépendants nous font confiance à Abidjan, Dakar, Douala, Lomé, Cotonou et Ouagadougou
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
              <span className="font-display font-bold text-xl text-slate-700 tracking-tight">KOFFI &amp; CO</span>
              <span className="font-display font-bold text-xl text-slate-700 tracking-tight">SAHEL TECH</span>
              <span className="font-display font-bold text-xl text-slate-700 tracking-tight">IVOIRE LOGISTICS</span>
              <span className="font-display font-bold text-xl text-slate-700 tracking-tight">SÉNÉGAL MEDIA</span>
              <span className="font-display font-bold text-xl text-slate-700 tracking-tight">GULF AUDIT</span>
            </div>
          </div>
        </section>

        {/* BEGIN: FinalCTA */}
        <section className="py-20 bg-brand-dark relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-brand-dark to-brand-primary/20 pointer-events-none"></div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="rounded-3xl bg-gradient-to-r from-purple-900/60 to-indigo-950/80 border border-purple-500/30 p-10 sm:p-14 text-center shadow-2xl backdrop-blur-sm">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight font-display">
                Rejoins les entrepreneurs qui facturent comme des pros
              </h2>
              <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
                Rejoins des milliers d'entrepreneurs africains et commence à émettre des factures irréprochables dès aujourd'hui.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup" className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-brand-primary to-brand-pink hover:opacity-95 shadow-lg shadow-brand-primary/50 transition-all">
                  Commencer gratuitement
                </Link>
              </div>
              <p className="text-xs text-slate-400 mt-4 flex items-center justify-center gap-2">
                <Shield className="text-brand-glow w-4 h-4" />
                Aucun moyen de paiement requis • Prêt en 2 minutes
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* BEGIN: MainFooter */}
      <footer className="bg-[#070414] text-slate-400 text-sm border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white text-sm">
                  <Receipt className="w-4 h-4" />
                </div>
                <span className="text-xl font-display font-bold text-white tracking-tight">
                  KEHEN<span className="text-brand-glow">Facture</span>
                </span>
              </Link>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                La solution de gestion commerciale et facturation conçue spécialement pour répondre aux enjeux réels des PME et indépendants en Afrique francophone.
              </p>
              <div className="pt-2 text-xs font-semibold text-slate-300 flex items-center gap-2">
                <span>Fait avec fierté et passion en Afrique 🌍</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Produit</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#fonctionnalites" className="hover:text-white transition-colors">Factures &amp; Devis</a></li>
                <li><a href="#fonctionnalites" className="hover:text-white transition-colors">Calcul TVA 18%</a></li>
                <li><a href="#fonctionnalites" className="hover:text-white transition-colors">Relances WhatsApp</a></li>
                <li><a href="#tarifs" className="hover:text-white transition-colors">Tarifs &amp; Offres</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Entreprise</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#about" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#careers" className="hover:text-white transition-colors">Carrières</a></li>
                <li><a href="#blog" className="hover:text-white transition-colors">Blog &amp; Guides</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contactez-nous</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Légal</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#terms" className="hover:text-white transition-colors">Conditions Générales</a></li>
                <li><a href="#privacy" className="hover:text-white transition-colors">Confidentialité</a></li>
                <li><a href="#legal" className="hover:text-white transition-colors">Mentions Légales</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Sécurité des Données</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© 2026 KEHENFacture SAS. Tous droits réservés.</p>
            <div className="flex items-center gap-5 text-base">
              <a href="#" aria-label="LinkedIn" className="hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>
              <a href="#" aria-label="Twitter" className="hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" aria-label="Facebook" className="hover:text-white transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href="#" aria-label="WhatsApp" className="hover:text-white transition-colors"><MessageCircle className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
