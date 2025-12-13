"use client";
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Check, MessageSquare, Plus } from 'lucide-react';

import toast from 'react-hot-toast';

export default function AdminFeedbackPage() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
            const res = await api.get('/api/admin/feedback');
            setFeedbacks(res.data.feedback);
        } catch (err) {
            console.error("Failed to load feedback", err);
            toast.error('Failed to load feedback');
        } finally {
            setLoading(false);
        }
    };

    const resolveFeedback = async (id) => {
        const toastId = toast.loading('Resolving...');
        try {
            await api.post(`/api/admin/feedback/${id}/resolve`);
            toast.success('Feedback resolved', { id: toastId });
            fetchFeedback();
        } catch (err) {
            toast.error('Failed to resolve', { id: toastId });
        }
    };

    const addInternalNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        
        const toastId = toast.loading('Adding note...');
        try {
            await api.post('/api/admin/feedback', { message: newNote, type: 'internal_note' });
            setNewNote('');
            setShowForm(false);
            toast.success('Note added', { id: toastId });
            fetchFeedback();
        } catch (err) {
            toast.error('Failed to add note', { id: toastId });
        }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 style={{ margin: 0 }}>Feedback & Notes</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    <Plus size={18} style={{ marginRight: '8px' }} />
                    Add Note
                </button>
            </div>

            {showForm && (
                <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
                    <form onSubmit={addInternalNote}>
                        <textarea 
                            className="input-premium" 
                            placeholder="Write an internal note or quick task..." 
                            value={newNote}
                            onChange={e => setNewNote(e.target.value)}
                            required
                            style={{ minHeight: '100px', resize: 'vertical' }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }}>Save Note</button>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {feedbacks.map(fb => (
                    <div key={fb.id} className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', opacity: fb.status === 'resolved' ? 0.6 : 1 }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ 
                                padding: '10px', borderRadius: '12px', 
                                background: fb.type === 'internal_note' ? 'rgba(255,255,255,0.05)' : 'rgba(59, 130, 246, 0.1)',
                                color: fb.type === 'internal_note' ? 'var(--text-secondary)' : '#3b82f6'
                            }}>
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>
                                        {fb.type}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {new Date(fb.created_at).toLocaleString()}
                                    </span>
                                    {fb.status === 'resolved' && <span style={{ fontSize: '0.8rem', color: '#10b981' }}>RESOLVED</span>}
                                </div>
                                <p style={{ margin: 0, fontSize: '1.1rem' }}>{fb.message}</p>
                            </div>
                        </div>
                        
                        {fb.status !== 'resolved' && (
                            <button 
                                onClick={() => resolveFeedback(fb.id)}
                                className="btn-icon" 
                                title="Mark Resolved"
                                style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                <Check size={18} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
