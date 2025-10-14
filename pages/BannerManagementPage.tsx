import React, { useState, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import type { Banner } from '../types';
import EditBannerModal from '../components/EditBannerModal';

const BannerManagementPage: React.FC = () => {
    const { banners, addBanner, deleteBanner } = useAppContext();
    const navigate = useNavigate();
    
    const [newBannerFile, setNewBannerFile] = useState<File | null>(null);
    const [newBannerTitle, setNewBannerTitle] = useState('');
    const [newBannerDescription, setNewBannerDescription] = useState('');
    const [bannerFormError, setBannerFormError] = useState('');
    const bannerFileInputRef = useRef<HTMLInputElement>(null);

    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

    const handleBannerFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          setNewBannerFile(e.target.files[0]);
          setBannerFormError('');
        }
      };
    
    const handleAddBanner = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBannerFile) {
          setBannerFormError('لطفاً یک تصویر برای بنر انتخاب کنید.');
          return;
        }
        if (newBannerTitle.trim() && newBannerDescription.trim()) {
          await addBanner(newBannerFile, newBannerTitle.trim(), newBannerDescription.trim());
          setNewBannerFile(null);
          setNewBannerTitle('');
          setNewBannerDescription('');
          setBannerFormError('');
          if (bannerFileInputRef.current) {
            bannerFileInputRef.current.value = '';
          }
        }
    };

    const handleDeleteBanner = async (bannerId: string) => {
        if (window.confirm('آیا از حذف این بنر اطمینان دارید؟')) {
            await deleteBanner(bannerId);
        }
    };

    return (
        <div>
            <button onClick={() => navigate('/home')} className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 bg-white shadow-sm border border-slate-200 rounded-full py-2 px-4 transition-all hover:bg-slate-50 hover:shadow-md hover:border-slate-300 transform hover:-translate-y-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                بازگشت به صفحه اصلی
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 drop-shadow-sm mb-10">مدیریت بنرهای خبری</h1>

            <div className="bg-white/50 p-6 rounded-2xl shadow-lg border border-slate-200 mb-10">
                <h2 className="text-xl font-semibold mb-4 text-emerald-700">اضافه کردن بنر جدید</h2>
                <form onSubmit={handleAddBanner} className="space-y-4">
                    <div>
                        <label htmlFor="banner-upload" className="w-full cursor-pointer bg-slate-100/50 rounded-lg border-2 border-dashed border-slate-300 hover:border-emerald-400 transition-colors p-4 text-center block">
                            <span className="text-slate-500">{newBannerFile ? newBannerFile.name : 'برای انتخاب تصویر بنر کلیک کنید'}</span>
                            <input ref={bannerFileInputRef} id="banner-upload" type="file" onChange={handleBannerFileChange} accept="image/*" className="hidden" />
                        </label>
                    </div>
                    <input
                        type="text"
                        value={newBannerTitle}
                        onChange={(e) => setNewBannerTitle(e.target.value)}
                        placeholder="عنوان بنر"
                        className="w-full bg-white/80 border border-slate-300 rounded-lg p-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        required
                    />
                    <textarea
                        value={newBannerDescription}
                        onChange={(e) => setNewBannerDescription(e.target.value)}
                        placeholder="توضیحات مختصر بنر"
                        rows={2}
                        className="w-full bg-white/80 border border-slate-300 rounded-lg p-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        required
                    />
                    {bannerFormError && <p className="text-red-500 text-sm text-center">{bannerFormError}</p>}
                    <button type="submit" className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/30 disabled:bg-slate-400 disabled:shadow-none disabled:cursor-not-allowed disabled:scale-100" disabled={!newBannerFile}>
                        افزودن بنر
                    </button>
                </form>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">بنرهای موجود</h2>
                {banners.length > 0 ? (
                    <div className="space-y-4">
                        {banners.map(banner => (
                           <div key={banner.id} className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl shadow-md border border-slate-200">
                                <img src={banner.imageUrl} alt={banner.title} className="w-full sm:w-48 h-24 sm:h-auto object-cover rounded-lg" />
                                <div className="flex-grow text-right">
                                    <h3 className="font-bold text-slate-800">{banner.title}</h3>
                                    <p className="text-slate-600 text-sm mt-1">{banner.description}</p>
                                </div>
                                <div className="flex-shrink-0 flex gap-2 self-start sm:self-center">
                                    <button onClick={() => setEditingBanner(banner)} className="p-2 rounded-full bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-600 transition-colors" aria-label="ویرایش بنر">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <button onClick={() => handleDeleteBanner(banner.id)} className="p-2 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 transition-colors" aria-label="حذف بنر">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                           </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white/50 rounded-2xl shadow-md border border-slate-200">
                        <p className="text-slate-500">هیچ بنری برای نمایش وجود ندارد.</p>
                    </div>
                )}
            </div>

            <EditBannerModal 
                isOpen={!!editingBanner}
                onClose={() => setEditingBanner(null)}
                banner={editingBanner}
            />
        </div>
    );
};

export default BannerManagementPage;
