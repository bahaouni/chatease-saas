'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Check, CheckCheck } from "lucide-react";
import { useTranslation } from 'react-i18next';

export function ChatDemo() {
  const { t } = useTranslation();
  
  // Dynamic messages from translations
  const messagesOriginal = [
    { id: 1, text: t('hero.demo_user_1', "Hi! What's the price for delivery?"), isUser: true, time: "2:34 PM" },
    { id: 2, text: t('hero.demo_ai_1', "Hello! 👋 Delivery is FREE for orders over $50. Standard delivery is $5.99. Express delivery (same-day) is $12.99. How can I help you today?"), isUser: false, time: "2:34 PM" },
    { id: 3, text: t('hero.demo_user_2', "Do you have this in blue?"), isUser: true, time: "2:35 PM" },
    { id: 4, text: t('hero.demo_ai_2', "Yes! We have it in Royal Blue, Navy, and Sky Blue. All sizes S-XXL are in stock. Would you like me to send you photos?"), isUser: false, time: "2:35 PM" },
  ];

  const [visibleMessages, setVisibleMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    
    // Reset function
    const resetChat = () => {
       setVisibleMessages([]);
       currentIndex = 0;
       scheduleNext();
    };

    const showNextMessage = () => {
      if (currentIndex < messagesOriginal.length) {
        const message = messagesOriginal[currentIndex];
        
        if (!message.isUser) {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setVisibleMessages(prev => [...prev, { ...message, id: Date.now() + Math.random() }]); // Ensure unique ID
            currentIndex++;
            scheduleNext(1500);
          }, 1200);
        } else {
          setVisibleMessages(prev => [...prev, { ...message, id: Date.now() + Math.random() }]); // Ensure unique ID
          currentIndex++;
          scheduleNext(800);
        }
      } else {
        // Reset and loop
        setTimeout(() => {
          resetChat();
        }, 3000);
      }
    };

    const scheduleNext = (delay = 500) => {
       setTimeout(showNextMessage, delay);
    };

    // Start
    const timeout = setTimeout(showNextMessage, 500);
    return () => clearTimeout(timeout);
  }, [t]); // Re-run if language changes

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Phone frame */}
      <div className="bg-navy-light rounded-[2.5rem] p-2 shadow-card border border-[var(--glass-border)]">
        {/* Phone notch */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-6 bg-[var(--bg-primary)] rounded-full z-10" />
        
        {/* Screen */}
        <div className="bg-[var(--bg-primary)] rounded-[2rem] overflow-hidden">
          {/* WhatsApp header */}
          <div className="bg-navy-light px-4 py-3 flex items-center gap-3 pt-8 border-b border-white/5">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-gold" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground text-sm">Your Store AI</p>
              <p className="text-xs text-gold">Online • AI Assistant</p>
            </div>
            <div className="flex gap-4 text-muted-foreground">
              <div className="w-5 h-5 rounded-full bg-gold/20" />
              <div className="w-5 h-5 rounded-full bg-gold/20" />
            </div>
          </div>

          {/* Chat area */}
          <div className="h-80 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-opacity-10 p-4 flex flex-col gap-2 overflow-hidden bg-cover">
            <div className="absolute inset-0 bg-[var(--bg-primary)]/90 z-0"></div>
            <div className="relative z-10 flex flex-col gap-2 h-full">
            <AnimatePresence mode="popLayout">
              {visibleMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      msg.isUser
                        ? "bg-gold text-navy font-medium rounded-br-sm"
                        : "bg-navy-lighter text-foreground rounded-bl-sm"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${msg.isUser ? "text-navy/70" : "text-muted-foreground"}`}>
                      <span>{msg.time}</span>
                      {msg.isUser && <CheckCheck className="w-3 h-3" />}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex justify-start"
                >
                  <div className="bg-navy-lighter rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-1.5 h-1.5 rounded-full bg-gold"
                      />
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-1.5 h-1.5 rounded-full bg-gold"
                      />
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-1.5 h-1.5 rounded-full bg-gold"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>

          {/* Input bar */}
          <div className="bg-navy-light px-3 py-2 flex items-center gap-2 border-t border-white/5">
            <div className="flex-1 bg-navy-lighter rounded-full px-4 py-2 text-xs text-muted-foreground">
              Type a message...
            </div>
            <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center">
              <svg className="w-4 h-4 text-navy" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-20 bg-gold rounded-full transform scale-75" />
    </div>
  );
}
