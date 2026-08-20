import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Shield, Flag, ChevronDown, Swords, Skull, Zap } from "lucide-react";

const BOOT_LINES = [
  "[ OK ] Memuat modul kernel jatim-cybersec v6.6.6",
  "[ OK ] Mounting /arena/challenges ... 28 target ditemukan",
  "[WARN] Integritas admin: COMPROMISED",
  "[CRIT] Tier-2 CVE module armed: log4shell, pcap, binary, jwt, shadow, pickle",
  "[CRIT] Tier-3 ZERO-DAY module armed: rsa, aes, usb-hid, polyglot, brainfuck, heap",
  "[ OK ] Flag format: JTCS{...}",
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
    }, 16);
    return () => clearInterval(timer);
  }, [lines]);
  return output;
}

const STATS = [
  { icon: Swords, label: "CHALLENGES", value: "28" },
  { icon: Skull, label: "0-DAY", value: "8" },
  { icon: Zap, label: "TOTAL POIN", value: "19.000" },
];

export default function Hero() {
  const lines = useTypewriter(BOOT_LINES);

  return (
    <header className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-4 py-1.5 text-xs tracking-[0.3em] text-emerald-400 backdrop-blur"
      >
        <Shield className="h-3.5 w-3.5" />
        JAWA TIMUR CYBERSECURITY
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="glitch text-center text-5xl font-black tracking-tight text-emerald-300 md:text-7xl"
      >
        JATIM <span className="text-red-500">CTF</span> ARENA
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mt-4 max-w-xl text-center text-sm text-emerald-100/60 md:text-base"
      >
        Arena Capture The Flag untuk para pemburu flag Jawa Timur. Dua puluh delapan
        tantangan dalam tiga tier: pemanasan <span className="font-semibold text-yellow-400">HARD</span>,
        simulasi insiden <span className="font-semibold text-red-400">CVE</span>, dan
        level <span className="font-semibold text-purple-400">ZERO-DAY</span>. Nol ampunan.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55 }}
        className="mt-8 flex gap-6"
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + i * 0.15 }}
            className="flex flex-col items-center rounded-lg border border-emerald-500/20 bg-black/50 px-5 py-3 backdrop-blur"
          >
            <s.icon className="mb-1 h-4 w-4 text-red-400" />
            <span className="text-2xl font-black text-emerald-300">{s.value}</span>
            <span className="text-[9px] tracking-[0.25em] text-emerald-100/40">{s.label}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9 }}
        className="mt-10 w-full max-w-2xl overflow-hidden rounded-lg border border-emerald-500/30 bg-black/80 shadow-[0_0_60px_-15px_rgba(16,185,129,0.5)] backdrop-blur"
      >
        <div className="flex items-center gap-2 border-b border-emerald-500/20 bg-emerald-950/30 px-4 py-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 flex items-center gap-1.5 text-xs text-emerald-500/70">
            <Terminal className="h-3.5 w-3.5" /> root@jatim-cybersec:~
          </span>
        </div>
        <div className="min-h-[200px] p-4 font-mono text-xs leading-6 text-emerald-400 md:text-sm">
          {lines.map((l, i) => (
            <div key={i}>
              <span className="text-emerald-700">$ </span>
              {l}
            </div>
          ))}
          <span className="inline-block h-4 w-2 animate-pulse bg-emerald-400 align-middle" />
        </div>
      </motion.div>

      <motion.a
        href="#challenges"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="mt-10 inline-flex items-center gap-2 rounded-md border border-red-500/50 bg-red-950/30 px-6 py-3 text-sm font-bold tracking-widest text-red-400 transition hover:bg-red-900/40 hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.6)]"
      >
        <Flag className="h-4 w-4" /> MASUK ARENA
      </motion.a>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        className="absolute bottom-8"
      >
        <ChevronDown className="h-6 w-6 text-emerald-500/50" />
      </motion.div>
    </header>
  );
}
