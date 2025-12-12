'use client';

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from 'react-i18next';

export default function FAQ() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const faqs = [
    { q: t('faq.q1', "Does it work with normal WhatsApp?"), a: t('faq.a1', "No, it works with WhatsApp Business API (WABA) for official auto-replies.") },
    { q: t('faq.q2', "How fast are the replies?"), a: t('faq.a2', "Instant, usually within 1-2 seconds.") },
    { q: t('faq.q3', "Is my WhatsApp number safe?"), a: t('faq.a3', "Yes, we use the official Meta Cloud API which is safe and compliant.") },
    { q: t('faq.q4', "What languages does it support?"), a: t('faq.a4', "We support Arabic (all dialects) and English.") },
    { q: t('faq.q5', "Can I customize the replies?"), a: t('faq.a5', "Absolutely. You upload your own knowledge base and FAQs.") },
    { q: t('faq.q6', "What if I want to cancel?"), a: t('faq.a6', "You can cancel anytime from your dashboard. No hidden fees.") },
  ];

  return (
    <section id="faq" className="py-24 bg-background relative overflow-hidden">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-gold text-sm font-semibold tracking-wider uppercase mb-4">
            {t('faq.title_label', "Got Questions?")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            {t('faq.title', "Frequently Asked Questions").split(' ')[0]} <span className="text-gradient-gold">{t('faq.title', "Frequently Asked Questions").split(' ').slice(1).join(' ')}</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-gold/30 transition-colors"
              >
                <AccordionTrigger className={`text-foreground hover:text-gold hover:no-underline py-5 text-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className={`text-muted-foreground pb-5 text-base ${isRTL ? 'text-right' : 'text-left'}`}>
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
