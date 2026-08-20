import { BookOpen, Swords, FlagTriangleRight, ShieldAlert } from "lucide-react";

const RULES = [
  {
    icon: FlagTriangleRight,
    title: "FORMAT FLAG",
    body: "Semua flag mengikuti format JTCS{...}. Huruf besar/kecil berpengaruh. Submit persis seperti yang kamu temukan.",
  },
  {
    icon: Swords,
    title: "TANPA BATAS",
    body: "Semua challenge bisa diselesaikan hanya dari website ini, repositori publiknya, dan file yang disediakan. Tidak perlu tools berbayar.",
  },
  {
    icon: ShieldAlert,
    title: "FAIR PLAY",
    body: "Dilarang menyerang infrastruktur di luar arena, brute-force form submit, atau spoiler flag di ruang publik. Hacker sejati bermain jantan.",
  },
  {
    icon: BookOpen,
    title: "BELAJAR",
    body: "Setiap challenge punya clue tersembunyi di kartunya. Terjebak? Buka clue-nya — yang penting kamu paham ilmunya, bukan sekadar copas jawaban.",
  },
];

export default function About() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-4 pb-24">
      <div className="rounded-lg border border-emerald-500/30 bg-black/70 p-8 backdrop-blur">
        <h2 className="mb-2 text-2xl font-black tracking-widest text-emerald-300">
          TENTANG ARENA
        </h2>
        <p className="mb-8 max-w-3xl text-sm leading-relaxed text-emerald-100/60">
          <span className="font-bold text-emerald-300">JATIM CYBERSEC</span> adalah
          wahana belajar cybersecurity untuk komunitas Jawa Timur. Arena CTF ini
          dirancang bergaya jeopardy: setiap challenge menyembunyikan sebuah
          "flag" — string rahasia — yang hanya bisa kamu temukan dengan teknik
          recon, kriptografi, forensik, steganografi, reversing, dan OSINT sungguhan.
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {RULES.map((r) => (
            <div
              key={r.title}
              className="rounded-md border border-emerald-500/20 bg-emerald-950/10 p-4"
            >
              <r.icon className="mb-3 h-6 w-6 text-red-400" />
              <h3 className="mb-2 font-mono text-xs font-bold tracking-widest text-emerald-300">
                {r.title}
              </h3>
              <p className="text-xs leading-relaxed text-emerald-100/60">{r.body}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-12 text-center font-mono text-xs text-emerald-100/30">
        <p>root@jatim-cybersec:~# ./arena --difficulty=hard --region=jawa-timur</p>
        <p className="mt-1">JATIM CYBERSEC © 2026 — dibangun untuk para pemburu flag</p>
      </footer>
    </section>
  );
}
