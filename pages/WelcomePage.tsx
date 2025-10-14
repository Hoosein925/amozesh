import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PlayIcon: React.FC = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
);

const TelegramIcon: React.FC = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15.91L18.22 18.2c-.27.68-1.13.83-1.74.37l-4.1-3.32-1.93 1.84c-.22.21-.42.41-.81.41z"/>
    </svg>
);

const HeartIcon: React.FC = () => (
    <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20">
        <div className="w-20 h-20 text-red-500 animate-beat drop-shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
        </div>
    </div>
);

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        
        const rotateX = (y / height - 0.5) * -15;
        const rotateY = (x / width - 0.5) * 15;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    };

    const handleMouseLeave = () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
    };
}, []);


  return (
    <div className="min-h-screen flex items-center justify-center p-4 perspective-1000">
      <div 
        ref={cardRef}
        className="welcome-card relative w-full max-w-lg md:max-w-3xl text-center content-container-bg rounded-2xl shadow-2xl shadow-violet-500/30 border border-violet-300/80 pt-24 pb-16 px-8 sm:pt-28 sm:pb-20 sm:px-12 transition-transform duration-300 ease-out"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <HeartIcon />
        <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 drop-shadow-md mb-3">
                بسم اللَّهِ الرحمن الرحیم
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-slate-700 drop-shadow-sm mb-6">
                به سامانه آموزشی بیمارستان <span className="whitespace-nowrap">امام رضا (ع)</span> خوش آمدید
            </p>
            <p className="text-base text-slate-600 mb-12">
                سازنده: حسین نصاری
            </p>
            <button
              onClick={() => navigate('/home')}
              className="w-64 bg-gradient-to-br from-sky-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-sky-500/50 shadow-lg shadow-sky-500/30 text-xl border-2 border-transparent hover:border-sky-200"
              aria-label="ورود به سامانه"
            >
              ورود
            </button>
            <div className="flex justify-center items-center gap-6 mt-10">
                <a 
                    href="https://www.aparat.com/Amazing.Nurse" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-400 text-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-red-500/40" 
                    aria-label="ویدیوهای آپارات"
                >
                   <PlayIcon />
                </a>
                <a 
                    href="https://t.me/ho3in925" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 text-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-sky-500/40" 
                    aria-label="کانال تلگرام"
                >
                   <TelegramIcon />
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;