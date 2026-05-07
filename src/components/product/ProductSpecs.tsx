export default function ProductSpecs({ specs }: { specs: Record<string, string> }) {
  const entries = Object.entries(specs).filter(([, v]) => v && v !== "-");

  const labels: Record<string, string> = {
    processor: "Prosessor",
    ram: "RAM",
    storage: "Yaddaş",
    screen: "Ekran",
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6">
      <h3 className="font-sora font-semibold text-primary text-base mb-4">Texniki xüsusiyyətlər</h3>
      <div className="space-y-3">
        {entries.map(([key, value]) => (
          <div key={key} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
            <span className="text-sm text-slate-500 font-inter">{labels[key] || key}</span>
            <span className="text-sm font-medium text-primary font-inter">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
