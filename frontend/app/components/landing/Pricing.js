'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function Pricing() {
  const { t } = useTranslation();

  const features = [
    t('pricing.feat_1', "AI Auto-Reply 24/7"),
    t('pricing.feat_2', "WhatsApp Business Integration"),
    t('pricing.feat_3', "Unlimited FAQ & Products"),
    t('pricing.feat_4', "Arabic + English"),
    t('pricing.feat_5', "Custom Responses"),
    t('pricing.feat_6', "Analytics Dashboard"),
    t('pricing.feat_7', "Priority Support"),
  ];

  return (
    <section id="pricing" className="py-24 bg-background relative overflow-hidden">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-gold text-sm font-semibold tracking-wider uppercase mb-4">
            {t('pricing.title', "Simple Pricing")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            {t('pricing.subtitle', "One Plan.")} <span className="text-gradient-gold">Everything Included.</span>
          </h2>
        </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Trial Plan */}
            <div className="relative bg-gradient-card border-gradient rounded-3xl p-8 shadow-card flex flex-col">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-2 bg-gold text-navy px-4 py-2 rounded-full text-sm font-bold shadow-gold">
                  <Sparkles className="w-4 h-4" />
                  {t('pricing.free_plan', "Free Trial")}
                </div>
              </div>

              <div className="text-center mb-8 mt-4">
                <h3 className="text-xl font-bold mb-2">Starter</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-medium text-muted-foreground">$</span>
                  <span className="text-6xl font-bold text-foreground">0</span>
                  <span className="text-xl text-muted-foreground">{t('pricing.period', "/month")}</span>
                </div>
                <p className="text-muted-foreground mt-2">{t('pricing.free_desc', "Perfect for testing automation.")}</p>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                {features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-gold" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href="/signup" className="w-full">
                <Button variant="gold" size="xl" className="w-full">
                  {t('pricing.start_free', "Start Free Trial")}
                </Button>
              </Link>
            </div>

            {/* Pro Plan (Coming Soon) */}
            <div className="relative bg-card/50 border border-white/5 rounded-3xl p-8 shadow-none flex flex-col opacity-75 grayscale-[0.5]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="bg-white/10 text-white backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/20">
                  {t('pricing.coming_soon', "Coming Soon")}
                </div>
              </div>

              <div className="text-center mb-8 mt-4">
                <h3 className="text-xl font-bold mb-2">Pro</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-medium text-muted-foreground">$</span>
                  <span className="text-6xl font-bold text-foreground">9</span>
                  <span className="text-xl text-muted-foreground">{t('pricing.period', "/month")}</span>
                </div>
                <p className="text-muted-foreground mt-2">{t('pricing.pro_desc', "For growing businesses.")}</p>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                     <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white/50" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Button disabled variant="outline" size="xl" className="w-full cursor-not-allowed opacity-50">
                {t('pricing.join_waitlist', "Coming Soon")}
              </Button>
            </div>
          </div>
      </div>
    </section>
  );
}
