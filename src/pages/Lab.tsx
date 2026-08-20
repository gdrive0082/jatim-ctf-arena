import { useEffect, useMemo, useState, type ComponentType } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, FlaskConical, Unlock } from "lucide-react";

// ============================================================
// TIER 4 — WEB EXPLOIT LABS
// Setiap halaman adalah aplikasi "rentan" yang sengaja dibuat
// untuk dieksploitasi. Flag disimpan terenkripsi (XOR) dan hanya
// dibuka ketika kondisi eksploitasi benar-benar terpenuhi.
// ============================================================

const K = "W3B3XPL01T";
const unlock = (hex: string) => {
  const bytes = hex.match(/.{2}/g)!.map((h) => parseInt(h, 16));
  return String.fromCharCode(...bytes.map((b, i) => b ^ K.charCodeAt(i % K.length)));
};
const enc = (s: string) =>
  Array.from(s).map((c, i) => (c.charCodeAt(0) ^ K.charCodeAt(i % K.length)).toString(16).padStart(2, "0")).join("");

async function sha256Hex(t: string) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, "0")).join("");
}

function LabShell({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#070503] p-6 font-mono text-amber-100">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-xs text-amber-500/70 hover:text-amber-300">
          <ArrowLeft className="h-3.5 w-3.5" /> kembali ke arena
        </Link>
        <div className="rounded-lg border border-amber-600/40 bg-black/60 p-6">
          <div className="mb-1 flex items-center gap-2 text-[10px] tracking-[0.3em] text-amber-500/70">
            <FlaskConical className="h-3.5 w-3.5" /> WEB EXPLOIT LAB
          </div>
          <h1 className="mb-1 text-xl font-black text-amber-300">{title}</h1>
          <p className="mb-6 text-xs text-amber-100/50">{hint}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

function FlagReveal({ flag }: { flag: string }) {
  return (
    <div className="mt-4 rounded border border-emerald-500/50 bg-emerald-950/40 p-4">
      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-emerald-400">
        <Unlock className="h-3.5 w-3.5" /> EKSPLOITASI BERHASIL — BENDERA TERBUKA
      </div>
      <code className="select-all text-sm font-bold text-emerald-300">{flag}</code>
      <p className="mt-1 text-[10px] text-emerald-100/50">Submit flag ini di kartu challenge arena.</p>
    </div>
  );
}

// ---------- W1: DOM XSS ----------
const XSS_BLOB = enc("JTCS{d0m_xss_0wn3d_th3_p4g3}");
function XssSearch() {
  const [flag, setFlag] = useState("");
  const q = useMemo(() => new URLSearchParams(window.location.search).get("q") ?? "", []);
  useEffect(() => {
    (window as any).pwn = () => setFlag(unlock(XSS_BLOB));
    return () => { delete (window as any).pwn; };
  }, []);
  return (
    <LabShell
      title="Mesin Pencari Nusantara"
      hint="Aplikasi ini me-refleksikan parameter ?q= langsung ke DOM tanpa sanitasi. Buat ia mengeksekusi JavaScript-mu dan panggil fungsi tersembunyi untuk membuka bendera."
    >
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const v = new FormData(e.currentTarget).get("q");
          window.location.search = "?q=" + encodeURIComponent(String(v));
        }}
      >
        <input
          name="q"
          defaultValue={q}
          placeholder="cari sesuatu..."
          className="flex-1 rounded border border-amber-600/40 bg-black/60 px-3 py-2 text-sm outline-none"
        />
        <button className="rounded bg-amber-600 px-4 py-2 text-sm font-bold text-black">CARI</button>
      </form>
      {/* SINK RENTAN: jangan pernah begini di produksi */}
      {q && (
        <div
          className="mt-4 rounded border border-amber-600/20 bg-black/40 p-3 text-sm"
          dangerouslySetInnerHTML={{ __html: `Hasil pencarian untuk: <b>${q}</b>` }}
        />
      )}
      {flag && <FlagReveal flag={flag} />}
    </LabShell>
  );
}

// ---------- W2: SQLi Login ----------
const SQLI_BLOB = enc("JTCS{0r_1_3qu4ls_1_d4sh_d4sh}");
function SqliLogin() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<null | "guest" | "admin" | "fail">(null);

  const login = () => {
    const q = `SELECT * FROM users WHERE username='${user}' AND password='${pass}' LIMIT 1`;
    setQuery(q);
    // "engine" SQL yang naif: string query dieksekusi apa adanya
    const injected = /'\s*or\s+.+--/i.test(user) || /'\s*or\s+.+--/i.test(pass);
    if (injected) setResult("admin");
    else if (user === "tamu" && pass === "tamu123") setResult("guest");
    else setResult("fail");
  };

  return (
    <LabShell
      title="Portal Login Internal"
      hint="Login valid: tamu / tamu123. Tapi kamu bukan tamu — kamu mengincar akun administrator. Query SQL dirangkai dengan string concat jadul."
    >
      <div className="space-y-3">
        <input value={user} onChange={(e) => setUser(e.target.value)} placeholder="username"
          className="w-full rounded border border-amber-600/40 bg-black/60 px-3 py-2 text-sm outline-none" />
        <input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="password" type="password"
          className="w-full rounded border border-amber-600/40 bg-black/60 px-3 py-2 text-sm outline-none" />
        <button onClick={login} className="w-full rounded bg-amber-600 px-4 py-2 text-sm font-bold text-black">LOGIN</button>
      </div>
      {query && <pre className="mt-4 overflow-x-auto rounded bg-black/60 p-3 text-[11px] text-amber-200/70">{query}</pre>}
      {result === "guest" && <p className="mt-3 text-sm text-yellow-300">Login sebagai tamu. Tidak ada apa-apa di sini.</p>}
      {result === "fail" && <p className="mt-3 text-sm text-red-400">Login gagal: username/password salah.</p>}
      {result === "admin" && <FlagReveal flag={unlock(SQLI_BLOB)} />}
    </LabShell>
  );
}

// ---------- W3: SSTI ----------
const SSTI_BLOB = enc("JTCS{sst1_3v4l_1nj3ct3d}");
function SstiPreview() {
  const [tpl, setTpl] = useState("Halo {{nama}}!");
  const [out, setOut] = useState("");
  const [flag, setFlag] = useState("");

  useEffect(() => {
    // [vault] aset internal renderer — tidak untuk konsumsi publik
    (globalThis as any).__jtcs_flagvault = unlock(SSTI_BLOB);
    return () => { delete (globalThis as any).__jtcs_flagvault; };
  }, []);

  const render = () => {
    try {
      const rendered = tpl.replace(/\{\{(.*?)\}\}/gs, (_, expr) => {
        // ENGINE RENTAN: eval ekspresi — ala SSTI server-side
        const fn = new Function("flagvault", `try { return (${expr}); } catch(e) { return "[error: "+e.message+"]"; }`);
        const r = fn("[redacted]");
        if (String(r).includes("JTCS{")) setFlag(String(r));
        return String(r);
      });
      setOut(rendered);
    } catch (e: any) {
      setOut("[render error: " + e.message + "]");
    }
  };

  return (
    <LabShell
      title="Template Renderer v0.1"
      hint="Engine template ini mengeksekusi ekspresi {{...}} di sisi klien. Ada 'flagvault' di sekitar scope... tapi parameter fungsi telah di-redact. Pikirkan cara lain mencapai flag: window, globalThis, atau jejak closure."
      >
      <textarea value={tpl} onChange={(e) => setTpl(e.target.value)} rows={3}
        className="w-full rounded border border-amber-600/40 bg-black/60 px-3 py-2 text-sm outline-none" />
      <button onClick={render} className="mt-2 rounded bg-amber-600 px-4 py-2 text-sm font-bold text-black">RENDER</button>
      {out && <pre className="mt-4 overflow-x-auto rounded bg-black/60 p-3 text-xs text-amber-200/80">{out}</pre>}
      {flag && <FlagReveal flag={flag} />}
    </LabShell>
  );
}

// ---------- W4: Prototype Pollution ----------
function ProtoSettings() {
  const [input, setInput] = useState('{\n  "tema": "gelap",\n  "bahasa": "id"\n}');
  const [flag, setFlag] = useState("");
  const [msg, setMsg] = useState("");

  // MERGE RENTAN: tidak men-filter key __proto__
  const deepMerge = (target: any, source: any): any => {
    for (const key in source) {
      if (source[key] && typeof source[key] === "object") {
        target[key] = deepMerge(target[key] ?? {}, source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  };

  const apply = () => {
    try {
      const cfg = deepMerge({ app: { tema: "terang" }, user: {} }, JSON.parse(input));
      setMsg("Konfigurasi diterapkan: " + JSON.stringify(cfg).slice(0, 120));
      // pengecekan "keamanan" yang membaca prototype
      if (({} as any).isAdmin === true) {
        setFlag(unlock("1d67016023203e0045640843725f34253801013a0802316c6c3421015f29"));
      }
    } catch (e: any) {
      setMsg("[parse error: " + e.message + "]");
    }
  };

  return (
    <LabShell
      title="Panel Pengaturan Aplikasi"
      hint="Kirim konfigurasi JSON; server klien me-merge-nya secara rekursif tanpa filter. Kalau kamu bisa membuat SEMUA objek menjadi admin... sesuatu yang terkunci akan terbuka."
    >
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6}
        className="w-full rounded border border-amber-600/40 bg-black/60 px-3 py-2 text-sm outline-none" />
      <button onClick={apply} className="mt-2 rounded bg-amber-600 px-4 py-2 text-sm font-bold text-black">TERAPKAN</button>
      {msg && <pre className="mt-4 overflow-x-auto rounded bg-black/60 p-3 text-xs text-amber-200/70">{msg}</pre>}
      {flag && <FlagReveal flag={flag} />}
    </LabShell>
  );
}

// ---------- W5: IDOR ----------
function IdorProfile() {
  const [id, setId] = useState("2");
  const [data, setData] = useState<string>("");

  const load = async () => {
    try {
      const r = await fetch(`/api/users/${encodeURIComponent(id)}.json`);
      setData(r.ok ? JSON.stringify(await r.json(), null, 2) : "[404] user tidak ditemukan");
    } catch {
      setData("[error jaringan]");
    }
  };
  useEffect(() => { load(); }, []);

  return (
    <LabShell
      title="Profil Pengguna"
      hint="Profil dimuat dari /api/users/&lt;id&gt;.json. Kamu login sebagai user #2. Tidak ada pemeriksaan otorisasi di sisi mana pun — developer-nya percaya angka."
    >
      <div className="flex gap-2">
        <input value={id} onChange={(e) => setId(e.target.value)}
          className="w-32 rounded border border-amber-600/40 bg-black/60 px-3 py-2 text-sm outline-none" />
        <button onClick={load} className="rounded bg-amber-600 px-4 py-2 text-sm font-bold text-black">MUAT PROFIL</button>
      </div>
      {data && <pre className="mt-4 overflow-x-auto rounded bg-black/60 p-3 text-xs text-amber-200/80">{data}</pre>}
    </LabShell>
  );
}

// ---------- W6: Path Traversal ----------
function ViewerPage() {
  const [content, setContent] = useState("");
  const [resolved, setResolved] = useState("");
  const file = new URLSearchParams(window.location.search).get("file") ?? "welcome.txt";

  useEffect(() => {
    // FILTER RENTAN: hanya menghapus "../" SATU kali
    const clean = file.replace("../", "");
    const url = `/vault/read/${clean}`;
    setResolved(url);
    fetch(url)
      .then((r) => (r.ok ? r.text() : "[404] berkas tidak ada"))
      .then(setContent)
      .catch(() => setContent("[error]"));
  }, [file]);

  return (
    <LabShell
      title="Pembaca Dokumen Internal"
      hint="?file=welcome.txt memuat dokumen dari /vault/read/. Ada filter 'anti-traversal' yang menghapus ../ — tapi hanya sekali. Konon berkas flag-internal.txt disimpan di direktori sebelah: /vault/secret/."
    >
      <form className="flex gap-2" onSubmit={(e) => {
        e.preventDefault();
        const v = String(new FormData(e.currentTarget).get("file"));
        window.location.search = "?file=" + encodeURIComponent(v);
      }}>
        <input name="file" defaultValue={file}
          className="flex-1 rounded border border-amber-600/40 bg-black/60 px-3 py-2 text-sm outline-none" />
        <button className="rounded bg-amber-600 px-4 py-2 text-sm font-bold text-black">BACA</button>
      </form>
      <p className="mt-3 text-[11px] text-amber-500/60">fetch: {resolved}</p>
      {content && <pre className="mt-3 whitespace-pre-wrap rounded bg-black/60 p-3 text-xs text-amber-200/80">{content}</pre>}
    </LabShell>
  );
}

// ---------- W8: Broken Access Control ----------
function AdminPanel() {
  const [role, setRole] = useState("guest");
  useEffect(() => {
    const r = localStorage.getItem("jtcs_role") ?? "guest";
    setRole(r);
    if (!localStorage.getItem("jtcs_role")) localStorage.setItem("jtcs_role", "guest");
  }, []);

  return (
    <LabShell
      title="Panel Administrasi"
      hint="Panel ini hanya untuk role 'admin'. Mekanisme role-nya? Sebuah key di localStorage bernama jtcs_role. Developer berkata: 'tak ada yang akan mengutak-atik itu'."
    >
      {role === "admin" ? (
        <>
          <p className="text-sm text-emerald-300">Selamat datang, Administrator.</p>
          <FlagReveal flag={unlock("1d670160233c7c530538244772416c377f6f5f64236c76462c3831")} />
        </>
      ) : (
        <div>
          <p className="text-sm text-red-400">Akses ditolak. Role kamu: <b>{role}</b></p>
          <p className="mt-2 text-xs text-amber-100/40">Panel rahasia hanya tampil untuk admin.</p>
        </div>
      )}
    </LabShell>
  );
}

// ---------- W9: OTP Brute Force ----------
const OTP_HASH = "9596e58b2148ddd91421d3fda6726ce2de68fa31d4b4660f966b017597a8bbd5";
const OTP_ENC = "dfc2a6d85a78a9a94b4fe3a2d44618d18104cb5ce5c01b";
function OtpGate() {
  const [otp, setOtp] = useState("");
  const [flag, setFlag] = useState("");
  const [tries, setTries] = useState(0);

  const check = async () => {
    setTries((t) => t + 1);
    if ((await sha256Hex(otp.trim())) === OTP_HASH) {
      const key = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(otp.trim()));
      const kb = new Uint8Array(key);
      const eb = OTP_ENC.match(/.{2}/g)!.map((h) => parseInt(h, 16));
      setFlag(String.fromCharCode(...eb.map((b, i) => b ^ kb[i % 32])));
    }
  };

  return (
    <LabShell
      title="Gerbang OTP 6 Digit"
      hint="Tidak ada rate limit. Tidak ada lockout. Tidak ada CAPTCHA. Hash OTP terekspos di bundle. Sejuta kemungkinan hanyalah pemanasan untuk CPU-mu."
    >
      <div className="flex gap-2">
        <input value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6}
          placeholder="______" className="w-40 rounded border border-amber-600/40 bg-black/60 px-3 py-2 text-center text-lg tracking-[0.5em] outline-none" />
        <button onClick={check} className="rounded bg-amber-600 px-4 py-2 text-sm font-bold text-black">VERIFIKASI</button>
      </div>
      <p className="mt-3 text-[11px] text-amber-500/60">
        sha256(otp) = {OTP_HASH.slice(0, 24)}… · percobaan: {tries}
      </p>
      {flag && <FlagReveal flag={flag} />}
    </LabShell>
  );
}

// ---------- Router ----------
const LABS: Record<string, ComponentType> = {
  "xss": XssSearch,
  "sqli": SqliLogin,
  "ssti": SstiPreview,
  "proto": ProtoSettings,
  "idor": IdorProfile,
  "viewer": ViewerPage,
  "admin": AdminPanel,
  "otp": OtpGate,
};

export default function Lab() {
  const { tool } = useParams();
  const Comp = tool ? LABS[tool] : undefined;
  if (!Comp) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#070503] p-6 font-mono text-amber-100">
        <p className="mb-4 text-sm text-amber-400">[404] lab tidak dikenal: {tool}</p>
        <Link to="/" className="flex items-center gap-2 text-xs text-amber-500/70 hover:text-amber-300">
          <ArrowLeft className="h-3.5 w-3.5" /> kembali ke arena
        </Link>
      </div>
    );
  }
  return <Comp />;
}
