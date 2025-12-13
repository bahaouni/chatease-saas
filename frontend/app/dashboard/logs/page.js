"use client";
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { ShoppingCart, Calendar, Tag, Clock } from 'lucide-react';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

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
      <h1 style={{ marginBottom: '32px' }}>Command Logs</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Detected keywords from customer messages.
      </p>

      {loading && <p>Loading logs...</p>}

      {!loading && logs.length === 0 && (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No commands detected yet.
          </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {logs.map(log => (
            <div key={log.id} className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
