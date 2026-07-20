import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { AnalyzeButton } from './components/AnalyzeButton';
import { AnalyzingView } from './components/AnalyzingView';
import { DossierCard } from './components/DossierCard';
import { ErrorBanner } from './components/ErrorBanner';
import { GrainOverlay } from './components/GrainOverlay';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ResultView } from './components/ResultView';
import { useBatchControle } from './hooks/useBatchControle';
import { MAX_DOSSIERS } from './lib/constants';
import { dossierDisplayName, isDossierReady } from './lib/dossier';
import { validateFilePair } from './lib/validation';

export default function App() {
  const {
    dossiers,
    phase,
    progress,
    addDossier,
    removeDossier,
    updateDossier,
    launch,
    retryFailed,
    reset,
  } = useBatchControle();

  const [launchError, setLaunchError] = useState<string | null>(null);

  const allReady = dossiers.every(isDossierReady);
  const atMax = dossiers.length >= MAX_DOSSIERS;
  const count = dossiers.length;

  const handleAdd = () => {
    if (atMax) {
      setLaunchError(`Maximum ${MAX_DOSSIERS} dossiers par lot.`);
      return;
    }
    setLaunchError(null);
    addDossier();
  };

  const handleLaunch = () => {
    if (!allReady) return;
    for (let i = 0; i < dossiers.length; i++) {
      const d = dossiers[i];
      const pair = validateFilePair(d.hercule, d.chacal);
      if (!pair.ok) {
        setLaunchError(`${dossierDisplayName(d, i)} : ${pair.error}`);
        return;
      }
    }
    setLaunchError(null);
    launch();
  };

  const handleReset = () => {
    setLaunchError(null);
    reset();
  };

  const failures = dossiers
    .map((d, idx) => ({ d, label: dossierDisplayName(d, idx) }))
    .filter((x) => x.d.status === 'erreur')
    .map((x) => ({ label: x.label, error: x.d.error }));

  return (
    <div className="relative min-h-svh">
      <GrainOverlay />
      <div className="relative z-10 flex min-h-svh flex-col">
        <Header />
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-10 px-6 pb-14 sm:pb-20">
          <AnimatePresence mode="wait">
            {phase === 'editing' && (
              <motion.div
                key="editing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex w-full flex-col items-center gap-8"
              >
                <Hero compact={count > 1 || allReady} />
                <ErrorBanner message={launchError} onDismiss={() => setLaunchError(null)} />

                <div className="flex w-full flex-col gap-4">
                  <AnimatePresence initial={false}>
                    {dossiers.map((d, idx) => (
                      <DossierCard
                        key={d.id}
                        dossier={d}
                        index={idx}
                        canRemove={count > 1}
                        disabled={false}
                        onChange={(patch) => updateDossier(d.id, patch)}
                        onRemove={() => removeDossier(d.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={atMax}
                  className="flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
                >
                  <Plus size={16} />
                  {atMax ? `Maximum ${MAX_DOSSIERS} dossiers` : 'Ajouter un dossier'}
                </button>

                <div className="flex w-full justify-center">
                  <AnalyzeButton
                    ready={allReady}
                    onClick={handleLaunch}
                    label={count > 1 ? `Lancer les ${count} contrôles` : 'Lancer le contrôle'}
                  />
                </div>
              </motion.div>
            )}

            {phase === 'sending' && progress && (
              <motion.div
                key="sending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AnalyzingView
                  current={progress.current}
                  total={progress.total}
                  label={progress.label}
                />
              </motion.div>
            )}

            {phase === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex w-full flex-col items-center"
              >
                <ResultView
                  total={count}
                  failures={failures}
                  onReset={handleReset}
                  onRetryFailed={failures.length > 0 ? retryFailed : undefined}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
