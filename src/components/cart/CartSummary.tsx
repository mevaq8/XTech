import { useCart } from "@/store/cart-store";
import { generateWhatsAppUrl } from "@/lib/whatsapp";

export default function CartSummary() {
  const { items, totalPrice } = useCart();

  const handleCheckout = () => {
    const url = generateWhatsAppUrl(items, totalPrice);
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 sticky top-24">
      <h3 className="font-sora font-semibold text-primary text-base mb-5">Sifariş xülasəsi</h3>
      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 font-inter">Məhsullar</span>
          <span className="font-medium text-primary font-inter">{totalPrice.toLocaleString("az-AZ")} AZN</span>
        </div>
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
          <span className="font-sora font-semibold text-primary">Yekun məbləğ</span>
          <span className="font-sora font-bold text-xl text-primary">
            {totalPrice.toLocaleString("az-AZ")} AZN
          </span>
        </div>
      </div>
      <button
        onClick={handleCheckout}
        className="w-full py-4 bg-accent text-white font-inter font-semibold text-base rounded-xl hover:bg-[#16A34A] hover:shadow-[0_0_30px_rgba(34,197,94,0.35)] transition-all duration-200 active:scale-[0.98] cursor-pointer"
      >
        Sifarişi tamamla
      </button>
      <p className="text-xs text-slate-400 text-center mt-3 font-inter">
        WhatsApp üzərindən sifarişinizi təsdiqləyin
      </p>
    </div>
  );
}
