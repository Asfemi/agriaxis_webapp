import { createRoute, type AnyRoute } from "@tanstack/react-router";
import { useEffect } from "react";

function Success() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = {
      status: params.get("status"),
      transactionId: params.get("transaction_id"),
      tx_ref: params.get("tx_ref"),
    };

    if (window.opener) {
      window.opener.postMessage(
        { type: "PAYMENT_COMPLETE", ...data },
        window.location.origin,
      );
      window.close();
    }
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="font-sans text-lg">Processing payment, please wait...</p>
    </div>
  );
}

export default (parentRoute: AnyRoute) =>
  createRoute({
    path: "payment/success",
    component: Success,
    getParentRoute: () => parentRoute,
    staticData: {
      title: "Dashboard",
    },
  });
