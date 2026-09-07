export default function WalletPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-3">Mon Portefeuille</h1>
      <p className="text-muted-foreground max-w-md text-lg">
        Cette fonctionnalité sera disponible très prochainement dans une future mise à jour.
      </p>
    </div>
  );
}
