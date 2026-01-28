'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  FileText, 
  Save, 
  Eye, 
  Trash2, 
  Plus, 
  GripVertical,
  Settings,
  Type,
  Hash,
  Calendar,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  User,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { TemplatePreviewDialog } from '@/components/dialogs/template-preview-dialog'
import { toast } from 'sonner'

const variableTypes = [
  { value: 'TEXT', label: 'Text', icon: Type, description: 'Fritext' },
  { value: 'NUMBER', label: 'Nummer', icon: Hash, description: 'Heltal eller decimal' },
  { value: 'DATE', label: 'Datum', icon: Calendar, description: 'ÅÅÅÅ-MM-DD' },
  { value: 'CURRENCY', label: 'Belopp (kr)', icon: CreditCard, description: 'Svensk valuta' },
  { value: 'EMAIL', label: 'E-post', icon: Mail, description: 'E-postadress' },
  { value: 'PHONE', label: 'Telefon', icon: Phone, description: 'Telefonnummer' },
  { value: 'ADDRESS', label: 'Adress', icon: MapPin, description: 'Fullständig adress' },
  { value: 'PERSONAL_NUMBER', label: 'Personnummer', icon: User, description: 'ÅÅÅÅMMDD-XXXX' },
]

interface TemplateVariable {
  id: string
  name: string
  label: string
  placeholder: string
  type: string
  required: boolean
  defaultValue: string | null
  description: string | null
  sortOrder: number
}

interface Template {
  id: string
  name: string
  description: string | null
  originalFileName: string
  originalFileType: string
  isDefault: boolean
  isActive: boolean
  variables: TemplateVariable[]
  _count: {
    contracts: number
  }
}

// Mock data - ersätt med data från server
const mockTemplate: Template = {
  id: '1',
  name: 'Standard hyresavtal',
  description: 'Generell mall för bostadslägenheter',
  originalFileName: 'hyresavtal_standard.docx',
  originalFileType: 'docx',
  isDefault: true,
  isActive: true,
  _count: {
    contracts: 24,
  },
  variables: [
    { id: '1', name: 'tenant_name', label: 'Hyresgästens namn', placeholder: '{{tenant_name}}', type: 'TEXT', required: true, defaultValue: null, description: null, sortOrder: 0 },
    { id: '2', name: 'tenant_personal_number', label: 'Personnummer', placeholder: '{{tenant_personal_number}}', type: 'PERSONAL_NUMBER', required: true, defaultValue: null, description: 'Format: YYYYMMDD-XXXX', sortOrder: 1 },
    { id: '3', name: 'tenant_email', label: 'E-postadress', placeholder: '{{tenant_email}}', type: 'EMAIL', required: true, defaultValue: null, description: null, sortOrder: 2 },
    { id: '4', name: 'tenant_phone', label: 'Telefonnummer', placeholder: '{{tenant_phone}}', type: 'PHONE', required: false, defaultValue: null, description: null, sortOrder: 3 },
    { id: '5', name: 'property_address', label: 'Fastighetsadress', placeholder: '{{property_address}}', type: 'ADDRESS', required: true, defaultValue: null, description: null, sortOrder: 4 },
    { id: '6', name: 'unit_label', label: 'Lägenhetsnummer', placeholder: '{{unit_label}}', type: 'TEXT', required: true, defaultValue: null, description: null, sortOrder: 5 },
    { id: '7', name: 'rent_amount', label: 'Månadshyra', placeholder: '{{rent_amount}}', type: 'CURRENCY', required: true, defaultValue: null, description: null, sortOrder: 6 },
    { id: '8', name: 'deposit_amount', label: 'Depositionsbelopp', placeholder: '{{deposit_amount}}', type: 'CURRENCY', required: true, defaultValue: null, description: 'Vanligtvis 1-3 månadshyror', sortOrder: 7 },
    { id: '9', name: 'contract_start_date', label: 'Startdatum', placeholder: '{{contract_start_date}}', type: 'DATE', required: true, defaultValue: null, description: null, sortOrder: 8 },
    { id: '10', name: 'contract_end_date', label: 'Slutdatum', placeholder: '{{contract_end_date}}', type: 'DATE', required: false, defaultValue: null, description: 'Lämna tomt för tillsvidare', sortOrder: 9 },
  ],
}

export default function TemplateDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  // Template data
  const [template, setTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Form state
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [isDefault, setIsDefault] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [variables, setVariables] = useState<TemplateVariable[]>([])
  
  // UI state
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [expandedVariables, setExpandedVariables] = useState<string[]>([])

  // Load template data
  useEffect(() => {
    loadTemplate()
  }, [params.id])

  const loadTemplate = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // TODO: Ersätt med riktig API-anrop
      // const data = await getTemplate(params.id)
      const data = mockTemplate // Mock för nu
      
      if (!data) {
        setError('Mall hittades inte')
        return
      }
      
      setTemplate(data)
      setTemplateName(data.name)
      setTemplateDescription(data.description || '')
      setIsDefault(data.isDefault)
      setIsActive(data.isActive)
      setVariables(data.variables)
    } catch (err) {
      setError('Kunde inte ladda mallen')
    } finally {
      setIsLoading(false)
    }
  }

  // Track changes
  useEffect(() => {
    if (!template) return
    
    const nameChanged = templateName !== template.name
    const descChanged = templateDescription !== (template.description || '')
    const defaultChanged = isDefault !== template.isDefault
    const activeChanged = isActive !== template.isActive
    const varsChanged = JSON.stringify(variables) !== JSON.stringify(template.variables)
    
    setHasChanges(nameChanged || descChanged || defaultChanged || activeChanged || varsChanged)
  }, [templateName, templateDescription, isDefault, isActive, variables, template])

  const updateVariable = (id: string, field: keyof TemplateVariable, value: any) => {
    setVariables(prev => prev.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ))
  }

  const removeVariable = (id: string) => {
    setVariables(prev => prev.filter(v => v.id !== id))
    setExpandedVariables(prev => prev.filter(i => i !== id))
  }

  const addVariable = () => {
    const newId = `new-${Date.now()}`
    const newVariable: TemplateVariable = {
      id: newId,
      name: `new_variable_${variables.length + 1}`,
      label: 'Ny variabel',
      placeholder: `{{new_variable_${variables.length + 1}}}`,
      type: 'TEXT',
      required: false,
      defaultValue: null,
      description: null,
      sortOrder: variables.length,
    }
    setVariables(prev => [...prev, newVariable])
    setExpandedVariables(prev => [...prev, newId])
  }

  const handleSave = async () => {
    if (!template) return
    
    setIsSaving(true)
    setSaveSuccess(false)
    
    try {
      // Spara mall-inställningar
      startTransition(async () => {
        // TODO: Ersätt med riktiga API-anrop
        // await updateTemplate({
        //   id: template.id,
        //   name: templateName,
        //   description: templateDescription || undefined,
        //   isDefault,
        //   isActive,
        // })
        
        // Spara variabler
        // await updateTemplateVariables(template.id, variables.map(v => ({
        //   name: v.name,
        //   label: v.label,
        //   placeholder: v.placeholder,
        //   type: v.type as any,
        //   required: v.required,
        //   defaultValue: v.defaultValue || undefined,
        //   description: v.description || undefined,
        //   sortOrder: v.sortOrder,
        // })))
        
        // Simulera sparning
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setSaveSuccess(true)
        setHasChanges(false)
        toast.success('Ändringar sparade!')
        
        // Uppdatera template state
        setTemplate({
          ...template,
          name: templateName,
          description: templateDescription || null,
          isDefault,
          isActive,
          variables,
        })
        
        setTimeout(() => setSaveSuccess(false), 3000)
      })
    } catch (err) {
      toast.error('Kunde inte spara ändringar')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!template) return
    
    try {
      // TODO: Ersätt med riktig API-anrop
      // await deleteTemplate(template.id)
      
      toast.success('Mall borttagen')
      router.push('/dashboard/templates')
    } catch (err) {
      toast.error('Kunde inte ta bort mallen')
    }
  }

  const getTypeIcon = (type: string) => {
    const found = variableTypes.find(t => t.value === type)
    return found?.icon || Type
  }

  const getTypeLabel = (type: string) => {
    const found = variableTypes.find(t => t.value === type)
    return found?.label || type
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !template) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">{error || 'Mall hittades inte'}</p>
        <Button variant="outline" onClick={() => router.push('/dashboard/templates')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tillbaka till mallar
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/dashboard/avtalsmallar" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Tillbaka till mallar
        </Link>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{template.name}</h1>
                {template.isDefault && (
                  <Badge variant="default" className="text-xs">Standard</Badge>
                )}
                {!template.isActive && (
                  <Badge variant="secondary" className="text-xs">Inaktiv</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {template.originalFileName} • {template._count.contracts} avtal skapade
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
              <Eye className="mr-2 h-4 w-4" />
              Förhandsgranska
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : saveSuccess ? (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isSaving ? 'Sparar...' : saveSuccess ? 'Sparat!' : 'Spara ändringar'}
            </Button>
          </div>
        </div>

        {/* Unsaved changes warning */}
        {hasChanges && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Du har osparade ändringar. Glöm inte att spara innan du lämnar sidan.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Variables List */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Variabler ({variables.length})</CardTitle>
                  <CardDescription>
                    Konfigurera variablerna som används i din mall. Använd formatet {`{{variabelnamn}}`} i ditt dokument.
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={addVariable}>
                  <Plus className="mr-2 h-4 w-4" />
                  Lägg till
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {variables.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Inga variabler definierade.</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={addVariable}>
                    <Plus className="mr-2 h-4 w-4" />
                    Lägg till första variabeln
                  </Button>
                </div>
              ) : (
                <Accordion 
                  type="multiple" 
                  value={expandedVariables}
                  onValueChange={setExpandedVariables}
                  className="w-full"
                >
                  {variables.map((variable, index) => {
                    const TypeIcon = getTypeIcon(variable.type)
                    return (
                      <AccordionItem key={variable.id} value={variable.id} className="border rounded-lg mb-2 px-4">
                        <AccordionTrigger className="hover:no-underline py-3">
                          <div className="flex items-center gap-3 flex-1 text-left">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab flex-shrink-0" />
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-muted flex-shrink-0">
                              <TypeIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium truncate">{variable.label}</span>
                                {variable.required && (
                                  <Badge variant="secondary" className="text-[10px] flex-shrink-0">Obligatorisk</Badge>
                                )}
                              </div>
                              <code className="text-xs text-muted-foreground">
                                {variable.placeholder}
                              </code>
                            </div>
                            <Badge variant="outline" className="text-[10px] flex-shrink-0 hidden sm:inline-flex">
                              {getTypeLabel(variable.type)}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid gap-4 pt-4 pb-2">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor={`label-${variable.id}`}>Etikett</Label>
                                <Input
                                  id={`label-${variable.id}`}
                                  value={variable.label}
                                  onChange={(e) => updateVariable(variable.id, 'label', e.target.value)}
                                  placeholder="Visningsnamn"
                                />
                                <p className="text-xs text-muted-foreground">
                                  Namnet som visas i formuläret
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`name-${variable.id}`}>Variabelnamn</Label>
                                <Input
                                  id={`name-${variable.id}`}
                                  value={variable.name}
                                  onChange={(e) => {
                                    const newName = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_')
                                    updateVariable(variable.id, 'name', newName)
                                    updateVariable(variable.id, 'placeholder', `{{${newName}}}`)
                                  }}
                                  placeholder="variabel_namn"
                                  className="font-mono text-sm"
                                />
                                <p className="text-xs text-muted-foreground">
                                  Används i mallen: <code className="bg-muted px-1 rounded">{variable.placeholder}</code>
                                </p>
                              </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor={`type-${variable.id}`}>Typ</Label>
                                <Select
                                  value={variable.type}
                                  onValueChange={(value) => updateVariable(variable.id, 'type', value)}
                                >
                                  <SelectTrigger id={`type-${variable.id}`}>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {variableTypes.map(type => (
                                      <SelectItem key={type.value} value={type.value}>
                                        <div className="flex items-center gap-2">
                                          <type.icon className="h-4 w-4 text-muted-foreground" />
                                          <span>{type.label}</span>
                                          <span className="text-xs text-muted-foreground">– {type.description}</span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`default-${variable.id}`}>Standardvärde</Label>
                                <Input
                                  id={`default-${variable.id}`}
                                  value={variable.defaultValue || ''}
                                  onChange={(e) => updateVariable(variable.id, 'defaultValue', e.target.value || null)}
                                  placeholder="Lämna tomt om inget"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`desc-${variable.id}`}>Hjälptext (valfritt)</Label>
                              <Input
                                id={`desc-${variable.id}`}
                                value={variable.description || ''}
                                onChange={(e) => updateVariable(variable.id, 'description', e.target.value || null)}
                                placeholder="Instruktioner eller exempel för användaren"
                              />
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="flex items-center gap-3">
                                <Switch
                                  id={`required-${variable.id}`}
                                  checked={variable.required}
                                  onCheckedChange={(checked) => updateVariable(variable.id, 'required', checked)}
                                />
                                <Label htmlFor={`required-${variable.id}`} className="text-sm cursor-pointer">
                                  Obligatorisk
                                </Label>
                              </div>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Ta bort
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Ta bort variabel?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Är du säker på att du vill ta bort variabeln "{variable.label}"? 
                                      Detta påverkar inte befintliga avtal men variabeln kommer inte längre 
                                      att fyllas i för nya avtal.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Avbryt</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => removeVariable(variable.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Ta bort
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Template Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Mallinställningar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="templateName">Mallnamn</Label>
                <Input 
                  id="templateName"
                  value={templateName} 
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="templateDescription">Beskrivning</Label>
                <Textarea 
                  id="templateDescription"
                  value={templateDescription} 
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Beskriv vad mallen används till"
                  rows={3}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isDefault">Standardmall</Label>
                  <p className="text-xs text-muted-foreground">
                    Används som standard vid nya avtal
                  </p>
                </div>
                <Switch 
                  id="isDefault"
                  checked={isDefault} 
                  onCheckedChange={setIsDefault}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isActive">Aktiv</Label>
                  <p className="text-xs text-muted-foreground">
                    Kan användas för nya avtal
                  </p>
                </div>
                <Switch 
                  id="isActive"
                  checked={isActive} 
                  onCheckedChange={setIsActive}
                />
              </div>
            </CardContent>
          </Card>

          {/* File Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Originalfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{template.originalFileName}</p>
                  <p className="text-xs text-muted-foreground uppercase">{template.originalFileType}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href={`/api/templates/${template.id}/download`} download>
                  Ladda ner original
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-muted/50 border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">💡 Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>
                <strong className="text-foreground">Variabelformat:</strong> Använd {`{{variabel_namn}}`} i ditt dokument.
              </p>
              <p>
                <strong className="text-foreground">Namngivning:</strong> Använd snake_case (t.ex. <code>tenant_name</code>).
              </p>
              <p>
                <strong className="text-foreground">Auto-ifyllning:</strong> Vissa variabler fylls automatiskt från hyresgäst- och enhetsdata.
              </p>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-destructive">Farozon</CardTitle>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Ta bort mall
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Ta bort mall permanent?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Detta kan inte ångras. Mallen "{template.name}" kommer att tas bort permanent.
                      {template._count.contracts > 0 && (
                        <span className="block mt-2 font-medium text-foreground">
                          ⚠️ Det finns {template._count.contracts} avtal skapade med denna mall.
                        </span>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Avbryt</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Ta bort permanent
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Befintliga avtal påverkas inte
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Dialog */}
      <TemplatePreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        templateId={template.id}
        templateName={template.name}
      />
    </div>
  )
}