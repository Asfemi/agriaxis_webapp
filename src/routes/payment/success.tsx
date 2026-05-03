import { createRoute, type AnyRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { useSearch } from "@tanstack/react-router";

const paymentSearchSchema = z.object({
  status: z.string().optional(),
  transaction_id: z.string().optional(),
  tx_ref: z.string().optional(),
});

function Success() {
  const search = useSearch({ from: "/payment/success" });

  useEffect(() => {
    if (window.opener) {
      const data = {
        status: search.status,
        transactionId: search.transaction_id,
        tx_ref: search.tx_ref,
      };

      window.opener.postMessage(
        { type: "PAYMENT_COMPLETE", ...data },
        window.location.origin,
      );

      const timeout = setTimeout(() => window.close(), 500);
      return () => clearTimeout(timeout);
    }
  }, [search]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="animate-pulse text-xl font-medium text-gray-500">
        Processing payment, please wait...
      </p>
    </div>
  );
}

export default (parentRoute: AnyRoute) =>
  createRoute({
    path: "payment/success",
    component: Success,
    validateSearch: (search) => paymentSearchSchema.parse(search),
    getParentRoute: () => parentRoute,
    staticData: {
      title: "Dashboard",
    },
    head: () => ({
      meta: [
        { title: "Payment successful"}
      ]
    })
  });
