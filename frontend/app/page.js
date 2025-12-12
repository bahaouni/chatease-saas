'use client';

import { Navbar } from './components/landing/Navbar';
import Hero from './components/landing/Hero';
import ProblemSolution from './components/landing/ProblemSolution';
import HowItWorks from './components/landing/HowItWorks';
import SocialProof from './components/landing/SocialProof';
import Pricing from './components/landing/Pricing';
import Waitlist from './components/landing/Waitlist';
import FAQ from './components/landing/FAQ';
import Footer from './components/landing/Footer';

export default function Home() {
  return (
    <div className="relative">
      <Navbar />

      <main className="pt-16"> {/* Add padding for fixed navbar */}
        <Hero />
        <ProblemSolution />
        <HowItWorks />
        <SocialProof />
        <Pricing />
        <Waitlist />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
