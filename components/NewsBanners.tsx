
import React, { useState, useEffect } from 'react';
import type { Banner } from '../types';

interface NewsBannersProps {
    banners: Banner[];
}

const NewsBanners: React.FC<NewsBannersProps> = ({ banners }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (banners.length <= 1) return;

        const timer = setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 5000);

        return () => clearTimeout(timer);
    }, [currentIndex, banners.length]);
    
    const goToPrevious = () => {
        setCurrentIndex(prevIndex => (prevIndex - 1 + banners.length) % banners.length);
    };

    const goToNext = () => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % banners.length);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    if (banners.length === 0) {
        return null;
    }

    const currentBanner = banners[currentIndex];

    return (
        <div className="w-full max-w-7xl mx-auto mb-10">
            <div className="rounded-2xl shadow-2xl shadow-slate-500/20 overflow-hidden bg-white/60 border border-slate-200">
                <div className="w-full aspect-[2/1] md:aspect-[3/1] relative group">
                    <div
                        key={currentBanner.id} // This key is crucial to force re-render and re-trigger animation
                        className="w-full h-full relative animate-fade-in"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        <img 
                            src={currentBanner.imageUrl} 
                            alt={currentBanner.title} 
                            className="w-full h-full object-cover" 
                        />
                    </div>

                    {banners.length > 1 && (
                        <>
                            {/* Left Arrow */}
                            <button onClick={goToPrevious} className="absolute top-1/2 -translate-y-1/2 left-4 z-10 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white transition-all opacity-0 group-hover:opacity-100" aria-label="بنر قبلی">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="http://www.w3.org/2000/svg" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            {/* Right Arrow */}
                            <button onClick={goToNext} className="absolute top-1/2 -translate-y-1/2 right-4 z-10 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white transition-all opacity-0 group-hover:opacity-100" aria-label="بنر بعدی">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="http://www.w3.org/2000/svg" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            {/* Dots */}
                            <div className="absolute bottom-4 right-0 left-0">
                                <div className="flex items-center justify-center gap-2">
                                    {banners.map((_, slideIndex) => (
                                        <button
                                            key={slideIndex}
                                            onClick={() => goToSlide(slideIndex)}
                                            className={`transition-all w-2 h-2 rounded-full ${currentIndex === slideIndex ? 'p-1.5 bg-white' : 'bg-white/50'}`}
                                            aria-label={`رفتن به بنر ${slideIndex + 1}`}
                                        ></button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="p-4 text-center">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">{currentBanner.title}</h3>
                    <p className="text-sm md:text-base text-slate-700">{currentBanner.description}</p>
                </div>
            </div>
        </div>
    );
};

export default NewsBanners;
