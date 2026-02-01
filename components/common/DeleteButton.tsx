"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

// type Props = {
//   url: string; // e.g. "/api/expenses?id=12"
//   confirmText?: string; // custom confirm message
//   children?: React.ReactNode;
//   className?: string;
// };

type Props = {
  url: string;
  confirmText?: string;
  children?: React.ReactNode;
  className?: string;
  onSuccess?: () => void; // ✅ add
};

// export default function DeleteButton({
//   url,
//   confirmText = "Are you sure you want to delete this?",
//   children = "Delete",
//   className,
// }: Props) {
//   const router = useRouter();

export default function DeleteButton({
  url,
  confirmText = "Are you sure you want to delete this?",
  children = "Delete",
  className,
  onSuccess,
}: Props) {
  const router = useRouter();

//   async function handleDelete() {
//     if (!confirm(confirmText)) return;

//     const res = await fetch(url, { method: "DELETE" });
//     if (!res.ok) {
//       alert("Failed to delete");
//       return;
//     }

//     router.refresh();
//   }

//   return (
//     <Button
//       onClick={handleDelete}
//       size="sm"
//       variant="outline"
//       className={cn(
//         "gap-2 border-red-500 text-red-600 hover:bg-red-500/10 hover:text-red-700",
//         className,
//       )}
//     >
//       {children}
//     </Button>
//   );
// }

async function handleDelete() {
    if (!confirm(confirmText)) return;

    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete");
      return;
    }

    onSuccess?.();     // ✅ update local table instantly
    router.refresh();  // optional (safe), you can remove later if you want
  }

  return (
    <Button
      onClick={handleDelete}
      size="sm"
      variant="outline"
      className={cn(
        "gap-2 border-red-500 text-red-600 hover:bg-red-500/10 hover:text-red-700",
        className,
      )}
    >
      {children}
    </Button>
  );
}