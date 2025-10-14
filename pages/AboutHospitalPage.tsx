import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutHospitalPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <button onClick={() => navigate('/home')} className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 bg-white shadow-sm border border-slate-200 rounded-full py-2 px-4 transition-all hover:bg-slate-50 hover:shadow-md hover:border-slate-300 transform hover:-translate-y-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                بازگشت به صفحه اصلی
            </button>
            <div className="bg-white/60 border border-slate-200 p-8 rounded-2xl shadow-lg mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 drop-shadow-sm">درباره بیمارستان امام رضا (ع)</h1>
                <div className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap space-y-4">
                    <p>
                        بیمارستان امام رضا (ع) به عنوان یکی از مراکز درمانی پیشرو، با بهره‌گیری از کادری مجرب و متخصص و با استفاده از تجهیزات مدرن پزشکی، متعهد به ارائه خدمات درمانی با بالاترین کیفیت به مراجعین محترم می‌باشد.
                    </p>
                    <p>
                        این مرکز درمانی با داشتن بخش‌های تخصصی و فوق تخصصی متعدد، در زمینه‌های مختلف تشخیصی، درمانی و مراقبتی فعالیت می‌کند. چشم‌انداز ما، تبدیل شدن به یک مرکز درمانی الگو در سطح منطقه، با تمرکز بر ایمنی بیمار، رضایت‌مندی مراجعین و بهبود مستمر کیفیت خدمات است.
                    </p>
                    <p>
                        ما بر این باوریم که آموزش به بیمار، بخش جدایی‌ناپذیر فرآیند درمان است. این سامانه آموزشی در راستای توانمندسازی بیماران و خانواده‌های آنان برای مشارکت فعال در مراقبت از سلامت خود طراحی شده است.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutHospitalPage;
