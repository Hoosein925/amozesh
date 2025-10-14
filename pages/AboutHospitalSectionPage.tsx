import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import type { Disease } from '../types';
import EditAboutTopicModal from '../components/EditAboutTopicModal';

const cardColors = [
  { accent: 'border-sky-500', shadow: 'shadow-sky-500/20', hoverBg: 'hover:bg-sky-50' },
  { accent: 'border-emerald-500', shadow: 'shadow-emerald-500/20', hoverBg: 'hover:bg-emerald-50' },
  { accent: 'border-purple-500', shadow: 'shadow-purple-500/20', hoverBg: 'hover:bg-purple-50' },
];

const AboutHospitalSectionPage: React.FC = () => {
    const navigate = useNavigate();
    const { aboutHospitalTopics, isAdmin, addAboutHospitalTopic, deleteAboutHospitalTopic } = useAppContext();
    
    const [newTopicName, setNewTopicName] = useState('');
    const [newTopicDesc, setNewTopicDesc] = useState('');
    const [editingTopic, setEditingTopic] = useState<Disease | null>(null);

    const handleAddTopic = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newTopicName.trim() && newTopicDesc.trim()) {
            await addAboutHospitalTopic(newTopicName.trim(), newTopicDesc.trim());
            setNewTopicName('');
            setNewTopicDesc('');
        }
    };
    
    const handleDeleteTopic = async (e: React.MouseEvent, topicId: string) => {
        e.stopPropagation();
        e.preventDefault();
        if (window.confirm('آیا از حذف این موضوع اطمینان دارید؟')) {
            await deleteAboutHospitalTopic(topicId);
        }
    };
    
    const handleEditTopic = (e: React.MouseEvent, topic: Disease) => {
        e.stopPropagation();
        e.preventDefault();
        setEditingTopic(topic);
    };

    return (
        <div>
            <button onClick={() => navigate('/home')} className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 bg-white shadow-sm border border-slate-200 rounded-full py-2 px-4 transition-all hover:bg-slate-50 hover:shadow-md hover:border-slate-300 transform hover:-translate-y-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                بازگشت به همه بخش‌ها
            </button>
            <div className="flex flex-col items-center text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 drop-shadow-sm">درباره بیمارستان</h1>
            </div>

            {isAdmin && (
                <div className="bg-white/50 p-6 rounded-2xl shadow-lg mb-10 border border-slate-200">
                <h2 className="text-xl font-semibold mb-4 text-sky-700">اضافه کردن موضوع جدید</h2>
                <form onSubmit={handleAddTopic} className="space-y-4">
                    <input
                    type="text"
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    placeholder="عنوان موضوع"
                    className="w-full bg-white/80 border border-slate-300 rounded-lg p-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                    required
                    />
                    <textarea
                    value={newTopicDesc}
                    onChange={(e) => setNewTopicDesc(e.target.value)}
                    placeholder="توضیحات"
                    className="w-full bg-white/80 border border-slate-300 rounded-lg p-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                    rows={4}
                    required
                    />
                    <button type="submit" className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-sky-500/30">
                    افزودن موضوع
                    </button>
                </form>
                </div>
            )}


            <div className="space-y-4">
                {aboutHospitalTopics.length > 0 ? (
                    aboutHospitalTopics.map((topic, index) => {
                        const color = cardColors[index % cardColors.length];
                        return (
                            <Link
                                key={topic.id}
                                to={`/about-hospital-topic/${topic.id}`}
                                className={`group relative block overflow-hidden bg-white p-6 rounded-2xl shadow-md ${color.shadow} border-r-4 ${color.accent} ${color.hoverBg} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
                            >
                                {isAdmin && (
                                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                                        <button onClick={(e) => handleEditTopic(e, topic)} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors" aria-label="ویرایش موضوع">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button onClick={(e) => handleDeleteTopic(e, topic.id)} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors" aria-label="حذف موضوع">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                                <div className="relative">
                                    <h3 className="text-xl font-semibold text-slate-800 drop-shadow-sm">{topic.name}</h3>
                                    <p className="text-slate-600 mt-2 max-w-prose truncate">{topic.description}</p>
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="text-center py-10 bg-white/50 rounded-2xl shadow-md border border-slate-200">
                        <p className="text-slate-500">هیچ موضوعی در این بخش ثبت نشده است.</p>
                    </div>
                )}
            </div>
            <EditAboutTopicModal
                isOpen={!!editingTopic}
                onClose={() => setEditingTopic(null)}
                topic={editingTopic}
            />
        </div>
    );
};

export default AboutHospitalSectionPage;