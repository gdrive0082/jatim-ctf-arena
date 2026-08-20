import { useEffect, useMemo, useState } from "react";
import {
  CHALLENGES,
  TOTAL_POINTS,
  verifyFlag,
  type Challenge,
} from "@/lib/challenges";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  Eye,
  Flag,
  Lock,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Skull,
} from "lucide-react";

const STORAGE_KEY = "jtcs-ctf-solved";

const CATEGORY_COLOR: Record<string, string> = {
  RECON: "text-cyan-400 border-cyan-500/50",
  CRYPTO: "text-yellow-400 border-yellow-500/50",
  FORENSICS: "text-purple-400 border-purple-500/50",
  STEGO: "text-pink-400 border-pink-500/50",
  REVERSING: "text-orange-400 border-orange-500/50",
  OSINT: "text-sky-400 border-sky-500/50",
  EXPLOIT: "text-red-400 border-red-500/50",
  DFIR: "text-lime-400 border-lime-500/50",
  BINARY: "text-amber-400 border-amber-500/50",
  CRACKING: "text-fuchsia-400 border-fuchsia-500/50",
};

const TIER_META: Record<number, { title: string; desc: string }> = {
  1: {
    title: "TIER 1 — PEMANASAN",
    desc: "Fondasi: recon, encoding, metadata, morse, source-code diving, git forensics.",
  },
  2: {
    title: "TIER 2 — CVE LEVEL",
    desc: "Simulasi insiden nyata: Log4Shell DFIR, DNS tunneling PCAP, reversing binary, crack JWT & shadow hash, insecure deserialization. Tidak untuk yang berhati lemah.",
  },
};

function loadSolved(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function ChallengeBoard() {
  const [solved, setSolved] = useState<string[]>([]);
  const [active, setActive] = useState<Challenge | null>(null);
  const [flagInput, setFlagInput] = useState("");
  const [showClue, setShowClue] = useState(false);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  useEffect(() => setSolved(loadSolved()), []);

  const score = useMemo(
    () =>
      CHALLENGES.filter((c) => solved.includes(c.id)).reduce(
        (s, c) => s + c.points,
        0
      ),
    [solved]
  );

  const openChallenge = (c: Challenge) => {
    setActive(c);
    setFlagInput("");
    setShowClue(false);
    setStatus("idle");
  };

  const submitFlag = async () => {
    if (!active) return;
    const ok = await verifyFlag(active, flagInput);
    if (ok) {
      setStatus("correct");
      setSolved((prev) => {
        if (prev.includes(active.id)) return prev;
        const next = [...prev, active.id];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    } else {
      setStatus("wrong");
    }
  };

  return (
    <section id="challenges" className="relative z-10 mx-auto max-w-6xl px-4 py-24">
      {/* Scoreboard */}
      <div className="mb-12 rounded-lg border border-emerald-500/30 bg-black/70 p-6 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-widest text-emerald-300">
              PAPAN MISI
            </h2>
            <p className="text-xs text-emerald-100/50">
              {solved.length} / {CHALLENGES.length} bendera direbut — progres
              tersimpan di browser kamu
            </p>
          </div>
          <div className="text-right">
            <div className="font-mono text-3xl font-black text-red-400">
              {score}
              <span className="text-sm text-emerald-100/40"> / {TOTAL_POINTS} pts</span>
            </div>
          </div>
        </div>
        <Progress
          value={(solved.length / CHALLENGES.length) * 100}
          className="mt-4 h-2 bg-emerald-950"
        />
        {solved.length === CHALLENGES.length && (
          <p className="mt-4 text-center font-mono text-sm font-bold text-yellow-300">
            ★ SEMPURNA. Kamu menaklukkan seluruh arena. Hubungi admin Jatim
            Cybersec dan klaim gelarmu, Sang Kera Sakti. ★
          </p>
        )}
      </div>

      {/* Tiers */}
      {[1, 2].map((tier) => (
        <div key={tier} className="mb-14">
          <div className="mb-6 border-l-4 pl-4" style={{ borderColor: tier === 2 ? "#ef4444" : "#10b981" }}>
            <h3 className={`text-xl font-black tracking-widest ${tier === 2 ? "text-red-400" : "text-emerald-300"}`}>
              {TIER_META[tier].title}
            </h3>
            <p className="text-xs text-emerald-100/50">{TIER_META[tier].desc}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {CHALLENGES.filter((c) => c.tier === tier).map((c) => {
              const isSolved = solved.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => openChallenge(c)}
                  className={`group relative overflow-hidden rounded-lg border p-5 text-left transition backdrop-blur ${
                    isSolved
                      ? "border-emerald-400/60 bg-emerald-950/30 shadow-[0_0_30px_-10px_rgba(16,185,129,0.6)]"
                      : c.tier === 2
                        ? "border-red-600/50 bg-[#0d0303]/80 hover:border-red-500/70 hover:shadow-[0_0_30px_-8px_rgba(239,68,68,0.7)]"
                        : "border-red-500/30 bg-black/60 hover:border-red-400/60 hover:shadow-[0_0_30px_-10px_rgba(239,68,68,0.5)]"
                  }`}
                >
                  {c.tier === 2 && !isSolved && (
                    <span className="absolute right-0 top-0 rounded-bl bg-red-600/90 px-2 py-0.5 font-mono text-[9px] font-black tracking-widest text-white">
                      CVE
                    </span>
                  )}
                  <div className="mb-3 flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`font-mono text-[10px] tracking-widest ${CATEGORY_COLOR[c.category]}`}
                    >
                      {c.category}
                    </Badge>
                    <span
                      className={`flex items-center gap-1 font-mono text-[10px] font-bold tracking-widest ${
                        c.difficulty === "CVE"
                          ? "text-red-500"
                          : c.difficulty === "INSANE"
                            ? "text-orange-500"
                            : "text-yellow-500"
                      }`}
                    >
                      <Skull className="h-3 w-3" />
                      {c.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-emerald-100 group-hover:text-emerald-300">
                    {c.title}
                  </h3>
                  <p className="mt-1 font-mono text-[10px] tracking-widest text-emerald-100/40">
                    {c.codename}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-red-400">
                      {c.points} pts
                    </span>
                    {isSolved ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" /> SOLVED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-emerald-100/40">
                        <Lock className="h-3.5 w-3.5" /> belum direbut
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Detail dialog */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="border-emerald-500/40 bg-[#050a08] text-emerald-100 sm:max-w-lg">
          {active && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`font-mono text-[10px] ${CATEGORY_COLOR[active.category]}`}
                  >
                    {active.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-red-500/50 font-mono text-[10px] text-red-400"
                  >
                    {active.difficulty} · {active.points} PTS
                  </Badge>
                </div>
                <DialogTitle className="text-xl font-black text-emerald-300">
                  {active.title}
                </DialogTitle>
                <DialogDescription className="font-mono text-[10px] tracking-widest text-emerald-100/40">
                  OPERATION: {active.codename}
                </DialogDescription>
              </DialogHeader>

              <p className="text-sm leading-relaxed text-emerald-100/80">
                {active.description}
              </p>

              {active.download && (
                <a
                  href={active.download.href}
                  download
                  className="inline-flex w-fit items-center gap-2 rounded border border-cyan-500/40 bg-cyan-950/30 px-3 py-1.5 font-mono text-xs text-cyan-300 transition hover:bg-cyan-900/40"
                >
                  <Download className="h-3.5 w-3.5" /> {active.download.label}
                </a>
              )}

              {/* Clue */}
              {showClue ? (
                <div className="rounded border border-yellow-500/40 bg-yellow-950/20 p-3 text-sm text-yellow-200/90">
                  <span className="mb-1 flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest text-yellow-400">
                    <Lightbulb className="h-3.5 w-3.5" /> CLUE
                  </span>
                  {active.clue}
                </div>
              ) : (
                <button
                  onClick={() => setShowClue(true)}
                  className="inline-flex w-fit items-center gap-2 rounded border border-yellow-500/30 px-3 py-1.5 font-mono text-xs text-yellow-400/70 transition hover:bg-yellow-950/30 hover:text-yellow-300"
                >
                  <Eye className="h-3.5 w-3.5" /> Buka clue (menyerah dikit gapapa)
                </button>
              )}

              {/* Flag submit */}
              {solved.includes(active.id) ? (
                <div className="flex items-center gap-2 rounded border border-emerald-500/50 bg-emerald-950/40 p-3 font-mono text-sm text-emerald-300">
                  <CheckCircle2 className="h-5 w-5" /> Flag sudah kamu rebut. GG.
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={flagInput}
                      onChange={(e) => {
                        setFlagInput(e.target.value);
                        setStatus("idle");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && submitFlag()}
                      placeholder="JTCS{...}"
                      className="border-emerald-500/40 bg-black/60 font-mono text-emerald-200 placeholder:text-emerald-900"
                    />
                    <Button
                      onClick={submitFlag}
                      className="bg-red-600 font-bold text-white hover:bg-red-500"
                    >
                      <Flag className="mr-1.5 h-4 w-4" /> Submit
                    </Button>
                  </div>
                  {status === "correct" && (
                    <p className="flex items-center gap-1.5 font-mono text-xs text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" /> FLAG BENAR — {active.points} pts direbut!
                    </p>
                  )}
                  {status === "wrong" && (
                    <p className="flex items-center gap-1.5 font-mono text-xs text-red-400">
                      <XCircle className="h-4 w-4" /> Flag salah. Kembali berburu.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
