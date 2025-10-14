
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
  aboutHospitalTopics: Disease[];
  addAboutHospitalTopic: (name: string, description: string) => Promise<void>;
  updateAboutHospitalTopic: (topicId: string, newName: string, newDescription: string) => Promise<void>;
  deleteAboutHospitalTopic: (topicId: string) => Promise<void>;
  // FIX: Add missing function signatures to context type to resolve type errors in consuming components.
  updateSection: (sectionId: string, newName: string, newIcon: string, newColorClass: string) => Promise<void>;
  updateDisease: (sectionId: string, diseaseId: string, newName: string, newDescription: string) => Promise<void>;
  addFileToDisease: (sectionId: string, diseaseId: string, file: File, name: string, description: string) => Promise<void>;
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
      // Fetch banners from Supabase
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

      // Fetch about hospital topics from Supabase
      const { data: topicsData, error: topicsError } = await supabase
          .from('about_hospital_topics')
          .select('*')
          .order('created_at', { ascending: true });

      if (topicsError) throw topicsError;

      const formattedTopics = topicsData.map(topic => ({
          ...topic,
          id: topic.id.toString(),
          files: [] // Ensure it matches the Disease type
      }));
      setAboutHospitalTopics(formattedTopics as unknown as Disease[]);

       // Fetch sections from local files
      const sectionsRes = await fetch('/data/sections.json');
      if (!sectionsRes.ok) throw new Error('Failed to fetch sections.json');
      const sectionsData: Omit<Section, 'diseases'>[] = await sectionsRes.json();

      const populatedSections = await Promise.all(
        sectionsData.map(async (section) => {
          try {
            const diseasesRes = await fetch(`/data/${section.id}/diseases.json`);
            if (!diseasesRes.ok) return { ...section, diseases: [] }; // Section with no diseases
            const diseaseIds: string[] = await diseasesRes.json();
            
            const diseases = await Promise.all(
              diseaseIds.map(async (diseaseId) => {
                try {
                  const manifestRes = await fetch(`/data/${section.id}/${diseaseId}/manifest.json`);
                  if (!manifestRes.ok) throw new Error(`Manifest for ${diseaseId} not found`);
                  const manifest = await manifestRes.json();

                  const descriptionRes = await fetch(`/data/${section.id}/${diseaseId}/description.txt`);
                  if (!descriptionRes.ok) throw new Error(`Description for ${diseaseId} not found`);
                  const description = await descriptionRes.text();

                  const files = manifest.files.map((file: any) => ({
                    id: file.path, // Use path as a unique ID
                    name: file.name,
                    description: file.description,
                    type: file.type as FileType,
                    dataUrl: `/data/${section.id}/${diseaseId}/${file.path}`,
                  }));

                  return {
                    id: diseaseId,
                    name: manifest.name,
                    description,
                    files,
                  };
                } catch (error) {
                  console.error(`Error loading disease ${diseaseId} in section ${section.id}:`, error);
                  return null; // Skip this disease if files are missing
                }
              })
            );

            return { ...section, diseases: diseases.filter((d): d is Disease => d !== null) };
          } catch(error) {
            console.error(`Error loading diseases for section ${section.id}:`, error);
            return { ...section, diseases: [] };
          }
        })
      );

      setSections(populatedSections);


    } catch (error) {
      console.error("Failed to load app data:", error);
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

  const addAboutHospitalTopic = async (name: string, description: string) => {
    const { error } = await supabase.from('about_hospital_topics').insert([{ name, description }]);
    if (error) console.error('Error adding about hospital topic:', error);
    else await loadData();
  };
  
  const updateAboutHospitalTopic = async (topicId: string, newName: string, newDescription: string) => {
    const { error } = await supabase.from('about_hospital_topics').update({ name: newName, description: newDescription }).eq('id', topicId);
    if (error) console.error('Error updating about hospital topic:', error);
    else await loadData();
  };

  const deleteAboutHospitalTopic = async (topicId: string) => {
    const { error } = await supabase.from('about_hospital_topics').delete().eq('id', topicId);
    if (error) console.error('Error deleting about hospital topic:', error);
    else await loadData();
  };

  // FIX: Implement missing context functions for in-memory state updates.
  // Note: These changes are not persisted and will be lost on page reload.
  const updateSection = async (sectionId: string, newName: string, newIcon: string, newColorClass: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? { ...section, name: newName, icon: newIcon, colorClass: newColorClass }
          : section
      )
    );
  };
  
  const updateDisease = async (sectionId: string, diseaseId: string, newName: string, newDescription: string) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              diseases: section.diseases.map(disease =>
                disease.id === diseaseId
                  ? { ...disease, name: newName, description: newDescription }
                  : disease
              )
            }
          : section
      )
    );
  };

  const addFileToDisease = async (sectionId: string, diseaseId: string, file: File, name: string, description: string) => {
    const getFileType = (inputFile: File): FileType => {
        if (inputFile.type.startsWith('image/')) return FileType.IMAGE;
        if (inputFile.type === 'application/pdf') return FileType.PDF;
        if (inputFile.type.startsWith('audio/')) return FileType.AUDIO;
        return FileType.UNKNOWN;
    };

    const newFile: FileAttachment = {
        id: `${Date.now()}-${file.name}`,
        name,
        description,
        type: getFileType(file),
        dataUrl: URL.createObjectURL(file),
    };

    setSections(prevSections =>
        prevSections.map(section =>
            section.id === sectionId
                ? {
                    ...section,
                    diseases: section.diseases.map(disease =>
                        disease.id === diseaseId
                            ? { ...disease, files: [...disease.files, newFile] }
                            : disease
                    )
                }
                : section
        )
    );
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
        aboutHospitalTopics,
        addAboutHospitalTopic,
        updateAboutHospitalTopic,
        deleteAboutHospitalTopic,
        // FIX: Provide the new functions through the context.
        updateSection,
        updateDisease,
        addFileToDisease,
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
