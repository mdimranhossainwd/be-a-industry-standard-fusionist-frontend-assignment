// app/ideas/[id]/page.tsx

import { getIdeaByIdAction } from "@/app/_action";
import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/navbar";
import { getUserInfo } from "@/services/auth.services";
import { notFound } from "next/navigation";
import IdeaDetailsClient from "./_components/idea-details";

export default async function IdeaDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [idea, currentUser] = await Promise.all([
    getIdeaByIdAction(id),
    getUserInfo(),
  ]);

  if (!idea) notFound();

  return (
    <>
      <Header user={currentUser} />
      <IdeaDetailsClient idea={idea} currentUser={currentUser} />
      <Footer />
    </>
  );
}
