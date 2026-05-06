import { motion } from "framer-motion";
import { Star, Users, ThumbsUp } from "lucide-react";

export default function CustomerConfidence() {
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
          <h2 className="font-sora font-bold text-2xl md:text-3xl text-primary mb-2">Müştərilərimizin etimadı</h2>
          <p className="font-inter text-slate-500">Minlərlə müştərinin seçimi</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Users, value: "5000+", label: "Məmnun müştəri" },
            { icon: Star, value: "4.9", label: "Ortalama reytinq" },
            { icon: ThumbsUp, value: "100%", label: "Orijinal məhsul zəmanəti" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-slate-100 rounded-2xl p-8 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
                <stat.icon size={24} className="text-primary" strokeWidth={2} />
              </div>
              <p className="font-sora font-bold text-3xl text-primary mb-1">{stat.value}</p>
              <p className="font-inter text-sm text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
