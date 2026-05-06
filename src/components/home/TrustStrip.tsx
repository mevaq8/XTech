import { motion } from "framer-motion";
import { Clock, ShieldCheck, BadgeCheck, Lock } from "lucide-react";

const items = [
  { icon: Clock, text: "24 saat çatdırılma" },
  { icon: ShieldCheck, text: "Rəsmi zəmanət" },
  { icon: BadgeCheck, text: "Yoxlanılmış keyfiyyət" },
  { icon: Lock, text: "Təhlükəsiz sifariş" },
];

export default function TrustStrip() {
  return (
    <section className="py-8 bg-bg hidden sm:block">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-full shadow-sm"
            >
              <item.icon size={16} className="text-accent" strokeWidth={2} />
              <span className="text-sm font-medium text-primary font-inter">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
