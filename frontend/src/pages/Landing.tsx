import { motion } from 'framer-motion';
import { TrendingUp, Zap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LandingSections } from '../components/landing/LandingSections';

const Spline = lazy(() => import('@splinetool/react-spline'));

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen selection:bg-brand-primary selection:text-white overflow-hidden font-label">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-white/40 backdrop-blur-md border-b border-white/50 shadow-sm">
        <div className="flex items-center cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <img src="/icons/synalytix-logo.svg" alt="Synalytix" className="h-10 w-auto" />
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/app')}
            className="text-slate-600 hover:text-brand-primary text-sm font-medium tracking-wide transition-colors"
          >
            LOGIN
          </button>
          <button
            onClick={() => navigate('/app')}
            className="px-6 py-2.5 bg-brand-primary text-white text-sm font-medium tracking-wide rounded-xl hover:bg-brand-primary/90 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-brand-primary/25"
          >
            START NOW
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="w-full h-[calc(100vh-2rem)] pt-32 pb-16 px-6 sm:px-12 flex items-center justify-center">
        <div className="w-full h-full max-w-[100rem] mx-auto relative rounded-[3rem] overflow-hidden shadow-2xl shadow-brand-primary/5 border border-white/60 bg-white/30 backdrop-blur-2xl">
          {/* Symmetrical negative inset to push the watermark out of bounds while keeping the 3D scene centered */}
          <div className="absolute -inset-24 z-10 pointer-events-auto">
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center h-full w-full bg-transparent">
                <div className="w-16 h-16 mb-4 rounded-2xl bg-white/50 flex items-center justify-center border border-white/50 shadow-inner">
                  <div className="w-8 h-8 rounded-full border-4 border-dashed border-brand-primary/50 animate-[spin_3s_linear_infinite]"></div>
                </div>
              </div>
            }>
              <Spline scene="https://prod.spline.design/t1kz57-eOEyxt8UN/scene.splinecode" className="w-full h-full" />
            </Suspense>
          </div>
        </div>
      </main>

      <LandingSections />
    </div>
  );
}
