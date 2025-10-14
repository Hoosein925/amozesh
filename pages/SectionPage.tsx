
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import type { Disease } from '../types';
import AddDiseaseModal from '../components/AddDiseaseModal';
import EditDiseaseModal from '../components/EditDiseaseModal';

const cardColors = [
  { accent: 'border-sky-500', shadow: 'shadow-sky-500/20', hoverBg: 'hover:bg-sky-50' },
  { accent: 'border-emerald-500', shadow: 'shadow-emerald-500/20', hoverBg: 'hover:bg-emerald-50' },
  { accent: 'border-purple-500', shadow: 'shadow-purple-500/20', hoverBg: 'hover:bg-purple-50' },
  { accent: 'border-rose-500', shadow: 'shadow-rose-500/20', hoverBg: 'hover:bg-rose-50' },
  { accent: 'border-amber-500', shadow: 'shadow-amber-500/20', hoverBg: 'hover:bg-amber-50' },
  { accent: 'border-indigo-500', shadow: 'shadow-indigo-500/20', hoverBg: 'hover:bg-indigo-50' },
];

export default function SectionPage(): React.ReactElement {
  const { sectionId } = useParams<{ sectionId: string }>();
  const { sections, isAdmin, deleteDisease } = useAppContext();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDiseaseModalOpen, setIsAddDiseaseModalOpen] = useState(false);
  const [editingDisease, setEditingDisease] = useState<Disease | null>(null);

  const section = sections.find(s => s.id === sectionId);

  const handleEditDisease = (e: React.MouseEvent, disease: Disease) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingDisease(disease);
  };

  const handleDeleteDisease = (e: React.MouseEvent, diseaseId: string) => {
      e.preventDefault();
      e.stopPropagation();
      if(sectionId) {
          deleteDisease(sectionId, diseaseId);
      }
  };

  if (!section) {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800">بخش مورد نظر یافت نشد.</h2>
            <Link to="/home" className="text-sky-600 hover:underline mt-4 inline-block">بازگشت به صفحه اصلی</Link>
        </div>
    );
  }

  const filteredDiseases = section.diseases.filter(disease => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return disease.name.toLowerCase().includes(query) || disease.description.toLowerCase().includes(query);
  });

  return (
    <div>
      <button onClick={() => navigate('/home')} className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 bg-white shadow-sm border border-slate-200 rounded-full py-2 px-4 transition-all hover:bg-slate-50 hover:shadow-md hover:border-slate-300 transform hover:-translate-y-0.5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        بازگشت به همه بخش‌ها
      </button>
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 drop-shadow-sm">{section.name}</h1>
      </div>
      
      {isAdmin && (
        <div className="text-center mb-8">
            <button 
                onClick={() => setIsAddDiseaseModalOpen(true)}
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 mx-auto"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>افزودن بیماری جدید</span>
            </button>
        </div>
      )}

      <div className="relative w-full mb-8 max-w-lg mx-auto">
        <input
            type="text"
            placeholder="جستجوی بیماری..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/80 border border-slate-300 rounded-lg p-3 pl-10 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all shadow-sm"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </div>

      <div className="space-y-4">
        {filteredDiseases.length > 0 ? (
          filteredDiseases.map((disease, index) => {
            const color = cardColors[index % cardColors.length];
            return (
                <Link
                key={disease.id}
                to={`/disease/${section.id}/${disease.id}?q=${encodeURIComponent(searchQuery)}`}
                className={`group relative block overflow-hidden bg-white p-6 rounded-2xl shadow-md ${color.shadow} border-r-4 ${color.accent} ${color.hoverBg} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
                >
                {isAdmin && (
                    <div className="absolute top-4 left-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={(e) => handleEditDisease(e, disease)} className="p-2 rounded-full bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-600 transition-colors" aria-label="ویرایش بیماری">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                        </button>
                        <button onClick={(e) => handleDeleteDisease(e, disease.id)} className="p-2 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 transition-colors" aria-label="حذف بیماری">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                )}
                <div className="relative">
                    <h3 className="text-xl font-semibold text-slate-800 drop-shadow-sm">{disease.name}</h3>
                    <p className="text-slate-600 mt-2 max-w-prose">{disease.description.split('\n')[0]}</p>
                </div>
                </Link>
            );
        })
        ) : (
            <div className="text-center py-10 bg-white/50 rounded-2xl shadow-md border border-slate-200">
                <p className="text-slate-500">
                    {searchQuery ? 'موردی متناسب با جستجوی شما یافت نشد.' : 'هیچ بیماری در این بخش ثبت نشده است.'}
                </p>
            </div>
        )}
      </div>
      <AddDiseaseModal isOpen={isAddDiseaseModalOpen} onClose={() => setIsAddDiseaseModalOpen(false)} sectionId={sectionId!} />
      <EditDiseaseModal isOpen={!!editingDisease} onClose={() => setEditingDisease(null)} disease={editingDisease} sectionId={sectionId} />
    </div>
  );
}
