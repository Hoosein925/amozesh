import React, { useState, useEffect } from 'react';
import type { Banner } from '../types';

interface NewsBannersProps {
    banners: Banner[];
}

const NewsBanners: React.FC<NewsBannersProps> = ({ banners }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Effect to auto-play the slideshow
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
        <div className="w-full max-w-7xl mx-auto h-64 md:h-80 relative mb-10 group">
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-slate-500/20">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 right-0 p-6 text-white w-full">
                        <h3 className="text-xl md:text-2xl font-bold drop-shadow-lg">{currentBanner.title}</h3>
                        <p className="mt-2 text-sm md:text-base drop-shadow-md">{currentBanner.description}</p>
                    </div>
                </div>
            </div>

            {banners.length > 1 && (
                <>
                    {/* Left Arrow */}
                    <button onClick={goToPrevious} className="absolute top-1/2 -translate-y-1/2 left-4 z-10 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white transition-all opacity-0 group-hover:opacity-100" aria-label="بنر قبلی">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    {/* Right Arrow */}
                    <button onClick={goToNext} className="absolute top-1/2 -translate-y-1/2 right-4 z-10 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white transition-all opacity-0 group-hover:opacity-100" aria-label="بنر بعدی">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    );
};

export default NewsBanners;