import React, { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { useStudioStore } from '../../store/studioStore';
import { getFileCompatibility } from '../../lib/studio/appCapabilities';
import { AppName } from '../../types';
import toast from 'react-hot-toast';

export const FileDropzone: React.FC = () => {
  const { addUploadedFiles, selectedApps } = useStudioStore();
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((files: File[]) => {
    if (files.length === 0) return;

    const newStudioFiles = files.map(file => {
      // Create object URL for preview purposes
      const objectUrl = file.type.startsWith('image/') || file.type.startsWith('video/') 
        ? URL.createObjectURL(file) 
        : undefined;
      
      return {
        id: crypto.randomUUID(),
        file,
        objectUrl
      };
    });

    const initialInclusions: Record<string, Record<AppName, boolean>> = {};

    newStudioFiles.forEach(({ id, file }) => {
      const compatibility = getFileCompatibility(file, selectedApps);
      initialInclusions[id] = {} as Record<AppName, boolean>;
      
      let matchedAny = false;
      
      selectedApps.forEach(app => {
        const isCompatible = compatibility[app]?.isCompatible || false;
        initialInclusions[id][app] = isCompatible; // default true if compatible
        
        if (isCompatible) {
          matchedAny = true;
        } else if (compatibility[app]?.reason) {
          toast.error(`${file.name}: ${compatibility[app].reason}`);
        }
      });

      if (!matchedAny && selectedApps.length > 0) {
        toast.error(`"${file.name}" is not compatible with any selected platforms.`);
      }
    });

    addUploadedFiles(newStudioFiles, initialInclusions);
  }, [addUploadedFiles, selectedApps]);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div 
      className={`w-full rounded-[var(--radius-card-inner)] p-8 border border-dashed flex flex-col items-center justify-center text-center transition-colors
        ${isDragging 
          ? 'bg-brand/10 border-brand' 
          : 'bg-bg-canvas border-border-strong hover:bg-bg-sunken'
        }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input 
        type="file" 
        multiple 
        className="hidden" 
        id="fileUpload" 
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
             handleFiles(Array.from(e.target.files));
          }
        }} 
      />
      <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center w-full">
        <UploadCloud className={`w-12 h-12 mb-4 ${isDragging ? 'text-brand' : 'text-text-muted/50'}`} />
        <p className="text-xs font-medium text-text-secondary">Drop your files here or click to upload</p>
        <p className="text-[10px] text-text-muted mt-1">Supports any file type compatible with your selected apps</p>
      </label>
    </div>
  );
};
