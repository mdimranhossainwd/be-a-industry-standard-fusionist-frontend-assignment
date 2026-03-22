// app/ideas/[id]/page.tsx

import { getIdeaByIdAction } from "@/app/_action";
import { notFound } from "next/navigation";
import IdeaDetailsClient from "./_components/idea-details";

export default async function IdeaDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const idea = await getIdeaByIdAction(id);
  if (!idea) notFound();

  return <IdeaDetailsClient idea={idea} />;
}
