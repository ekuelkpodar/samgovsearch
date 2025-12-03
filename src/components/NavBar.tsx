import Link from "next/link";
import { useRouter } from "next/router";

const links = [
  { href: "/", label: "Home" },
  { href: "/solutions", label: "Solutions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/tools", label: "Free Tools" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/search", label: "Search" },
];

export default function NavBar() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-40 bg-[#0b132b]/90 backdrop-blur">
      <div className="container-outer flex items-center justify-between py-4">
        <Link href="/" className="text-xl font-bold text-cyan-300">
          GovAI Search
        </Link>
        <nav className="hidden gap-4 text-sm font-medium md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg transition-colors ${
                router.pathname === link.href
                  ? "bg-glass text-white"
                  : "text-muted hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white/90 transition hover:border-cyan-300/60 hover:text-white md:inline"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-gradient-to-r from-cyan-300 to-sky-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-cyan-400/20 transition hover:scale-[1.01]"
          >
            Start free trial
          </Link>
        </div>
      </div>
    </header>
  );
}
