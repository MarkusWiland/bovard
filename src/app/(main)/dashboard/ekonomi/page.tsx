// app/dashboard/ekonomi/page.tsx
import { EconomyClient } from "./_components/economy-client";

/* MOCK */
async function getEconomyData() {
  return {
    summary: {
      monthlyRent: 147500,
      paidThisMonth: 135000,
      outstanding: 12500,
      paidPercentage: 92,
    },
    transactions: [
      {
        id: "tx1",
        tenant: "Anna Andersson",
        month: "Jan 2026",
        amount: 12500,
        status: "paid",
        stripeStatus: "succeeded",
      },
      {
        id: "tx2",
        tenant: "Erik Svensson",
        month: "Jan 2026",
        amount: 11500,
        status: "late",
        stripeStatus: "failed",
      },
    ],
  };
}

export default async function EconomyPage() {
  const data = await getEconomyData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ekonomi</h1>
        <p className="text-muted-foreground">
          Intäkter, betalningar och status
        </p>
      </div>

      <EconomyClient data={data} />
    </div>
  );
}
