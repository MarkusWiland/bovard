// app/dashboard/dokument/page.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { DocumentsTable } from "./_components/documents-table";

/* ================= MOCK DATA ================= */

async function getDocuments() {
  return [
    {
      id: "d1",
      name: "Hyresavtal_12A.pdf",
      type: "Kontrakt",
      uploadedAt: "2024-01-01",
      url: "/assets/mock/test-hyresavtal.pdf",  
      unit: {
        id: "u1",
        label: "12A",
      },
      property: {
        id: "p1",
        name: "Vasagatan 12",
      },
    },
    {
      id: "d2",
      name: "Inflyttningsprotokoll_12B.pdf",
      type: "Protokoll",
      uploadedAt: "2023-06-01",
      url: "/mock/test-inflyttningsprotokoll.pdf",
      unit: {
        id: "u2",
        label: "12B",
      },
      property: {
        id: "p1",
        name: "Vasagatan 12",
      },
    },
    {
      id: "d3",
      name: "Kvitto_deposition.pdf",
      type: "Kvitto",
      uploadedAt: "2024-01-01",
      url: "/mock/test-kvitto-deposition.pdf",
      unit: {
        id: "u1",
        label: "12A",
      },
      property: {
        id: "p1",
        name: "Vasagatan 12",
      },
    },
  ] as const;
}

/* ================= PRISMA (AKTIVERA SEN) ================= */

// import { prisma } from "@/lib/prisma";
// import { auth } from "@/lib/auth";

// async function getDocuments() {
//   const user = await auth.requireUser();
//
//   const membership = await prisma.membership.findFirst({
//     where: { userId: user.id },
//   });
//
//   if (!membership) return [];
//
//   return prisma.document.findMany({
//     where: {
//       unit: {
//         property: {
//           organizationId: membership.organizationId,
//         },
//       },
//     },
//     include: {
//       unit: {
//         include: {
//           property: true,
//         },
//       },
//     },
//     orderBy: {
//       uploadedAt: "desc",
//     },
//   });
// }

export default async function DocumentsPage() {
  const documents = await getDocuments();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dokument</h1>
        <p className="text-muted-foreground">
          Alla dokument kopplade till dina fastigheter
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dokument</CardTitle>
          <CardDescription>
            Totalt {documents.length} dokument
          </CardDescription>
        </CardHeader>

        <CardContent>
          <DocumentsTable documents={documents} />
        </CardContent>
      </Card>
    </div>
  );
}
