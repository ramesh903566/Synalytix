import { motion } from 'motion/react';
import { Sparkles, CheckCircle, ArrowRight, Star, ChevronDown, Share2, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { staggerChildren: 0.1 }
};

export function LandingSections() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="w-full bg-white relative z-10 overflow-hidden">
      
      {/* 3. Trusted By */}
      <section className="py-24 border-b border-zinc-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <p className="text-center text-sm font-medium tracking-widest text-slate-400 uppercase mb-10">Trusted by creators and teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-12 sm:gap-24 opacity-40 grayscale">
             {/* Mock company logos */}
             <div className="text-xl font-bold font-display text-slate-800">Acme Corp</div>
             <div className="text-xl font-bold font-display text-slate-800">Quantum</div>
             <div className="text-xl font-bold font-display text-slate-800">Globalize</div>
             <div className="text-xl font-bold font-display text-slate-800">Vercel</div>
             <div className="text-xl font-bold font-display text-slate-800">Stripe</div>
          </div>
        </div>
      </section>

      {/* 4. Problem & 5. Solution */}
      <section className="py-40 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/5 text-brand-primary text-xs font-semibold uppercase tracking-widest mb-8">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span> The Problem
            </div>
            <h2 className="text-4xl sm:text-5xl font-display text-slate-900 leading-tight mb-6">
              You are wasting hours jumping between applications.
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed mb-8">
              Managing content across X, LinkedIn, Instagram, and GitHub means fragmented analytics, manual cross-posting, and lost audience context. It&apos;s impossible to scale your presence when your tools are disconnected.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/10 to-brand-secondary/10 blur-3xl rounded-full opacity-60"></div>
            <div className="relative p-10 rounded-[2rem] bg-white/70 backdrop-blur-xl border border-white/60 shadow-2xl shadow-brand-primary/5">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-secondary/10 text-brand-secondary text-xs font-semibold uppercase tracking-widest mb-8">
                 <Sparkles className="w-3 h-3" /> The Solution
               </div>
               <h3 className="text-2xl font-display mb-6 text-slate-800">One Unified Command Center.</h3>
               <ul className="space-y-5">
                 {[
                   'Plan visually and schedule posts across all channels.',
                   'Use smart queues and recommended posting times.',
                   'Track GitHub contributions and LeetCode stats automatically.',
                   'Understand exactly what content drives real growth.'
                 ].map((text, i) => (
                   <li key={i} className="flex items-start gap-4">
                     <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                       <CheckCircle className="w-4 h-4 text-brand-primary" />
                     </div>
                     <span className="text-slate-600 font-medium">{text}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. Features */}
      <section className="py-40 bg-brand-bg border-y border-brand-primary/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl sm:text-5xl font-display text-slate-900 mb-6">Everything you need to grow faster.</h2>
            <p className="text-lg text-slate-500">Powerful features designed to automate the heavy lifting so you can focus on creating high-quality content.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer} 
            initial="initial" 
            whileInView="whileInView" 
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {/* Feature 1 */}
            <motion.div variants={fadeUp} className="p-10 bg-white/60 backdrop-blur-sm rounded-[2.5rem] flex flex-col shadow-xl shadow-brand-primary/5 hover:-translate-y-1 transition-all duration-300 border border-white">
              <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-8">
                <Share2 className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="font-display text-2xl tracking-wide mb-4 text-slate-800">Visual Calendar & Publisher</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Schedule the same post to multiple platforms like X, LinkedIn, and Instagram, customizing captions and times for each one.</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={fadeUp} className="p-10 bg-white/60 backdrop-blur-sm rounded-[2.5rem] flex flex-col shadow-xl shadow-brand-primary/5 hover:-translate-y-1 transition-all duration-300 border border-white">
              <div className="w-14 h-14 rounded-2xl bg-brand-secondary/10 flex items-center justify-center mb-8">
                <Sparkles className="w-6 h-6 text-brand-secondary" />
              </div>
              <h3 className="font-display text-2xl tracking-wide mb-4 text-slate-800">AI Studio & Tech Stats</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Let AI tailor your content for each platform, while automatically tracking your GitHub commits and LeetCode activity.</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={fadeUp} className="p-10 bg-white/60 backdrop-blur-sm rounded-[2.5rem] flex flex-col shadow-xl shadow-brand-primary/5 hover:-translate-y-1 transition-all duration-300 border border-white">
              <div className="w-14 h-14 rounded-2xl bg-brand-tertiary/10 flex items-center justify-center mb-8">
                <BarChart3 className="w-6 h-6 text-brand-tertiary" />
              </div>
              <h3 className="font-display text-2xl tracking-wide mb-4 text-slate-800">Smart Queue & Analytics</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Get proactive insights and recommended posting times to ensure your content reaches your audience when they're most active.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 7. Product Demo */}
      <section className="py-40 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 text-center">
          <motion.div {...fadeUp} className="mb-20">
            <h2 className="text-4xl sm:text-5xl font-display text-slate-900 mb-6">See it in action.</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">A beautifully designed interface that makes managing your digital footprint feel effortless.</p>
          </motion.div>

          <motion.div {...fadeUp} className="relative mx-auto max-w-6xl rounded-t-[3rem] overflow-hidden shadow-2xl shadow-brand-primary/10 border border-slate-100 bg-white/50 backdrop-blur-xl pt-8 px-8">
             <div className="w-full flex items-center gap-3 mb-6">
               <div className="w-3 h-3 rounded-full bg-slate-200"></div>
               <div className="w-3 h-3 rounded-full bg-slate-200"></div>
               <div className="w-3 h-3 rounded-full bg-slate-200"></div>
             </div>
             <div className="w-full aspect-[16/9] bg-slate-50 rounded-t-2xl border-t border-x border-slate-200 flex items-center justify-center relative overflow-hidden">
                <video 
                  src="/icons/Synalytixvedio.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover"
                />
             </div>
          </motion.div>
        </div>
      </section>

      {/* 8. Benefits */}
      <section className="py-40 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-slate-900 to-brand-secondary/20"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
          <div className="grid md:grid-cols-3 gap-16 text-center">
             <motion.div {...fadeUp} className="flex flex-col items-center">
               <div className="text-6xl font-display text-white mb-6">10h+</div>
               <h4 className="text-xl font-medium mb-3 text-slate-100">Saved Weekly</h4>
               <p className="text-slate-400 text-sm">Automate cross-posting with a visual calendar and smart scheduling.</p>
             </motion.div>
             <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="flex flex-col items-center">
               <div className="text-6xl font-display text-white mb-6">3x</div>
               <h4 className="text-xl font-medium mb-3 text-slate-100">Faster Growth</h4>
               <p className="text-slate-400 text-sm">Make data-driven decisions on what content works.</p>
             </motion.div>
             <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="flex flex-col items-center">
               <div className="text-6xl font-display text-white mb-6">100%</div>
               <h4 className="text-xl font-medium mb-3 text-slate-100">Platform Visibility</h4>
               <p className="text-slate-400 text-sm">Never miss an important metric or engagement opportunity.</p>
             </motion.div>
          </div>
        </div>
      </section>

      {/* 9. Testimonials */}
      <section className="py-40 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <motion.div {...fadeUp} className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-display text-slate-900 mb-6">Loved by creators.</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { name: "Alex Chen", role: "DevRel Engineer", text: "Synalytix replaced four different tools for me. Being able to track my GitHub commits alongside my Twitter growth is insane." },
              { name: "Sarah Jenkins", role: "Content Creator", text: "The AI Studio is magic. It perfectly formats my LinkedIn posts based on my short-form video captions. A massive time saver." },
              { name: "David Kim", role: "Indie Hacker", text: "Finally, a dashboard that understands developers are creators too. Tracking LeetCode and product launches in one place." }
            ].map((t, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="bg-white/60 backdrop-blur-sm p-10 rounded-[2.5rem] shadow-xl shadow-brand-primary/5 border border-white">
                <div className="flex gap-1 mb-8">
                  {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-brand-secondary text-brand-secondary" />)}
                </div>
                <p className="text-slate-600 mb-10 leading-relaxed font-medium">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                   <div>
                     <h4 className="font-bold text-sm text-slate-900">{t.name}</h4>
                     <span className="text-xs text-slate-500">{t.role}</span>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* 11. FAQ */}
      <section className="py-40 bg-white">
        <div className="max-w-3xl mx-auto px-6 sm:px-12">
          <motion.div {...fadeUp} className="text-center mb-20">
            <h2 className="text-4xl font-display text-slate-900">Frequently Asked Questions</h2>
          </motion.div>
          <div className="space-y-4">
            {[
              { q: "Can I schedule posts for multiple channels at once?", a: "Yes! You can create one post, select multiple channels, and customize the caption and time for each platform before scheduling." },
              { q: "How do recommended posting times work?", a: "Synalytix analyzes your audience's engagement patterns and suggests the best times to post for maximum visibility." },
              { q: "Can I track developer stats alongside my social growth?", a: "Yes, Synalytix automatically tracks your GitHub contributions and LeetCode activity in the same unified dashboard." }
            ].map((faq, i) => (
              <div key={i} className="bg-brand-bg/50 border border-brand-primary/10 rounded-2xl overflow-hidden transition-all hover:border-brand-primary/20">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-8 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-semibold text-slate-900">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-brand-primary transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-8 pb-8 text-slate-500 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Final CTA */}
      <section className="py-40 relative overflow-hidden bg-brand-primary">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)]"></div>
        <div className="max-w-4xl mx-auto px-6 sm:px-12 relative z-10 text-center">
           <h2 className="text-5xl sm:text-6xl font-display text-white mb-8">Ready to grow your digital presence?</h2>
           <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">Join thousands of creators and developers who use Synalytix to save time and scale their audience.</p>
           <button onClick={() => navigate('/app')} className="px-10 py-4 rounded-2xl bg-white text-brand-primary font-bold tracking-wide hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/20 transition-all flex items-center gap-3 mx-auto">
             Get Started for Free <ArrowRight className="w-5 h-5" />
           </button>
        </div>
      </section>

      {/* 13. Footer */}
      <footer className="py-12 bg-slate-950 text-slate-400 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center rounded-2xl overflow-hidden opacity-90 hover:opacity-100 transition-opacity">
              <img src="/icons/synalytix-icon.svg" alt="Synalytix" className="h-8 w-auto" />
           </div>
           <div className="flex gap-6 text-sm">
             <button className="hover:text-white transition-colors">Terms</button>
             <button className="hover:text-white transition-colors">Privacy</button>
             <button className="hover:text-white transition-colors">Contact</button>
           </div>
           <div className="text-sm">
             © 2026 Synalytix. All rights reserved.
           </div>
        </div>
      </footer>

    </div>
  );
}
