'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChatDemo } from "@/components/ChatDemo";
import { Play, Zap } from "lucide-react";
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function Hero() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-20">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center lg:text-start"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2 mb-6"
          >
            <Zap className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold font-medium">AI-Powered WhatsApp Automation</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
             <span className="text-foreground">{t('hero.title_start', "Your AI Replies to Customers on WhatsApp")}</span>
            <br />
            <span className="text-gradient-gold rtl:bg-gradient-to-l">— {t('hero.title_end', "24/7.")}</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
            {t('hero.subtitle', "Stop losing customers. Let AI answer messages automatically in your language.")}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link href="/signup">
              <Button variant="hero" size="xl" className="group w-full sm:w-auto">
                {t('hero.cta_primary', "Start Free Trial")}
                <motion.span
                  className="ml-1 rtl:mr-1 rtl:ml-0 rtl:rotate-180"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Button>
            </Link>
            <Button variant="heroOutline" size="xl" className="group w-full sm:w-auto">
              <Play className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 group-hover:text-gold transition-colors" />
              {t('hero.cta_secondary', "Watch Demo")}
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>{t('hero.cta_sub', "No credit card required • Setup in 2 minutes").split('•')[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold" />
              <span>{t('hero.cta_sub', "No credit card required • Setup in 2 minutes").split('•')[1] || " Setup in 2 minutes"}</span>
            </div>
          </motion.div>
        </motion.div>

          {/* Right content - Chat Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex justify-center lg:justify-end rtl:lg:justify-end"
          >
            <div className="animate-float">
              <ChatDemo />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
}
