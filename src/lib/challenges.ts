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

export type Category =
  | "RECON" | "CRYPTO" | "FORENSICS" | "STEGO" | "REVERSING" | "OSINT"
  | "EXPLOIT" | "DFIR" | "BINARY" | "CRACKING";

export interface Challenge {
  id: string;
  title: string;
  codename: string;
  category: Category;
  tier: 1 | 2 | 3;
  points: number;
  difficulty: "HARD" | "INSANE" | "CVE" | "0-DAY";
  description: string;
  clue: string;
  flagHash: string; // sha256 hex of the real flag
  download?: { label: string; href: string };
}

export const CHALLENGES: Challenge[] = [
  // ================= TIER 1 — PEMANASAN =================
  {
    id: "robot-trace",
    title: "Jejak Robot",
    codename: "ROBOT-TRACE",
    category: "RECON",
    tier: 1,
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
    tier: 1,
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
    tier: 1,
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
    tier: 1,
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
    tier: 1,
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
    tier: 1,
    points: 600,
    difficulty: "INSANE",
    description:
      "Arena ini dibangun di atas repositori publik di GitHub. Seorang developer pernah menyimpan bendera rahasia di dalamnya, lalu panik dan 'menghapusnya'. Tapi Kera Sakti tahu satu kebenaran: git tidak pernah melupakan masa lalu.",
    clue:
      "Temukan repositori sumber website ini di GitHub, lalu baca git log-nya. Flag ada di commit awal sebelum 'dihapus'. git log --all, git show, atau tombol History di GitHub adalah jalanmu.",
    flagHash: "bc4eee39fcc8f339de7015c12110b9de1d264f4bfdc6ab24019428fd22689280",
  },
  {
    id: "header-whisper",
    title: "Bisikan Header",
    codename: "HEADER-WHISPER",
    category: "RECON",
    tier: 1,
    points: 350,
    difficulty: "HARD",
    description:
      "Edge server arena ini menjawab lebih dari yang terlihat mata. Ada endpoint status di /api/status.json — body-nya hanya pemanis, tapi response headers-nya membisikkan tiga fragmen rahasia. curl -I adalah senjatamu.",
    clue:
      "curl -sI https://jatim-ctf-arena.vercel.app/api/status.json — cari header berawalan X-JTCS, gabungkan fragmennya berurutan.",
    flagHash: "aeab3375112100a123f066074ab0a69cc412eb598c812549170fe7df699c9599",
  },
  {
    id: "cookie-monster",
    title: "Kue Terlarang",
    codename: "COOKIE-MONSTER",
    category: "RECON",
    tier: 1,
    points: 350,
    difficulty: "HARD",
    description:
      "Saat kamu membuka arena ini, sebuah cookie sesi diam-diam ditanam di browser-mu. Monster cookie tidak pernah menolak kue gratis. Buka DevTools → Application → Cookies dan lihat apa yang disimpan situs ini tentangmu.",
    clue:
      "Cookie bernama jtcs_session berisi string Base64. Decode isinya — itulah benderamu.",
    flagHash: "975712e1534935d41f67c09136f6d646e0f0420b1cbaa9426afd8dd87442ef2b",
  },

  // ================= TIER 2 — CVE LEVEL =================
  {
    id: "log4shell-aftermath",
    title: "Sisa Letusan Log4Shell",
    codename: "LOG4SHELL-AFTERMATH",
    category: "DFIR",
    tier: 2,
    points: 700,
    difficulty: "CVE",
    description:
      "Tahun 2021 dunia diguncang CVE-2021-44228 (Log4Shell). Kamu adalah analis DFIR yang menerima access.log dari server Jawa Timur yang diretas lewat JNDI injection. Di antara 2.400 baris log, penyerang mengeksfiltrasi sebuah flag — dipecah menjadi potongan-potongan kecil yang diselundupkan lewat string JNDI. Rekonstruksi benderanya sebelum bukti dihapus selamanya.",
    clue:
      "grep 'jndi' adalah awalmu. Perhatikan pola partNNofMM di URL ldap:// penyerang — kumpulkan potongannya, urutkan, gabungkan, lalu decode base64-nya.",
    flagHash: "9248cbf2cec344449043f7340ef1c68976ddb43d015cb01ba1a2dd68f299984b",
    download: { label: "breach-access.log", href: "files/breach-access.log" },
  },
  {
    id: "silent-exfil",
    title: "Silent Exfil",
    codename: "SILENT-EXFIL",
    category: "DFIR",
    tier: 2,
    points: 800,
    difficulty: "CVE",
    description:
      "Sebuah sensor jaringan merekam silent-exfil.pcap dari laptop pegawai yang terinfeksi malware. Tidak ada koneksi mencurigakan ke IP asing — hanya query DNS yang tampak normal. Tapi malware kelas APT tidak pernah berisik: ia bersenandung lewat subdomain. Buka dengan Wireshark/tshark dan temukan terowongan DNS-nya.",
    clue:
      "Filter: dns. Cari query ke domain aneh ber-akhiran sama. Label pertamanya adalah potongan Base32 bernomor urut. Gabungkan, tambahkan padding '=' jika perlu, lalu base32-decode.",
    flagHash: "87cf32afe75477ebce18ca73db2c1991ea0ee67e508dc0bd439f4dc615afd3a8",
    download: { label: "silent-exfil.pcap", href: "files/silent-exfil.pcap" },
  },
  {
    id: "petra-binary",
    title: "Binary Petra",
    codename: "PETRA-BINARY",
    category: "BINARY",
    tier: 2,
    points: 800,
    difficulty: "CVE",
    description:
      "Binary bernama 'petra' disita dari server C2. Ia memvalidasi sebuah flag — tapi strings tidak akan menolongmu: benderanya disandikan per-byte dengan kunci bergulir di dalam kode mesin. Ini latihan reversing sungguhan: bongkar dengan Ghidra, radare2, objdump, atau lldb. Analisis statis cukup — kamu tidak wajib menjalankannya.",
    clue:
      "Temukan fungsi main, cari array byte 'enc' dan string kuncinya, pahami loop perbandingannya: tiap byte flag di-XOR dengan kunci bergulir (indeks i*7 mod panjang kunci). Reproduksi perhitungannya di Python untuk membalik cipher-nya.",
    flagHash: "58561052a2a149465b316794b7271e0922a0c0dda60be07f20f32fc4e02b80c4",
    download: { label: "petra", href: "files/petra" },
  },
  {
    id: "rogue-token",
    title: "Token Tak Bertuan",
    codename: "ROGUE-TOKEN",
    category: "CRACKING",
    tier: 2,
    points: 700,
    difficulty: "CVE",
    description:
      "Tim blue team mengintersepsi sebuah JWT dari jaringan kafe tempat admin Jatim Cybersec pernah login. Token ditandatangani HS256 dengan secret yang lemah — gaya kesalahan nyata di balik banyak insiden (lihat CVE-2018-0114 & kawan-kawan). Retas secret-nya memakai wordlist lokal rockyou-jatim.txt. Flag-nya adalah: JTCS{<secret>}.",
    clue:
      "Decode dulu header.payload-nya untuk paham strukturnya. Lalu brute-force signature HMAC-SHA256 dengan tiap kata di wordlist (hashcat mode 16500, jwt_tool, atau skrip Python 10 baris). Secret-nya bergaya lokal.",
    flagHash: "0332f1a02db918d47b2118b90bcfd851f4ce60fd499b7a5876ac66a92ccb7fc7",
    download: { label: "captured-token.txt", href: "vault/captured-token.txt" },
  },
  {
    id: "shadow-leak",
    title: "Shadow Leak",
    codename: "SHADOW-LEAK",
    category: "CRACKING",
    tier: 2,
    points: 700,
    difficulty: "CVE",
    description:
      "Sebuah dump database bocor: tiga akun dengan hash password dan salt-nya. Polanya persis kebocoran nyata vBulletin/MyBB yang memakan jutaan korban. Algoritmanya sha256($pass.$salt) — hashcat mode 1410. Retas hash milik 'admin'. Flag-nya adalah: JTCS{<password admin>}.",
    clue:
      "Gunakan wordlist rockyou-jatim.txt. Tanpa GPU pun bisa: loop Python dengan hashlib.sha256((kata + salt).encode()) sudah cukup. Password admin bergaya leet-speak.",
    flagHash: "ab07f8ee790693a1f4d9b0a86713b7741d872a9244588ad27d718aeefb8d587a",
    download: { label: "shadow-leak.txt", href: "vault/shadow-leak.txt" },
  },
  {
    id: "evil-pickle",
    title: "Pickle Beracun",
    codename: "EVIL-PICKLE",
    category: "EXPLOIT",
    tier: 2,
    points: 800,
    difficulty: "CVE",
    description:
      "Insecure deserialization — akar dari rantai RCE paling mematikan (Apache Commons, CVE-2015-4852; PyYAML, CVE-2020-14343). Kamu menemukan payload.b64.txt: objek Python pickle ter-serialize dari server yang diretas. Di dalamnya ada 'blob' warisan yang menyimpan flag. JANGAN pernah unpickle file tak dikenal di mesin produksi — bedah dulu dengan pickletools.",
    clue:
      "base64 -d lalu bedah: python -m pickletools, atau pickle.loads di sandbox. Field 'payload' adalah bytes yang tiap bytenya di-XOR 0x42. Balikkan operasinya.",
    flagHash: "b881a4fce249099bb3019d032fc7f0d219a25839fe9bd27109531a92b020c68f",
    download: { label: "payload.b64.txt", href: "files/payload.b64.txt" },
  },

  // ================= TIER 3 — ZERO-DAY =================
  {
    id: "fermat-rsa",
    title: "Operasi Fermat",
    codename: "FERMAT-RSA",
    category: "CRYPTO",
    tier: 3,
    points: 1000,
    difficulty: "0-DAY",
    description:
      "Intelijen berhasil mengintersepsi ciphertext RSA beserta kunci publik target: modulus 512-bit. Kelihatannya aman... sampai kamu sadar implementasi target membangkitkan dua bilangan prima yang berdekatan satu sama lain. Kesalahan ini nyata — menjerumuskan perangkat IoT dan smartcard (baca: ROCA, CVE-2017-15361). Faktorkan n, hitung d, dekripsi c.",
    clue:
      "Dua prima berdekatan → Fermat factorization: mulai dari a = isqrt(n)+1, cari a²-n yang merupakan kuadrat sempurna. Python murni bisa; n hanya 512-bit.",
    flagHash: "46163b8d721a3fa3760595e267894d6f4e24fe33d7c8aa5aa536878f43b8604b",
    download: { label: "rsa-weak.txt", href: "vault/rsa-weak.txt" },
  },
  {
    id: "pin-vault",
    title: "Brankas PIN",
    codename: "PIN-VAULT",
    category: "CRACKING",
    tier: 3,
    points: 900,
    difficulty: "0-DAY",
    description:
      "vault-pin.bin adalah brankas AES-256-CBC. Kuncinya diturunkan dari PIN 4 digit: key = SHA256(PIN), IV = 16 byte nol. Desain 'keamanan lewat kependekan' seperti ini persis yang membobol banyak sistem nyata. 10.000 kemungkinan berdiri antara kamu dan bendera.",
    clue:
      "Loop 0000–9999, sha256(pin) sebagai key hex, coba openssl enc -d -aes-256-cbc -K <hex> -iv 000...0 — plaintext yang benar diawali 'JTCS{'.",
    flagHash: "5f525e05f08d65494bf1d439f1d50fe7f41294bcc06407a0fd408ccdddd46f78",
    download: { label: "vault-pin.bin", href: "files/vault-pin.bin" },
  },
  {
    id: "usb-ghost",
    title: "Keyboard Hantu",
    codename: "USB-GHOST",
    category: "FORENSICS",
    tier: 3,
    points: 950,
    difficulty: "0-DAY",
    description:
      "Sebuah keylogger hardware USB tertanam di keyboard admin selama seminggu. Kamu menyita capture-nya: keyboard-hantu.pcap (format usbmon Linux, LINKTYPE 189). Tidak ada teks di dalamnya — hanya deretan HID report 8 byte. Setiap ketukan admin terekam, termasuk saat ia mengetik sebuah flag.",
    clue:
      "tshark -r keyboard-hantu.pcap -T fields -e usb.capdata, lalu decode HID usage table: byte ke-3 adalah keycode (a=0x04, 1=0x1e), byte ke-1 adalah modifier Shift. Report kosong adalah pelepas tombol.",
    flagHash: "6573eaff72d7867041597dcebaf47411e1497998a4571d218deeff7f237c2277",
    download: { label: "keyboard-hantu.pcap", href: "files/keyboard-hantu.pcap" },
  },
  {
    id: "polyglot",
    title: "Berkas Ganda",
    codename: "POLYGLOT",
    category: "STEGO",
    tier: 3,
    points: 900,
    difficulty: "0-DAY",
    description:
      "matahari.png terlihat seperti gambar matahari terbit biasa dan lolos semua image viewer. Tapi sebuah berkas bisa punya dua jiwa: teknik polyglot dipakai malware nyata untuk menyelundupkan payload (steganography berkas, bukan piksel). binwalk tidak pernah berbohong.",
    clue:
      "binwalk matahari.png atau langsung unzip matahari.png — ZIP dibaca dari belakang, PNG dari depan. Ada arsip rahasia yang menempel di ekor gambar.",
    flagHash: "a3b06189abf171593e05d25234c16a10eff641cea3ebc3435ca07252aa5e1886",
    download: { label: "matahari.png", href: "files/matahari.png" },
  },
  {
    id: "broken-image",
    title: "Gambar yang Retak",
    codename: "BROKEN-IMAGE",
    category: "FORENSICS",
    tier: 3,
    points: 900,
    difficulty: "0-DAY",
    description:
      "rusak.png menolak menampilkan apa pun — pelaku merusak satu field kritis di header-nya sebelum melarikan diri. Ini forensik berkas sesungguhnya: pahami struktur chunk PNG, temukan field yang dimutilasi, perbaiki dengan hex editor. Gambarnya sendiri adalah benderanya.",
    clue:
      "IHDR menyatakan lebar 800 tapi tinggi yang... mustahil. IDAT-nya masih utuh. Tinggi aslinya kurang dari 1000 — brute-force nilai tinggi sambil membetulkan CRC IHDR (pngcheck akan memandumu).",
    flagHash: "00db4ede6b6c89342d03b5778863735e390bfbd0ee8e78b50ae9eee54c0c4643",
    download: { label: "rusak.png", href: "files/rusak.png" },
  },
  {
    id: "encoding-tower",
    title: "Menara Tujuh Lapis",
    codename: "ENCODING-TOWER",
    category: "CRYPTO",
    tier: 3,
    points: 850,
    difficulty: "0-DAY",
    description:
      "Sebuah pesan dibungkus TUJUH lapis transformasi berturut-turut oleh operator paranoid. Tidak ada satu pun yang berupa enkripsi berkunci — tapi tanpa metode, kamu akan tersesat di lapis ketiga. Petakan setiap lapisan dari luar ke dalam; perhatikan alfabet dan bentuk tiap lapis.",
    clue:
      "Dari luar: dibalik (reverse) → ROT13 → Base85 → Base64 berisi gzip → Base32 → hex → Base64. Magic bytes gzip (1f 8b) adalah kompas di lapisan tengah.",
    flagHash: "0c4eea0819eec5cbb753b8abe600e4fb378219b1f48c10ec963c4198d8e90160",
    download: { label: "menara.txt", href: "vault/menara.txt" },
  },
  {
    id: "brainfuck",
    title: "Otak Kusut",
    codename: "BRAINFUCK",
    category: "REVERSING",
    tier: 3,
    points: 850,
    difficulty: "0-DAY",
    description:
      "terlarang.bf ditemukan di home directory seorang operator yang menghilang. Isinya bukan bahasa manusia — hanya deretan + - . yang tampak gila. Esoteric language memang dirancang untuk menyiksa, tapi interpreter-nya hanya 30 baris. Jalankan, dan biarkan mesin yang berpikir.",
    clue:
      "Itu Brainfuck. Tulis interpreter mini (tape 30.000 sel, pointer, + - . ) atau pakai interpreter online. Program ini hanya menulis output — tidak ada input, tidak ada jebakan loop.",
    flagHash: "8d048aaaefe8465d343a4b2fa34a66a1ac1cb033f65ce64310a9cb821641d222",
    download: { label: "terlarang.bf", href: "vault/terlarang.bf" },
  },
  {
    id: "heap-bleed",
    title: "Heap Berdarah",
    codename: "HEAP-BLEED",
    category: "FORENSICS",
    tier: 3,
    points: 900,
    difficulty: "0-DAY",
    description:
      "Terinspirasi Heartbleed (CVE-2014-0160): heap-dump.bin adalah 2 MB tumpukan memori yang bocor dari proses yang diserang. Di antara lautan byte acak, ada satu objek ber-pagar 0xDEADBEEF yang isinya telah dikaburkan. Carving memori adalah keterampilan inti DFIR — asah di sini.",
    clue:
      "Cari byte pattern DE AD BE EF (ada dua, sebagai pagar pembuka dan penutup). Isi di antaranya adalah flag yang tiap bytenya di-XOR 0xAA.",
    flagHash: "127d99ff1a2f65fd45d5305a6e8fdc271696f7969ff18f58b7f911015429bca8",
    download: { label: "heap-dump.bin", href: "files/heap-dump.bin" },
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
