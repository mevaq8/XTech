import { motion } from "framer-motion";
import { MousePointerClick, ShoppingCart, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    title: "Məhsulu seç",
    desc: "Geniş çeşidimizdən sizə uyğun məhsulu tapın və ətraflı məlumatla tanış olun.",
  },
  {
    icon: ShoppingCart,
    title: "Səbətə at",
    desc: "Seçdiyiniz məhsulu səbətə əlavə edin və miqdarı tənzimləyin.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp-la sifarişi tamamla",
    desc: "Səbətinizi WhatsApp üzərindən göndərin və sifarişinizi tez bir zamanda təsdiqləyin.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-bg">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-sora font-bold text-2xl md:text-3xl text-primary mb-2">Necə işləyir?</h2>
          <p className="font-inter text-slate-500">Cəmi 3 addımla sifariş edin</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-5">
                <step.icon size={24} className="text-white" strokeWidth={2} />
              </div>
              <div className="absolute top-7 left-1/2 w-full hidden md:block" style={{ transform: "translateX(50%)" }}>
                {i < steps.length - 1 && (
                  <div className="w-1/2 h-px bg-slate-200 mx-auto" />
                )}
              </div>
              <h3 className="font-sora font-semibold text-primary text-base mb-2">{step.title}</h3>
              <p className="font-inter text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
