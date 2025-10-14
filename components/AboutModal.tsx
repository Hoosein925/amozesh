import React from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 z-50 flex justify-center items-center p-4 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 left-4 text-slate-500 hover:text-slate-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">درباره سامانه آموزشی بیمارستان امام رضا (ع)</h2>
        </div>
        <div className="text-right text-slate-600 space-y-4 leading-relaxed">
            <p>
                این سامانه یک برنامه برای ارائه مطالب آموزشی به بیماران و مددجویان است.
            </p>
            <p>
                اطلاعات بر اساس بخش‌های مختلف پزشکی و بیماری‌های خاص دسته‌بندی شده‌اند. کاربران می‌توانند به راحتی در میان بخش‌ها و بیماری‌ها جستجو کرده و به اطلاعات لازم دست پیدا کنند و فایل‌های آموزشی مرتبط را مشاهده و دانلود کنند.
            </p>
            <div className="pt-4 mt-4 border-t border-slate-200 text-center text-sm">
                <p>تاریخ ساخت: مهرماه 1404</p>
                <p className="mt-1">سازنده: حسین نصاری</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;