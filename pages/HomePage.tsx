
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import EditSectionModal from '../components/EditSectionModal';
import NewsBanners from '../components/NewsBanners';
import type { Section } from '../types';

const colorStyles: { [key: string]: { bg: string; shadow: string; accent?: string; hoverBg?: string } } = {
  red: { bg: 'bg-gradient-to-br from-rose-500 to-red-600', shadow: 'shadow-2xl shadow-rose-600/30', accent: 'border-rose-500', hoverBg: 'hover:bg-rose-50' },
  orange: { bg: 'bg-gradient-to-br from-amber-500 to-orange-600', shadow: 'shadow-2xl shadow-amber-600/30', accent: 'border-amber-500', hoverBg: 'hover:bg-amber-50' },
  yellow: { bg: 'bg-gradient-to-br from-yellow-400 to-amber-500', shadow: 'shadow-2xl shadow-yellow-500/30' },
  green: { bg: 'bg-gradient-to-br from-lime-500 to-green-600', shadow: 'shadow-2xl shadow-lime-600/30' },
  emerald: { bg: 'bg-gradient-to-br from-emerald-500 to-teal-600', shadow: 'shadow-2xl shadow-emerald-600/30', accent: 'border-emerald-500', hoverBg: 'hover:bg-emerald-50' },
  teal: { bg: 'bg-gradient-to-br from-teal-400 to-cyan-600', shadow: 'shadow-2xl shadow-teal-500/30' },
  cyan: { bg: 'bg-gradient-to-br from-cyan-400 to-sky-600', shadow: 'shadow-2xl shadow-cyan-500/30' },
  sky: { bg: 'bg-gradient-to-br from-sky-500 to-blue-600', shadow: 'shadow-2xl shadow-sky-600/30', accent: 'border-sky-500', hoverBg: 'hover:bg-sky-50' },
  indigo: { bg: 'bg-gradient-to-br from-indigo-500 to-violet-600', shadow: 'shadow-2xl shadow-indigo-600/30', accent: 'border-indigo-500', hoverBg: 'hover:bg-indigo-50' },
  purple: { bg: 'bg-gradient-to-br from-purple-600 to-indigo-700', shadow: 'shadow-2xl shadow-purple-700/30', accent: 'border-purple-500', hoverBg: 'hover:bg-purple-50' },
  pink: { bg: 'bg-gradient-to-br from-pink-500 to-rose-500', shadow: 'shadow-2xl shadow-pink-500/30' },
  default: { bg: 'bg-gradient-to-br from-slate-500 to-slate-600', shadow: 'shadow-2xl shadow-slate-600/30' },
};

const colorOptions = [
    { name: 'قرمز', class: 'red' }, { name: 'نارنجی', class: 'orange' }, { name: 'زرد', class: 'yellow' },
    { name: 'سبز', class: 'green' }, { name: 'زمردی', class: 'emerald' }, { name: 'تیل', class: 'teal' },
    { name: 'فیروزه‌ای', class: 'cyan' }, { name: 'آبی آسمانی', class: 'sky' }, { name: 'نیلی', class: 'indigo' },
    { name: 'بنفش', class: 'purple' }, { name: 'صورتی', class: 'pink' },
];

interface SearchResult {
  sectionId: string;
  sectionName: string;
  diseaseId: string;
  diseaseName: string;
  contextSnippet: React.ReactNode;
}

const cardColors = [
    colorStyles.sky, colorStyles.emerald, colorStyles.purple, colorStyles.red, colorStyles.orange, colorStyles.indigo
];


const HomePage: React.FC = () => {
  const { sections, isAdmin, addSection, deleteSection, banners } = useAppContext();
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionIcon, setNewSectionIcon] = useState('📁');
  const [newSectionColor, setNewSectionColor] = useState('sky');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);


  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setSearchResults([]);
      return;
    }

    const allResults: SearchResult[] = [];
    sections.forEach(section => {
      section.diseases.forEach(disease => {
        const diseaseNameMatch = disease.name.toLowerCase().includes(query);
        const descriptionMatch = disease.description.toLowerCase().includes(query);

        if (diseaseNameMatch || descriptionMatch) {
            let context = '';
            if (diseaseNameMatch && descriptionMatch) {
                context = 'مطابقت در عنوان و توضیحات';
            } else if (diseaseNameMatch) {
                context = 'مطابقت در عنوان';
            } else {
                context = 'مطابقت در توضیحات';
            }

          allResults.push({
            sectionId: section.id,
            sectionName: section.name,
            diseaseId: disease.id,
            diseaseName: disease.name,
            contextSnippet: <span className="text-sm text-slate-500 italic">{context}</span>
          });
        }
      });
    });

    setSearchResults(allResults);
  }, [searchQuery, sections]);


  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSectionName.trim()) {
      await addSection(newSectionName.trim(), newSectionIcon, newSectionColor);
      setNewSectionName('');
      setNewSectionIcon('📁');
      setNewSectionColor('sky');
    }
  };
  
  const handleDeleteSection = async (e: React.MouseEvent, sectionId: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm('آیا از حذف این بخش اطمینان دارید؟ تمام بیماری‌های آن نیز حذف خواهند شد.')) {
        await deleteSection(sectionId);
    }
  };

  const handleEditSection = (e: React.MouseEvent, section: Section) => {
      e.stopPropagation();
      e.preventDefault();
      setEditingSection(section);
  };

  return (
    <div>
      <NewsBanners banners={banners} />

      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center sm:text-right text-slate-800 drop-shadow-sm">
            {searchQuery ? `نتایج جستجو برای: "${searchQuery}"` : "بخش مورد نظر را انتخاب کنید"}
        </h1>
        <div className="relative w-full sm:w-auto">
            <input
            type="text"
            placeholder="جستجوی بخش یا بیماری..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-72 bg-white/80 border border-slate-300 rounded-lg p-3 pl-10 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
        </div>
      </div>
      
      {isAdmin && (
        <div className="space-y-6 mb-12">
            <div className="bg-white/50 p-6 rounded-2xl shadow-lg border border-slate-200">
                <h2 className="text-xl font-semibold mb-4 text-violet-700">پنل مدیریت</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        to="/admin/banners"
                        className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                        </svg>
                        <span>مدیریت بنرهای خبری</span>
                    </Link>
                </div>
            </div>
            <div className="bg-white/50 p-6 rounded-2xl shadow-lg border border-slate-200">
                <h2 className="text-xl font-semibold mb-4 text-sky-700">اضافه کردن بخش جدید</h2>
                <form onSubmit={handleAddSection} className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <input
                            type="text"
                            value={newSectionName}
                            onChange={(e) => setNewSectionName(e.target.value)}
                            placeholder="نام بخش جدید"
                            className="flex-grow w-full bg-white/80 border border-slate-300 rounded-lg p-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                            required
                        />
                        <input
                            type="text"
                            value={newSectionIcon}
                            onChange={(e) => setNewSectionIcon(e.target.value)}
                            placeholder="آیکون (اموجی)"
                            className="w-full sm:w-24 bg-white/80 border border-slate-300 rounded-lg p-3 text-center text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2 text-right">رنگ کاشی</label>
                        <div className="flex flex-wrap gap-2 justify-end p-2 bg-white/50 rounded-lg">
                            {colorOptions.map((color) => (
                                <button
                                key={color.class}
                                type="button"
                                onClick={() => setNewSectionColor(color.class)}
                                className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${colorStyles[color.class].bg}`}
                                title={color.name}
                                >
                                {newSectionColor === color.class && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white mx-auto" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-sky-500/30">
                        افزودن
                    </button>
                </form>
            </div>
        </div>
      )}

    {searchQuery.trim() ? (
        <div className="space-y-4">
            {searchResults.length > 0 ? (
                searchResults.map((result, index) => {
                    const color = cardColors[index % cardColors.length];
                    return (
                        <Link
                            key={`${result.sectionId}-${result.diseaseId}`}
                            to={`/disease/${result.sectionId}/${result.diseaseId}?q=${encodeURIComponent(searchQuery)}`}
                            className={`group block bg-white p-5 rounded-2xl shadow-md ${color.shadow} border-r-4 ${color.accent} ${color.hoverBg} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
                        >
                            <h3 className="text-lg font-semibold text-slate-800">{result.diseaseName}</h3>
                            <p className="text-sm text-slate-600">در بخش: {result.sectionName}</p>
                            <div className="mt-2 text-sm">{result.contextSnippet}</div>
                        </Link>
                    )
                })
            ) : (
                <div className="text-center py-10 bg-white/50 rounded-2xl shadow-md border border-slate-200">
                    <p className="text-slate-500">موردی متناسب با جستجوی شما یافت نشد.</p>
                </div>
            )}
        </div>
      ) : (
        sections.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 perspective-1000">
                <Link
                    to="/about-hospital-section"
                    className={`group relative block overflow-hidden rounded-2xl text-right ${colorStyles.emerald.shadow} ${colorStyles.emerald.bg} transition-all duration-500 transform-style-3d hover:!shadow-none hover:scale-110 hover:-rotate-y-6 hover:rotate-x-4`}
                >
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-br-full opacity-80 transform -translate-x-4 -translate-y-4 transition-transform duration-500 group-hover:scale-[2.5]"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/10 rounded-tl-full opacity-80 transform translate-x-4 translate-y-4 transition-transform duration-500 group-hover:scale-[2.5]"></div>
    
                    <div className="relative z-10 p-5 flex flex-col justify-end min-h-[160px]">
                        <h3 className="text-2xl font-bold text-white drop-shadow-md mt-auto">درباره بیمارستان</h3>
                    </div>
                </Link>
                {sections.map((section) => {
                    const style = colorStyles[section.colorClass] || colorStyles.default;
                return (
                    <Link
                    key={section.id}
                    to={`/section/${section.id}`}
                    className={`group relative block overflow-hidden rounded-2xl text-right ${style.shadow} ${style.bg} transition-all duration-500 transform-style-3d hover:!shadow-none hover:scale-110 hover:-rotate-y-6 hover:rotate-x-4`}
                    >
                    {isAdmin && (
                        <div className="absolute top-2 right-2 z-20 flex gap-2">
                            <button onClick={(e) => handleEditSection(e, section)} className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors" aria-label="ویرایش بخش">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <button onClick={(e) => handleDeleteSection(e, section.id)} className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors" aria-label="حذف بخش">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    )}
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-br-full opacity-80 transform -translate-x-4 -translate-y-4 transition-transform duration-500 group-hover:scale-[2.5]"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/10 rounded-tl-full opacity-80 transform translate-x-4 translate-y-4 transition-transform duration-500 group-hover:scale-[2.5]"></div>
    
                    <div className="relative z-10 p-5 flex flex-col justify-end min-h-[160px]">
                        <h3 className="text-2xl font-bold text-white drop-shadow-md mt-auto">{section.name}</h3>
                    </div>
                    </Link>
                );
                })}
            </div>
            ) : (
            <div className="text-center py-10 bg-white/50 rounded-2xl shadow-md border border-slate-200">
                <p className="text-slate-500">هیچ بخشی برای نمایش وجود ندارد.</p>
            </div>
        )
    )}
    <EditSectionModal
        isOpen={!!editingSection}
        onClose={() => setEditingSection(null)}
        section={editingSection}
    />
    </div>
  );
};

export default HomePage;
