import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <Skeleton />
    </div>
  );
}
