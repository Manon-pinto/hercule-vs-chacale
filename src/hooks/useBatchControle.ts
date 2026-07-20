import { useCallback, useRef, useState } from 'react';
import { ControleError, submitControle } from '../lib/api';
import { MAX_DOSSIERS } from '../lib/constants';
import { type Dossier, createEmptyDossier, dossierDisplayName } from '../lib/dossier';

export type BatchPhase = 'editing' | 'sending' | 'done';

export type BatchProgress = {
  current: number;
  total: number;
  label: string;
};

type Target = { dossier: Dossier; name: string };

type DossierPatch = Partial<Pick<Dossier, 'label' | 'hercule' | 'chacal'>>;

export function useBatchControle() {
  const [dossiers, setDossiers] = useState<Dossier[]>(() => [createEmptyDossier()]);
  const [phase, setPhase] = useState<BatchPhase>('editing');
  const [progress, setProgress] = useState<BatchProgress | null>(null);
  const sendingRef = useRef(false);

  const addDossier = useCallback(() => {
    setDossiers((prev) =>
      prev.length >= MAX_DOSSIERS ? prev : [...prev, createEmptyDossier()],
    );
  }, []);

  const removeDossier = useCallback((id: string) => {
    setDossiers((prev) => (prev.length <= 1 ? prev : prev.filter((d) => d.id !== id)));
  }, []);

  const updateDossier = useCallback((id: string, patch: DossierPatch) => {
    setDossiers((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }, []);

  // Envoi en SÉRIE STRICTE : un seul POST en vol, on attend l'accusé 200
  // avant de passer au dossier suivant. Un échec n'interrompt pas le lot.
  const runSerial = useCallback(async (targets: Target[]) => {
    if (sendingRef.current || targets.length === 0) return;
    sendingRef.current = true;
    setPhase('sending');

    const targetIds = new Set(targets.map((t) => t.dossier.id));
    setDossiers((prev) =>
      prev.map((d) =>
        targetIds.has(d.id) ? { ...d, status: 'en attente', error: undefined } : d,
      ),
    );

    const total = targets.length;
    for (let i = 0; i < targets.length; i++) {
      const { dossier, name } = targets[i];
      setProgress({ current: i + 1, total, label: name });
      setDossiers((prev) =>
        prev.map((d) =>
          d.id === dossier.id ? { ...d, status: 'envoi en cours', error: undefined } : d,
        ),
      );
      try {
        await submitControle(dossier.hercule, dossier.chacal);
        setDossiers((prev) =>
          prev.map((d) => (d.id === dossier.id ? { ...d, status: 'envoyé' } : d)),
        );
      } catch (err) {
        const message =
          err instanceof ControleError ? err.message : 'Une erreur inattendue est survenue.';
        setDossiers((prev) =>
          prev.map((d) =>
            d.id === dossier.id ? { ...d, status: 'erreur', error: message } : d,
          ),
        );
      }
    }

    setProgress(null);
    setPhase('done');
    sendingRef.current = false;
  }, []);

  const launch = useCallback(() => {
    const targets = dossiers.map((d, idx) => ({ dossier: d, name: dossierDisplayName(d, idx) }));
    void runSerial(targets);
  }, [dossiers, runSerial]);

  const retryFailed = useCallback(() => {
    const targets = dossiers
      .map((d, idx) => ({ dossier: d, name: dossierDisplayName(d, idx) }))
      .filter((t) => t.dossier.status === 'erreur');
    void runSerial(targets);
  }, [dossiers, runSerial]);

  const reset = useCallback(() => {
    if (sendingRef.current) return;
    setDossiers([createEmptyDossier()]);
    setProgress(null);
    setPhase('editing');
  }, []);

  return {
    dossiers,
    phase,
    progress,
    addDossier,
    removeDossier,
    updateDossier,
    launch,
    retryFailed,
    reset,
  };
}
