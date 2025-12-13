"use client";
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { ShoppingCart, Calendar, Tag, Clock } from 'lucide-react';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [activeTab, setActiveTab] = useState('commands'); // commands | history

  useEffect(() => {
    if (activeTab === 'commands') {
        fetchLogs(page);
    } else {
        fetchChatHistory(page);
    }
  }, [page, activeTab]);

  const fetchLogs = async (pageNum) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/logs?page=${pageNum}`);
      setLogs(res.data.logs);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async (pageNum) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/chat-history?page=${pageNum}`);
      setLogs(res.data.logs);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
      switch(type) {
          case 'order': return <ShoppingCart size={16} color="#10b981" />;
          case 'book': return <Calendar size={16} color="#3b82f6" />;
          case 'price': return <Tag size={16} color="#f59e0b" />;
          default: return <Clock size={16} />;
      }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1>Logs</h1>
          
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px' }}>
              <button 
                  onClick={() => { setActiveTab('commands'); setPage(1); }}
                  style={{ 
                      padding: '8px 16px', 
                      borderRadius: '8px',
                      border: 'none',
                      background: activeTab === 'commands' ? 'var(--accent-primary)' : 'transparent',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                  }}
              >
                  Commands
              </button>
              <button 
                  onClick={() => { setActiveTab('history'); setPage(1); }}
                  style={{ 
                      padding: '8px 16px', 
                      borderRadius: '8px',
                      border: 'none',
                      background: activeTab === 'history' ? 'var(--accent-primary)' : 'transparent',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                  }}
              >
                  Chat History
              </button>
          </div>
      </div>

      {loading && <p>Loading logs...</p>}

      {!loading && logs.length === 0 && (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No logs found.
          </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {logs.map(log => (
            <div key={log.id} className="glass-panel" style={{ padding: '20px' }}>
                {activeTab === 'commands' ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            {getTypeIcon(log.command_type)}
                            <span style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
                                {log.command_type}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '12px' }}>
                                {new Date(log.timestamp).toLocaleString()}
                            </span>
                        </div>
                        <div style={{ fontSize: '1.1rem', marginBottom: '4px' }}>
                            {log.message_content}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            From: {log.customer_number}
                        </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                             {new Date(log.timestamp).toLocaleString()}
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <strong style={{ color: 'var(--accent-primary)' }}>User:</strong> {log.incoming}
                        </div>
                        <div style={{ paddingLeft: '12px', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                            <strong>Bot:</strong> {log.reply}
                        </div>
                    </div>
                )}
            </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ marginTop: '32px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              className="btn" 
              disabled={page <= 1} 
              onClick={() => setPage(page - 1)}
              style={{ padding: '8px 16px' }}
            >
                Previous
            </button>
            <span style={{ display: 'flex', alignItems: 'center' }}>Page {page} of {totalPages}</span>
            <button 
              className="btn" 
              disabled={page >= totalPages} 
              onClick={() => setPage(page + 1)}
              style={{ padding: '8px 16px' }}
            >
                Next
            </button>
        </div>
      )}
    </div>
  );
}
