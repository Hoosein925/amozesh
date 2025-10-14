import React from 'react';

const PlayIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
);

const TelegramIcon: React.FC = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15.91L18.22 18.2c-.27.68-1.13.83-1.74.37l-4.1-3.32-1.93 1.84c-.22.21-.42.41-.81.41z"/>
    </svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="py-6 px-4 sm:px-8 relative z-10 text-slate-600">
      <div className="container mx-auto border-t border-slate-300/70 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-center sm:text-right">
          <p>سامانه آموزش به بیمار. تمامی حقوق محفوظ است. © 1404</p>
          <p className="mt-1">طراحی و توسعه توسط حسین نصاری</p>
        </div>
        <div className="flex items-center gap-4">
          <a 
            href="https://www.aparat.com/Amazing.Nurse" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-slate-500 hover:text-red-600 transition-colors" 
            aria-label="ویدیوهای آپارات"
          >
            <PlayIcon />
          </a>
          <a 
            href="https://t.me/ho3in925" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-slate-500 hover:text-sky-600 transition-colors" 
            aria-label="کانال تلگرام"
          >
            <TelegramIcon />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;