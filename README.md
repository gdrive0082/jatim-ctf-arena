# JATIM CYBERSEC — CTF ARENA

Arena Capture The Flag (CTF) untuk komunitas Jawa Timur Cybersecurity.
Dua puluh dua challenge jeopardy-style dalam tiga tier — semuanya bisa diselesaikan langsung dari website, repo ini, dan file artefak yang disediakan.

## Tier 1 — Pemanasan (HARD)

| Codename | Kategori | Poin | Teknik |
|---|---|---|---|
| ROBOT-TRACE | Recon / Web | 300 | robots.txt + encoding berlapis |
| BATIK-CIPHER | Cryptography | 400 | ROT13 → Base64 → Hex |
| BROMO-WHISPER | Forensics | 400 | PNG metadata (tEXt chunk) |
| MAJAPAHIT-ECHO | Steganography | 500 | Sandi Morse pada audio WAV |
| THIRD-EYE | Reversing | 600 | XOR cipher, kunci terbelah di HTML + JS |
| KERA-SAKTI | OSINT / Git | 600 | Forensik riwayat git |
| HEADER-WHISPER | Recon / Web | 350 | Response header rahasia (curl -I) |
| COOKIE-MONSTER | Recon / Web | 350 | Inspeksi cookie via DevTools + Base64 |

## Tier 2 — CVE Level (INSANE)

| Codename | Kategori | Poin | Teknik |
|---|---|---|---|
| LOG4SHELL-AFTERMATH | DFIR | 700 | Analisis access.log, rekonstruksi eksfiltrasi JNDI (CVE-2021-44228) |
| SILENT-EXFIL | DFIR | 800 | Analisis PCAP, DNS tunneling ber-label Base32 |
| PETRA-BINARY | Binary Reversing | 800 | Bongkar binary Mach-O (Ghidra/r2/objdump), XOR rolling key |
| ROGUE-TOKEN | Cracking | 700 | Crack secret HMAC JWT (HS256 lemah, hashcat mode 16500) |
| SHADOW-LEAK | Cracking | 700 | Crack sha256($pass.$salt) (hashcat mode 1410) |
| EVIL-PICKLE | Exploit | 800 | Bedah Python pickle (insecure deserialization, XOR blob) |

## Tier 3 — ZERO-DAY

| Codename | Kategori | Poin | Teknik |
|---|---|---|---|
| FERMAT-RSA | Cryptography | 1000 | RSA 512-bit, prima berdekatan → Fermat factorization (ala ROCA CVE-2017-15361) |
| PIN-VAULT | Cracking | 900 | Brute-force PIN 4 digit, AES-256-CBC key = SHA256(pin) |
| USB-GHOST | Forensics | 950 | Decode USB HID keylogger capture (usbmon PCAP) |
| POLYGLOT | Steganography | 900 | Berkas PNG+ZIP polyglot, binwalk / unzip |
| BROKEN-IMAGE | Forensics | 900 | Perbaikan header PNG (IHDR + CRC) via hex editor |
| ENCODING-TOWER | Cryptography | 850 | Menara 7 lapis: reverse→ROT13→Base85→gzip→Base32→hex→Base64 |
| BRAINFUCK | Reversing | 850 | Interpretasi program Brainfuck |
| HEAP-BLEED | Forensics | 900 | Memory carving ala Heartbleed (CVE-2014-0160), marker 0xDEADBEEF + XOR |

Format flag: `JTCS{...}`

## Menjalankan Lokal

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # output ke dist/ (static site, siap deploy)
```

---

> ⚠️ Untuk peserta: repo ini **bagian dari arena**. Ada hantu di masa lalunya.
