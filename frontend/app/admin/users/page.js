"use client";
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Power, Trash2, CheckCircle, XCircle } from 'lucide-react';

import toast from 'react-hot-toast';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/api/admin/users');
            setUsers(res.data.users);
        } catch (err) {
            console.error("Failed to load users", err);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const toggleSuspend = async (userId) => {
        // if (!confirm('Are you sure you want to toggle suspension for this user?')) return;
        const toastId = toast.loading('Updating status...');
        try {
            await api.post(`/api/admin/users/${userId}/suspend`);
            toast.success('User status updated', { id: toastId });
            fetchUsers();
        } catch (err) {
            toast.error('Action failed', { id: toastId });
        }
    };

    const deleteUser = async (userId) => {
        if (!confirm('CRITICAL: Are you sure you want to PERMANENTLY DELETE this user and all their data?')) return;
        const toastId = toast.loading('Deleting user...');
        try {
            await api.delete(`/api/admin/users/${userId}/delete`);
            toast.success('User deleted', { id: toastId });
            fetchUsers();
        } catch (err) {
            toast.error('Delete failed', { id: toastId });
        }
    };

    return (
        <div className="animate-fade-in">
            <h1 style={{ marginBottom: '32px' }}>Users Management</h1>

            {loading ? <p>Loading users...</p> : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '16px' }}>ID</th>
                                <th style={{ padding: '16px' }}>Email</th>
                                <th style={{ padding: '16px' }}>Role</th>
                                <th style={{ padding: '16px' }}>Bot Active</th>
                                <th style={{ padding: '16px' }}>Phone</th>
                                <th style={{ padding: '16px' }}>Status</th>
                                <th style={{ padding: '16px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '16px' }}>{user.id}</td>
                                    <td style={{ padding: '16px' }}>{user.email}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ 
                                            background: user.role === 'admin' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)',
                                            color: user.role === 'admin' ? '#818cf8' : 'inherit',
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        {user.bot_enabled ? <CheckCircle size={18} color="#10b981"/> : <XCircle size={18} color="var(--text-secondary)"/>}
                                    </td>
                                    <td style={{ padding: '16px' }}>{user.connected_phone}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ color: user.is_active ? '#10b981' : '#ef4444' }}>
                                            {user.is_active ? 'Active' : 'Suspended'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                                        <button 
                                            onClick={() => toggleSuspend(user.id)}
                                            className="btn-icon" 
                                            title={user.is_active ? "Suspend" : "Activate"}
                                            style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                                        >
                                            <Power size={18} />
                                        </button>
                                        <button 
                                            onClick={() => deleteUser(user.id)}
                                            className="btn-icon" 
                                            title="Delete"
                                            style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
