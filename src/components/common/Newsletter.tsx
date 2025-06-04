import React, { useState } from 'react';
import { Send } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setEmail('');
    }, 1000);
  };

  return (
    <div className="bg-primary-500 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-norway-landscape bg-cover bg-center h-40 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/30 to-primary-500/80"></div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-2">Stay in the Loop</h3>
        <p className="text-primary-100 mb-4">
          Get the latest festival announcements, lineup updates, and exclusive offers straight to your inbox.
        </p>
        
        {isSubmitted ? (
          <div className="bg-primary-400/30 backdrop-blur-sm rounded-lg p-4 text-white text-center animate-fade-in">
            <p className="font-medium">Thanks for subscribing!</p>
            <p className="text-sm mt-1">We'll keep you updated with the latest festival news.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-grow px-3 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-r-md transition-colors disabled:opacity-70 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-primary-200">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Newsletter;