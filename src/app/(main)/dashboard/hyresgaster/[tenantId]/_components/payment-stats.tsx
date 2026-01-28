import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function PaymentsStats({ tenantId }: { tenantId: string }) {
  const payments = await prisma.payment.findMany({
    where: {
      unit: {
        contracts: {
          some: {
            tenantId,
          },
        },
      },
    },
  });

  const total = payments.length;
  const paidInTime = payments.filter(p => p.status === "PAID").length;
  const late = payments.filter(p => p.status === "LATE").length;

  const percentage = total
    ? Math.round((paidInTime / total) * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Betalningshistorik</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>{percentage}% betalat i tid</div>
        <div>{late} sena betalningar</div>
        <div>{total} betalningar totalt</div>
      </CardContent>
    </Card>
  );
}
