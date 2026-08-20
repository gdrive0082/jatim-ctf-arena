import { motion } from "framer-motion";
import { Shield, Github, Swords } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-30 border-b border-emerald-500/20 bg-black/60 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#" className="flex items-center gap-2 font-black tracking-widest text-emerald-300">
          <Shield className="h-5 w-5 text-red-500" />
          JATIM<span className="text-red-500">CTF</span>
        </a>
        <div className="flex items-center gap-5 font-mono text-xs text-emerald-100/60">
          <a href="#challenges" className="hidden items-center gap-1.5 transition hover:text-emerald-300 sm:flex">
            <Swords className="h-3.5 w-3.5" /> ARENA
          </a>
          <a href="#tentang" className="hidden transition hover:text-emerald-300 sm:block">
            TENTANG
          </a>
          <a
            href="https://github.com/gdrive0082/jatim-ctf-arena"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded border border-emerald-500/30 px-2.5 py-1 transition hover:border-emerald-400 hover:text-emerald-300"
          >
            <Github className="h-3.5 w-3.5" /> SOURCE
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
