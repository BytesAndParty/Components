import { useEffect, useRef, useState } from 'react'

interface UseImageUploadProps {
  onUpload?: (url: string) => void
}

export function useImageUpload({ onUpload }: UseImageUploadProps = {}) {
  const previewRef = useRef<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleThumbnailClick = () => {
    fileInputRef.current?.click()
  }

  const handleFile = (file: File) => {
    setFileName(file.name)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    previewRef.current = url
    onUpload?.(url)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleRemove = () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    setPreviewUrl(null)
    setFileName(null)
    previewRef.current = null
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    }
  }, [])

  return {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFile,
    handleFileChange,
    handleRemove,
  }
}
