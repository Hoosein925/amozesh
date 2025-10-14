import React, { useState, useEffect, FormEvent } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Disease as Topic } from '../types';

interface EditTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: Topic | null;
}

const EditAboutTopicModal: React.FC<EditTopicModalProps> = ({ isOpen, onClose, topic }) => {
  const { updateAboutHospitalTopic } = useAppContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (topic) {
      setName(topic.name);
      setDescription(topic.description);
    }
  }, [topic]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (topic && name.trim() && description.trim()) {
      await updateAboutHospitalTopic(topic.id, name, description);
      onClose();
    }
  };

  if (!isOpen || !topic) {
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
        <h2 className="text-2xl font-bold text-center text-slate-700 mb-6">ویرایش موضوع</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="topicName" className="block text-sm font-medium text-slate-600 mb-2 text-right">عنوان موضوع</label>
            <input
              id="topicName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-100/50 border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="topicDescription" className="block text-sm font-medium text-slate-600 mb-2 text-right">توضیحات</label>
            <textarea
              id="topicDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-100/50 border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              rows={5}
              required
            />
          </div>
          <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-sky-500/30">
            ذخیره تغییرات
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAboutTopicModal;
