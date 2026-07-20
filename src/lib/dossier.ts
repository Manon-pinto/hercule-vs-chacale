// Modèle "liste de dossiers" : l'app gère toujours une liste de 1 à N
// dossiers. Le libellé est purement front (identification dans l'UI et la
// progression) et n'est jamais envoyé au webhook.

export type DossierStatus = 'en attente' | 'envoi en cours' | 'envoyé' | 'erreur';

export type Dossier = {
  id: string;
  label: string;
  hercule: File[];
  chacal: File[];
  status: DossierStatus;
  error?: string;
};

let fallbackCounter = 0;

export function createEmptyDossier(): Dossier {
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `dossier-${Date.now()}-${fallbackCounter++}`;
  return { id, label: '', hercule: [], chacal: [], status: 'en attente' };
}

export function dossierDisplayName(dossier: Dossier, index: number): string {
  return dossier.label.trim() || `Dossier ${index + 1}`;
}

export function isDossierReady(dossier: Dossier): boolean {
  return dossier.hercule.length > 0 && dossier.chacal.length > 0;
}
