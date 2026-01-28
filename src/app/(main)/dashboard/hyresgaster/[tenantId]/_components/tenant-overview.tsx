import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  tenant: any;
};

export function TenantOverview({ tenant }: Props) {
  const activeContract = tenant.contracts.find(
    (c: any) => c.status === "ACTIVE"
  );

  const moveIn = new Date(tenant.moveInDate);
  const monthsLiving =
    Math.floor(
      (Date.now() - moveIn.getTime()) / (1000 * 60 * 60 * 24 * 30)
    ) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Översikt</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Inflytt</span>
          <span>{moveIn.toLocaleDateString("sv-SE")}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Bott</span>
          <span>{monthsLiving} månader</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Antal avtal</span>
          <span>{tenant.contracts.length}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Status</span>
          {activeContract ? (
            <Badge>Aktiv hyresgäst</Badge>
          ) : (
            <Badge variant="secondary">Ingen bostad</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
