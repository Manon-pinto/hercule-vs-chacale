import {
  ACCEPTED_MIME,
  MAX_COMBINED_SIZE_BYTES,
  MAX_COMBINED_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  MAX_FILES_PER_ZONE,
} from './constants';

export type ValidationResult = { ok: true } | { ok: false; error: string };

export function validatePdf(file: File): ValidationResult {
  const isPdfMime = file.type === ACCEPTED_MIME;
  const isPdfExt = file.name.toLowerCase().endsWith('.pdf');
  if (!isPdfMime && !isPdfExt) {
    return { ok: false, error: 'Seuls les fichiers PDF sont acceptés.' };
  }
  if (file.size === 0) {
    return { ok: false, error: 'Le fichier est vide.' };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { ok: false, error: `Fichier trop lourd (max ${MAX_FILE_SIZE_MB} Mo).` };
  }
  return { ok: true };
}

export function validateFilePair(hercule: File[], chacal: File[]): ValidationResult {
  if (hercule.length < 1 || chacal.length < 1) {
    return {
      ok: false,
      error: 'Déposez au moins un fichier dans chaque zone (Hercule et Chacal).',
    };
  }
  if (hercule.length > MAX_FILES_PER_ZONE || chacal.length > MAX_FILES_PER_ZONE) {
    return {
      ok: false,
      error: `Maximum ${MAX_FILES_PER_ZONE} fichiers par zone.`,
    };
  }
  const combined = [...hercule, ...chacal].reduce((sum, f) => sum + f.size, 0);
  if (combined > MAX_COMBINED_SIZE_BYTES) {
    return {
      ok: false,
      error: `L'ensemble des fichiers dépasse ${MAX_COMBINED_SIZE_MB} Mo (limite technique). Contactez l'administrateur si cela se reproduit.`,
    };
  }
  return { ok: true };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} Ko`;
  return `${(kb / 1024).toFixed(1)} Mo`;
}
