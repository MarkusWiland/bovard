import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ActiveContract({ contract }: { contract: any }) {
  if (!contract) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aktivt avtal</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Ingen aktivt avtal
        </CardContent>
      </Card>
    );
  }

  const months =
    (Date.now() - new Date(contract.startDate).getTime()) /
    (1000 * 60 * 60 * 24 * 30);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivt avtal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          {contract.unit.label} – {contract.unit.property.name}
        </div>
        <div>
          Hyra:{" "}
          <strong>
            {contract.unit.rent.toLocaleString("sv-SE")} kr
          </strong>
        </div>
        <div>
          Bott här: {Math.floor(months)} månader
        </div>
        <div>
          Avtalsmall: {contract.template.name}
        </div>
      </CardContent>
    </Card>
  );
}
