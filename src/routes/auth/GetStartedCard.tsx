import { Button } from "@/components/Button";
import { createRoute, Link, type AnyRoute } from "@tanstack/react-router";

function GetStartedCard() {
  return (
    <div className="max-w-5/12 min-w-135 rounded-3xl bg-white p-16">
      <header className="mb-24 space-y-2">
        <h5 className="font-neue text-2xl font-semibold text-[#130B30]">
          Get Started
        </h5>
        <h6 className="text-[#423C59]">
          Create an account or Login to continue with Farm Intelligence
        </h6>
      </header>
      <section className="mb-2.5 space-y-4">
        <Link to="/select-country" className="block">
          <Button variant="primary">Create an Account</Button>
        </Link>
        <Link to="/signin" className="block">
          <Button variant="secondary">Login</Button>
        </Link>
      </section>
      <p className="mx-auto w-fit text-sm text-[#423C59]">
        Continuing means you agree with{" "}
        <span className="cursor-pointer font-medium text-[#0A814A]">
          Terms & Conditions
        </span>
      </p>
    </div>
  );
}

export default (parentRoute: AnyRoute) =>
  createRoute({
    path: 'get-started',
    component: GetStartedCard,
    getParentRoute: () => parentRoute,
    head: () => ({
      meta: [
        { title: "Get Started" }
      ]
    })
  })
