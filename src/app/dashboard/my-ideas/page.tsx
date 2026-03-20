// app/dashboard/my-ideas/page.tsx — RSC

import { MyIdeasClient } from "@/components/member/my-idea";
import { redirect } from "next/navigation";
import { getMyIdeasAction } from "./_action";

export default async function MyIdeasPage() {
  let initialIdeas;

  try {
    initialIdeas = await getMyIdeasAction({ page: 1, limit: 10 });
  } catch {
    redirect("/login");
  }

  return <MyIdeasClient initialIdeas={initialIdeas} />;
}
