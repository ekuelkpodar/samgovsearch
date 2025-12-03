import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/solutions", label: "Solutions" },
      { href: "/pricing", label: "Pricing" },
      { href: "/tools", label: "Free Tools" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "https://www.sam.gov", label: "SAM.gov" },
      { href: "/wall-of-love", label: "Testimonials" },
      { href: "mailto:hello@govai.example", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/", label: "Blog" },
      { href: "/", label: "Security" },
      { href: "/", label: "Status" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a1024] py-10">
      <div className="container-outer grid gap-8 md:grid-cols-4">
        <div>
          <div className="text-lg font-semibold text-cyan-300">GovAI Search</div>
          <p className="mt-3 max-w-sm text-sm text-muted">
            AI-powered market intelligence for government contractors. Find, win,
            and deliver on the best-fitting opportunities.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <div className="text-sm font-semibold text-white/80">{col.title}</div>
            <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
              {col.links.map((link) => (
                <Link key={link.label} href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="container-outer mt-8 flex items-center justify-between text-xs text-muted">
        <span>© {new Date().getFullYear()} GovAI Search. All rights reserved.</span>
        <div className="flex gap-4">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
