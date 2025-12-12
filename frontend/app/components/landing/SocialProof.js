'use client';

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function SocialProof() {
  const { t } = useTranslation();

  const testimonials = [
    {
      text: t('proof.t1_text', "My customers get instant replies now, even at 3 AM. Sales increased by 40% in the first month!"),
      author: t('proof.t1_author', "Sarah Al-Rashid"),
      role: t('proof.t1_role', "Online Fashion Store, Dubai"),
      initial: "S"
    },
    {
      text: t('proof.t2_text', "I was answering the same questions 50 times a day. Now AI handles it perfectly in Arabic."),
      author: t('proof.t2_author', "Ahmed Hassan"),
      role: t('proof.t2_role', "Electronics Shop, Riyadh"),
      initial: "A"
    },
    {
      text: t('proof.t3_text', "Setup took 5 minutes. My AI speaks Tunisian dialect perfectly. Customers love it!"),
      author: t('proof.t3_author', "Fatima Ben Ali"),
      role: t('proof.t3_role', "Home Bakery, Tunis"),
      initial: "F"
    }
  ];

  return (
    <section className="py-20 bg-[var(--bg-secondary)] border-y border-[var(--glass-border)]">
      <div className="container mx-auto px-4">
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl font-bold mb-4 uppercase tracking-widest text-[var(--text-secondary)]">
              {t('proof.label', "Trusted Worldwide • Loved by Small Businesses")}
            </h2>
          </motion.div>
         
         <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-panel p-8 relative"
              >
                <div className="flex gap-1 text-[var(--accent-primary)] mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-lg mb-6 italic">"{item.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent-primary)] text-[var(--bg-primary)] flex items-center justify-center font-bold text-xl">
                    {item.initial}
                  </div>
                  <div>
                    <h4 className="font-bold">{item.author}</h4>
                    <p className="text-sm text-[var(--text-secondary)]">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
         </div>

         <div className="mt-16 text-center opacity-60">
            <p className="text-sm font-semibold uppercase tracking-wider mb-6">Trusted Worldwide</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 font-bold text-xl text-[var(--text-secondary)]">
                <span>Dubai</span>
                <span>Riyadh</span>
                <span>Jeddah</span>
                <span>Tunis</span>
                <span>Paris</span>
             </div>
         </div>
      </div>
    </section>
  );
}
