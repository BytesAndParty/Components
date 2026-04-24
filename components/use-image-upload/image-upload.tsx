import { ImagePlus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Hook ────────────────────────────────────────────────────────────────────

interface UseImageUploadProps {
  onUpload?: (url: string) => void;
}

export function useImageUpload({ onUpload }: UseImageUploadProps = {}) {
  const previewRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleThumbnailClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      previewRef.current = url;
      onUpload?.(url);
    },
    [onUpload]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    setPreviewUrl(null);
    setFileName(null);
    previewRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  return {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFile,
    handleFileChange,
    handleRemove,
  };
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const STYLE_ID = 'image-upload-styles';

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .iu-zone {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.75rem;
      border: 1.5px dashed var(--border, oklch(0.35 0 0));
      background: transparent;
      cursor: pointer;
      overflow: hidden;
      transition: border-color 0.2s ease, background 0.2s ease;
    }
    .iu-zone:hover {
      border-color: var(--accent, oklch(0.7 0.15 250));
      background: color-mix(in oklch, var(--accent, oklch(0.7 0.15 250)) 5%, transparent);
    }
    .iu-zone--dragging {
      border-color: var(--accent, oklch(0.7 0.15 250));
      border-style: solid;
      background: color-mix(in oklch, var(--accent, oklch(0.7 0.15 250)) 10%, transparent);
    }
    .iu-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: var(--muted-foreground, oklch(0.5 0 0));
      pointer-events: none;
      user-select: none;
      transition: color 0.2s ease;
    }
    .iu-zone:hover .iu-empty,
    .iu-zone--dragging .iu-empty {
      color: var(--accent, oklch(0.7 0.15 250));
    }
    .iu-empty-icon {
      transition: transform 0.2s ease;
    }
    .iu-zone:hover .iu-empty-icon,
    .iu-zone--dragging .iu-empty-icon {
      transform: translateY(-3px);
    }
    .iu-preview {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .iu-filename {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0.375rem 0.75rem;
      background: oklch(0 0 0 / 0.5);
      color: oklch(1 0 0 / 0.8);
      font-size: 0.75rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .iu-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: oklch(0 0 0 / 0.45);
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .iu-zone:hover .iu-overlay {
      opacity: 1;
    }
    .iu-remove {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      border: 1px solid oklch(1 0 0 / 0.2);
      background: oklch(0 0 0 / 0.55);
      color: oklch(1 0 0 / 0.9);
      font-size: 0.875rem;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .iu-remove:hover {
      background: oklch(0.3 0.1 25);
    }
  `;
  document.head.appendChild(style);
}

// ─── Component ───────────────────────────────────────────────────────────────

export interface ImageUploadProps {
  onUpload?: (url: string) => void;
  accept?: string;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export function ImageUpload({
  onUpload,
  accept = 'image/*',
  height = 200,
  className,
  style,
}: ImageUploadProps) {
  useEffect(() => { injectStyles(); }, []);

  const { previewUrl, fileName, fileInputRef, handleFile, handleFileChange, handleRemove } =
    useImageUpload({ onUpload });
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const zoneClass = [
    'iu-zone',
    isDragging ? 'iu-zone--dragging' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={zoneClass}
      style={{ height: typeof height === 'number' ? `${height}px` : height, ...style }}
      onClick={!previewUrl ? () => fileInputRef.current?.click() : undefined}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-slot="image-upload"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {previewUrl ? (
        <>
          <img src={previewUrl} alt={fileName ?? 'Preview'} className="iu-preview" />
          {fileName && <div className="iu-filename">{fileName}</div>}
          <div className="iu-overlay">
            <button
              type="button"
              className="iu-remove"
              onClick={(e) => { e.stopPropagation(); handleRemove(); }}
            >
              <Trash2 size={14} />
              Entfernen
            </button>
          </div>
        </>
      ) : (
        <div className="iu-empty">
          <ImagePlus className="iu-empty-icon" size={28} strokeWidth={1.5} />
          <span style={{ fontSize: '0.875rem' }}>
            {isDragging ? 'Loslassen zum Hochladen' : 'Klicken oder Bild ablegen'}
          </span>
        </div>
      )}
    </div>
  );
}
