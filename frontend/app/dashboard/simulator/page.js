"use client";
import React, { useState, useRef, useEffect } from 'react';
import api from '@/lib/api';
import { Send, Bot, User, RefreshCw } from 'lucide-react';

export default function SimulatorPage() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I am your AI assistant simulator. Ask me anything from your FAQs.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/test/chat', { message: userMsg });
      setMessages(prev => [...prev, { role: 'bot', content: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Error: Could not reach the server.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1>Bot Simulator</h1>
        <button 
          onClick={() => setMessages([{ role: 'bot', content: 'Hello! I am your AI assistant simulator. Ask me anything from your FAQs.' }])}
          className="btn-secondary"
          style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={16} /> Reset
        </button>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
        {/* Chat Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              style={{ 
                display: 'flex', 
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: '10px'
              }}
            >
              {msg.role === 'bot' && (
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <Bot size={18} color="white" />
                </div>
              )}
              
              <div style={{ 
                background: msg.role === 'user' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '12px',
                borderBottomRightRadius: msg.role === 'user' ? '2px' : '12px',
                borderBottomLeftRadius: msg.role === 'bot' ? '2px' : '12px',
                maxWidth: '70%',
                lineHeight: '1.5'
              }}>
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <User size={18} color="white" />
                </div>
              )}
            </div>
          ))}
          {loading && (
             <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <Bot size={18} color="white" />
                </div>
                <div style={{ padding: '12px', color: 'var(--text-secondary)' }}>Typing...</div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '20px', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
            <input
              className="input-field"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a test message..."
              style={{ marginBottom: 0 }}
            />
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: 'auto', padding: '0 20px' }}
              disabled={loading}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
