export enum FileType {
  PDF = 'pdf',
  IMAGE = 'image',
  AUDIO = 'audio',
  UNKNOWN = 'unknown',
}

export interface FileAttachment {
  id: string;
  name: string;
  description: string;
  type: FileType;
  dataUrl: string; // Base64 encoded file content
}

export interface Disease {
  id: string;
  name: string;
  description: string;
  files: FileAttachment[];
}

export interface Section {
  id: string;
  name: string;
  icon: string; // Emoji or SVG string
  colorClass: string; // e.g., 'red', 'sky', 'emerald'
  diseases: Disease[];
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string; // Base64 encoded image content
}
