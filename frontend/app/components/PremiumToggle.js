"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function PremiumToggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] hover:border-[var(--glass-border)] transition-colors">
      <div>
        {label && <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">{label}</label>}
        {description && <p className="text-xs text-[var(--text-secondary)] m-0">{description}</p>}
      </div>
      <div 
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-7 rounded-full cursor-pointer transition-colors duration-300 ${checked ? 'bg-[var(--accent-primary)]' : 'bg-[rgba(255,255,255,0.1)]'}`}
      >
        <motion.div 
          className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </div>
  );
}
