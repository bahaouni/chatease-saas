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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-lg mx-auto"
        >
          <div className="relative bg-gradient-card border-gradient rounded-3xl p-8 md:p-10 shadow-card">
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-2 bg-gold text-navy px-4 py-2 rounded-full text-sm font-bold shadow-gold">
                <Sparkles className="w-4 h-4" />
                {t('pricing.plan_name', "Most Popular")}
              </div>
            </div>

            {/* Price */}
            <div className="text-center mb-8 mt-4">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-2xl font-medium text-muted-foreground">$</span>
                <span className="text-6xl font-bold text-foreground">9</span>
                <span className="text-xl text-muted-foreground">{t('pricing.period', "/month")}</span>
              </div>
              <p className="text-muted-foreground mt-2">{t('pricing.billing', "Billed monthly. Cancel anytime.")}</p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-gold" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <Link href="/signup">
                <Button variant="gold" size="xl" className="w-full">
                {t('pricing.cta', "Start 7-Day Free Trial")}
                </Button>
            </Link>

            <p className="text-center text-sm text-muted-foreground mt-4">
              {t('pricing.cta_sub', "No credit card required. Setup in 2 minutes.")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
