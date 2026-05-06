interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({ quantity, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
      <button
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Azalt"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <span className="w-10 h-9 flex items-center justify-center text-sm font-medium text-primary font-inter select-none">
        {quantity}
      </span>
      <button
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        aria-label="Artır"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
}
