'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, FileText, MoreHorizontal, Upload, Trash2, Edit, Eye, Copy, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog'
import { TemplateUploadDialog } from '@/components/dialogs/template-upload-dialog'
import { TemplatePreviewDialog } from '@/components/dialogs/template-preview-dialog'

// TODO: Ersätt med data från server
const mockTemplates = [
  {
    id: '1',
    name: 'Standard hyresavtal',
    description: 'Generell mall för bostadslägenheter',
    originalFileName: 'hyresavtal_standard.docx',
    originalFileType: 'docx',
    isDefault: true,
    isActive: true,
    variablesCount: 12,
    contractsCount: 24,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: '2',
    name: 'Korttidsuthyrning',
    description: 'För uthyrning kortare än 6 månader',
    originalFileName: 'korttid_avtal.pdf',
    originalFileType: 'pdf',
    isDefault: false,
    isActive: true,
    variablesCount: 8,
    contractsCount: 5,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
]

export default function TemplatesPage() {
  const router = useRouter()
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<{
    id: string
    name: string
  } | null>(null)

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Avtalsmallar</h1>
          <p className="text-muted-foreground mt-1">
            Hantera dina avtalsmallar och definiera variabler
          </p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ladda upp mall
            </Button>
          </DialogTrigger>
          <TemplateUploadDialog onClose={() => setIsUploadOpen(false)} />
        </Dialog>
      </div>

      {/* Empty State */}
      {mockTemplates.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Inga mallar ännu</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Ladda upp ditt första avtal i Word- eller PDF-format för att komma igång.
            </p>
            <Button onClick={() => setIsUploadOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Ladda upp din första mall
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Templates Grid */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockTemplates.map((template: any) => (
            <Link href={`/dashboard/avtalsmallar/${template.id.toString()}`} key={template.id}>

            <Card 
              key={template.id} 
              className="group relative overflow-hidden transition-all hover:shadow-lg cursor-pointer"
              
              >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{template.name}</CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {template.originalFileName}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                        >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        setPreviewTemplate({ id: template.id, name: template.name })
                      }}>
                        <Eye className="mr-2 h-4 w-4" />
                        Förhandsgranska
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/dashboard/templates/${template.id}`)
                      }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Redigera variabler
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicera
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => e.stopPropagation()}
                        >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Ta bort
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                {template.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {template.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2 mb-4">
                  {template.isDefault && (
                    <Badge variant="default" className="text-xs">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Standard
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs uppercase">
                    {template.originalFileType}
                  </Badge>
                  {!template.isActive && (
                    <Badge variant="secondary" className="text-xs">
                      Inaktiv
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                  <span>{template.variablesCount} variabler</span>
                  <span>{template.contractsCount} avtal skapade</span>
                </div>
              </CardContent>
            </Card>
                  </Link>
          ))}

          {/* Add New Template Card */}
          <Card 
            className="border-dashed cursor-pointer transition-all hover:border-primary hover:bg-muted/50"
            onClick={() => setIsUploadOpen(true)}
          >
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px]">
              <div className="rounded-full bg-muted p-3 mb-3">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Lägg till mall</p>
              <p className="text-xs text-muted-foreground">Word eller PDF</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Preview Dialog */}
      {previewTemplate && (
        <TemplatePreviewDialog
          open={!!previewTemplate}
          onOpenChange={(open: boolean) => !open && setPreviewTemplate(null)}
          templateId={previewTemplate.id}
          templateName={previewTemplate.name}
        />
      )}
    </div>
  )
}