import { useEffect, useState } from "react";
import { Terminal, Shield, Flag, ChevronDown } from "lucide-react";

const BOOT_LINES = [
  "[ OK ] Memuat modul kernel jatim-cybersec v6.6.6",
  "[ OK ] Mounting /arena/challenges ... 6 target ditemukan",
  "[WARN] Integritas admin: COMPROMISED",
  "[ OK ] Flag format: JTCS{...}",
  "[ OK ] Semua clue telah disembunyikan di lokasi masing-masing",
  "> Inisialisasi CTF ARENA selesai. Selamat berburu, hacker.",
];

function useTypewriter(lines: string[]) {
  const [output, setOutput] = useState<string[]>([]);
  useEffect(() => {
    let line = 0;
    let char = 0;
    let current = "";
    const timer = setInterval(() => {
      if (line >= lines.length) {
        clearInterval(timer);
        return;
      }
      current += lines[line][char];
      char++;
      if (char >= lines[line].length) {
        setOutput((prev) => [...prev, current]);
        current = "";
        char = 0;
        line++;
      } else {
        setOutput((prev) => {
          const copy = [...prev];
          copy[line] = current;
          return copy;
        });
      }
    }, 18);
    return () => clearInterval(timer);
  }, [lines]);
  return output;
}

export default function Hero() {
  const lines = useTypewriter(BOOT_LINES);

  return (
    <header className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mb-6 flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-4 py-1.5 text-xs tracking-[0.3em] text-emerald-400 backdrop-blur">
        <Shield className="h-3.5 w-3.5" />
        JAWA TIMUR CYBERSECURITY
      </div>

      <h1 className="glitch text-center text-5xl font-black tracking-tight text-emerald-300 md:text-7xl">
        JATIM <span className="text-red-500">CTF</span> ARENA
      </h1>
      <p className="mt-4 max-w-xl text-center text-sm text-emerald-100/60 md:text-base">
        Arena Capture The Flag tingkat <span className="text-red-400 font-semibold">HARD</span> untuk
        para pemburu flag Jawa Timur. Enam tantangan. Enam bendera. Nol ampunan.
      </p>

      <div className="mt-10 w-full max-w-2xl overflow-hidden rounded-lg border border-emerald-500/30 bg-black/80 shadow-[0_0_60px_-15px_rgba(16,185,129,0.5)] backdrop-blur">
        <div className="flex items-center gap-2 border-b border-emerald-500/20 bg-emerald-950/30 px-4 py-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 flex items-center gap-1.5 text-xs text-emerald-500/70">
            <Terminal className="h-3.5 w-3.5" /> root@jatim-cybersec:~
          </span>
        </div>
        <div className="min-h-[180px] p-4 font-mono text-xs leading-6 text-emerald-400 md:text-sm">
          {lines.map((l, i) => (
            <div key={i}>
              <span className="text-emerald-700">$ </span>
              {l}
            </div>
          ))}
          <span className="inline-block h-4 w-2 animate-pulse bg-emerald-400 align-middle" />
        </div>
      </div>

      <a
        href="#challenges"
        className="mt-10 inline-flex items-center gap-2 rounded-md border border-red-500/50 bg-red-950/30 px-6 py-3 text-sm font-bold tracking-widest text-red-400 transition hover:bg-red-900/40 hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.6)]"
      >
        <Flag className="h-4 w-4" /> MASUK ARENA
      </a>

      <ChevronDown className="absolute bottom-8 h-6 w-6 animate-bounce text-emerald-500/50" />
    </header>
  );
}
