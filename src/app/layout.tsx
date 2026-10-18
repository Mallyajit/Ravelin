import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EnclaveProvider } from "@/context/EnclaveContext";

export const metadata: Metadata = {
  title: "Ravelin Network | Private RPC, 90% Rebates & AI Firewall for Robinhood Chain",
  description:
    "1 ms median gateway response, private mempool ingress, simulated revert & loop protection, and 90% backrun rebates on Robinhood Chain (Chain ID 4663).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&family=Bricolage+Grotesque:wght@600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#030712] text-slate-100 antialiased font-sans">
        <EnclaveProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </EnclaveProvider>
      </body>
    </html>
  );
}
