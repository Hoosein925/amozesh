import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Disease } from '../types';

// Hardcoded data for "About Hospital" topics. This mimics the 'Disease' structure.
export const aboutHospitalTopics: Disease[] = [
  {
    id: 'introduction',
    name: 'معرفی بیمارستان',
    description: `بیمارستان امام رضا (ع) به عنوان یکی از مراکز درمانی پیشرو، با بهره‌گیری از کادری مجرب و متخصص و با استفاده از تجهیزات مدرن پزشکی، متعهد به ارائه خدمات درمانی با بالاترین کیفیت به مراجعین محترم می‌باشد.
این مرکز درمانی با داشتن بخش‌های تخصصی و فوق تخصصی متعدد، در زمینه‌های مختلف تشخیصی، درمانی و مراقبتی فعالیت می‌کند. چشم‌انداز ما، تبدیل شدن به یک مرکز درمانی الگو در سطح منطقه، با تمرکز بر ایمنی بیمار، رضایت‌مندی مراجعین و بهبود مستمر کیفیت خدمات است.
ما بر این باوریم که آموزش به بیمار، بخش جدایی‌ناپذیر فرآیند درمان است. این سامانه آموزشی در راستای توانمندسازی بیماران و خانواده‌های آنان برای مشارکت فعال در مراقبت از سلامت خود طراحی شده است.`,
    files: [],
  },
  {
    id: 'social-work',
    name: 'واحد مددکاری',
    description: 'واحد مددکاری بیمارستان آماده ارائه خدمات مشاوره‌ای و حمایتی به بیماران و خانواده‌های محترم می‌باشد. این واحد در تلاش است تا با شناسایی مشکلات اجتماعی و اقتصادی بیماران، راهکارهای مناسب را جهت رفع موانع درمانی و بهبود کیفیت زندگی آنان فراهم آورد.',
    files: [],
  },
  {
    id: 'admissions',
    name: 'واحد پذیرش',
    description: 'واحد پذیرش اولین نقطه تماس شما با بیمارستان است. همکاران ما در این واحد آماده ارائه اطلاعات و راهنمایی‌های لازم در خصوص فرآیند تشکیل پرونده، بستری و ترخیص بیماران می‌باشند. لطفاً مدارک شناسایی و بیمه خود را به همراه داشته باشید.',
    files: [],
  }
];

const cardColors = [
  { accent: 'border-sky-500', shadow: 'shadow-sky-500/20', hoverBg: 'hover:bg-sky-50' },
  { accent: 'border-emerald-500', shadow: 'shadow-emerald-500/20', hoverBg: 'hover:bg-emerald-50' },
  { accent: 'border-purple-500', shadow: 'shadow-purple-500/20', hoverBg: 'hover:bg-purple-50' },
];

const AboutHospitalSectionPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <button onClick={() => navigate('/home')} className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 bg-white shadow-sm border border-slate-200 rounded-full py-2 px-4 transition-all hover:bg-slate-50 hover:shadow-md hover:border-slate-300 transform hover:-translate-y-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                بازگشت به همه بخش‌ها
            </button>
            <div className="flex flex-col items-center text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 drop-shadow-sm">درباره بیمارستان</h1>
            </div>

            <div className="space-y-4">
                {aboutHospitalTopics.map((topic, index) => {
                    const color = cardColors[index % cardColors.length];
                    return (
                        <Link
                            key={topic.id}
                            to={`/about-hospital-topic/${topic.id}`}
                            className={`group relative block overflow-hidden bg-white p-6 rounded-2xl shadow-md ${color.shadow} border-r-4 ${color.accent} ${color.hoverBg} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
                        >
                            <div className="relative">
                                <h3 className="text-xl font-semibold text-slate-800 drop-shadow-sm">{topic.name}</h3>
                                <p className="text-slate-600 mt-2 max-w-prose truncate">{topic.description}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default AboutHospitalSectionPage;
