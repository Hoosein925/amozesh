import React, { useState, useEffect, FormEvent, ChangeEvent, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Banner } from '../types';

interface EditBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner: Banner | null;
}

const EditBannerModal: React.FC<EditBannerModalProps> = ({ isOpen, onClose, banner }) => {
  const { updateBanner } = useAppContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (banner) {
      setTitle(banner.title);
      setDescription(banner.description);
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [banner]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (banner && title.trim()) {
      await updateBanner(banner.id, title.trim(), description.trim(), imageFile);
      onClose();
    }
  };
  
  const handleClose = () => {
    setImageFile(null);
    onClose();
  }

  if (!isOpen || !banner) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 z-50 flex justify-center items-center p-4 transition-opacity duration-300" onClick={handleClose}>
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-4 left-4 text-slate-500 hover:text-slate-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-center text-slate-700 mb-6">ویرایش بنر</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="bannerTitle" className="block text-sm font-medium text-slate-600 mb-2 text-right">عنوان بنر</label>
            <input
              id="bannerTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-100/50 border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="bannerDescription" className="block text-sm font-medium text-slate-600 mb-2 text-right">توضیحات</label>
            <textarea
              id="bannerDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-100/50 border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              rows={3}
              required
            />
          </div>
           <div>
            <label htmlFor="banner-edit-upload" className="block text-sm font-medium text-slate-600 mb-2 text-right">تغییر تصویر (اختیاری)</label>
            <label htmlFor="banner-edit-upload" className="w-full cursor-pointer bg-slate-100/50 rounded-lg border-2 border-dashed border-slate-300 hover:border-sky-400 transition-colors p-4 text-center block">
                <span className="text-slate-500">{imageFile ? imageFile.name : 'برای انتخاب تصویر جدید کلیک کنید'}</span>
                <input ref={fileInputRef} id="banner-edit-upload" type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
            </label>
          </div>
          <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-sky-500/30">
            ذخیره تغییرات
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBannerModal;
