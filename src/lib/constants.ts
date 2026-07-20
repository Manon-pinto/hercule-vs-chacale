export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const MAX_COMBINED_SIZE_MB = 20;
export const MAX_COMBINED_SIZE_BYTES = MAX_COMBINED_SIZE_MB * 1024 * 1024;

export const MAX_FILES_PER_ZONE = 5;

export const MAX_DOSSIERS = 15;

export const ACCEPTED_MIME = 'application/pdf';
export const REQUEST_TIMEOUT_MS = 180_000;

export const SUPPORT_EMAIL = 'controle@rpimenuiserie.com';

export type ProgressStep = { fromMs: number; text: string };

export const PROGRESS_STEPS: readonly ProgressStep[] = [
  { fromMs: 0, text: 'Lecture des documents' },
  { fromMs: 3_000, text: 'Extraction des données (Claude AI)' },
  { fromMs: 10_000, text: 'Comparaison des références' },
  { fromMs: 18_000, text: 'Génération du rapport' },
] as const;
