'use client';

import React from 'react';
import Link from 'next/link';
import { Smartphone, Cpu, MessageSquare, PlayCircle, Settings, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function GuidePage() {
  const steps = [
    {
      id: 1,
      title: 'Connect WhatsApp',
      description: 'Link your business WhatsApp number to ChatEase to verify your identity and enable message sending.',
      icon: Smartphone,
      color: '#25D366', // WhatsApp Green
      link: '/dashboard/settings',
      linkText: 'Go to Settings',
    },
    {
      id: 2,
      title: 'Configure AI Intelligence',
      description: 'Choose your AI provider (OpenAI, Gemini, etc.) and set your API Key. Define your bot\'s "Persona" to control how it speaks.',
      icon: Cpu,
      color: 'var(--accent-primary)',
      link: '/dashboard/settings',
      linkText: 'Configure AI',
    },
    {
      id: 3,
      title: 'Train Your Bot (FAQs)',
      description: 'Add specific questions and answers. Your bot will use these to answer customers accurately before using general AI.',
      icon: MessageSquare,
      color: '#10b981',
      link: '/dashboard/faq',
      linkText: 'Manage FAQs',
    },
    {
      id: 4,
      title: 'Test & Simulate',
      description: 'Use the Simulator to chat with your bot in a safe environment. Verify it answers FAQs correctly and handles general chit-chat.',
      icon: PlayCircle,
      color: '#f59e0b',
      link: '/dashboard/simulator',
      linkText: 'Open Simulator',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Getting Started Guide</h1>
        <p className="text-[var(--text-secondary)]">Follow these steps to get your AI assistant up and running perfectly.</p>
      </div>

      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.id} className="glass-panel p-6 flex gap-6 items-start relative overflow-hidden group hover:border-[var(--accent-primary)] transition-colors">
            {/* Step Number Background */}
            <div className="absolute -right-4 -top-4 text-[8rem] font-bold opacity-[0.03] select-none">
              {step.id}
            </div>

            {/* Icon */}
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${step.color}20`, color: step.color }}
            >
              <step.icon size={24} />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-2 py-1 rounded-md">
                  Step {step.id}
                </span>
                <h3 className="text-xl font-bold">{step.title}</h3>
              </div>
              
              <p className="text-[var(--text-secondary)] mb-4 leading-relaxed">
                {step.description}
              </p>

              <Link href={step.link}>
                <button className="btn btn-secondary text-sm group-hover:bg-[var(--accent-primary)] group-hover:text-black group-hover:border-[var(--accent-primary)] transition-all">
                  {step.linkText}
                  <ArrowRight size={16} className="ml-2" />
                </button>
              </Link>
            </div>

            {/* Checkmark Visual (Optional) */}
            <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-full border border-[var(--glass-border)] text-[var(--glass-border)] group-hover:border-[var(--accent-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
               <CheckCircle2 size={18} />
            </div>

          </div>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-xl bg-[rgba(16,185,129,0.1)] border border-emerald-500/20 text-center">
        <h3 className="text-emerald-500 font-bold mb-2">Need more help?</h3>
        <p className="text-[var(--text-secondary)] text-sm mb-4">
          If you're stuck, check our detailed documentation or contact support.
        </p>
        <Link href="/dashboard/feedback">
            <button className="text-emerald-500 hover:text-emerald-400 font-medium text-sm underline">
            Contact Support
            </button>
        </Link>
      </div>
    </div>
  );
}
