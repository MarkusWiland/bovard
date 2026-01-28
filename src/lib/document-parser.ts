import mammoth from 'mammoth'
import * as pdfParse from 'pdf-parse'

export interface DetectedVariable {
  name: string
  placeholder: string
  suggestedLabel: string
  suggestedType: 'TEXT' | 'NUMBER' | 'DATE' | 'CURRENCY' | 'EMAIL' | 'PHONE' | 'ADDRESS' | 'PERSONAL_NUMBER'
  occurrences: number
}

// Regex för att hitta {{variabel}} mönster
const VARIABLE_PATTERN = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g

// Mappning av vanliga variabelnamn till typer
const TYPE_MAPPINGS: Record<string, DetectedVariable['suggestedType']> = {
  // Personuppgifter
  'name': 'TEXT',
  'tenant_name': 'TEXT',
  'landlord_name': 'TEXT',
  'full_name': 'TEXT',
  'first_name': 'TEXT',
  'last_name': 'TEXT',
  
  // Identifiering
  'personal_number': 'PERSONAL_NUMBER',
  'tenant_personal_number': 'PERSONAL_NUMBER',
  'personnummer': 'PERSONAL_NUMBER',
  'ssn': 'PERSONAL_NUMBER',
  
  // Kontakt
  'email': 'EMAIL',
  'tenant_email': 'EMAIL',
  'landlord_email': 'EMAIL',
  'phone': 'PHONE',
  'tenant_phone': 'PHONE',
  'landlord_phone': 'PHONE',
  'telefon': 'PHONE',
  
  // Adresser
  'address': 'ADDRESS',
  'property_address': 'ADDRESS',
  'street': 'ADDRESS',
  'city': 'TEXT',
  'postal_code': 'TEXT',
  
  // Belopp
  'rent': 'CURRENCY',
  'rent_amount': 'CURRENCY',
  'hyra': 'CURRENCY',
  'deposit': 'CURRENCY',
  'deposit_amount': 'CURRENCY',
  'deposition': 'CURRENCY',
  'amount': 'CURRENCY',
  'belopp': 'CURRENCY',
  
  // Datum
  'date': 'DATE',
  'start_date': 'DATE',
  'end_date': 'DATE',
  'contract_start': 'DATE',
  'contract_end': 'DATE',
  'contract_start_date': 'DATE',
  'contract_end_date': 'DATE',
  'move_in_date': 'DATE',
  'move_out_date': 'DATE',
  'signing_date': 'DATE',
  
  // Nummer
  'number': 'NUMBER',
  'unit_number': 'TEXT',
  'apartment_number': 'TEXT',
  'rooms': 'NUMBER',
  'size': 'NUMBER',
  'area': 'NUMBER',
}

// Mappning av variabelnamn till svenska etiketter
const LABEL_MAPPINGS: Record<string, string> = {
  'tenant_name': 'Hyresgästens namn',
  'landlord_name': 'Hyresvärdens namn',
  'tenant_personal_number': 'Hyresgästens personnummer',
  'landlord_personal_number': 'Hyresvärdens personnummer',
  'tenant_email': 'Hyresgästens e-post',
  'landlord_email': 'Hyresvärdens e-post',
  'tenant_phone': 'Hyresgästens telefon',
  'landlord_phone': 'Hyresvärdens telefon',
  'property_address': 'Fastighetsadress',
  'unit_label': 'Lägenhetsbeteckning',
  'unit_number': 'Lägenhetsnummer',
  'rent_amount': 'Månadshyra',
  'deposit_amount': 'Depositionsbelopp',
  'contract_start_date': 'Kontraktets startdatum',
  'contract_end_date': 'Kontraktets slutdatum',
  'move_in_date': 'Inflyttningsdatum',
  'signing_date': 'Signeringsdatum',
  'unit_size': 'Lägenhetsstorlek',
  'unit_type': 'Lägenhetstyp',
  'rooms': 'Antal rum',
}

/**
 * Extraherar text från ett Word-dokument
 */
async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer })
  return result.value
}

/**
 * Extraherar text från ett PDF-dokument
 */
async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer)
  return data.text
}

/**
 * Genererar en svensk etikett från variabelnamn
 */
function generateLabel(name: string): string {
  // Kolla om vi har en fördefinierad etikett
  if (LABEL_MAPPINGS[name]) {
    return LABEL_MAPPINGS[name]
  }
  
  // Annars generera från variabelnamnet
  return name
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Gissar variabeltyp baserat på namn
 */
function guessType(name: string): DetectedVariable['suggestedType'] {
  const lowerName = name.toLowerCase()
  
  // Exakt matchning först
  if (TYPE_MAPPINGS[lowerName]) {
    return TYPE_MAPPINGS[lowerName]
  }
  
  // Partiell matchning
  for (const [pattern, type] of Object.entries(TYPE_MAPPINGS)) {
    if (lowerName.includes(pattern)) {
      return type
    }
  }
  
  // Default till TEXT
  return 'TEXT'
}

/**
 * Huvudfunktion för att parsa dokument och extrahera variabler
 */
export async function parseDocumentVariables(
  buffer: Buffer,
  fileType: string
): Promise<DetectedVariable[]> {
  // Extrahera text baserat på filtyp
  let text: string
  
  if (fileType === 'docx') {
    text = await extractTextFromDocx(buffer)
  } else if (fileType === 'pdf') {
    text = await extractTextFromPdf(buffer)
  } else {
    throw new Error(`Filtyp ${fileType} stöds inte`)
  }
  
  // Hitta alla variabler
  const variableMap = new Map<string, number>()
  let match
  
  while ((match = VARIABLE_PATTERN.exec(text)) !== null) {
    const variableName = match[1]
    variableMap.set(variableName, (variableMap.get(variableName) || 0) + 1)
  }
  
  // Konvertera till array med metadata
  const variables: DetectedVariable[] = []
  
  for (const [name, occurrences] of variableMap) {
    variables.push({
      name,
      placeholder: `{{${name}}}`,
      suggestedLabel: generateLabel(name),
      suggestedType: guessType(name),
      occurrences,
    })
  }
  
  // Sortera: vanliga fält först, sedan alfabetiskt
  const priorityOrder = [
    'tenant_name',
    'tenant_personal_number',
    'tenant_email',
    'tenant_phone',
    'property_address',
    'unit_label',
    'rent_amount',
    'deposit_amount',
    'contract_start_date',
    'contract_end_date',
  ]
  
  variables.sort((a, b) => {
    const aIndex = priorityOrder.indexOf(a.name)
    const bIndex = priorityOrder.indexOf(b.name)
    
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex
    }
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    
    return a.name.localeCompare(b.name)
  })
  
  return variables
}

/**
 * Ersätter variabler i ett dokument med faktiska värden
 */
export async function fillDocumentVariables(
  buffer: Buffer,
  fileType: string,
  values: Record<string, string>
): Promise<Buffer> {
  if (fileType === 'docx') {
    return fillDocxVariables(buffer, values)
  } else if (fileType === 'pdf') {
    // PDF-hantering är mer komplex och kräver annan approach
    throw new Error('PDF-ifyllning stöds inte ännu. Konvertera till DOCX först.')
  }
  
  throw new Error(`Filtyp ${fileType} stöds inte`)
}

/**
 * Ersätter variabler i ett DOCX-dokument
 * Använder en enkel find-replace approach
 */
async function fillDocxVariables(
  buffer: Buffer,
  values: Record<string, string>
): Promise<Buffer> {
  // Vi behöver arbeta med DOCX-filens XML direkt
  // Detta är en förenklad implementation - i produktion bör du använda
  // ett bibliotek som docx eller xml2js för mer robust hantering
  
  const JSZip = (await import('jszip')).default
  const zip = await JSZip.loadAsync(buffer)
  
  // Hämta document.xml
  const documentXml = await zip.file('word/document.xml')?.async('string')
  if (!documentXml) {
    throw new Error('Kunde inte läsa dokumentet')
  }
  
  // Ersätt variabler
  let modifiedXml = documentXml
  for (const [name, value] of Object.entries(values)) {
    const placeholder = `{{${name}}}`
    // Escape XML-tecken i värdet
    const escapedValue = escapeXml(value)
    modifiedXml = modifiedXml.split(placeholder).join(escapedValue)
  }
  
  // Uppdatera ZIP-filen
  zip.file('word/document.xml', modifiedXml)
  
  // Returnera som Buffer
  const outputBuffer = await zip.generateAsync({ type: 'nodebuffer' })
  return outputBuffer
}

/**
 * Escapar XML-tecken
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}