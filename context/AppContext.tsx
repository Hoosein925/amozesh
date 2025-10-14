
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
  addSection: (name: string, icon: string, colorClass: string) => Promise<void>;
  updateSection: (sectionId: string, newName: string, newIcon: string, newColorClass: string) => Promise<void>;
  deleteSection: (sectionId: string) => Promise<void>;
  addDisease: (sectionId: string, name: string, description: string) => Promise<void>;
  updateDisease: (sectionId: string, diseaseId: string, newName: string, newDescription: string) => Promise<void>;
  deleteDisease: (sectionId: string, diseaseId: string) => Promise<void>;
  addFileToDisease: (sectionId: string, diseaseId: string, file: File, name: string, description: string) => Promise<void>;
  deleteFileFromDisease: (sectionId: string, diseaseId: string, fileId: string) => Promise<void>;
  banners: Banner[];
  addBanner: (file: File, title: string, description: string) => Promise<void>;
  updateBanner: (bannerId: string, title: string, description: string, imageFile: File | null) => Promise<void>;
  deleteBanner: (bannerId: string) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      // Fetch banners
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

      // Fetch sections with nested diseases and files
      const { data: sectionsData, error: sectionsError } = await supabase
          .from('sections')
          .select('*, diseases(*, files(*))')
          .order('created_at', { ascending: true });

      if (sectionsError) throw sectionsError;
      
      const sectionsWithUrls = sectionsData.map(section => ({
          ...section,
          id: section.id.toString(),
          diseases: section.diseases.map((disease: any) => ({
              ...disease,
              id: disease.id.toString(),
              files: disease.files.map((file: any) => ({
                  ...file,
                  id: file.id.toString(),
                  dataUrl: supabase.storage.from('files').getPublicUrl(file.file_path).data.publicUrl
              }))
          }))
      }));

      setSections(sectionsWithUrls as unknown as Section[]);

    } catch (error) {
      console.error("Failed to load app data from Supabase:", error);
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

  const addSection = async (name: string, icon: string, colorClass: string) => {
    const { error } = await supabase.from('sections').insert([{ name, icon, colorClass }]);
    if (error) console.error('Error adding section:', error);
    else await loadData();
  };

  const updateSection = async (sectionId: string, newName: string, newIcon: string, newColorClass: string) => {
    const { error } = await supabase.from('sections').update({ name: newName, icon: newIcon, colorClass: newColorClass }).eq('id', sectionId);
    if (error) console.error('Error updating section:', error);
    else await loadData();
  };

  const deleteSection = async (sectionId: string) => {
    const { error } = await supabase.from('sections').delete().eq('id', sectionId);
    if (error) console.error('Error deleting section:', error);
    else await loadData();
  };

  const addDisease = async (sectionId: string, name: string, description: string) => {
    const { error } = await supabase.from('diseases').insert([{ name, description, section_id: sectionId }]);
    if (error) console.error('Error adding disease:', error);
    else await loadData();
  };
  
  const updateDisease = async (sectionId: string, diseaseId: string, newName: string, newDescription: string) => {
    const { error } = await supabase.from('diseases').update({ name: newName, description: newDescription }).eq('id', diseaseId);
    if (error) console.error('Error updating disease:', error);
    else await loadData();
  };

  const deleteDisease = async (sectionId: string, diseaseId: string) => {
    const { error } = await supabase.from('diseases').delete().eq('id', diseaseId);
    if (error) console.error('Error deleting disease:', error);
    else await loadData();
  };

  const getFileType = (mimeType: string): FileType => {
      if (mimeType.startsWith('image/')) return FileType.IMAGE;
      if (mimeType === 'application/pdf') return FileType.PDF;
      if (mimeType.startsWith('audio/')) return FileType.AUDIO;
      return FileType.UNKNOWN;
  }

  const addFileToDisease = async (sectionId: string, diseaseId: string, file: File, name: string, description: string) => {
      const filePath = `${sectionId}/${diseaseId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('files').upload(filePath, file);

      if (uploadError) {
          console.error('Error uploading file:', uploadError);
          return;
      }

      const fileType = getFileType(file.type);
      const { error: insertError } = await supabase.from('files').insert([
          { name, description, type: fileType, disease_id: diseaseId, file_path: filePath }
      ]);

      if (insertError) console.error('Error inserting file metadata:', insertError);
      else await loadData();
  };

  const deleteFileFromDisease = async (sectionId: string, diseaseId: string, fileId: string) => {
      const { data: fileData, error: fetchError } = await supabase.from('files').select('file_path').eq('id', fileId).single();
      if (fetchError || !fileData) {
          console.error('Error fetching file path:', fetchError);
          return;
      }
      const { error: deleteDbError } = await supabase.from('files').delete().eq('id', fileId);
      if (deleteDbError) {
          console.error('Error deleting file from DB:', deleteDbError);
          return;
      }
      const { error: deleteStorageError } = await supabase.storage.from('files').remove([fileData.file_path]);
      if (deleteStorageError) console.error('Error deleting file from storage:', deleteStorageError);
      
      await loadData();
  };

  const addBanner = async (file: File, title: string, description: string) => {
      const imagePath = `public/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('banners').upload(imagePath, file);
      if (uploadError) {
        console.error('Error uploading banner image:', uploadError);
        return;
      }
      const { error: insertError } = await supabase.from('banners').insert([{ title, description, image_path: imagePath }]);
      if (insertError) console.error('Error inserting banner:', insertError);
      else await loadData();
  };

  const updateBanner = async (bannerId: string, title: string, description: string, imageFile: File | null) => {
    let image_path;
    if (imageFile) {
        image_path = `public/${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage.from('banners').upload(image_path, imageFile);
        if (uploadError) {
          console.error('Error uploading new banner image:', uploadError);
          return;
        }
    }
    const updateData: { title: string; description: string; image_path?: string } = { title, description };
    if (image_path) {
        updateData.image_path = image_path;
    }
    const { error } = await supabase.from('banners').update(updateData).eq('id', bannerId);
    if (error) console.error('Error updating banner:', error);
    else await loadData();
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
          return;
      }
      const { error: deleteStorageError } = await supabase.storage.from('banners').remove([bannerData.image_path]);
      if (deleteStorageError) console.error('Error deleting banner image from storage:', deleteStorageError);
      
      await loadData();
  };


  return (
    <AppContext.Provider value={{ 
        isAdmin,
        isLoading,
        login, 
        logout, 
        sections, 
        addSection,
        updateSection,
        deleteSection,
        addDisease,
        updateDisease,
        deleteDisease, 
        addFileToDisease,
        deleteFileFromDisease,
        banners,
        addBanner,
        updateBanner,
        deleteBanner,
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
