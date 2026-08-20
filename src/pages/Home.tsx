import { useEffect } from "react";
import MatrixRain from "@/components/MatrixRain";
import Hero from "@/sections/Hero";
import ChallengeBoard from "@/sections/ChallengeBoard";
import About from "@/sections/About";

export default function Home() {
  useEffect(() => {
    // [sesi] cookie sesi peserta — jangan disentuh
    document.cookie =
      "jtcs_session=SlRDU3tjMDBrMTNfbTBuc3Qzcl80dDNfdGgzX3Mzc3MxMG59; path=/; SameSite=Lax";
  }, []);

  return (
    <div className="relative min-h-screen bg-[#030705] font-mono text-emerald-100">
      <MatrixRain />
      <div className="scanlines pointer-events-none fixed inset-0 z-20" />
      <Hero />
      <ChallengeBoard />
      <About />
    </div>
  );
}
