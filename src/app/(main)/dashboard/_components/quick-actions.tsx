import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Plus, FileText, Download } from 'lucide-react';

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Snabbåtgärder</CardTitle>
        <CardDescription>Vanliga uppgifter du utför ofta</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Button className="w-full justify-start" variant="outline">
          <Send className="mr-2 h-4 w-4" />
          Skicka påminnelse
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Nytt hyresavtal
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Generera rapport
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportera data
        </Button>
      </CardContent>
    </Card>
  );
}