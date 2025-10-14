import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const AboutHospitalTopicPage: React.FC = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();
    const { aboutHospitalTopics } = useAppContext();

    const topic = aboutHospitalTopics.find(t => t.id === topicId);

    if (!topic) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800">موضوع مورد نظر یافت نشد.</h2>
                <Link to="/home" className="text-sky-600 hover:underline mt-4 inline-block">بازگشت به صفحه اصلی</Link>
            </div>
        );
    }

    return (
        <div>
            <button onClick={() => navigate('/about-hospital-section')} className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 bg-white shadow-sm border border-slate-200 rounded-full py-2 px-4 transition-all hover:bg-slate-50 hover:shadow-md hover:border-slate-300 transform hover:-translate-y-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                بازگشت به بخش «درباره بیمارستان»
            </button>
            <div className="bg-white/60 border border-slate-200 p-8 rounded-2xl shadow-lg mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 drop-shadow-sm">{topic.name}</h1>
                <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">{topic.description}</p>
            </div>
        </div>
    );
};

export default AboutHospitalTopicPage;