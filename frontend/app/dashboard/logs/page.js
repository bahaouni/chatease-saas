"use client";
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Clock, MessageSquare, Bot, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function ChatLogsPage() {
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
      const res = await api.get(`/stats/logs?page=${pageNum}`);
      setLogs(res.data.logs);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("ChatEase - Conversation Logs", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    const tableColumn = ["Time", "User Message", "Bot Reply"];
    const tableRows = [];

    logs.forEach(log => {
      const logData = [
        log.timestamp,
        log.user_message,
        log.bot_reply,
      ];
      tableRows.push(logData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      headStyles: { fillColor: [66, 133, 244] }, // Blue header
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 40 }, // Timestamp
        1: { cellWidth: 70 }, // User
        2: { cellWidth: 70 }, // Bot
      }
    });

    doc.save("chatease_logs.pdf");
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
           <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Chat Logs</h1>
           <p style={{ color: 'var(--text-secondary)' }}>History of conversations between your bot and users.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={exportPDF} className="btn-primary" disabled={logs.length === 0} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={18} />
              Export PDF
            </button>
            <button onClick={() => fetchLogs(page)} className="btn-secondary">
              Refresh
            </button>
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.03)' }}>
                  <th style={{ padding: '16px', textAlign: 'left', width: '180px' }}>Time</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>User Message</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Bot Reply</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      Loading logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      No messages found yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={14} />
                            {log.timestamp}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ minWidth: '24px', paddingTop: '2px' }}><MessageSquare size={16} color="var(--text-secondary)"/></div>
                            <div>{log.user_message}</div>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                         <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ minWidth: '24px', paddingTop: '2px' }}><Bot size={16} color="var(--accent-primary)"/></div>
                            <div style={{ color: 'var(--text-primary)', opacity: 0.9 }}>{log.bot_reply}</div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
        </div>
        
        {/* Pagination */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button 
                disabled={page <= 1} 
                onClick={() => setPage(p => p - 1)}
                className="btn-secondary"
                style={{ opacity: page <= 1 ? 0.5 : 1 }}
            >
                Previous
            </button>
            <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
                Page {page} of {totalPages || 1}
            </span>
            <button 
                disabled={page >= totalPages} 
                onClick={() => setPage(p => p + 1)}
                className="btn-secondary"
                style={{ opacity: page >= totalPages ? 0.5 : 1 }}
            >
                Next
            </button>
        </div>
      </div>
    </div>
  );
}
