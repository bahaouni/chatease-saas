'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Waitlist() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      // Logic to save email would go here
    }
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gold/5 opacity-50 pointer-events-none" />

      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="glass-panel p-12 md:p-16 relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gold/20 blur-[100px] rounded-full pointer-events-none" />

            <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">
              {t('waitlist.title', "Join the Future of AI Chat")}
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto relative z-10">
              {t('waitlist.subtitle', "More features are coming. Be the first to get access to advanced analytics and custom AI personas.")}
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/10 border border-green-500/20 text-green-500 px-6 py-4 rounded-xl inline-flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {t('waitlist.success', "You're on the list! Watch your inbox.")}
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative z-10">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="email"
                    required
                    placeholder={t('waitlist.placeholder', "Enter your email")}
                    className="input-field h-12 pl-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="gold" size="lg" className="h-12 px-8">
                  {t('waitlist.button', "Join Waitlist")}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
