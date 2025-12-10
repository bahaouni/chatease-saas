import Link from 'next/link';
import { ArrowRight, MessageSquare, Zap, Shield } from 'lucide-react';

export default function Home() {
  return (
    <main className="page-wrapper">
      <div className="container" style={{ textAlign: 'center', paddingTop: '60px' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '20px', background: 'linear-gradient(to right, #fff, #a1a1aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Automate WhatsApp<br />with AI Intelligence.
        </h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 40px auto' }}>
          ChatEase AI handles your customer FAQs instantly. 
          Connect your WhatsApp Business API and let AI take over.
        </p>
        
        <div className="flex-center" style={{ gap: '20px', marginBottom: '80px' }}>
          <Link href="/signup">
            <button className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '16px 32px' }}>
              Get Started <ArrowRight size={20} style={{ marginLeft: '10px' }} />
            </button>
          </Link>
          <Link href="/login">
            <button className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '16px 32px' }}>
              Login
            </button>
          </Link>
        </div>

        <div className="flex-center" style={{ gap: '30px', flexWrap: 'wrap' }}>
          <div className="glass-panel" style={{ flex: '1', minWidth: '300px', textAlign: 'left' }}>
            <div style={{ marginBottom: '20px', color: 'var(--accent-primary)' }}><MessageSquare size={32} /></div>
            <h3>Smart Auto-Replies</h3>
            <p>AI matches questions to your FAQ or generates smart answers.</p>
          </div>
          <div className="glass-panel" style={{ flex: '1', minWidth: '300px', textAlign: 'left' }}>
             <div style={{ marginBottom: '20px', color: 'var(--success)' }}><Zap size={32} /></div>
            <h3>Instant setup</h3>
            <p>Simply paste your WhatsApp API keys and start automating.</p>
          </div>
          <div className="glass-panel" style={{ flex: '1', minWidth: '300px', textAlign: 'left' }}>
             <div style={{ marginBottom: '20px', color: '#facc15' }}><Shield size={32} /></div>
            <h3>Secure & Scalable</h3>
            <p>Built for small businesses and growing shops.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
