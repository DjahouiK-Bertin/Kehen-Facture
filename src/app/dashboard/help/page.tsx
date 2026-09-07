export default function HelpPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Aide et Support</h1>
          <p className="text-muted-foreground mt-1">Comment pouvons-nous vous aider ?</p>
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl p-12 text-center shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Centre d&apos;aide en construction</h2>
        <p className="text-muted-foreground">Contactez-nous à l&apos;adresse support@kehenfacture.com pour toute assistance.</p>
      </div>
    </div>
  );
}
