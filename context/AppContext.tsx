
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Section, Disease, FileAttachment, Banner } from '../types';
import { FileType } from '../types';
import { supabase } from '../lib/supabaseClient';

interface AppContextType {
  isAdmin: boolean;
  isLoading: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  sections: Section[];
  banners: Banner[];
  addBanner: (file: File, title: string, description: string) => Promise<void>;
  updateBanner: (bannerId: string, title: string, description: string, imageFile: File | null) => Promise<void>;
  deleteBanner: (bannerId: string) => Promise<void>;
  updateSection: (sectionId: string, newName: string, newIcon: string, newColorClass: string) => Promise<void>;
  updateDisease: (sectionId: string, diseaseId: string, newName: string, newDescription: string) => Promise<void>;
  addFileToDisease: (sectionId: string, diseaseId: string, file: File, name: string, description: string) => Promise<void>;
  addSection: (name: string, icon: string, colorClass: string) => Promise<void>;
  deleteSection: (sectionId: string) => Promise<void>;
  addDisease: (sectionId: string, name: string, description: string) => Promise<void>;
  deleteDisease: (sectionId: string, diseaseId: string) => Promise<void>;
  deleteFile: (sectionId: string, diseaseId: string, fileId: string) => Promise<void>;
  aboutHospitalTopics: Disease[];
  addAboutHospitalTopic: (name: string, description: string) => Promise<void>;
  updateAboutHospitalTopic: (topicId: string, newName: string, newDescription: string) => Promise<void>;
  deleteAboutHospitalTopic: (topicId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LoadingSpinner: React.FC = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-violet-200">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-sky-500"></div>
    </div>
);


export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [aboutHospitalTopics, setAboutHospitalTopics] = useState<Disease[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const { data: bannersData, error: bannersError } = await supabase
          .from('banners')
          .select('*')
          .order('created_at');
      if (bannersError) throw bannersError;

      const bannersWithUrls = bannersData.map(banner => ({
          ...banner,
          id: banner.id.toString(),
          imageUrl: supabase.storage.from('banners').getPublicUrl(banner.image_path).data.publicUrl,
      }));
      setBanners(bannersWithUrls);
      
      const { data: sectionsData, error: sectionsError } = await supabase
          .from('sections')
          .select('*')
          .order('name');
      if (sectionsError) throw sectionsError;

      const { data: diseasesData, error: diseasesError } = await supabase
          .from('diseases')
          .select('*');
      if (diseasesError) throw diseasesError;

      const { data: filesData, error: filesError } = await supabase
          .from('files')
          .select('*');
      if (filesError) throw filesError;

      const filesByDiseaseId = filesData.reduce((acc, file) => {
          const diseaseId = file.disease_id.toString();
          if (!acc[diseaseId]) acc[diseaseId] = [];
          
          const { data: { publicUrl } } = supabase.storage.from('files').getPublicUrl(file.file_path);

          acc[diseaseId].push({
              id: file.id.toString(),
              name: file.name,
              description: file.description,
              type: file.file_type as FileType,
              dataUrl: publicUrl,
          });
          return acc;
      }, {} as { [key: string]: FileAttachment[] });

      const diseasesBySectionId = diseasesData.reduce((acc, disease) => {
          const sectionId = disease.section_id.toString();
          if (!acc[sectionId]) acc[sectionId] = [];
          acc[sectionId].push({
              id: disease.id.toString(),
              name: disease.name,
              description: disease.description,
              files: filesByDiseaseId[disease.id.toString()] || [],
          });
          return acc;
      }, {} as { [key: string]: Disease[] });

      const populatedSections = sectionsData.map(section => ({
          id: section.id.toString(),
          name: section.name,
          icon: section.icon,
          colorClass: section.color_class,
          diseases: diseasesBySectionId[section.id.toString()] || [],
      }));

      setSections(populatedSections);

      const { data: topicsData, error: topicsError } = await supabase
        .from('about_hospital_topics')
        .select('*')
        .order('name');
      if (topicsError) throw topicsError;

      const topics: Disease[] = topicsData.map(topic => ({
        id: topic.id.toString(),
        name: topic.name,
        description: topic.description,
        files: [],
      }));
      setAboutHospitalTopics(topics);

    } catch (error) {
      console.error("Failed to load app data:", error);
      alert(`خطا در بارگذاری اطلاعات اولیه برنامه: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    loadData().finally(() => setIsLoading(false));
  }, []);

  const login = (user: string, pass: string): boolean => {
    if (user === '5850008985' && pass === '64546') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  const addBanner = async (file: File, title: string, description: string) => {
      const imagePath = `public/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('banners').upload(imagePath, file);
      if (uploadError) {
        console.error('Error uploading banner image:', uploadError);
        alert('خطا در بارگذاری تصویر بنر: ' + uploadError.message);
        return;
      }
      const { error: insertError } = await supabase.from('banners').insert([{ title, description, image_path: imagePath }]);
      if (insertError) {
          console.error('Error inserting banner:', insertError);
          alert('خطا در ذخیره اطلاعات بنر: ' + insertError.message);
      } else {
          await loadData();
      }
  };

  const updateBanner = async (bannerId: string, title: string, description: string, imageFile: File | null) => {
    let image_path;
    if (imageFile) {
        image_path = `public/${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage.from('banners').upload(image_path, imageFile);
        if (uploadError) {
          console.error('Error uploading new banner image:', uploadError);
          alert('خطا در بارگذاری تصویر جدید بنر: ' + uploadError.message);
          return;
        }
    }
    const updateData: { title: string; description: string; image_path?: string } = { title, description };
    if (image_path) {
        updateData.image_path = image_path;
    }
    const { error } = await supabase.from('banners').update(updateData).eq('id', bannerId);
    if (error) {
        console.error('Error updating banner:', error);
        alert('خطا در به‌روزرسانی بنر: ' + error.message);
    } else {
        await loadData();
    }
  };

  const deleteBanner = async (bannerId: string) => {
      const { data: bannerData, error: fetchError } = await supabase.from('banners').select('image_path').eq('id', bannerId).single();
      if (fetchError || !bannerData) {
          console.error('Error fetching banner path:', fetchError);
          return;
      }
      const { error: deleteDbError } = await supabase.from('banners').delete().eq('id', bannerId);
      if (deleteDbError) {
          console.error('Error deleting banner from DB:', deleteDbError);
          alert('خطا در حذف بنر از پایگاه داده: ' + deleteDbError.message);
          return;
      }
      const { error: deleteStorageError } = await supabase.storage.from('banners').remove([bannerData.image_path]);
      if (deleteStorageError) console.error('Error deleting banner image from storage:', deleteStorageError);
      
      await loadData();
  };

  const addSection = async (name: string, icon: string, colorClass: string) => {
    const { error } = await supabase.from('sections').insert([{ name, icon, color_class: colorClass }]);
    if (error) {
        console.error('Error adding section:', error);
        alert('خطا در افزودن بخش: ' + error.message);
    } else {
        await loadData();
    }
  };

  const deleteSection = async (sectionId: string) => {
    if (window.confirm('آیا از حذف این بخش و تمام بیماری‌های آن اطمینان دارید؟')) {
        const { data: diseases, error: diseasesError } = await supabase.from('diseases').select('id').eq('section_id', sectionId);
        if (diseasesError) { console.error(diseasesError); return; }

        if (diseases.length > 0) {
            const diseaseIds = diseases.map(d => d.id);
            const { data: files, error: filesError } = await supabase.from('files').select('file_path').in('disease_id', diseaseIds);
            if (filesError) { console.error(filesError); return; }
            if (files.length > 0) {
                const filePaths = files.map(f => f.file_path);
                await supabase.storage.from('files').remove(filePaths);
            }
        }
        
        const { error: deleteError } = await supabase.from('sections').delete().eq('id', sectionId);
        if (deleteError) {
            console.error('Error deleting section:', deleteError);
            alert('خطا در حذف بخش: ' + deleteError.message);
        } else {
            await loadData();
        }
    }
  };

  const addDisease = async (sectionId: string, name: string, description: string) => {
    const { error } = await supabase.from('diseases').insert([{ name, description, section_id: parseInt(sectionId) }]);
    if (error) {
        console.error('Error adding disease:', error);
        alert('خطا در افزودن بیماری: ' + error.message);
    } else {
        await loadData();
    }
  };

  const deleteDisease = async (sectionId: string, diseaseId: string) => {
    if (window.confirm('آیا از حذف این بیماری اطمینان دارید؟')) {
        const { data: files, error: filesError } = await supabase.from('files').select('file_path').eq('disease_id', diseaseId);
        if (filesError) { console.error(filesError); return; }
        if (files.length > 0) {
            const filePaths = files.map(f => f.file_path);
            await supabase.storage.from('files').remove(filePaths);
        }

        const { error: deleteError } = await supabase.from('diseases').delete().eq('id', diseaseId);
        if (deleteError) {
            console.error('Error deleting disease:', deleteError);
            alert('خطا در حذف بیماری: ' + deleteError.message);
        } else {
            await loadData();
        }
    }
  };
  
  const deleteFile = async (sectionId: string, diseaseId: string, fileId: string) => {
    if (window.confirm('آیا از حذف این فایل اطمینان دارید؟')) {
        const { data: file, error: fetchError } = await supabase.from('files').select('file_path').eq('id', fileId).single();
        if (fetchError || !file) { console.error('File not found', fetchError); return; }

        await supabase.storage.from('files').remove([file.file_path]);
        const { error: deleteError } = await supabase.from('files').delete().eq('id', fileId);
        if (deleteError) {
            console.error('Error deleting file record:', deleteError);
            alert('خطا در حذف فایل: ' + deleteError.message);
        } else {
            await loadData();
        }
    }
  };

  const updateSection = async (sectionId: string, newName: string, newIcon: string, newColorClass: string) => {
    const { error } = await supabase.from('sections').update({ name: newName, icon: newIcon, color_class: newColorClass }).eq('id', sectionId);
    if (error) {
        console.error('Error updating section:', error);
        alert('خطا در به‌روزرسانی بخش: ' + error.message);
    } else {
        await loadData();
    }
  };
  
  const updateDisease = async (sectionId: string, diseaseId: string, newName: string, newDescription: string) => {
    const { error } = await supabase.from('diseases').update({ name: newName, description: newDescription }).eq('id', diseaseId);
    if (error) {
        console.error('Error updating disease:', error);
        alert('خطا در به‌روزرسانی بیماری: ' + error.message);
    } else {
        await loadData();
    }
  };

  const addFileToDisease = async (sectionId: string, diseaseId: string, file: File, name: string, description: string) => {
    const getFileType = (inputFile: File): FileType => {
        if (inputFile.type.startsWith('image/')) return FileType.IMAGE;
        if (inputFile.type === 'application/pdf') return FileType.PDF;
        if (inputFile.type.startsWith('audio/')) return FileType.AUDIO;
        return FileType.UNKNOWN;
    };
    
    const filePath = `public/${diseaseId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from('files').upload(filePath, file);
    if (uploadError) {
        console.error('Error uploading file:', uploadError);
        alert('خطا در بارگذاری فایل: ' + uploadError.message);
        return;
    }

    const newFile = {
        name,
        description,
        disease_id: parseInt(diseaseId),
        file_path: filePath,
        file_type: getFileType(file)
    };

    const { error: insertError } = await supabase.from('files').insert([newFile]);
    if (insertError) {
        console.error('Error inserting file record:', insertError);
        alert('خطا در ذخیره اطلاعات فایل: ' + insertError.message);
    } else {
        await loadData();
    }
  };

  const addAboutHospitalTopic = async (name: string, description: string) => {
    const { error } = await supabase.from('about_hospital_topics').insert([{ name, description }]);
    if (error) {
        console.error('Error adding about hospital topic:', error);
        alert('خطا در افزودن موضوع: ' + error.message);
    } else {
        await loadData();
    }
  };

  const updateAboutHospitalTopic = async (topicId: string, newName: string, newDescription: string) => {
      const { error } = await supabase.from('about_hospital_topics').update({ name: newName, description: newDescription }).eq('id', topicId);
      if (error) {
          console.error('Error updating about hospital topic:', error);
          alert('خطا در به‌روزرسانی موضوع: ' + error.message);
      } else {
          await loadData();
      }
  };

  const deleteAboutHospitalTopic = async (topicId: string) => {
      if (window.confirm('آیا از حذف این موضوع اطمینان دارید؟')) {
        const { error } = await supabase.from('about_hospital_topics').delete().eq('id', topicId);
        if (error) {
            console.error('Error deleting about hospital topic:', error);
            alert('خطا در حذف موضوع: ' + error.message);
        } else {
            await loadData();
        }
      }
  };

  return (
    <AppContext.Provider value={{ 
        isAdmin,
        isLoading,
        login, 
        logout, 
        sections, 
        banners,
        addBanner,
        updateBanner,
        deleteBanner,
        updateSection,
        updateDisease,
        addFileToDisease,
        addSection,
        deleteSection,
        addDisease,
        deleteDisease,
        deleteFile,
        aboutHospitalTopics,
        addAboutHospitalTopic,
        updateAboutHospitalTopic,
        deleteAboutHospitalTopic,
    }}>
      {isLoading ? <LoadingSpinner /> : children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
