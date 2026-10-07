import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { WriterLogoutButton } from "@/components/writer/logout-button";
import { getWriterSession } from "@/lib/writer/session";

export const dynamic = "force-dynamic";

export default async function WriterPortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getWriterSession();
  if (!session) redirect("/writer/login");

  return (
    <div className="min-h-screen bg-[#0b1c33] text-slate-200">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={40} height={40} className="size-10 object-contain" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Writer workspace</p>
              <p className="text-sm font-semibold text-white">{session.name}</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">
            <Link href="/writer" className="rounded-full px-3 py-1.5 text-slate-300 hover:bg-white/10 hover:text-white">
              Orders
            </Link>
            <Link href="/writer/chat" className="rounded-full px-3 py-1.5 text-slate-300 hover:bg-white/10 hover:text-white">
              Chat
            </Link>
            <Link href="/writer/storage" className="rounded-full px-3 py-1.5 text-slate-300 hover:bg-white/10 hover:text-white">
              Storage
            </Link>
            <WriterLogoutButton />
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  );
}
