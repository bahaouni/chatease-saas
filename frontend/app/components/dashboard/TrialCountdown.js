'use client';

import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export default function TrialCountdown() {
  const [daysLeft, setDaysLeft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for user data
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.created_at) {
          const createdAt = new Date(user.created_at); // UTC time from backend
          const trialEndsAt = new Date(createdAt);
          trialEndsAt.setDate(createdAt.getDate() + 7);
          
          const today = new Date();
          const diffTime = trialEndsAt - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          
          setDaysLeft(diffDays > 0 ? diffDays : 0);
        } else {
            // Fallback for users created before this update or without timestamp
            setDaysLeft(7); 
        }
      } catch (e) {
        console.error("Error parsing user data for trial", e);
      }
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <div className="mx-4 mb-6 p-4 rounded-xl bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-16 h-16 bg-gold/10 rounded-full blur-xl -mr-8 -mt-8 group-hover:bg-gold/20 transition-all duration-500" />
      
      <div className="relative z-10 flex items-start gap-3">
        <div className="bg-gold/20 p-2 rounded-lg text-gold shrink-0">
            <Clock size={18} />
        </div>
        <div>
            <h4 className="text-sm font-bold text-foreground mb-1">Free Trial</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
                {daysLeft > 0 ? (
                    <>You have <span className="text-gold font-bold">{daysLeft} days</span> left in your free trial.</>
                ) : (
                    <span className="text-error font-medium">Trial Expired</span>
                )}
            </p>
        </div>
      </div>

      {daysLeft <= 3 && daysLeft > 0 && (
          <div className="mt-3 relative z-10">
              <div className="h-1.5 w-full bg-background/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gold rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(daysLeft / 7) * 100}%` }}
                  />
              </div>
          </div>
      )}
    </div>
  );
}
