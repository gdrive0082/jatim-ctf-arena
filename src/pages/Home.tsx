import { useEffect } from "react";
import MatrixRain from "@/components/MatrixRain";
import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import ChallengeBoard from "@/sections/ChallengeBoard";
import About from "@/sections/About";
import { Toaster } from "@/components/ui/sonner";
import { INTERNAL_BUILD, internalNotes } from "@/lib/internal-notes";

export default function Home() {
  useEffect(() => {
    console.debug(`[build] ${INTERNAL_BUILD} (${internalNotes()})`);
    // [sesi] cookie sesi peserta — jangan disentuh
    document.cookie =
      "jtcs_session=SlRDU3tjMDBrMTNfbTBuc3Qzcl80dDNfdGgzX3Mzc3MxMG59; path=/; SameSite=Lax";

    // [log] fragmen bisikan konsol — CONSOLE-WHISPER
    console.log(
      "%c[JTCS-FRAG-1]%c JTCS{d3vt00ls_",
      "color:#030705;background:#10b981;padding:2px 6px;font-weight:bold",
      "color:#10b981;font-family:monospace"
    );
    console.warn(
      "%c[JTCS-FRAG-2]%c c0ns0l3_l34k}",
      "color:#030705;background:#f59e0b;padding:2px 6px;font-weight:bold",
      "color:#f59e0b;font-family:monospace"
    );
  }, []);

  return (
    <div className="relative min-h-screen bg-[#030705] font-mono text-emerald-100">
      <MatrixRain />
      <div className="scanlines pointer-events-none fixed inset-0 z-20" />
      <Navbar />
      <Hero />
      <ChallengeBoard />
      <About />
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}
