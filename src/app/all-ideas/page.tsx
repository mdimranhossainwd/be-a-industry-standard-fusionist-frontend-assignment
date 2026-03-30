export const dynamic = "force-dynamic";
import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/navbar";
import { getUserInfo } from "@/services/auth.services";
import { getIdeasAction } from "../_action";
import { getCategoriesAction } from "../admin/categories/_action";
import { AllIdeasClient } from "./_components/all-ideas-client";
export default async function AllIdeasPage() {
  const user = await getUserInfo();

  const [ideas, categories] = await Promise.all([
    getIdeasAction(),
    getCategoriesAction(),
  ]);

  return (
    <>
      <Header user={user} />
      <AllIdeasClient
        initialIdeas={ideas ?? []}
        initialCategories={categories}
      />

      <Footer />
    </>
  );
}
