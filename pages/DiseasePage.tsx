
import React, { useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FileType } from '../types';
import type { FileAttachment } from '../types';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import AddFileModal from '../components/AddFileModal';


const iconStyles: { [key in FileType]: { classes: string, content: React.ReactElement } } = {
    [FileType.PDF]: {
        classes: 'bg-rose-100 text-rose-600',
        content: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
    },
    [FileType.IMAGE]: {
        classes: 'bg-purple-100 text-purple-600',
        content: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
    },
    [FileType.AUDIO]: {
        classes: 'bg-teal-100 text-teal-600',
        content: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
    },
    [FileType.UNKNOWN]: {
        classes: 'bg-slate-100 text-slate-600',
        content: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
    },
};

const highlightText = (text: string, query: string): React.ReactNode => {
    if (!query || query.trim() === '') {
        return text;
    }
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = text.split(regex);

    return (
        <span>
            {parts.map((part, index) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <mark key={index} className="bg-yellow-300 px-0.5 rounded">{part}</mark>
                ) : (
                    part
                )
            )}
        </span>
    );
};


const DiseasePage: React.FC = () => {
  const { sectionId, diseaseId } = useParams<{ sectionId: string, diseaseId: string }>();
  const { sections, isAdmin, deleteFile } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get('q') || '';
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);

  const section = sections.find(s => s.id === sectionId);
  const disease = section?.diseases.find(d => d.id === diseaseId);
  
  const handleDeleteFile = (fileId: string) => {
    if (sectionId && diseaseId) {
        deleteFile(sectionId, diseaseId, fileId);
    }
  };

  const FileCard: React.FC<{ file: FileAttachment, onDelete: (fileId: string) => void }> = ({ file, onDelete }) => {
    const { classes, content } = iconStyles[file.type] || iconStyles[FileType.UNKNOWN];

    return (
        <div className="group relative bg-white rounded-2xl p-4 flex flex-col gap-4 shadow-md border border-slate-200 hover:shadow-xl hover:border-sky-300 hover:-translate-y-1 transition-all duration-300">
            {isAdmin && (
                <button 
                    onClick={() => onDelete(file.id)}
                    className="absolute top-2 left-2 z-20 p-1.5 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="حذف فایل"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                </button>
            )}
            <div className="flex items-center gap-4">
                <div className={`flex-shrink-0 h-14 w-14 rounded-lg flex items-center justify-center ${classes}`}>
                    <div className="h-7 w-7">{content}</div>
                </div>
                <div className="flex-grow min-w-0">
                    <p className="font-bold text-slate-800 truncate">{file.name}</p>
                    <p className="text-sm text-slate-500 mt-1 truncate">{file.description || 'بدون توضیحات'}</p>
                </div>
            </div>
            <a
                href={file.dataUrl}
                download={file.name}
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-auto w-full text-center bg-slate-100 hover:bg-sky-500 text-slate-700 hover:text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                دانلود
            </a>
        </div>
    );
  };


  const handleDownloadWord = async () => {
    if (!disease) return;

    const safeFilename = disease.name.replace(/[/\\?%*:|"<>]/g, '-') + '.docx';

    const descriptionParagraphs = disease.description.split('\n').map(line => {
        const parts: TextRun[] = [];
        const regex = /\*\*(.*?)\*\*/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(line)) !== null) {
            if (match.index > lastIndex) {
                parts.push(new TextRun({ text: line.substring(lastIndex, match.index) }));
            }
            parts.push(new TextRun({ text: match[1], bold: true }));
            lastIndex = regex.lastIndex;
        }

        if (lastIndex < line.length) {
            parts.push(new TextRun({ text: line.substring(lastIndex) }));
        }

        return new Paragraph({
            children: parts.length > 0 ? parts : [new TextRun({ text: "" })],
            alignment: AlignmentType.JUSTIFIED,
            bidirectional: true,
        });
    });

    const doc = new Document({
        creator: "Patient Education System",
        title: disease.name,
        description: `Educational material for ${disease.name}`,
        sections: [{
            properties: {
                page: {
                    margin: { top: 720, right: 720, bottom: 720, left: 720 },
                },
            },
            children: [
                new Paragraph({
                    text: "سامانه آموزش به بیمار",
                    alignment: AlignmentType.CENTER,
                    style: "headerStyle",
                }),
                new Paragraph({
                    text: disease.name,
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    bidirectional: true,
                }),
                new Paragraph({ text: "" }), // Spacer
                ...descriptionParagraphs,
            ],
        }],
        styles: {
            paragraphStyles: [{
                id: "headerStyle",
                name: "Header Style",
                basedOn: "Normal",
                next: "Normal",
                run: { size: 20, color: "888888" },
            }],
        }
    });

    try {
      const blob = await Packer.toBlob(doc);
      
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.href = url;
      link.download = safeFilename;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error generating Word document:", error);
        alert("متاسفانه در تولید فایل Word خطایی رخ داد.");
    }
  };


  if (!disease || !section) {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800">بیماری مورد نظر یافت نشد.</h2>
            <Link to="/home" className="text-sky-600 hover:underline mt-4 inline-block">بازگشت به صفحه اصلی</Link>
        </div>
    );
  }

  return (
    <div>
        <button onClick={() => navigate(`/section/${sectionId}`)} className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 bg-white shadow-sm border border-slate-200 rounded-full py-2 px-4 transition-all hover:bg-slate-50 hover:shadow-md hover:border-slate-300 transform hover:-translate-y-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            بازگشت به بخش «{section.name}»
        </button>
        <div className="bg-white/60 border border-slate-200 p-8 rounded-2xl shadow-lg mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 drop-shadow-sm">{highlightText(disease.name, searchQuery)}</h1>
            <p className="text-slate-600 text-xl leading-relaxed whitespace-pre-wrap">{highlightText(disease.description, searchQuery)}</p>
        </div>
        
        <div className="flex justify-center mb-10">
            <button
                onClick={handleDownloadWord}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
                aria-label="دانلود محتوا به صورت فایل Word"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>دانلود محتوای آموزشی بصورت فایل Word</span>
            </button>
        </div>


        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">فایل‌های ضمیمه</h2>
                {isAdmin && (
                    <button 
                        onClick={() => setIsAddFileModalOpen(true)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.414l-1.293 1.293a1 1 0 01-1.414-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L13 9.414V13h-1.5z" /><path d="M9 13h2v5a1 1 0 11-2 0v-5z" /></svg>
                        <span>افزودن فایل</span>
                    </button>
                )}
            </div>
            
            {disease.files.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {disease.files.map(file => (
                        <FileCard 
                            key={file.id} 
                            file={file} 
                            onDelete={handleDeleteFile}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white/50 rounded-2xl shadow-md border border-slate-200">
                    <p className="text-slate-500">هیچ فایلی برای این بیماری ثبت نشده است.</p>
                </div>
            )}
        </div>
        <AddFileModal 
            isOpen={isAddFileModalOpen} 
            onClose={() => setIsAddFileModalOpen(false)} 
            sectionId={sectionId!} 
            diseaseId={diseaseId!} 
        />
    </div>
  );
};

export default DiseasePage;
