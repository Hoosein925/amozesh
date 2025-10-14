import React, { useState, useEffect, FormEvent } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Section } from '../types';

interface EditSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: Section | null;
}

const colorStyles: { [key: string]: { bg: string } } = {
  red: { bg: 'bg-gradient-to-br from-rose-500 to-red-600' },
  orange: { bg: 'bg-gradient-to-br from-amber-500 to-orange-600' },
  yellow: { bg: 'bg-gradient-to-br from-yellow-400 to-amber-500' },
  green: { bg: 'bg-gradient-to-br from-lime-500 to-green-600' },
  emerald: { bg: 'bg-gradient-to-br from-emerald-500 to-teal-600' },
  teal: { bg: 'bg-gradient-to-br from-teal-400 to-cyan-600' },
  cyan: { bg: 'bg-gradient-to-br from-cyan-400 to-sky-600' },
  sky: { bg: 'bg-gradient-to-br from-sky-500 to-blue-600' },
  indigo: { bg: 'bg-gradient-to-br from-indigo-500 to-violet-600' },
  purple: { bg: 'bg-gradient-to-br from-purple-600 to-indigo-700' },
  pink: { bg: 'bg-gradient-to-br from-pink-500 to-rose-500' },
};

const colorOptions = [
    { name: 'قرمز', class: 'red' }, { name: 'نارنجی', class: 'orange' }, { name: 'زرد', class: 'yellow' },
    { name: 'سبز', class: 'green' }, { name: 'زمردی', class: 'emerald' }, { name: 'تیل', class: 'teal' },
    { name: 'فیروزه‌ای', class: 'cyan' }, { name: 'آبی آسمانی', class: 'sky' }, { name: 'نیلی', class: 'indigo' },
    { name: 'بنفش', class: 'purple' }, { name: 'صورتی', class: 'pink' },
];

const EditSectionModal: React.FC<EditSectionModalProps> = ({ isOpen, onClose, section }) => {
  const { updateSection } = useAppContext();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [colorClass, setColorClass] = useState('');

  useEffect(() => {
    if (section) {
      setName(section.name);
      setIcon(section.icon);
      setColorClass(section.colorClass);
    }
  }, [section]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (section && name.trim() && icon.trim()) {
      await updateSection(section.id, name, icon, colorClass);
      onClose();
    }
  };

  if (!isOpen || !section) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 z-50 flex justify-center items-center p-4 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 left-4 text-slate-500 hover:text-slate-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-center text-slate-700 mb-6">ویرایش بخش</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="sectionName" className="block text-sm font-medium text-slate-600 mb-2 text-right">نام بخش</label>
            <input
              id="sectionName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-100/50 border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="sectionIcon" className="block text-sm font-medium text-slate-600 mb-2 text-right">آیکون (اموجی)</label>
            <input
              id="sectionIcon"
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full bg-slate-100/50 border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              required
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-slate-600 mb-2 text-right">رنگ کاشی</label>
            <div className="flex flex-wrap gap-2 justify-end p-2 bg-slate-100/50 rounded-lg">
                {colorOptions.map((color) => (
                    <button
                    key={color.class}
                    type="button"
                    onClick={() => setColorClass(color.class)}
                    className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${colorStyles[color.class]?.bg || ''}`}
                    title={color.name}
                    >
                    {colorClass === color.class && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mx-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                    </button>
                ))}
            </div>
          </div>
          <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-sky-500/30">
            ذخیره تغییرات
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSectionModal;
