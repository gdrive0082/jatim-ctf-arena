// ============================================================
// JATIM CYBERSEC — CTF ARENA :: challenge registry
// ============================================================
// [SISTEM INTERNAL — JANGAN DIBACA PESERTA]
// KUNCI_BAGIAN_2 = "CYBER"
// _ct adalah cipher XOR untuk challenge "Mata Ketiga".
// Kunci lengkap = KUNCI_BAGIAN_1 + KUNCI_BAGIAN_2
// KUNCI_BAGIAN_1 disembunyikan di index.html (view-source).
// decode: String.fromCharCode(..._ct.map((b,i)=>b^key.charCodeAt(i%key.length)))
// ============================================================

export const _ct = [0, 21, 23, 26, 54, 53, 48, 113, 50, 13, 57, 113, 33, 59, 46, 112, 6, 115, 54, 13, 62, 41, 103, 22, 57, 43, 104, 48, 33, 13, 121, 56, 103, 52];

export type Category = "RECON" | "CRYPTO" | "FORENSICS" | "STEGO" | "REVERSING" | "OSINT";

export interface Challenge {
  id: string;
  title: string;
  codename: string;
  category: Category;
  points: number;
  difficulty: "HARD" | "INSANE";
  description: string;
  clue: string;
  flagHash: string; // sha256 hex of the real flag
  download?: { label: string; href: string };
}

export const CHALLENGES: Challenge[] = [
  {
    id: "robot-trace",
    title: "Jejak Robot",
    codename: "ROBOT-TRACE",
    category: "RECON",
    points: 300,
    difficulty: "HARD",
    description:
      "Server arena ini dijaga robot-robot kecil yang patuh pada aturan. Admin kami ceroboh: ia menulis aturan untuk para robot, tetapi lupa bahwa aturan itu bisa dibaca siapa saja. Di suatu tempat di dalam aturan itu, ada petunjuk menuju catatan rahasia yang 'dilipat dua kali'.",
    clue:
      "Mulai dari /robots.txt. 'Dilipat dua kali' bukan enkripsi — hanya encoding yang ditumpuk dua lapis. Balikkan lipatannya, satu per satu.",
    flagHash: "72cd422efff7229fb64cd8a0d8f7d9ab1a2d094859fb88040a13b3e5755c2913",
  },
  {
    id: "batik-cipher",
    title: "Batik Cipher",
    codename: "BATIK-CIPHER",
    category: "CRYPTO",
    points: 400,
    difficulty: "HARD",
    description:
      "Selembar kain batik digital ditemukan di server lama Keraton. Pesan di dalamnya dilindungi tiga lapis pola. Arah membaca batik selalu dari lapisan terluar ke terdalam.",
    clue:
      "Tiga lapis: 13 putaran di luar, 64 motif di tengah, 16 warna di dalam. Kupas berurutan: ROT13 → Base64 → Hex. Tidak ada kunci, hanya ketelitian.",
    flagHash: "4de15ac1d10e679956e81303fb19b0ed808a0a0b02a3ca5d248b790e733fc540",
    download: { label: "batik.txt", href: "vault/batik.txt" },
  },
  {
    id: "bromo-whisper",
    title: "Bisikan Bromo",
    codename: "BROMO-WHISPER",
    category: "FORENSICS",
    points: 400,
    difficulty: "HARD",
    description:
      "Foto matahari terbit dari kawah Bromo ini tampak biasa saja. Tapi gunung berapi tidak pernah benar-benar diam — ia menyimpan bisikan di tempat yang tidak terlihat mata. Jangan percaya pikselnya; interogasi berkasnya.",
    clue:
      "Piksel hanya topeng. Gunakan exiftool, strings, atau baca struktur chunk PNG-nya. Yang kamu cari bukan gambar, melainkan metadata tEXt.",
    flagHash: "e40137a49bdf9491596eeeea16030586064b7575f49f2bc30390ee4c22f2f062",
    download: { label: "bromo.png", href: "files/bromo.png" },
  },
  {
    id: "majapahit-echo",
    title: "Gema Majapahit",
    codename: "MAJAPAHIT-ECHO",
    category: "STEGO",
    points: 500,
    difficulty: "HARD",
    description:
      "Rekaman aneh dari reruntuhan Trowulan: deretan bunyi titik dan strip di frekuensi 750 Hz. Konon, utusan Majapahit berkomunikasi tanpa suara manusia. Transkripsikan pesannya — dua kata — lalu bungkus menjadi flag: JTCS{kata_pertama_kata_kedua} (huruf kecil).",
    clue:
      "Itu sandi Morse. Perlambat audionya atau visualisasikan spektrogramnya. Dit pendek, dah panjang; jeda panjang memisahkan kata.",
    flagHash: "e91bff1ec5a604d7146f8014a95edb9ce6a1f5a6f2ba865842f2dab62412e8b7",
    download: { label: "majapahit.wav", href: "files/majapahit.wav" },
  },
  {
    id: "third-eye",
    title: "Mata Ketiga",
    codename: "THIRD-EYE",
    category: "REVERSING",
    points: 600,
    difficulty: "INSANE",
    description:
      "Halaman ini sedang melihatmu. Satu-satunya cara melihat balik: View Source. Sebuah flag disandikan XOR dan kuncinya sengaja dibelah dua — satu bagian disembunyikan di dokumen HTML, satu bagian lagi tertinggal di dalam JavaScript yang membangun papan challenge ini.",
    clue:
      "Buka view-source: pada index.html, cari komentar KUNCI_BAGIAN_1. Lalu telusuri bundle JS (atau repo sumber) untuk KUNCI_BAGIAN_2 dan array _ct. XOR setiap byte _ct dengan kunci gabungan, berulang sepanjang kunci.",
    flagHash: "ec70587dc54eea77d8a3187d3e0111e4fad1d5a12ca16f80cdf3a81a1a103efb",
  },
  {
    id: "kera-sakti",
    title: "Kera Sakti",
    codename: "KERA-SAKTI",
    category: "OSINT",
    points: 600,
    difficulty: "INSANE",
    description:
      "Arena ini dibangun di atas repositori publik di GitHub. Seorang developer pernah menyimpan bendera rahasia di dalamnya, lalu panik dan 'menghapusnya'. Tapi Kera Sakti tahu satu kebenaran: git tidak pernah melupakan masa lalu.",
    clue:
      "Temukan repositori sumber website ini di GitHub, lalu baca git log-nya. Flag ada di commit awal sebelum 'dihapus'. git log --all, git show, atau tombol History di GitHub adalah jalanmu.",
    flagHash: "bc4eee39fcc8f339de7015c12110b9de1d264f4bfdc6ab24019428fd22689280",
  },
];

export const TOTAL_POINTS = CHALLENGES.reduce((s, c) => s + c.points, 0);

export async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyFlag(challenge: Challenge, input: string): Promise<boolean> {
  const normalized = input.trim();
  if (!/^JTCS\{.*\}$/.test(normalized)) return false;
  return (await sha256Hex(normalized)) === challenge.flagHash;
}
