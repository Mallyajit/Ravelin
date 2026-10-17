import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Ravelin Network | Private RPC, 90% Rebates & AI Firewall for Robinhood Chain",
  description:
    "1 ms median gateway response, private mempool ingress, simulated revert & loop protection, and 90% backrun rebates on Robinhood Chain (Chain ID 4663).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-slate-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
