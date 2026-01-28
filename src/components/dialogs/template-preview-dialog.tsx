'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, X, Loader2, FileText, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface TemplatePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  templateId: string
  templateName: string
  previewData?: {
    pages: string[] // Base64-encoded images or URLs
    totalPages: number
    fileType: string
  }
}

export function TemplatePreviewDialog({
  open,
  onOpenChange,
  templateId,
  templateName,
  previewData: initialPreviewData,
}: TemplatePreviewDialogProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [previewData, setPreviewData] = useState(initialPreviewData)

  // Ladda förhandsgranskning när dialogen öppnas
  useEffect(() => {
    if (open && !previewData) {
      loadPreview()
    }
  }, [open, templateId])

  // Reset vid nytt template
  useEffect(() => {
    setCurrentPage(1)
    setZoom(100)
  }, [templateId])

  const loadPreview = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/templates/${templateId}/preview`)
      
      if (!response.ok) {
        throw new Error('Kunde inte ladda förhandsgranskning')
      }

      const data = await response.json()
      setPreviewData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod')
    } finally {
      setIsLoading(false)
    }
  }

  const nextPage = () => {
    if (previewData && currentPage < previewData.totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const zoomIn = () => {
    setZoom(Math.min(zoom + 25, 200))
  }

  const zoomOut = () => {
    setZoom(Math.max(zoom - 25, 50))
  }

  const handleDownload = () => {
    // Öppna original-filen i ny flik för nedladdning
    window.open(`/api/templates/${templateId}/download`, '_blank')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base">{templateName}</DialogTitle>
              <DialogDescription className="text-xs">
                {previewData ? `${previewData.totalPages} sidor • ${previewData.fileType.toUpperCase()}` : 'Laddar...'}
              </DialogDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom controls */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={zoomOut}
                disabled={zoom <= 50}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={zoomIn}
                disabled={zoom >= 200}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Download */}
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Ladda ner
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-muted/30 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">Förbereder förhandsgranskning...</p>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="rounded-full bg-destructive/10 p-4 mb-4">
                <X className="h-8 w-8 text-destructive" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button variant="outline" onClick={loadPreview}>
                Försök igen
              </Button>
            </div>
          ) : previewData ? (
            <div className="flex items-center justify-center min-h-full p-8">
              <div
                className="bg-white shadow-2xl transition-transform duration-200"
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'center center',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewData.pages[currentPage - 1]}
                  alt={`Sida ${currentPage}`}
                  className="max-w-none"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer - Page navigation */}
        {previewData && previewData.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 px-6 py-4 border-t bg-background">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Föregående
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: previewData.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'h-8 w-8 rounded text-sm font-medium transition-colors',
                    currentPage === page
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  {page}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === previewData.totalPages}
            >
              Nästa
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

/**
 * Inline preview komponent för att visa i kort/cards
 */
export function TemplatePreviewThumbnail({
  templateId,
  className,
}: {
  templateId: string
  className?: string
}) {
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadThumbnail()
  }, [templateId])

  const loadThumbnail = async () => {
    try {
      const response = await fetch(`/api/templates/${templateId}/thumbnail`)
      if (response.ok) {
        const data = await response.json()
        setThumbnail(data.thumbnail)
      }
    } catch {
      // Ignore errors for thumbnails
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center bg-muted', className)}>
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!thumbnail) {
    return (
      <div className={cn('flex items-center justify-center bg-muted', className)}>
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={thumbnail}
      alt="Förhandsgranskning"
      className={cn('object-cover', className)}
    />
  )
}