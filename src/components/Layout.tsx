import { ReactNode } from "react";
import Footer from "./Footer";
import NavBar from "./NavBar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b132b] text-slate-50">
      <NavBar />
      <main className="container-outer">{children}</main>
      <Footer />
    </div>
  );
}
