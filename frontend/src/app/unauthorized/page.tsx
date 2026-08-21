import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0B0A] px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#121210] p-6 sm:p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D7A455]/10 text-[#F3C77F]">
          <ShieldAlert size={26} />
        </div>

        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[#D7A455]">Access restricted</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#F5F0E6]">Customer role cannot access merchant data.</h1>
        <p className="mt-4 text-base text-[#B7AEA2]">
          This merchant dashboard is reserved for merchant and admin workflows. Frontend route protection is only a UX layer; real authorization must be enforced by the backend.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/login">
            <Button className="w-full sm:w-auto">Return to login</Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" className="w-full sm:w-auto">Public website</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
