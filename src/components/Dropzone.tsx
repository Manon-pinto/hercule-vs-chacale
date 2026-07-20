import { AnimatePresence, motion } from 'motion/react';
import { FileCheck, FileText, UploadCloud, X } from 'lucide-react';
import { useCallback, useId, useRef, useState } from 'react';
import { MAX_FILES_PER_ZONE } from '../lib/constants';
import { formatBytes, validatePdf } from '../lib/validation';

type Props = {
  label: string;
  subtitle: string;
  files: File[];
  onFilesChange: (files: File[]) => void;
  onError?: (message: string | null) => void;
  disabled?: boolean;
};

export function Dropzone({ label, subtitle, files, onFilesChange, onError, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [dragOver, setDragOver] = useState(false);
  const dragCounter = useRef(0);

  const handleFiles = useCallback(
    (picked: FileList | File[] | null | undefined) => {
      if (!picked) return;
      const incoming = Array.from(picked);
      if (incoming.length === 0) return;

      const next = [...files];
      let errorMsg: string | null = null;
      for (const f of incoming) {
        const result = validatePdf(f);
        if (!result.ok) {
          errorMsg = result.error;
          continue;
        }
        if (next.length >= MAX_FILES_PER_ZONE) {
          errorMsg = `Maximum ${MAX_FILES_PER_ZONE} fichiers par zone.`;
          continue;
        }
        next.push(f);
      }
      onError?.(errorMsg);
      if (next.length !== files.length) onFilesChange(next);
    },
    [files, onFilesChange, onError],
  );

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    dragCounter.current += 1;
    if (e.dataTransfer.items?.length) setDragOver(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setDragOver(false);
    }
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    e.dataTransfer.dropEffect = 'copy';
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    dragCounter.current = 0;
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeAt = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onFilesChange(files.filter((_, i) => i !== index));
    onError?.(null);
  };

  const hasFiles = files.length > 0;
  const isActive = dragOver;

  return (
    <motion.label
      htmlFor={inputId}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      whileHover={!disabled && !hasFiles ? { scale: 1.015 } : undefined}
      whileTap={!disabled && !hasFiles ? { scale: 0.995 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      aria-disabled={disabled}
      className="group relative flex min-h-[220px] max-h-[260px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border px-6 py-8 text-center transition-colors"
      style={{
        borderStyle: hasFiles ? 'solid' : 'dashed',
        borderColor: isActive
          ? 'var(--accent-primary)'
          : hasFiles
            ? 'var(--border-strong)'
            : 'var(--border-subtle)',
        background: isActive
          ? 'linear-gradient(180deg, rgba(243,146,0,0.08), rgba(243,146,0,0.02))'
          : hasFiles
            ? 'rgba(255,255,255,0.02)'
            : 'rgba(255,255,255,0.015)',
        boxShadow: isActive
          ? '0 0 0 1px rgba(243,146,0,0.3), 0 0 48px rgba(243,146,0,0.18)'
          : undefined,
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        onChange={onInputChange}
        className="sr-only"
        disabled={disabled}
      />
      <AnimatePresence mode="wait">
        {hasFiles ? (
          <motion.div
            key="loaded"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="flex w-full flex-col gap-2"
          >
            <div className="flex max-h-[150px] w-full flex-col gap-1.5 overflow-y-auto pr-1">
              {files.map((file, i) => (
                <div
                  key={`${file.name}-${file.size}-${i}`}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <FileCheck size={16} className="shrink-0" style={{ color: 'var(--success)' }} />
                  <div className="flex min-w-0 flex-1 flex-col text-left">
                    <span
                      className="truncate text-xs font-medium"
                      style={{ color: 'var(--text-primary)' }}
                      title={file.name}
                    >
                      {file.name}
                    </span>
                    <span
                      className="text-[10px] font-mono"
                      style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                    >
                      {formatBytes(file.size)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeAt(i)}
                    aria-label={`Retirer ${file.name}`}
                    className="shrink-0 rounded p-1 transition hover:bg-white/5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {files.length}/{MAX_FILES_PER_ZONE} · glisser ou cliquer pour ajouter
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl transition-colors"
              style={{
                background: isActive ? 'rgba(243,146,0,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isActive ? 'rgba(243,146,0,0.3)' : 'var(--border-subtle)'}`,
              }}
            >
              {isActive ? (
                <UploadCloud size={22} style={{ color: 'var(--accent-primary)' }} />
              ) : (
                <FileText size={22} style={{ color: 'var(--text-secondary)' }} />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {label}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {subtitle}
              </span>
            </div>
            <span
              className="mt-2 text-xs"
              style={{ color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)' }}
            >
              {isActive ? 'Relâchez pour déposer' : 'Glisser les PDF ou cliquer'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.label>
  );
}
