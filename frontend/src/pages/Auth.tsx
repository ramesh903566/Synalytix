import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Github, ArrowRight, Sparkles, BarChart3, Zap, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    // TODO: Uncomment for production auth
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   if (session) navigate('/app', { replace: true });
    // });
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (signUpError) throw signUpError;
        navigate('/app', { replace: true });
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        navigate('/app', { replace: true });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/app`,
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to authenticate with GitHub');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to authenticate with Google');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-bg-canvas">
      {/* Visual Side */}
      <div className="hidden md:flex flex-col bg-bg-sunken p-12 justify-between relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-bg-canvas to-brand-secondary/5" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/8 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-secondary/8 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5 font-semibold tracking-tight text-xl text-text-primary">
          <div className="w-8 h-8 bg-brand rounded-[var(--radius-card-inner)] flex items-center justify-center shadow-level-1">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          Synalytix
        </div>

        {/* Hero text */}
        <div className="relative z-10 max-w-md">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight text-balance leading-tight mb-4 text-text-primary"
          >
            Step into the command center of your digital identity.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-text-muted text-lg leading-relaxed"
          >
            Unify your social and developer platforms. Optimize your reach with AI-driven insights and cross-posting capabilities.
          </motion.p>
        </div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 flex flex-wrap gap-3"
        >
          {[
            { icon: BarChart3, label: 'Analytics' },
            { icon: Zap, label: 'AI Insights' },
            { icon: Globe, label: 'Cross-platform' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3.5 py-2 bg-bg-elevated/80 backdrop-blur-sm rounded-[var(--radius-badge)] border border-border shadow-level-1"
            >
              <Icon className="w-3.5 h-3.5 text-brand" />
              <span className="text-xs font-medium text-text-secondary">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Form Side */}
      <div className="flex flex-col justify-center items-center p-8 sm:p-12 relative">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="md:hidden flex items-center gap-2.5 font-semibold tracking-tight text-xl text-text-primary mb-8 justify-center">
            <div className="w-8 h-8 bg-brand rounded-[var(--radius-card-inner)] flex items-center justify-center shadow-level-1">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            Synalytix
          </div>

          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-text-primary">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-text-muted">
              {isSignUp ? 'Enter your details below to get started' : 'Enter your credentials to access your dashboard'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error-light text-error-text text-sm rounded-[var(--radius-card-inner)] border border-error/20">
              {error}
            </div>
          )}
          {msg && (
            <div className="mb-4 p-3 bg-success-light text-success-text text-sm rounded-[var(--radius-card-inner)] border border-success/20">
              {msg}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4 mb-6">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-11 px-4 bg-bg-elevated border border-border rounded-[var(--radius-input)] text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                  placeholder="Alex Johnson"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-bg-elevated border border-border rounded-[var(--radius-input)] text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                  placeholder="alex@example.com"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 bg-bg-elevated border border-border rounded-[var(--radius-input)] text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-brand text-white rounded-[var(--radius-button)] font-medium flex items-center justify-center gap-2 hover:bg-brand-hover shadow-level-1 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-border" />
            <span className="flex-shrink-0 mx-4 text-text-muted text-sm">Or continue with</span>
            <div className="flex-grow border-t border-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGithubLogin}
              disabled={loading}
              className="flex justify-center items-center h-11 border border-border rounded-[var(--radius-button)] hover:bg-bg-sunken transition-colors gap-2 text-sm font-medium text-text-primary disabled:opacity-50 active:scale-[0.98]"
            >
              <Github className="w-4 h-4" />
              GitHub
            </button>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex justify-center items-center h-11 border border-border rounded-[var(--radius-button)] hover:bg-bg-sunken transition-colors gap-2 text-sm font-medium text-text-primary disabled:opacity-50 active:scale-[0.98]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-text-muted">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); setMsg(''); }}
              className="text-brand font-medium hover:text-brand-hover transition-colors"
            >
              {isSignUp ? 'Log in' : 'Sign up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
