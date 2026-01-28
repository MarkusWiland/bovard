'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface TemplateUploadDialogProps {
  onClose: () => void
}

type UploadStep = 'upload' | 'processing' | 'configure' | 'complete'

interface DetectedVariable {
  name: string
  placeholder: string
  suggestedLabel: string
  suggestedType: string
  occurrences: number
}

export function TemplateUploadDialog({ onClose }: TemplateUploadDialogProps) {
  const [step, setStep] = useState<UploadStep>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [detectedVariables, setDetectedVariables] = useState<DetectedVariable[]>([])
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      setTemplateName(uploadedFile.name.replace(/\.(docx|pdf)$/i, ''))
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDropRejected: (rejections: any) => {
      const rejection = rejections[0]
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('Filen är för stor. Max 10MB.')
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Endast .docx och .pdf filer stöds.')
      }
    },
  })

  const handleUpload = async () => {
    if (!file || !templateName) return

    setStep('processing')
    setUploadProgress(0)

    try {
      // Simulera uppladdning och bearbetning
      // I produktion: Använd server action eller API route
      
      // Steg 1: Ladda upp fil
      for (let i = 0; i <= 40; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setUploadProgress(i)
      }

      // Steg 2: Analysera dokument för variabler
      for (let i = 40; i <= 80; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 300))
        setUploadProgress(i)
      }

      // Simulera detekterade variabler
      const mockVariables: DetectedVariable[] = [
        { name: 'tenant_name', placeholder: '{{tenant_name}}', suggestedLabel: 'Hyresgästens namn', suggestedType: 'TEXT', occurrences: 3 },
        { name: 'tenant_personal_number', placeholder: '{{tenant_personal_number}}', suggestedLabel: 'Personnummer', suggestedType: 'PERSONAL_NUMBER', occurrences: 1 },
        { name: 'tenant_email', placeholder: '{{tenant_email}}', suggestedLabel: 'E-postadress', suggestedType: 'EMAIL', occurrences: 1 },
        { name: 'tenant_phone', placeholder: '{{tenant_phone}}', suggestedLabel: 'Telefonnummer', suggestedType: 'PHONE', occurrences: 1 },
        { name: 'property_address', placeholder: '{{property_address}}', suggestedLabel: 'Fastighetsadress', suggestedType: 'ADDRESS', occurrences: 2 },
        { name: 'unit_label', placeholder: '{{unit_label}}', suggestedLabel: 'Lägenhetsnummer', suggestedType: 'TEXT', occurrences: 2 },
        { name: 'rent_amount', placeholder: '{{rent_amount}}', suggestedLabel: 'Månadshyra', suggestedType: 'CURRENCY', occurrences: 2 },
        { name: 'deposit_amount', placeholder: '{{deposit_amount}}', suggestedLabel: 'Depositionsbelopp', suggestedType: 'CURRENCY', occurrences: 1 },
        { name: 'contract_start_date', placeholder: '{{contract_start_date}}', suggestedLabel: 'Startdatum', suggestedType: 'DATE', occurrences: 1 },
        { name: 'contract_end_date', placeholder: '{{contract_end_date}}', suggestedLabel: 'Slutdatum', suggestedType: 'DATE', occurrences: 1 },
      ]

      setDetectedVariables(mockVariables)

      // Steg 3: Klar
      for (let i = 80; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setUploadProgress(i)
      }

      setStep('configure')
    } catch (err) {
      setError('Något gick fel vid uppladdningen. Försök igen.')
      setStep('upload')
    }
  }

  const handleSave = async () => {
    // TODO: Spara mall med server action
    setStep('complete')
    
    // Stäng dialog efter 2 sekunder
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  const removeFile = () => {
    setFile(null)
    setTemplateName('')
    setError(null)
  }

  return (
    <DialogContent className="sm:max-w-xl">
      {step === 'upload' && (
        <>
          <DialogHeader>
            <DialogTitle>Ladda upp avtalsmall</DialogTitle>
            <DialogDescription>
              Ladda upp ditt befintliga Word- eller PDF-avtal. Vi detekterar automatiskt variabler markerade med {`{{variabelnamn}}`}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Dropzone */}
            {!file ? (
              <div
                {...getRootProps()}
                className={cn(
                  'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer',
                  isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
                  error && 'border-destructive'
                )}
              >
                <input {...getInputProps()} />
                <div className="rounded-full bg-muted p-4 mb-4">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium mb-1">
                  {isDragActive ? 'Släpp filen här...' : 'Dra och släpp din mall här'}
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  eller klicka för att välja fil
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="px-2 py-1 rounded bg-muted">.docx</span>
                  <span className="px-2 py-1 rounded bg-muted">.pdf</span>
                  <span>Max 10MB</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={removeFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {/* Template Name */}
            <div className="space-y-2">
              <Label htmlFor="templateName">Mallnamn</Label>
              <Input
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="t.ex. Standard hyresavtal"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="templateDescription">Beskrivning (valfritt)</Label>
              <Textarea
                id="templateDescription"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="t.ex. Generell mall för bostadslägenheter"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Avbryt
            </Button>
            <Button onClick={handleUpload} disabled={!file || !templateName}>
              Fortsätt
            </Button>
          </DialogFooter>
        </>
      )}

      {step === 'processing' && (
        <>
          <DialogHeader>
            <DialogTitle>Bearbetar mall...</DialogTitle>
            <DialogDescription>
              Vi laddar upp och analyserar ditt dokument för att hitta variabler.
            </DialogDescription>
          </DialogHeader>

          <div className="py-8 space-y-4">
            <Progress value={uploadProgress} className="w-full" />
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {uploadProgress < 40 && 'Laddar upp fil...'}
              {uploadProgress >= 40 && uploadProgress < 80 && 'Analyserar dokument...'}
              {uploadProgress >= 80 && 'Slutför...'}
            </div>
          </div>
        </>
      )}

      {step === 'configure' && (
        <>
          <DialogHeader>
            <DialogTitle>Detekterade variabler</DialogTitle>
            <DialogDescription>
              Vi hittade {detectedVariables.length} variabler i ditt dokument. Granska och justera vid behov.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 max-h-[400px] overflow-y-auto">
            <div className="space-y-3">
              {detectedVariables.map((variable, index) => (
                <div
                  key={variable.name}
                  className="flex items-center gap-4 p-3 rounded-lg border bg-card"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                        {variable.placeholder}
                      </code>
                      <span className="text-xs text-muted-foreground">
                        ×{variable.occurrences}
                      </span>
                    </div>
                    <p className="text-sm font-medium mt-1">{variable.suggestedLabel}</p>
                  </div>
                  <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted">
                    {variable.suggestedType}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStep('upload')}>
              Tillbaka
            </Button>
            <Button onClick={handleSave}>
              Spara mall
            </Button>
          </DialogFooter>
        </>
      )}

      {step === 'complete' && (
        <>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              Mall sparad!
            </DialogTitle>
            <DialogDescription>
              Din avtalsmall "{templateName}" är nu redo att användas.
            </DialogDescription>
          </DialogHeader>

          <div className="py-8 flex flex-col items-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Du kan nu skapa avtal baserat på denna mall.
            </p>
          </div>
        </>
      )}
    </DialogContent>
  )
}