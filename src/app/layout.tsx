import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EnclaveProvider } from "@/context/EnclaveContext";

export const metadata: Metadata = {
  title: "Ravelin Network | Private RPC, 90% Rebates & AI Firewall on Robinhood Chain",
  description:
    "1 ms median gateway response, private mempool ingress, simulated revert & loop protection, and 90% backrun rebates on Robinhood Chain (Chain ID 4663).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-black text-neutral-100">
        <EnclaveProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </EnclaveProvider>
      </body>
    </html>
  );
}
