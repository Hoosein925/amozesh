
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import LoginModal from './LoginModal';
import AboutModal from './AboutModal';

const Header: React.FC = () => {
  const { isAdmin, logout } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="bg-violet-700/95 backdrop-blur-xl sticky top-0 z-40 border-b border-violet-600 shadow-lg shadow-violet-900/20">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link to="/home" className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">
            سامانه آموزشی
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/"
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold p-2 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-teal-500/20 flex items-center justify-center border border-teal-400"
              aria-label="بازگشت به صفحه اصلی"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </Link>
            <button
              onClick={() => setIsAboutModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold p-2 sm:px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-orange-500/20 flex items-center gap-2 border border-orange-400"
              aria-label="درباره برنامه"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">درباره</span>
            </button>
            {isAdmin ? (
              <button
                onClick={handleLogout}
                className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-rose-500/20 flex items-center gap-2 border border-rose-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">خروج</span>
              </button>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-sky-500 hover:bg-sky-600 text-white font-semibold p-2 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-sky-500/20 flex items-center justify-center border border-sky-400"
                aria-label="ورود مدیر"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
    </>
  );
};

export default Header;
