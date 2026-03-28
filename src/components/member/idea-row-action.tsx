// "use client";

// import {
//   deleteIdeaAction,
//   submitIdeaAction,
// } from "@/app/dashboard/my-ideas/_action";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";
// import { Idea } from "@/types/api.types";
// import { useRouter } from "next/navigation";
// import { useState, useTransition } from "react";
// import { toast } from "sonner";

// interface IdeaRowActionsProps {
//   idea: Idea;
//   onMutate: () => void; // called after any successful mutation to refetch
// }

// export function IdeaRowActions({ idea, onMutate }: IdeaRowActionsProps) {
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition();
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [showSubmitDialog, setShowSubmitDialog] = useState(false);

//   const canEdit = idea.status === "DRAFT" || idea.status === "REJECTED";
//   const canSubmit = idea.status === "DRAFT";
//   const canDelete = idea.status === "DRAFT" || idea.status === "REJECTED";

//   // ── Delete ─────────────────────────────────────────────────────────────────

//   function handleDelete() {
//     startTransition(async () => {
//       const result = await deleteIdeaAction(idea.id);
//       setShowDeleteDialog(false);
//       if (!result.success) {
//         toast.error(result.error);
//         return;
//       }
//       toast.success("Idea deleted.");
//       onMutate();
//     });
//   }

//   // ── Submit for review ──────────────────────────────────────────────────────

//   function handleSubmit() {
//     startTransition(async () => {
//       const result = await submitIdeaAction(idea.id);
//       setShowSubmitDialog(false);
//       if (!result.success) {
//         toast.error(result.error);
//         return;
//       }
//       toast.success("Idea submitted for review!");
//       onMutate();
//     });
//   }

//   if (!canEdit && !canSubmit && !canDelete) {
//     return <span className="text-xs text-muted-foreground">—</span>;
//   }

//   return (
//     <>
//       <div className="flex items-center justify-end gap-1.5">
//         {/* Submit for review */}
//         {canSubmit && (
//           <Button
//             size="sm"
//             variant="outline"
//             className="h-7 text-xs text-green-700 border-green-300 hover:bg-green-50 dark:hover:bg-green-950"
//             disabled={isPending}
//             onClick={() => setShowSubmitDialog(true)}
//           >
//             Submit
//           </Button>
//         )}

//         {/* Edit */}
//         {canEdit && (
//           <Button
//             size="sm"
//             variant="outline"
//             className="h-7 text-xs"
//             disabled={isPending}
//             onClick={() =>
//               router.push(`/dashboard/create-idea?edit=${idea.id}`)
//             }
//           >
//             Edit
//           </Button>
//         )}

//         {/* Delete */}
//         {canDelete && (
//           <Button
//             size="sm"
//             variant="outline"
//             className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
//             disabled={isPending}
//             onClick={() => setShowDeleteDialog(true)}
//           >
//             Delete
//           </Button>
//         )}
//       </div>

//       {/* Submit confirm */}
//       <AlertDialog
//         open={showSubmitDialog}
//         onOpenChange={(o) => !isPending && setShowSubmitDialog(o)}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Submit for review?</AlertDialogTitle>
//             <AlertDialogDescription>
//               You won&apos;t be able to edit this idea until the admin reviews
//               it.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleSubmit} disabled={isPending}>
//               {isPending ? "Submitting..." : "Submit"}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Delete confirm */}
//       <AlertDialog
//         open={showDeleteDialog}
//         onOpenChange={(o) => !isPending && setShowDeleteDialog(o)}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete this idea?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone. The idea will be permanently
//               removed.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//               onClick={handleDelete}
//               disabled={isPending}
//             >
//               {isPending ? "Deleting..." : "Delete"}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }

"use client";

import {
  deleteIdeaAction,
  submitIdeaAction,
} from "@/app/dashboard/my-ideas/_action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Idea } from "@/types/api.types";
import { CheckCircle, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface IdeaRowActionsProps {
  idea: Idea;
  onMutate: () => void;
}

export function IdeaRowActions({ idea, onMutate }: IdeaRowActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const canEdit = idea.status === "DRAFT" || idea.status === "REJECTED";
  const canSubmit = idea.status === "DRAFT";
  const canDelete = idea.status === "DRAFT" || idea.status === "REJECTED";

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteIdeaAction(idea.id);
      setShowDeleteDialog(false);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Idea deleted.");
      onMutate();
    });
  }

  function handleSubmit() {
    startTransition(async () => {
      const result = await submitIdeaAction(idea.id);
      setShowSubmitDialog(false);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Idea submitted for review!");
      onMutate();
    });
  }

  if (!canEdit && !canSubmit && !canDelete) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        {/* Submit for review */}
        {canSubmit && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2.5 text-[12px] gap-1.5 text-green-700 border-green-300 hover:bg-green-50 dark:hover:bg-green-950"
            disabled={isPending}
            onClick={() => setShowSubmitDialog(true)}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Submit
          </Button>
        )}

        {/* Edit */}
        {canEdit && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2.5 text-[12px] gap-1.5"
            disabled={isPending}
            onClick={() =>
              router.push(`/dashboard/create-idea?edit=${idea.id}`)
            }
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </Button>
        )}

        {/* Delete */}
        {canDelete && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2.5 text-[12px] gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
            disabled={isPending}
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </Button>
        )}
      </div>

      {/* Submit confirm */}
      <AlertDialog
        open={showSubmitDialog}
        onOpenChange={(o) => !isPending && setShowSubmitDialog(o)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">
              Submit for review?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px]">
              You won&apos;t be able to edit this idea until the admin reviews
              it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending} className="h-8 text-[13px]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              disabled={isPending}
              className="h-8 text-[13px] gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {isPending ? "Submitting..." : "Submit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete confirm */}
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={(o) => !isPending && setShowDeleteDialog(o)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">
              Delete this idea?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px]">
              This action cannot be undone. The idea will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending} className="h-8 text-[13px]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-8 text-[13px] gap-1.5 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
