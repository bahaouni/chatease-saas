'use client';

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link2, FileText, CheckCircle, Home, ShoppingBag, Instagram, PenTool, Wrench } from 'lucide-react';

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    { num: "01", icon: Link2, title: t('how.step1_title', "Connect WhatsApp Business"), desc: t('how.step1_desc', "Link your WhatsApp Business number in seconds. Simple, secure, official API.") },
    { num: "02", icon: FileText, title: t('how.step2_title', "Add Your Products & FAQ"), desc: t('how.step2_desc', "Upload your product list or type common questions. Takes just 1 minute.") },
    { num: "03", icon: CheckCircle, title: t('how.step3_title', "AI Starts Replying"), desc: t('how.step3_desc', "Your AI assistant goes live instantly. Watch it handle customers 24/7.") },
  ];

  const personas = [
    { icon: Home, label: t('personas.p1', "Home Businesses") },
    { icon: ShoppingBag, label: t('personas.p2', "Online Sellers") },
    { icon: Instagram, label: t('personas.p3', "Social Sellers") },
    { icon: Wrench, label: t('personas.p4', "Service Providers") },
    { icon: PenTool, label: t('personas.p5', "Freelancers") },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[var(--bg-secondary)] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* How It Works */}
        <div className="mb-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t('how.title', "Go Live in 3 Steps")}</h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-[var(--glass-border)] via-[var(--accent-primary)] to-[var(--glass-border)] opacity-30 z-0" />

              {steps.map((s, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="relative z-10 flex flex-col items-center text-center"
                >
                  <div className="w-24 h-24 rounded-2xl bg-[var(--card-bg)] border border-[var(--glass-border)] flex items-center justify-center mb-6 shadow-xl text-[var(--accent-primary)] relative">
                    <span className="absolute top-2 left-2 text-xs font-mono opacity-50">{s.num}</span>
                    <s.icon size={40} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-[var(--text-secondary)]">{s.desc}</p>
                </motion.div>
              ))}
            </div>
            
             <div className="text-center mt-12">
              <button className="btn btn-primary px-8 py-3">
                {t('how.cta', "Start Free — No Credit Card")}
              </button>
            </div>
        </div>

        {/* Personas */}
        <div className="glass-panel p-12 bg-white/5 border-[var(--glass-border)]">
           <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-2">{t('personas.title') || "Perfect For"}</h2>
           </div>
           
           <div className="flex flex-wrap justify-center gap-6">
             {personas.map((p, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, scale: 0.8 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 className="flex items-center gap-3 px-6 py-3 rounded-full bg-[var(--bg-primary)] border border-[var(--glass-border)] text-sm font-medium hover:border-[var(--accent-primary)] transition-colors cursor-default"
               >
                 <p.icon size={18} className="text-[var(--accent-primary)]" />
                 {p.label}
               </motion.div>
             ))}
           </div>
        </div>

      </div>
    </section>
  );
}
