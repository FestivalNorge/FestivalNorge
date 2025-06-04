import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Get the "from" path from location state, or default to "/"
  const from = location.state?.from?.pathname || '/';
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      let success;
      
      if (isLogin) {
        success = await login(email, password);
      } else {
        if (!name) {
          setError('Name is required');
          return;
        }
        success = await register(name, email, password);
      }
      
      if (!success) {
        setError(isLogin ? 'Invalid email or password' : 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
      <div className="container-custom max-w-md">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary-500 px-6 py-8 text-white">
            <h1 className="text-2xl font-bold mb-2">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="text-primary-100">
              {isLogin 
                ? 'Sign in to access your saved festivals and preferences.' 
                : 'Join FestivalNorge to save your favorite festivals and get personalized recommendations.'}
            </p>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="bg-error-100 text-error-800 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-4">
                  <label htmlFor="name\" className="label">Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="input pl-10"
                    />
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="email" className="label">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="input pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="label">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="input pl-10"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full mb-4"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
              
              <p className="text-center text-gray-600 text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-accent-500 hover:text-accent-600 font-medium ml-1"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;