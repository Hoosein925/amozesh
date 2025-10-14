
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useAppContext } from '../context/AppContext';

interface AddFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId: string;
  diseaseId: string;
}

const AddFileModal: React.FC<AddFileModalProps> = ({ isOpen, onClose, sectionId, diseaseId }) => {
  const { addFileToDisease } = useAppContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      if (!name) { // auto-fill name if empty
          setName(e.target.files[0].name);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !name.trim()) {
        setError('لطفاً یک فایل انتخاب کرده و نام آن را مشخص کنید.');
        return;
    }
    await addFileToDisease(sectionId, diseaseId, file, name.trim(), description.trim());
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setFile(null);
    setError('');
    onClose();
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 z-50 flex justify-center items-center p-4 transition-opacity duration-300" onClick={handleClose}>
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-4 left-4 text-slate-500 hover:text-slate-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-center text-slate-700 mb-6">افزودن فایل جدید</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="file-upload-modal" className="w-full cursor-pointer bg-slate-100/50 rounded-lg border-2 border-dashed border-slate-300 hover:border-sky-400 transition-colors p-6 text-center block">
                <span className="text-slate-500">{file ? file.name : 'برای انتخاب فایل کلیک کنید'}</span>
                <input id="file-upload-modal" type="file" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
          <div>
            <label htmlFor="fileName" className="block text-sm font-medium text-slate-600 mb-2 text-right">نام فایل</label>
            <input
              id="fileName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-100/50 border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              placeholder="مثال: راهنمای تغذیه پس از عمل"
              required
            />
          </div>
          <div>
            <label htmlFor="fileDescription" className="block text-sm font-medium text-slate-600 mb-2 text-right">توضیحات</label>
            <textarea
              id="fileDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-100/50 border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              rows={3}
              placeholder="توضیح مختصری درباره محتوای فایل"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-sky-500/30 disabled:bg-slate-400 disabled:shadow-none disabled:cursor-not-allowed disabled:scale-100" disabled={!file || !name.trim()}>
            افزودن فایل
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFileModal;
