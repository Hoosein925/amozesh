
import React, { useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { AppContextProvider, useAppContext } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SectionPage from './pages/SectionPage';
import DiseasePage from './pages/DiseasePage';
import WelcomePage from './pages/WelcomePage';
import BannerManagementPage from './pages/BannerManagementPage';

const MainLayout: React.FC = () => {
    const { isLoading } = useAppContext();
    
    // The loading spinner is handled inside the context provider now,
    // so we don't need to check for isLoading here. The children won't render until it's false.
    return (
        <div className="min-h-screen text-slate-800 relative flex flex-col">
            <Header />
            <main className="p-4 sm:p-6 md:p-8 relative z-10 flex-grow">
            <div className="container mx-auto content-container-bg rounded-2xl shadow-xl border border-indigo-300/60 p-6 sm:p-8 h-full">
                <Outlet />
            </div>
            </main>
            <Footer />
        </div>
    );
};

const AppRoutes: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            if (location.pathname !== '/') {
                navigate('/', { replace: true });
            }
        }
    }, [location.pathname, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route element={<MainLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/section/:sectionId" element={<SectionPage />} />
            <Route path="/disease/:sectionId/:diseaseId" element={<DiseasePage />} />
            <Route path="/admin/banners" element={<BannerManagementPage />} />
          </Route>
        </Routes>
    );
};


const App: React.FC = () => {
  return (
    <AppContextProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppContextProvider>
  );
};

export default App;