import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Tutor Not Found</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            The tutor profile you are looking for does not exist or may have
            been removed.
          </p>
          <div className="pt-4">
            <Link href="/tutors">
              <Button>Browse All Tutors</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
