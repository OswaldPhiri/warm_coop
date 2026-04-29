import React from 'react';
import { Bird, ShieldCheck, TrendingUp, Zap, ChevronRight } from 'lucide-react';
import chickensHero from '../assets/chickens_hero.png';

const LandingPage = () => {
  const loginWithGoogle = () => {
    let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    if (!apiUrl.endsWith('/api')) {
      apiUrl = `${apiUrl.replace(/\/$/, '')}/api`;
    }
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 font-sans selection:bg-warm-100 selection:text-warm-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-warm-600 p-2 rounded-xl shadow-lg shadow-warm-200">
            <Bird className="text-white" size={24} />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-800">WarmCoop</span>
        </div>
        <button 
          onClick={loginWithGoogle}
          className="bg-white text-slate-600 px-6 py-2.5 rounded-full font-semibold text-sm border border-slate-200 hover:border-warm-200 hover:text-warm-600 transition-all shadow-sm active:scale-95"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <header className="px-6 pt-12 pb-24 md:pt-24 md:pb-40 max-w-7xl mx-auto relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-warm-50/50 rounded-full blur-3xl -z-10" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 bg-warm-100/50 border border-warm-200 text-warm-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in">
              <Zap size={14} className="fill-warm-500" />
              <span>Made for modern poultry farming</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1]">
              Manage your birds, <br />
              <span className="text-warm-600">maximize your profit.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed">
              The all-in-one assistant for small-scale poultry farmers. 
              Track population, mortality, vaccine schedules, and financials in one beautiful interface.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={loginWithGoogle}
                className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-warm-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group"
              >
                Start Farming for Free
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto bg-white text-slate-600 px-8 py-4 rounded-2xl font-bold text-lg border border-slate-200 hover:bg-slate-50 transition-all">
                See How it Works
              </button>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-warm-200/20 rounded-[2.5rem] blur-2xl group-hover:bg-warm-200/30 transition-colors" />
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-warm-200/50 border border-white">
              <img 
                src={chickensHero} 
                alt="Healthy chickens in a modern farm" 
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            
            {/* Floating Badge on Image */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce-subtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Health Index</p>
                  <p className="text-sm font-black text-slate-800">98% Optimal</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Stats Preview (Premium Touch) */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-6xl mx-auto">
          {[
            { icon: Bird, label: "Live Tracking", desc: "Real-time population monitoring and mortality logs.", color: "bg-blue-50 text-blue-600" },
            { icon: ShieldCheck, label: "Health First", desc: "Automated vaccine schedules and health reminders.", color: "bg-emerald-50 text-emerald-600" },
            { icon: TrendingUp, label: "Financial Insights", desc: "Detailed expense and revenue tracking for every batch.", color: "bg-warm-50 text-warm-600" }
          ].map((feature, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`${feature.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>
                <feature.icon size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.label}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </header>

      {/* Trust Quote */}
      <section className="bg-slate-900 py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">"WarmCoop changed how we view our farm's performance in just weeks."</h2>
            <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-warm-500 border-2 border-white/20" />
                <div className="text-left">
                    <p className="text-white font-bold">Oswald Phiri</p>
                    <p className="text-slate-400 text-sm">Owner, Phiri Poultry Farm</p>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} WarmCoop. Empowering poultry farmers worldwide.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
