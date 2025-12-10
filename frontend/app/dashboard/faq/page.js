"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Trash2, Edit2, Save, X, Search } from 'lucide-react';

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ question: '', answer: '' });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await api.get('/faq');
      setFaqs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newFaq.question || !newFaq.answer) return;
    try {
      const res = await api.post('/faq', newFaq);
      setFaqs([...faqs, res.data]);
      setNewFaq({ question: '', answer: '' });
      setIsAdding(false);
    } catch (err) {
      alert('Failed to add FAQ');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await api.delete(`/faq/${id}`);
      setFaqs(faqs.filter(f => f.id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const startEdit = (faq) => {
    setEditingId(faq.id);
    setEditForm({ question: faq.question, answer: faq.answer });
  };

  const handleUpdate = async () => {
    try {
      const res = await api.put(`/faq/${editingId}`, editForm);
      setFaqs(faqs.map(f => f.id === editingId ? res.data : f));
      setEditingId(null);
    } catch (err) {
      alert('Failed to update');
    }
  };

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>Knowledge Base</h1>
          <p>The AI uses these FAQs to answer your customers automatically.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? <X size={20} /> : <Plus size={20} />}
          <span style={{ marginLeft: '8px' }}>{isAdding ? 'Cancel' : 'Add FAQ'}</span>
        </button>
      </div>

      {isAdding && (
        <div className="glass-panel" style={{ marginBottom: '32px', border: '1px solid var(--accent-primary)' }}>
          <h3 style={{ marginBottom: '16px' }}>New Question</h3>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label className="label">Question</label>
                <input 
                  className="input-field" 
                  placeholder="e.g. Do you deliver to Dubai?"
                  value={newFaq.question}
                  onChange={e => setNewFaq({...newFaq, question: e.target.value})}
                />
              </div>
              <div>
                <label className="label">Answer</label>
                <textarea 
                  className="input-field" 
                  rows={3}
                  placeholder="e.g. Yes, we deliver to Dubai for 20 AED."
                  value={newFaq.answer}
                  onChange={e => setNewFaq({...newFaq, answer: e.target.value})}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }}>
                <Save size={18} style={{ marginRight: '8px' }} /> Save FAQ
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex-center" style={{ height: '200px' }}>Loading FAQs...</div>
      ) : faqs.length === 0 ? (
        <div className="glass-panel flex-center" style={{ flexDirection: 'column', padding: '60px', textAlign: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '50%', marginBottom: '20px' }}>
            <Search size={40} color="var(--text-secondary)" />
          </div>
          <h3>No FAQs yet</h3>
          <p style={{ maxWidth: '400px', margin: '10px auto 20px' }}>Add your most common questions so the AI can start ignoring... I mean answering them.</p>
          <button className="btn btn-primary" onClick={() => setIsAdding(true)}>Add Your First FAQ</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {faqs.map(faq => (
            <div key={faq.id} className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              {editingId === faq.id ? (
                <div style={{ width: '100%', marginRight: '20px' }}>
                  <input 
                    className="input-field" 
                    value={editForm.question}
                    onChange={e => setEditForm({...editForm, question: e.target.value})}
                    style={{ marginBottom: '8px' }}
                  />
                  <textarea 
                    className="input-field" 
                    rows={2}
                    value={editForm.answer}
                    onChange={e => setEditForm({...editForm, answer: e.target.value})}
                  />
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                    <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={handleUpdate}>Save</button>
                    <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }} onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{faq.question}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>{faq.answer}</p>
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '8px' }}>
                {editingId !== faq.id && (
                  <>
                    <button className="btn btn-secondary" style={{ padding: '8px' }} onClick={() => startEdit(faq)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn btn-secondary" style={{ padding: '8px', color: 'var(--error)', borderColor: 'rgba(239,68,68,0.3)' }} onClick={() => handleDelete(faq.id)}>
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
