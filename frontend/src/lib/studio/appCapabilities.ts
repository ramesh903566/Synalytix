import { AppName } from '../../types';

export interface AppCapability {
  allowedMimeTypes: string[];
  allowedExtensions: string[];
  maxSizeBytes: number;
  maxFileCount: number;
}

export const APP_CAPABILITIES: Partial<Record<AppName, AppCapability[]>> = {
  instagram: [
    { allowedMimeTypes: ['image/jpeg', 'image/png'], allowedExtensions: ['.jpg', '.jpeg', '.png'], maxSizeBytes: 8 * 1024 * 1024, maxFileCount: 10 },
    { allowedMimeTypes: ['video/mp4', 'video/quicktime'], allowedExtensions: ['.mp4', '.mov'], maxSizeBytes: 100 * 1024 * 1024, maxFileCount: 10 }
  ],
  x: [
    { allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'], maxSizeBytes: 5 * 1024 * 1024, maxFileCount: 4 },
    { allowedMimeTypes: ['video/mp4', 'video/quicktime'], allowedExtensions: ['.mp4', '.mov'], maxSizeBytes: 512 * 1024 * 1024, maxFileCount: 1 }
  ],
  linkedin: [
    { allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'], allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif'], maxSizeBytes: 5 * 1024 * 1024, maxFileCount: 9 },
    { allowedMimeTypes: ['video/mp4', 'video/webm'], allowedExtensions: ['.mp4', '.webm'], maxSizeBytes: 5 * 1024 * 1024 * 1024, maxFileCount: 1 },
    { allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'], allowedExtensions: ['.pdf', '.doc', '.docx', '.ppt', '.pptx'], maxSizeBytes: 100 * 1024 * 1024, maxFileCount: 1 }
  ],
  github: [
    { 
      // Accept pretty much any text or code file
      allowedMimeTypes: ['*/*'], 
      allowedExtensions: ['.js', '.ts', '.tsx', '.jsx', '.py', '.html', '.css', '.json', '.md', '.txt', '.csv', '.yml', '.yaml'], 
      maxSizeBytes: 50 * 1024 * 1024, 
      maxFileCount: 100 
    }
  ]
};

export interface CompatibilityResult {
  isCompatible: boolean;
  reason?: string;
}

export function getFileCompatibility(file: File, selectedApps: AppName[]): Record<AppName, CompatibilityResult> {
  const result: Record<AppName, CompatibilityResult> = {} as Record<AppName, CompatibilityResult>;
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  
  for (const app of selectedApps) {
    const capabilities = APP_CAPABILITIES[app];
    if (!capabilities) {
      result[app] = { isCompatible: false, reason: `Platform ${app} constraints unknown.` };
      continue;
    }

    let isCompatible = false;
    let reason = `File type not supported on ${app}.`;

    for (const cap of capabilities) {
      const typeMatches = cap.allowedMimeTypes.includes('*/*') || cap.allowedMimeTypes.includes(file.type) || cap.allowedExtensions.includes(extension);
      
      if (typeMatches) {
        if (file.size > cap.maxSizeBytes) {
          reason = `File exceeds size limit of ${cap.maxSizeBytes / (1024 * 1024)}MB for ${app}.`;
        } else {
          isCompatible = true;
          reason = '';
          break;
        }
      }
    }

    result[app] = { isCompatible, reason: isCompatible ? undefined : reason };
  }

  return result;
}
