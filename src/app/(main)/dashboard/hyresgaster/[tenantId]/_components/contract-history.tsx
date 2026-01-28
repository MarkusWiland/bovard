import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Props = {
  contracts: any[];
};

export function ContractsHistory({ contracts }: Props) {
  if (contracts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Avtalshistorik</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Inga avtal registrerade.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avtalshistorik</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {contracts.map((contract, index) => {
          const start = new Date(contract.startDate).toLocaleDateString("sv-SE");
          const end = contract.endDate
            ? new Date(contract.endDate).toLocaleDateString("sv-SE")
            : "Tillsvidare";

          return (
            <div key={contract.id}>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="font-medium">
                    {contract.unit.label} – {contract.unit.property.name}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {start} → {end}
                  </div>

                  <div className="text-sm">
                    Hyra:{" "}
                    <strong>
                      {contract.unit.rent.toLocaleString("sv-SE")} kr
                    </strong>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Mall: {contract.template.name}
                  </div>
                </div>

                <Badge
                  variant={
                    contract.status === "ACTIVE"
                      ? "default"
                      : contract.status === "TERMINATED"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {contract.status === "ACTIVE" && "Aktivt"}
                  {contract.status === "TERMINATED" && "Avslutat"}
                  {contract.status === "EXPIRED" && "Utgånget"}
                  {contract.status === "DRAFT" && "Utkast"}
                </Badge>
              </div>

              {index < contracts.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
