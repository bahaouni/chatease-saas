'use client';

import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Sending feedback...');
    
    try {
      await api.post('/api/feedback', {
        rating,
        message: feedback
      });
      toast.success('Feedback sent!', { id: toastId });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error('Failed to send feedback', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="glass-panel p-12 text-center max-w-lg mx-auto animate-fade-in">
        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Send className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
        <p className="text-muted-foreground mb-6">Your feedback helps us improve ChatEase AI.</p>
        <Button onClick={() => { setSubmitted(false); setRating(0); setFeedback(''); }}>
          Send Another
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">We Value Your Feedback</h1>
      <p className="text-muted-foreground mb-8">Tell us about your experience and how we can improve.</p>

      <div className="glass-panel p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Star Rating */}
          <div className="flex flex-col items-center gap-4">
            <label className="text-lg font-medium">Rate your experience</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition-colors focus:outline-none"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-10 h-10 transition-all duration-200 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-[var(--accent-primary)] text-[var(--accent-primary)] scale-110'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Text */}
          <div className="space-y-2">
            <label htmlFor="feedback" className="text-sm font-medium">
              Share your thoughts (Optional)
            </label>
            <textarea
              id="feedback"
              className="input-premium min-h-[150px] resize-none"
              placeholder="What do you like? What could be better?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={rating === 0 || loading} className="w-full btn-primary">
            {loading ? 'Sending...' : 'Submit Feedback'}
          </Button>
        </form>
      </div>
    </div>
  );
}
