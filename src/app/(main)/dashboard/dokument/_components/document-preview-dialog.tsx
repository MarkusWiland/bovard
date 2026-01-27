"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, FileText } from "lucide-react";
import { useEffect, useState } from "react";

export type PreviewDocument = {
  id: string;
  name: string;
  url: string;
};

interface DocumentPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: PreviewDocument | null;
}

export function DocumentPreviewDialog({
  open,
  onOpenChange,
  document,
}: DocumentPreviewDialogProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (document) {
      setLoading(true);
    }
  }, [document]);

  if (!document) return null;

  const isPdf = document.url.toLowerCase().endsWith(".pdf");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-10xl h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <DialogTitle className="truncate">
            {document.name}
          </DialogTitle>
        
        </DialogHeader>

        <div className="relative flex-1 border rounded-md overflow-hidden bg-muted">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {isPdf ? (
            <iframe
              src={document.url}
              className="w-full h-full"
              onLoad={() => setLoading(false)}
            />
          ) : (
            <img
              src={document.url}
              alt={document.name}
              onLoad={() => setLoading(false)}
              className="max-h-full mx-auto object-contain"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
