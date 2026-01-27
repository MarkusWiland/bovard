"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowDownToLine,
  Download,
  Eye,
  FileText,
  Search,
} from "lucide-react";
import { DocumentPreviewDialog } from "./document-preview-dialog";

type DocumentItem = {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  url: string; // 👈 preview-url
  unit: { id: string; label: string };
  property: { id: string; name: string };
};

export function DocumentsTable({
  documents,
}: {
  documents: DocumentItem[];
}) {
  const [query, setQuery] = useState("");
  const [selectedDoc, setSelectedDoc] =
  useState<DocumentItem | null>(null);

  const filteredDocuments = useMemo(() => {
    const q = query.toLowerCase();

    return documents.filter((doc) =>
      [
        doc.name,
        doc.type,
        doc.unit.label,
        doc.property.name,
      ].some((field) => field.toLowerCase().includes(q))
    );
  }, [documents, query]);

  return (
    <div className="space-y-4">
      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Sök dokument, fastighet eller enhet…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* TABLE */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dokument</TableHead>
            <TableHead>Typ</TableHead>
            <TableHead>Enhet</TableHead>
            <TableHead>Fastighet</TableHead>
            <TableHead>Uppladdat</TableHead>  
            <TableHead className="text-right">Visa dokument</TableHead>
            <TableHead className="text-right">Ladda ner dokument</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredDocuments.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {doc.name}
              </TableCell>

              <TableCell>
                <Badge variant="secondary">{doc.type}</Badge>
              </TableCell>

              <TableCell>{doc.unit.label}</TableCell>

              <TableCell>
                <Link
                  href={`/dashboard/properties/${doc.property.id}`}
                  className="hover:underline"
                >
                  {doc.property.name}
                </Link>
              </TableCell>

              <TableCell>
                {new Date(doc.uploadedAt).toLocaleDateString(
                  "sv-SE"
                )}
              </TableCell>
              <TableCell className="text-right">
              <Button
  size="icon"
  variant="ghost"
  onClick={() =>
    setSelectedDoc({
      id: doc.id,
      name: doc.name,
      url: doc.url, // signed URL
      type: doc.type,
      uploadedAt: doc.uploadedAt,
      unit: doc.unit,
      property: doc.property,
    })
  }>
    <Eye className="h-4 w-4" />
  </Button>

              </TableCell>
              <TableCell className="text-right">
            <Button 
              size="icon"
              variant="ghost"
              onClick={() => downloadDocument(selectedDoc?.url || "")}
            >
              <Download className="h-4 w-4" />
             
            </Button>
          </TableCell>
            </TableRow>
          ))}
         
        </TableBody>
      </Table>
      <DocumentPreviewDialog
        open={!!selectedDoc}
        onOpenChange={(open) => setSelectedDoc(open ? selectedDoc : null)}
        document={selectedDoc || null}
      />
    </div>
  );
}
