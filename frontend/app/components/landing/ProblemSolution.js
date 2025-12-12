'use client';

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Clock, MessageSquare, TrendingUp, MessageCircle, Globe, Smartphone } from 'lucide-react';

export default function ProblemSolution() {
  const { t } = useTranslation();

  const problems = [
    { icon: Clock, title: t('problem.p1_title', "Customers wait too long"), desc: t('problem.p1_desc', "They message you, wait hours, and buy from competitors") },
    { icon: MessageSquare, title: t('problem.p2_title', "You can't reply while busy"), desc: t('problem.p2_desc', "During work, sleep, or meetings — messages pile up") },
    { icon: MessageCircle, title: t('problem.p3_title', "Same questions 100 times"), desc: t('problem.p3_desc', "\"Price?\" \"Delivery?\" \"Available?\" — over and over again") },
    { icon: TrendingUp, title: t('problem.p4_title', "No time to grow"), desc: t('problem.p4_desc', "You're stuck answering messages instead of growing your business") },
  ];

  const features = [
    { 
      icon: MessageSquare, 
      title: t('solution.f1_title', "Auto-Replies to Customers"), 
      desc: t('solution.f1_desc', "Instant AI replies based on your products & FAQs. Never miss a sale again.") 
    },
    { 
      icon: Globe, 
      title: t('solution.f2_title', "Works in Arabic + English"), 
      desc: t('solution.f2_desc', "Saudi dialect, Gulf Arabic, Tunisian, Egyptian, English — all supported.") 
    },
    { 
      icon: Smartphone, 
      title: t('solution.f3_title', "No App Needed"), 
      desc: t('solution.f3_desc', "Works directly on WhatsApp Business. No new apps to download or learn.") 
    },
  ];

  return (
    <>
      {/* Problem Section */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {t('problem.title', "Too Many WhatsApp Messages? You’re Losing Money.")}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {problems.map((p, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 text-center hover:border-[var(--error)] transition-colors group"
                style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                  <p.icon size={32} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-[var(--text-secondary)]">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="features" className="py-20 bg-[var(--bg-primary)]">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[var(--accent-primary)]">
              {t('solution.title', "Your Smart WhatsApp Assistant")}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass-panel p-8 text-center border-[var(--accent-primary)]/20 hover:border-[var(--accent-primary)] transition-all"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--accent-glow)] flex items-center justify-center text-[var(--accent-primary)]">
                  <f.icon size={40} />
                </div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
